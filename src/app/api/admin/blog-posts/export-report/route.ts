import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog-posts/export-report`, {
    headers: {
      "x-internal-api-key": process.env.INTERNAL_API_KEY as string,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ message: "Could not generate report." }, { status: res.status });
  }

  const csv = await res.text();

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="blog-report-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}