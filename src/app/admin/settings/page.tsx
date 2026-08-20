import { getSiteSettings, getEmailStatus } from "@/lib/settings-admin";
import { SettingsNav } from "@/components/admin/settings-nav";
import { GeneralSettingsForm } from "@/components/admin/general-settings-form";
import { EmailStatusPanel } from "@/components/admin/email-status-panel";
import { SecuritySettings } from "@/components/admin/security-settings";

export const dynamic = "force-dynamic";

interface AdminSettingsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminSettingsPage({ searchParams }: AdminSettingsPageProps) {
  const { tab = "general" } = await searchParams;

  const [siteSettings, emailStatus] = await Promise.all([
    tab === "general" ? getSiteSettings() : null,
    tab === "email" ? getEmailStatus() : null,
  ]);

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
        Settings
      </h1>

      <div className="mt-6 flex gap-8">
        <SettingsNav />

        <div className="max-w-2xl flex-1">
          {tab === "general" && siteSettings && (
            <GeneralSettingsForm initialSettings={siteSettings} />
          )}
          {tab === "email" && emailStatus && <EmailStatusPanel status={emailStatus} />}
          {tab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}