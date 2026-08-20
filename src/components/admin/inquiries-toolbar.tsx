"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { InquiryStats } from "@/lib/inquiries-admin";

const TYPE_TABS = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "call", label: "Call Requests" },
];

const STATUS_TABS = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

export function InquiriesToolbar({ stats }: { stats: InquiryStats }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeType = searchParams.get("type") ?? "all";
  const activeStatus = searchParams.get("status") ?? "all";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    params.delete("page");
    router.push(`/admin/inquiries?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateParam("search", String(formData.get("search") ?? "").trim());
  }

  function countFor(tab: string) {
    if (tab === "all") return stats.total;
    if (tab === "general") return stats.general;
    if (tab === "call") return stats.call;
    if (tab === "new") return stats.statusNew;
    if (tab === "contacted") return stats.statusContacted;
    if (tab === "closed") return stats.statusClosed;
    return undefined;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {TYPE_TABS.map((tab) => (
          <Button
            key={tab.value}
            variant="outline"
            size="sm"
            className={cn(
              "gap-1.5",
              activeType === tab.value && "border-blue-600 bg-blue-50 text-blue-700",
            )}
            onClick={() => updateParam("type", tab.value)}
          >
            {tab.label}
            <span className="rounded-full bg-gray-100 px-1.5 text-xs text-gray-600">
              {countFor(tab.value)}
            </span>
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <Button
              key={tab.value}
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1.5",
                activeStatus === tab.value && "bg-gray-100 font-medium text-gray-900",
              )}
              onClick={() => updateParam("status", tab.value)}
            >
              {tab.label}
              {tab.value !== "all" && (
                <span className="rounded-full bg-gray-100 px-1.5 text-xs text-gray-600">
                  {countFor(tab.value)}
                </span>
              )}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            defaultValue={searchParams.get("search") ?? ""}
            placeholder="Search name, email, business..."
            className="w-64 pl-9"
          />
        </form>
      </div>
    </div>
  );
}