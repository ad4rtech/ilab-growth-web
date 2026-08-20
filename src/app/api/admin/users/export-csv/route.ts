import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

function statusWhere(status: string, now: Date) {
  switch (status) {
    case "suspended":
      return { banned: true };
    case "unverified":
      return { banned: false, emailVerified: false };
    case "active":
      return {
        banned: false,
        emailVerified: true,
        sessions: { some: { expiresAt: { gt: now } } },
      };
    case "inactive":
      return {
        banned: false,
        emailVerified: true,
        sessions: { none: { expiresAt: { gt: now } } },
      };
    default:
      return {};
  }
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const status = searchParams.get("status") ?? "";
  const now = new Date();

  const where = {
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { email: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...statusWhere(status, now),
  };

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      banned: true,
      createdAt: true,
      _count: { select: { sessions: { where: { expiresAt: { gt: now } } } } },
    },
  });

  // Cross-DB: purchases/spend live in the NestJS business DB, keyed by
  // plain userId strings (no FK), same pattern as the page's own fetch.
  const spend: { byUser: Record<string, { purchases: number; totalSpent: number }> } =
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/admin/user-spend`, {
      headers: { "x-internal-api-key": process.env.INTERNAL_API_KEY as string },
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : { byUser: {} }))
      .catch(() => ({ byUser: {} }));

  const header = [
    "Name",
    "Email",
    "Role",
    "Status",
    "Email Verified",
    "Purchases",
    "Total Spent (KES)",
    "Joined",
  ];

  const rows = users.map((u) => {
    const s = spend.byUser[u.id];
    const status = u.banned
      ? "Suspended"
      : !u.emailVerified
        ? "Unverified"
        : u._count.sessions > 0
          ? "Active"
          : "Inactive";
    return [
      u.name ?? "",
      u.email,
      u.role ?? "user",
      status,
      u.emailVerified ? "Yes" : "No",
      String(s?.purchases ?? 0),
      String(s?.totalSpent ?? 0),
      u.createdAt.toISOString().slice(0, 10),
    ];
  });

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => csvEscape(String(cell))).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="users-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}