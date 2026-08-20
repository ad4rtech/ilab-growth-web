import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const res = await fetch(`${API_URL}/payments/mpesa/initiate-cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-api-key": process.env.INTERNAL_API_KEY ?? "",
    },
    body: JSON.stringify({
      userId: session.user.id,
      phoneNumber: body.phoneNumber,
      billingFirstName: body.billingFirstName,
      billingLastName: body.billingLastName,
      billingEmail: body.billingEmail,
      billingAddress: body.billingAddress,
      billingCity: body.billingCity,
      billingCountry: body.billingCountry,
    }),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}