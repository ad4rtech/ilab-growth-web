import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Activity = {
  type:
    | "user_signup"
    | "product_created"
    | "product_deleted"
    | "product_updated"
    | "blog_post_created"
    | "blog_post_deleted"
    | "order_completed"
    | "enrollment_created";
  title: string;
  createdAt: string;
};

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const since = request.nextUrl.searchParams.get("since");
  const sinceDate = since ? new Date(since) : new Date(0);
  const [newUsers, activityRes] = await Promise.all([
    prisma.user.findMany({
      where: { createdAt: { gt: sinceDate } },
      orderBy: { createdAt: "desc" },
      select: { name: true, createdAt: true },
    }),
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/activity?since=${encodeURIComponent(
        sinceDate.toISOString()
      )}`,
      {
        headers: {
          "x-internal-api-key": process.env.INTERNAL_API_KEY as string,
        },
        cache: "no-store",
      }
    )
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []),
  ]);
  const items: Activity[] = [
    ...newUsers.map((u) => ({
      type: "user_signup" as const,
      title: u.name ? `${u.name} signed up` : "New user signed up",
      createdAt: u.createdAt.toISOString(),
    })),
    ...activityRes.map((a: { action: string; title: string; createdAt: string }) => {
      const labels: Record<string, string> = {
        product_created: `Product added: ${a.title}`,
        product_deleted: `Product deleted: ${a.title}`,
        product_updated: `Product updated: ${a.title}`,
        blog_post_created: `Blog post added: ${a.title}`,
        blog_post_deleted: `Blog post deleted: ${a.title}`,
        // NEW — real M-Pesa purchases and course enrollments now log
        // these action types via ActivityService in payments.service.ts.
        order_completed: `New order: ${a.title}`,
        enrollment_created: `New enrollment: ${a.title}`,
      };
      return {
        type: a.action as Activity["type"],
        title: labels[a.action] ?? a.title,
        createdAt: a.createdAt,
      };
    }),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ count: items.length, items: items.slice(0, 20) });
}