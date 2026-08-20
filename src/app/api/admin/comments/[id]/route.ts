import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized", status: 401 };
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") return { error: "Forbidden", status: 403 };
  return null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return NextResponse.json(denied, { status: denied.status });

  const { id } = await params;
  const body = await request.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog-posts/comments/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-internal-api-key": process.env.INTERNAL_API_KEY as string,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return NextResponse.json(denied, { status: denied.status });

  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog-posts/comments/${id}`,
    {
      method: "DELETE",
      headers: {
        "x-internal-api-key": process.env.INTERNAL_API_KEY as string,
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}