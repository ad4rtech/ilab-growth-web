"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CartPageTabsProps {
  cartSlot: React.ReactNode;
  librarySlot: React.ReactNode;
  initialTab?: "cart" | "library";
}

export function CartPageTabs({ cartSlot, librarySlot, initialTab = "cart" }: CartPageTabsProps) {
  const [tab, setTab] = useState<"cart" | "library">(initialTab);

  return (
    <div>
      <div className="flex gap-6 border-b">
        <button
          onClick={() => setTab("cart")}
          className={cn(
            "border-b-2 px-1 pb-3 text-sm font-medium",
            tab === "cart" ? "border-blue-700 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700",
          )}
        >
          Your Cart
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

      <div className="mt-8">{tab === "cart" ? cartSlot : librarySlot}</div>
    </div>
  );
}