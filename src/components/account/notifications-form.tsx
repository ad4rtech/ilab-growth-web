"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ToggleRow } from "@/components/account/toggle-row";

interface Preferences {
  emailOrderUpdates: boolean;
  emailCourseReminders: boolean;
  emailServiceUpdates: boolean;
  emailNewsletter: boolean;
  emailBlogDigest: boolean;
}

const FIELDS: { key: keyof Preferences; label: string; description: string }[] = [
  {
    key: "emailOrderUpdates",
    label: "Order & Payment Updates",
    description: "Receipts, order confirmations, and payment status changes.",
  },
  {
    key: "emailCourseReminders",
    label: "Course Reminders",
    description: "Nudges to continue courses you've started.",
  },
  {
    key: "emailServiceUpdates",
    label: "Service Inquiry Updates",
    description: "Status changes on inquiries and discovery call requests.",
  },
  {
    key: "emailNewsletter",
    label: "Newsletter & Promotions",
    description: "Business tips, templates, and occasional discounts.",
  },
  {
    key: "emailBlogDigest",
    label: "Weekly Blog Digest",
    description: "A roundup of new articles, sent weekly.",
  },
];

export function NotificationsForm() {
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [saving, setSaving] = useState<keyof Preferences | null>(null);

  useEffect(() => {
    fetch("/api/account/notifications")
      .then((r) => r.json())
      .then((data: Preferences) => setPrefs(data))
      .catch(() => toast.error("Could not load notification preferences."));
  }, []);

  async function handleToggle(key: keyof Preferences, value: boolean) {
    if (!prefs) return;
    const previous = prefs;
    setPrefs({ ...prefs, [key]: value });
    setSaving(key);

    try {
      const res = await fetch("/api/account/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      if (!res.ok) {
        setPrefs(previous);
        toast.error("Could not save preference.");
        return;
      }
      toast.success("Preference saved.");
    } catch {
      setPrefs(previous);
      toast.error("Network error. Could not save preference.");
    } finally {
      setSaving(null);
    }
  }

  if (!prefs) {
    return <p className="text-sm text-muted-foreground">Loading preferences...</p>;
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
        Notifications
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose which emails you&apos;d like to receive. Changes save instantly.
      </p>

      <div className="mt-6 divide-y">
        {FIELDS.map((field) => (
          <ToggleRow
            key={field.key}
            label={field.label}
            description={field.description}
            checked={prefs[field.key]}
            disabled={saving === field.key}
            onChange={(value) => handleToggle(field.key, value)}
          />
        ))}
      </div>
    </div>
  );
}