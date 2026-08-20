import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, subject, message } = body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "iLab Growth Contact Form <onboarding@resend.dev>",
      to: process.env.SUPPORT_EMAIL ?? "support@ilabgrowth.com",
      replyTo: email.trim(),
      subject: subject?.trim() ? `[Contact Form] ${subject.trim()}` : "[Contact Form] New message",
      html: `
        <p><strong>From:</strong> ${name.trim()} (${email.trim()})</p>
        ${subject?.trim() ? `<p><strong>Subject:</strong> ${subject.trim()}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message.trim().replace(/\n/g, "<br />")}</p>
      `,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send contact form email:", err);
    return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 500 });
  }
}