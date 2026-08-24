import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 1800,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "iLab Growth <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your iLab Growth password",
        html: `<p>Click the link below to reset your password:</p><p><a href="${url}">${url}</a></p><p>If you didn't request this, you can safely ignore this email. This link expires in 30 minutes.</p>`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
      firstName: { type: "string", required: false },
      lastName: { type: "string", required: false },
      phone: { type: "string", required: false },
      country: { type: "string", required: false },
      city: { type: "string", required: false },
      businessName: { type: "string", required: false },
      industry: { type: "string", required: false },
      businessStage: { type: "string", required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (user.email === process.env.ADMIN_EMAIL) {
            return { data: { ...user, role: "admin" } };
          }
          // NEW — if this email has a pending, unexpired invitation,
          // honor the role it was invited with (e.g. an invited admin).
          // Self-service signups with no matching invitation are
          // unaffected — they fall through to the default "user" role.
          const invitation = await prisma.invitation.findFirst({
            where: {
              email: user.email,
              status: "pending",
              expiresAt: { gt: new Date() },
            },
          });
          if (invitation) {
            return { data: { ...user, role: invitation.role } };
          }
          return { data: user };
        },
      },
      after: async (user: { email: string } & Record<string, unknown>) => {
        // Mark the invitation used now that the account actually exists.
        // Separate from the "before" hook since we want this to run only
        // on confirmed success, not merely on an attempted signup.
        await prisma.invitation.updateMany({
          where: { email: user.email, status: "pending" },
          data: { status: "accepted" },
        });
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
});