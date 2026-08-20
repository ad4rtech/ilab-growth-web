"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { requestPasswordReset } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  KeyRound,
  Mail,
  Inbox,
  Lock,
  Send,
  Info,
  Zap,
} from "lucide-react";

const STEPS = [
  { icon: Mail, label: "Enter your registered email address" },
  { icon: Inbox, label: "Check your inbox for the reset link" },
  { icon: Lock, label: "Create a new secure password" },
];

const RESEND_COOLDOWN_SECONDS = 30;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

 async function sendResetLink(targetEmail: string) {
  setLoading(true);
  const { error } = await requestPasswordReset({
    email: targetEmail,
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
  });
  setLoading(false);
  
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    setSent(true);
    setCooldown(RESEND_COOLDOWN_SECONDS);
    toast.success("If that email exists, a reset link has been sent.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await sendResetLink(email);
  }

  async function handleResend() {
    if (cooldown > 0) return;
    await sendResetLink(email);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between bg-blue-700 text-white p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400">
              <Zap className="h-6 w-6 text-blue-900" fill="currentColor" />
            </div>
            <div>
              <p
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold leading-tight"
              >
                iLab Growth
              </p>
              <p className="text-xs text-blue-200">
                Empowering African Entrepreneurs
              </p>
            </div>
          </div>

          <h1
            style={{ fontFamily: "var(--font-ubuntu)" }}
            className="mt-10 text-4xl font-bold leading-tight"
          >
            It happens to
            <br />
            the best of us.
          </h1>

          <p className="mt-6 text-blue-100">
            Enter your email and we&apos;ll send a secure reset link within
            minutes.
          </p>

          <ul className="mt-10 space-y-5">
            {STEPS.map(({ icon: Icon, label }, i) => (
              <li key={label} className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-blue-600">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-blue-50">
                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="mr-1 text-blue-300"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800" />
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-16">
        <div className="w-full max-w-md">
          <a
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </a>

          <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
            <KeyRound className="h-6 w-6 text-blue-700" />
          </div>

          <h2
            style={{ fontFamily: "var(--font-ubuntu)" }}
            className="mt-4 text-2xl font-bold sm:text-3xl"
          >
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;ll email you a secure link to reset your password. The
            link expires after 30 minutes.
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the email address linked to your iLab Growth account.
              </p>

              <Button
                type="submit"
                className="mt-4 w-full gap-2 bg-blue-700 hover:bg-blue-800"
                disabled={loading}
              >
                <Send className="h-4 w-4" />
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="mt-6 rounded-lg border bg-muted/30 p-4 text-sm">
              Reset link sent to <strong>{email}</strong>. Check your inbox.
            </div>
          )}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              didn&apos;t get an email?
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-4 w-4 flex-none text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Check your spam or junk folder
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sometimes reset emails land in spam. Mark it as safe to
                  receive future emails.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm">
              <span className="text-muted-foreground">
                Still nothing after a few minutes?
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || !email || loading}
                className="text-blue-700 underline disabled:text-muted-foreground disabled:no-underline"
              >
                {cooldown > 0 ? `Resend email (${cooldown}s)` : "Resend email"}
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Need help? Contact{" "}
            <a
              href="mailto:support@ilabgrowth.com"
              className="text-blue-700 underline"
            >
              support@ilabgrowth.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}