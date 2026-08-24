"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Download, Printer, Calendar, ChevronDown } from "lucide-react";

type ExportRow = {
  id: string;
  customer: string;
  item: string;
  amount: number;
  status: string;
  date: string;
};

const CATEGORY_ITEMS = [
  { value: "all", label: "All Categories" },
  { value: "courses", label: "Online Courses" },
  { value: "products", label: "Digital Products" },
];

export function SalesReportsToolbar({ exportRows }: { exportRows: ExportRow[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const category = searchParams.get("category") ?? "all";

  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);
  const [dateOpen, setDateOpen] = useState(false);

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    }
    router.push(`/admin/sales-reports?${params.toString()}`);
  }

  function applyDateRange() {
    updateParams({ from: draftFrom, to: draftTo });
    setDateOpen(false);
  }

  function clearDateRange() {
    setDraftFrom("");
    setDraftTo("");
    updateParams({ from: "", to: "" });
    setDateOpen(false);
  }

  const dateLabel = from || to ? `${from || "…"} → ${to || "…"}` : "All Time";

  function handleExport() {
    if (exportRows.length === 0) {
      toast.info("Nothing to export yet — no orders found for this filter.");
      return;
    }

    const header = ["Order ID", "Customer", "Item", "Amount (KES)", "Status", "Date"];
    const rows = exportRows.map((r) => [
      r.id,
      r.customer,
      r.item,
      String(r.amount),
      r.status,
      new Date(r.date).toLocaleDateString(),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Report exported.");
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button type="button" className="gap-2 bg-blue-700 hover:bg-blue-800" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export Report
        </Button>
        <Button type="button" variant="outline" className="gap-2" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          {/* Styled directly with buttonVariants instead of nesting <Button>,
              since Button always renders a real <button> via Base UI's
              ButtonPrimitive — nesting it inside PopoverTrigger produced a
              <button> inside a <button>, which is invalid HTML and caused
              a hydration error. */}
          <PopoverTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-2"
            )}
          >
            <Calendar className="h-3.5 w-3.5" />
            {dateLabel}
            <ChevronDown className="h-3.5 w-3.5" />
          </PopoverTrigger>
          <PopoverContent className="w-72 space-y-3" align="end">
            <div className="space-y-1.5">
              <Label htmlFor="from-date" className="text-xs">From</Label>
              <Input
                id="from-date"
                type="date"
                value={draftFrom}
                onChange={(e) => setDraftFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="to-date" className="text-xs">To</Label>
              <Input
                id="to-date"
                type="date"
                value={draftTo}
                onChange={(e) => setDraftTo(e.target.value)}
              />
            </div>
            <div className="flex justify-between pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={clearDateRange}>
                Clear
              </Button>
              <Button type="button" size="sm" className="bg-blue-700 hover:bg-blue-800" onClick={applyDateRange}>
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Select
          value={category}
          onValueChange={(v) => updateParams({ category: v ?? "all" })}
          items={CATEGORY_ITEMS}
        >
          <SelectTrigger className="w-[170px]" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_ITEMS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}