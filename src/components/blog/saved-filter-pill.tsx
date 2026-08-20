"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export function SavedFilterPill({ savedCount }: { savedCount: number }) {
  const searchParams = useSearchParams();
  const isActive = searchParams.get("saved") === "true";

  if (savedCount === 0) return null;

  return (
    <Link
      href={isActive ? "/dashboard/blog" : "/dashboard/blog?saved=true"}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium",
        isActive ? "border-blue-700 bg-blue-700 text-white" : "text-gray-600 hover:bg-gray-50",
      )}
    >
      <Bookmark className={cn("h-3.5 w-3.5", isActive && "fill-current")} />
      Saved
      <span
        className={cn(
          "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold",
          isActive ? "bg-white text-blue-700" : "bg-gray-100 text-gray-600",
        )}
      >
        {savedCount}
      </span>
    </Link>
  );
}