"use client";

// src/components/admin/settings-nav.tsx
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "general", label: "General" },
  { value: "email", label: "Email" },
  { value: "security", label: "Security" },
];

export function SettingsNav() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "general";

  return (
    <nav className="w-48 flex-none space-y-1">
      {TABS.map((tab) => (
        <Link
          key={tab.value}
          href={`/admin/settings?tab=${tab.value}`}
          className={cn(
            "block rounded-lg px-3 py-2 text-sm",
            activeTab === tab.value
              ? "bg-blue-50 font-medium text-blue-700"
              : "text-gray-600 hover:bg-gray-50",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}