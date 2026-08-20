import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/payments/orders/${id}/status`,
    { cache: "no-store" }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}