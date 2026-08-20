"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductViewTabsProps {
  allProductsSlot: React.ReactNode;
  myLibrarySlot: React.ReactNode;
}

export function ProductViewTabs({ allProductsSlot, myLibrarySlot }: ProductViewTabsProps) {
  const [tab, setTab] = useState<"all" | "library">("all");

  return (
    <div>
      <div className="flex gap-6 border-b">
        <button
          onClick={() => setTab("all")}
          className={cn(
            "border-b-2 px-1 pb-3 text-sm font-medium",
            tab === "all" ? "border-blue-700 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700",
          )}
        >
          All Products
        </button>
        <button
          onClick={() => setTab("library")}
          className={cn(
            "border-b-2 px-1 pb-3 text-sm font-medium",
            tab === "library" ? "border-blue-700 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700",
          )}
        >
          My Library
        </button>
      </div>

      <div className="mt-8">{tab === "all" ? allProductsSlot : myLibrarySlot}</div>
    </div>
  );
}