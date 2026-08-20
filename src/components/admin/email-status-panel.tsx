// src/components/admin/email-status-panel.tsx
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmailStatus } from "@/lib/settings-admin";

function StatusRow({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b py-3 last:border-0">
      {ok ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-green-600" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 flex-none text-gray-400" />
      )}
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

export function EmailStatusPanel({ status }: { status: EmailStatus }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Email Connection Status</CardTitle>
        <CardDescription>Read-only — reflects your Resend configuration.</CardDescription>
      </CardHeader>
      <CardContent>
        <StatusRow
          label="Resend API Key"
          ok={status.hasApiKey}
          detail={status.hasApiKey ? "Configured" : "Not set — no emails can be sent."}
        />
        <StatusRow
          label="Webhook Secret"
          ok={status.hasWebhookSecret}
          detail={
            status.hasWebhookSecret
              ? "Configured — open/click tracking can work once the webhook URL is reachable."
              : "Not set — open/click tracking won't record anything."
          }
        />
        <StatusRow
          label="Sending Domain"
          ok={!!status.verifiedDomain}
          detail={
            status.domainCheckError
              ? status.domainCheckError
              : status.verifiedDomain
              ? `Verified: ${status.verifiedDomain}`
              : "No verified domain — currently sending from onboarding@resend.dev."
          }
        />

        {status.isSandboxMode && (
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-600" />
            <p className="text-sm text-amber-800">
              You're in sandbox mode — emails only actually deliver to your own Resend account
              email until a sending domain is verified. Password resets, new-post
              notifications, and campaigns all go through this same limitation.
            </p>
          </div>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          From address currently used: <code>{status.fromAddress}</code>
        </p>
      </CardContent>
    </Card>
  );
}