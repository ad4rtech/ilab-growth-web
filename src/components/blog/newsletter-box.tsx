"use client";

// src/components/blog/newsletter-box.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface NewsletterBoxProps {
  variant: "sidebar" | "banner";
  source?: string;
}

export function NewsletterBox({ variant, source = "Website" }: NewsletterBoxProps) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // capture now — do NOT read e.currentTarget after an await
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    if (!email) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Could not subscribe. Try again.");
        return;
      }
      toast.success("You're subscribed! Check your inbox for a welcome email.");
      form.reset(); // use the captured reference, not e.currentTarget
    } catch {
      toast.error("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (variant === "banner") {
    return (
      <section className="bg-blue-600 px-6 py-16 text-center text-white">
        <p className="text-sm font-medium text-blue-200">Free Resources & Updates</p>
        <h2 className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-ubuntu)" }}>
          Join 12,000+ Entrepreneurs
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-blue-100">
          Subscribe to our newsletter and get free business templates, growth tips, and exclusive
          discounts delivered straight to your inbox.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-lg flex-wrap gap-2 rounded-lg bg-white p-1.5"
        >
          <Input
            type="email"
            name="email"
            required
            placeholder="Enter your email address..."
            className="min-w-[200px] flex-1 border-0 text-gray-900 caret-gray-900 shadow-none focus-visible:ring-0"
          />
          <Button type="submit" disabled={submitting} className="shrink-0 bg-orange-500 hover:bg-orange-600">
            {submitting ? "Subscribing..." : "Subscribe Free"}
          </Button>
        </form>
        <p className="mt-3 text-xs text-blue-200">No spam. Unsubscribe anytime. We respect your privacy.</p>
      </section>
    );
  }

  return (
    <div className="rounded-xl bg-blue-600 p-5 text-white">
      <h3 className="font-bold" style={{ fontFamily: "var(--font-ubuntu)" }}>
        Get Articles in Your Inbox
      </h3>
      <p className="mt-2 text-sm text-blue-100">
        Join 12,000+ entrepreneurs and get the best posts delivered weekly.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <Input
          type="email"
          name="email"
          required
          placeholder="Enter your email address..."
          className="min-w-[200px] flex-1 border-0 text-gray-900 caret-gray-900 shadow-none focus-visible:ring-0"
        />
        <Button type="submit" disabled={submitting} className="w-full bg-orange-500 hover:bg-orange-600">
          {submitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}