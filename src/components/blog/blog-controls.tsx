"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SEARCH_DEBOUNCE_MS = 300;

export function BlogSearchInput({ basePath = "/blog" }: { basePath?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const isDirtyRef = useRef(false);

  useEffect(() => {
    if (!isDirtyRef.current) return;

    const handle = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }
      params.delete("page");
      router.push(`${basePath}?${params.toString()}`, { scroll: false });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Enter still works instantly — no longer required
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        name="search"
        value={value}
        onChange={(e) => {
          isDirtyRef.current = true;
          setValue(e.target.value);
        }}
        placeholder="Search articles..."
        className="pl-9"
      />
    </form>
  );
}

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest First" },
  { value: "popular", label: "Most Popular" },
] as const;

export function BlogSortSelect({ basePath = "/blog" }: { basePath?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSort = searchParams.get("sort") ?? "recent";

  function setSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "recent") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  }

  return (
    <Select value={activeSort} onValueChange={(v) => v !== null && setSort(v)}>
      <SelectTrigger className="w-[170px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}