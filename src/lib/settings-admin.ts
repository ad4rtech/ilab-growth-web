// src/lib/settings-admin.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const authHeaders = { "x-internal-api-key": process.env.INTERNAL_API_KEY as string };

export interface SiteSettings {
  id: string;
  platformName: string;
  tagline: string | null;
  siteUrl: string | null;
  supportEmail: string | null;
  updatedAt: string;
}

export interface EmailStatus {
  hasApiKey: boolean;
  hasWebhookSecret: boolean;
  fromAddress: string;
  verifiedDomain: string | null;
  isSandboxMode: boolean;
  domainCheckError: string | null;
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: "singleton",
  platformName: "iLab Growth",
  tagline: null,
  siteUrl: null,
  supportEmail: null,
  updatedAt: new Date().toISOString(),
};

const DEFAULT_EMAIL_STATUS: EmailStatus = {
  hasApiKey: false,
  hasWebhookSecret: false,
  fromAddress: "",
  verifiedDomain: null,
  isSandboxMode: false,
  domainCheckError: "Could not reach the backend.",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_URL}/settings/site`, { headers: authHeaders, cache: "no-store" });
    if (!res.ok) throw new Error();
    return (await res.json()) as SiteSettings;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getEmailStatus(): Promise<EmailStatus> {
  try {
    const res = await fetch(`${API_URL}/settings/email-status`, {
      headers: authHeaders,
      cache: "no-store",
    });
    if (!res.ok) throw new Error();
    return (await res.json()) as EmailStatus;
  } catch {
    return DEFAULT_EMAIL_STATUS;
  }
}