"use client";

// src/components/admin/blog-posts-toolbar.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Plus, Download, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NamedItem } from "@/components/manage-list-dialog";

const STATUS_ITEMS = [
  { value: "all", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
];

export function BlogPostsToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<NamedItem[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/blog-categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: NamedItem[]) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/admin/blog?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateParam("search", String(formData.get("search") ?? "").trim());
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/blog-posts/export-report");
      if (!res.ok) {
        toast.error("Could not generate report.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `blog-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded.");
    } catch {
      toast.error("Network error during export.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild className="bg-blue-700 hover:bg-blue-800">
        <Link href="/admin/blog/new" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Write New Post
        </Link>
      </Button>

      <Button variant="outline" className="gap-2" onClick={handleExport} disabled={exporting}>
        <Download className="h-4 w-4" />
        {exporting ? "Exporting..." : "Export Report"}
      </Button>

       <Button asChild variant="outline">
        <Link href="/admin/comments" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          View Comments
        </Link>
      </Button>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            defaultValue={searchParams.get("search") ?? ""}
            placeholder="Search posts..."
            className="w-56 pl-9"
          />
        </form>

        <Select
          value={searchParams.get("category") ?? "all"}
          onValueChange={(v) => updateParam("category", v ?? "all")}
          items={[{ value: "all", label: "All Categories" }, ...categories.map((c) => ({ value: c.name, label: c.name }))]}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("status") ?? "all"}
          onValueChange={(v) => updateParam("status", v ?? "all")}
          items={STATUS_ITEMS}
        >
          <SelectTrigger className="w-[150px]">
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