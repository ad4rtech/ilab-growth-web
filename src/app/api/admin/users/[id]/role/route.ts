import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const VALID_ROLES = ["user", "admin"] as const;
type Role = (typeof VALID_ROLES)[number];

function isValidRole(value: string): value is Role {
  return (VALID_ROLES as readonly string[]).includes(value);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const newRole: string | undefined = body?.role;

  if (!newRole || !isValidRole(newRole)) {
    return NextResponse.json(
      { message: "Role must be 'user' or 'admin'." },
      { status: 400 }
    );
  }

  if (id === session.user.id && newRole !== "admin") {
    return NextResponse.json(
      { message: "You can't remove your own admin access from here." },
      { status: 400 }
    );
  }

  try {
    await auth.api.setRole({
      body: { userId: id, role: newRole }, // now typed as "user" | "admin", not string
      headers: reqHeaders,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not update role.";
    return NextResponse.json({ message }, { status: 400 });
  }
}