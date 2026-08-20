import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, role } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "This email already has an account." },
      { status: 400 }
    );
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // No natural compound-unique key on Invitation to upsert against —
  // replace any existing pending invite for this email, then create fresh.
  await prisma.invitation.deleteMany({ where: { email, status: "pending" } });
  await prisma.invitation.create({
    data: {
      email,
      token,
      role: role === "admin" ? "admin" : "user",
      invitedBy: session.user.id,
      status: "pending",
      expiresAt,
    },
  });

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;

  await resend.emails.send({
    from: "iLab Growth <onboarding@resend.dev>",
    to: email,
    subject: "You've been invited to iLab Growth",
    html: `<p>You've been invited to join iLab Growth${role === "admin" ? " as an admin" : ""}.</p><p><a href="${inviteUrl}">${inviteUrl}</a></p><p>This link expires in 7 days.</p>`,
  });

  return NextResponse.json({ success: true });
}