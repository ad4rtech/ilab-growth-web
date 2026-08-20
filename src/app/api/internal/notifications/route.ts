import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PREFERENCE_MAP: Record<string, "emailOrderUpdates" | "emailCourseReminders" | "emailServiceUpdates"> = {
  order_completed: "emailOrderUpdates",
  order_failed: "emailOrderUpdates",
  course_reminder: "emailCourseReminders",
  service_inquiry_status: "emailServiceUpdates",
};

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-internal-api-key");
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { userIds = [], emails = [], type, title, message, link } = body as {
    userIds?: string[];
    emails?: string[];
    type: string;
    title: string;
    message: string;
    link?: string;
  };

  if ((!userIds.length && !emails.length) || !type || !title || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [byId, byEmail] = await Promise.all([
    userIds.length ? prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true } }) : [],
    emails.length ? prisma.user.findMany({ where: { email: { in: emails } }, select: { id: true } }) : [],
  ]);

  const resolvedIds = [...new Set([...byId, ...byEmail].map((u) => u.id))];
  if (resolvedIds.length === 0) {
    return NextResponse.json({ created: 0 });
  }

  // Respect the user's notification preference, when this type maps to one.
  // Types with no mapping (e.g. product_updated) are never gated.
  const prefKey = PREFERENCE_MAP[type];
  let targetIds = resolvedIds;

  if (prefKey) {
    const prefs = await prisma.notificationPreference.findMany({
      where: { userId: { in: resolvedIds } },
    });
    const prefMap = new Map(prefs.map((p) => [p.userId, p]));
    // Default true when no preference row exists yet (matches the API
    // route's DEFAULTS, so a user who's never visited Notifications still
    // gets these until they explicitly opt out).
    targetIds = resolvedIds.filter((id) => prefMap.get(id)?.[prefKey] ?? true);
  }

  if (targetIds.length === 0) {
    return NextResponse.json({ created: 0 });
  }

  await prisma.notification.createMany({
    data: targetIds.map((userId) => ({ userId, type, title, message, link })),
  });

  return NextResponse.json({ created: targetIds.length });
}