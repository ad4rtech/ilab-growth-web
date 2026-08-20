"use client";

// src/components/admin/subscribers-toolbar.tsx
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Send, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_ITEMS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Subscribed" },
  { value: "unsubscribed", label: "Unsubscribed" },
];

export function SubscribersToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [exporting, setExporting] = useState(false);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/admin/subscribers?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateParam("search", String(formData.get("search") ?? "").trim());
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/subscribers/export-csv");
      if (!res.ok) {
        toast.error("Could not generate export.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("List downloaded.");
    } catch {
      toast.error("Network error during export.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild className="bg-blue-700 hover:bg-blue-800">
        <Link href="/admin/subscribers/new-campaign" className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Create Campaign
        </Link>
      </Button>

      <Button variant="outline" className="gap-2" onClick={handleExport} disabled={exporting}>
        <Download className="h-4 w-4" />
        {exporting ? "Exporting..." : "Export List"}
      </Button>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            defaultValue={searchParams.get("search") ?? ""}
            placeholder="Search subscribers..."
            className="w-56 pl-9"
          />
        </form>

        <Select
          value={searchParams.get("status") ?? "all"}
          onValueChange={(v) => updateParam("status", v)}
          items={STATUS_ITEMS}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_ITEMS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}