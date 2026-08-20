import { ShieldCheck } from "lucide-react";

export function TwoFactorCard() {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="flex items-center gap-2 font-bold text-gray-900">
        <ShieldCheck className="h-4 w-4 text-blue-700" />
        Two-Factor Authentication
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Two-factor authentication isn&apos;t available yet. We&apos;ll let you know when it
        launches.
      </p>
    </div>
  );
}