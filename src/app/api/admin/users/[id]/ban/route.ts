import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(
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

  if (id === session.user.id) {
    return NextResponse.json(
      { message: "You can't suspend your own account." },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const banReason: string | undefined = body?.banReason;

  try {
    await auth.api.banUser({
      body: {
        userId: id,
        banReason: banReason || undefined,
        // No banExpiresIn — bans are indefinite until manually unbanned.
      },
      headers: reqHeaders,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not suspend user.";
    return NextResponse.json({ message }, { status: 400 });
  }
}