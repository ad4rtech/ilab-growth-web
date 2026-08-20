"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

const RANGES = [
  { value: "7d", label: "Last 7 Days" },
  { value: "this-week", label: "This Week" },
  { value: "30d", label: "Last 30 Days" },
  { value: "this-month", label: "This Month" },
  { value: "90d", label: "Last 90 Days" },
];

export function DateRangeSelect({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) {
  const [value, setValue] = useState(variant === "compact" ? "this-week" : "7d");

  return (
    <Select items={RANGES} value={value} onValueChange={setValue}>
      <SelectTrigger className={variant === "compact" ? "w-[150px]" : "w-[200px]"}>
        {variant === "default" && <Calendar className="mr-1 h-4 w-4" />}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {RANGES.map((r) => (
          <SelectItem key={r.value} value={r.value}>
            {r.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}