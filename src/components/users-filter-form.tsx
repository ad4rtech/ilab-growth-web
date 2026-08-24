"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";

const STATUS_FILTERS = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "unverified", label: "Unverified" },
  { value: "suspended", label: "Suspended" },
];

export function UsersFilterForm({
  initialQuery,
  initialStatus,
  initialCountry,
}: {
  initialQuery: string;
  initialStatus: string;
  initialCountry: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState(initialStatus);
  const [country, setCountry] = useState(initialCountry);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    if (status) params.set("status", status);
    else params.delete("status");
    if (country) params.set("country", country);
    else params.delete("country");
    params.delete("page"); // reset pagination on a new filter
    router.push(`/admin/users?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <div className="relative w-[220px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="pl-9"
        />
      </div>

      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="h-9 rounded-md border bg-white px-3 text-sm"
      >
        <option value="">All Countries</option>
        {COUNTRIES.map((c) => (
  <option key={c.name} value={c.name}>
    {c.flag} {c.name}
  </option>
))}
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="h-9 rounded-md border bg-white px-3 text-sm"
      >
        {STATUS_FILTERS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <Button type="submit" variant="outline">
        Filter
      </Button>
    </form>
  );
}