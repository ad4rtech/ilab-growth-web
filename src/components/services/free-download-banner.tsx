"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileText, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export function FreeDownloadBanner() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email first.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "services_playbook" }),
      });
      if (!res.ok) {
        toast.error("Could not subscribe. Try again.");
        return;
      }
      // Honest state: no PDF asset exists yet behind this — subscribing is real,
      // the file delivery is not, so we don't fake a download.
      toast.success("Subscribed! We'll email the playbook to your inbox soon.");
      setEmail("");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-6xl rounded-2xl bg-orange-500 p-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600">
              <FileText className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-100">Free Download</p>
              <h3 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-1 text-xl font-bold text-white">
                The African SME Growth Playbook — 2025 Edition
              </h3>
              <p className="mt-1 max-w-md text-sm text-orange-50">
                A 40-page actionable guide covering the top strategies used by Africa&apos;s
                fastest-growing small businesses. Free, no strings attached.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2 md:w-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="bg-white"
            />
            <Button
              type="submit"
              disabled={submitting}
              className="shrink-0 gap-2 bg-gray-900 text-white hover:bg-gray-800"
            >
              <Download className="h-4 w-4" />
              {submitting ? "..." : "Download"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}