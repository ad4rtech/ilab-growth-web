"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { resetPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  EyeOff as EyeOffIcon,
  Check,
  X,
  Zap,
  ShieldAlert,
  Loader2,
} from "lucide-react";

const TIPS = [
  { icon: ShieldCheck, label: "Use a mix of uppercase, numbers & symbols" },
  { icon: EyeOffIcon, label: "Don't reuse a previous password" },
  { icon: Lock, label: "Keep it unique to iLab Growth" },
];

function getStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    upper: /[A-Z]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score };
}

type MatchState = "idle" | "typing" | "match" | "mismatch";

function getMatchState(newPassword: string, confirmPassword: string) {
  if (confirmPassword.length === 0) {
    return { state: "idle" as MatchState, progress: 0 };
  }

  // How many leading characters agree between the two strings.
  let commonLen = 0;
  const maxCheck = Math.min(newPassword.length, confirmPassword.length);
  while (commonLen < maxCheck && newPassword[commonLen] === confirmPassword[commonLen]) {
    commonLen++;
  }

  const diverged = commonLen < confirmPassword.length; // a typo happened somewhere in what's typed
  const exactMatch =
    newPassword.length === confirmPassword.length && commonLen === newPassword.length;

  const progress = newPassword.length === 0 ? 0 : commonLen / newPassword.length;

  if (exactMatch) return { state: "match" as MatchState, progress: 1 };
  if (diverged) return { state: "mismatch" as MatchState, progress };
  return { state: "typing" as MatchState, progress };
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { checks, score } = useMemo(
    () => getStrength(newPassword),
    [newPassword]
  );
  const match = useMemo(
    () => getMatchState(newPassword, confirmPassword),
    [newPassword, confirmPassword]
  );
  const matches = match.state === "match";

  const strengthLabel =
    score <= 1 ? "Weak" : score === 2 ? "Fair" : score === 3 ? "Good" : "Strong";
  const strengthColor =
    score <= 1 ? "bg-red-500" : score === 2 ? "bg-orange-500" : "bg-blue-700";

  const canSubmit =
    checks.length &&
    checks.number &&
    checks.special &&
    matches &&
    !!token &&
    !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      toast.error("This reset link is invalid or has expired.");
      return;
    }
    if (!matches) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await resetPassword({ newPassword, token });
    setLoading(false);

    if (error) {
      toast.error("This reset link is invalid or has expired.");
      return;
    }

    toast.success("Password updated. Please log in.");
    router.push("/login");
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg font-semibold">
            This reset link is invalid or has expired.
          </p>
          <a href="/forgot-password" className="mt-2 inline-block text-sm text-blue-700 underline">
            Request a new reset link
          </a>
        </div>
      </div>
    );
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
            Almost there.
            <br />
            Create a strong
            <br />
            new password.
          </h1>

          <p className="mt-6 text-blue-100">
            Your new password must be at least 8 characters and include a
            number and a special character.
          </p>

          <ul className="mt-10 space-y-5">
            {TIPS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-blue-600">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-blue-50">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800" />
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-16">
        <div className="w-full max-w-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-700" />
          </div>

          <h2
            style={{ fontFamily: "var(--font-ubuntu)" }}
            className="mt-4 text-2xl font-bold sm:text-3xl"
          >
            Set a New Password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter and confirm your new password below. This link is valid for
            30 minutes.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  className="pl-9 pr-9"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  className="pl-9 pr-9"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {match.state !== "idle" && (
                <div
                  className={`mt-2 flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors duration-300 ${
                    match.state === "match"
                      ? "border-green-200 bg-green-50"
                      : match.state === "mismatch"
                        ? "border-red-200 bg-red-50"
                        : "border-blue-200 bg-blue-50"
                  }`}
                >
                  <span className="flex h-5 w-5 flex-none items-center justify-center">
                    {match.state === "match" && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                    {match.state === "mismatch" && (
                      <ShieldAlert className="h-4 w-4 text-red-600" />
                    )}
                    {match.state === "typing" && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/60">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ease-out ${
                          match.state === "match"
                            ? "bg-green-500"
                            : match.state === "mismatch"
                              ? "bg-red-500"
                              : "bg-blue-500"
                        }`}
                        style={{ width: `${Math.round(match.progress * 100)}%` }}
                      />
                    </div>
                    <p
                      className={`mt-1 text-xs font-medium ${
                        match.state === "match"
                          ? "text-green-700"
                          : match.state === "mismatch"
                            ? "text-red-700"
                            : "text-blue-700"
                      }`}
                    >
                      {match.state === "match" && "Passwords match"}
                      {match.state === "mismatch" && "Passwords don't match"}
                      {match.state === "typing" && "Looking good so far..."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Password strength</span>
                {newPassword.length > 0 && (
                  <span className="font-medium text-blue-700">{strengthLabel}</span>
                )}
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full ${
                      newPassword.length > 0 && i < score ? strengthColor : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  {checks.length ? (
                    <Check className="h-4 w-4 text-blue-700" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={checks.length ? "" : "text-muted-foreground"}>
                    At least 8 characters
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {checks.number ? (
                    <Check className="h-4 w-4 text-blue-700" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={checks.number ? "" : "text-muted-foreground"}>
                    Contains a number
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {checks.special ? (
                    <Check className="h-4 w-4 text-blue-700" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={checks.special ? "" : "text-muted-foreground"}>
                    Contains a special character
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Not checked against previous passwords (not yet tracked)
                  </span>
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full gap-2 bg-blue-700 hover:bg-blue-800"
              disabled={!canSubmit}
            >
              <ShieldCheck className="h-4 w-4" />
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Need help? Contact{" "}
            <a href="mailto:support@ilabgrowth.com" className="text-blue-700 underline">
              support@ilabgrowth.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}