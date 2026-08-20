"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProductToCart } from "@/lib/cart";

interface AddToCartButtonProps {
  productId: string;
  title: string;
  price: number;
  userId?: string;
}

export function AddToCartButton({ productId, userId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!userId) {
    return (
    <Button asChild className="w-full bg-blue-700 hover:bg-blue-800">
  <Link href={`/login?redirect=/products/${productId}`} className="flex items-center justify-center gap-2">
    <ShoppingCart className="h-4 w-4" />
    Log in to Add to Cart
  </Link>
</Button>
    );
  }

  async function handleClick() {
    setLoading(true);
    const count = await addProductToCart(userId!, productId, quantity);
    setLoading(false);

    if (count === null) {
      toast.error("Could not add to cart.");
      return;
    }
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: count }));
    toast.success("Added to cart.");
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-lg border px-2 py-1.5">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1}
          className="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-40"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-medium">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-gray-100"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <Button onClick={handleClick} disabled={loading} className="flex-1 gap-2 bg-blue-700 hover:bg-blue-800">
        <ShoppingCart className="h-4 w-4" />
        {loading ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  );
}