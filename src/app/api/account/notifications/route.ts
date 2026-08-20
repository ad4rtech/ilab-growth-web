import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const DEFAULTS = {
  emailOrderUpdates: true,
  emailCourseReminders: true,
  emailServiceUpdates: true,
  emailNewsletter: true,
  emailBlogDigest: false,
};

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prefs = await prisma.notificationPreference.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(prefs ?? { userId: session.user.id, ...DEFAULTS });
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const allowedKeys = Object.keys(DEFAULTS);
  const data: Record<string, boolean> = {};
  for (const key of allowedKeys) {
    if (typeof body[key] === "boolean") data[key] = body[key];
  }

  const updated = await prisma.notificationPreference.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...DEFAULTS, ...data },
    update: data,
  });

  return NextResponse.json(updated);
}