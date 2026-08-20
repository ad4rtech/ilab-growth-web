"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { addProductToCart } from "@/lib/cart";

export function MoveToCartButton({ userId, productId }: { userId: string; productId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const count = await addProductToCart(userId, productId);
    setLoading(false);

    if (count === null) {
      toast.error("Could not add to cart.");
      return;
    }

    window.dispatchEvent(new CustomEvent("cart:updated", { detail: count }));
    toast.success("Moved to cart.");
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
    >
      <ShoppingCart className="h-4 w-4" />
      {loading ? "Adding..." : "Move to Cart"}
    </button>
  );
}