import { prisma } from "@/lib/db";
import { InviteAcceptForm } from "@/components/invite-accept-form";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invitation = await prisma.invitation.findUnique({ where: { token } });

  const invalid =
    !invitation || invitation.status !== "pending" || invitation.expiresAt < new Date();

  if (invalid) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-bold">Invite link invalid or expired</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask whoever invited you to send a new invitation, or{" "}
            <a href="/signup" className="text-blue-700 underline">sign up directly</a>.
          </p>
        </div>
      </div>
    );
  }

  return <InviteAcceptForm email={invitation.email} />;
}