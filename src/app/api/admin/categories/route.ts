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

export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return NextResponse.json(denied, { status: denied.status });

  const type = request.nextUrl.searchParams.get("type");
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
  if (type) url.searchParams.set("type", type);

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return NextResponse.json(denied, { status: denied.status });

  const body = await request.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-api-key": process.env.INTERNAL_API_KEY as string,
    },
    body: JSON.stringify(body), // { name, type } — type omitted = "product", same as before
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}