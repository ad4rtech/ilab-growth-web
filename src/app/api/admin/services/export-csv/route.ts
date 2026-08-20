import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function GET() {
  const res = await fetch(`${API_URL}/services/export-csv`, {
    headers: { "x-internal-api-key": process.env.INTERNAL_API_KEY ?? "" },
  });
  if (!res.ok) return NextResponse.json({ message: "Export failed" }, { status: res.status });
  const csv = await res.text();
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="services.csv"',
    },
  });
}