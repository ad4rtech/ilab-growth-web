"use client";

// src/components/admin/general-settings-form.tsx
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteSettings } from "@/lib/settings-admin";

export function GeneralSettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const [platformName, setPlatformName] = useState(initialSettings.platformName);
  const [tagline, setTagline] = useState(initialSettings.tagline ?? "");
  const [siteUrl, setSiteUrl] = useState(initialSettings.siteUrl ?? "");
  const [supportEmail, setSupportEmail] = useState(initialSettings.supportEmail ?? "");
  const [saving, setSaving] = useState(false);

  function handleCancel() {
    setPlatformName(initialSettings.platformName);
    setTagline(initialSettings.tagline ?? "");
    setSiteUrl(initialSettings.siteUrl ?? "");
    setSupportEmail(initialSettings.supportEmail ?? "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!platformName.trim()) {
      toast.error("Platform name is required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformName: platformName.trim(),
          tagline: tagline.trim() || undefined,
          siteUrl: siteUrl.trim() || undefined,
          supportEmail: supportEmail.trim() || undefined,
        }),
      });
      if (!res.ok) {
        toast.error("Could not save changes.");
        return;
      }
      toast.success("Settings saved.");
    } catch {
      toast.error("Network error. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Site Identity</CardTitle>
        <CardDescription>
          Stored for now — not yet wired to the live header/footer/page titles across the site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input
                id="siteUrl"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://ilabgrowth.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@ilabgrowth.com"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}