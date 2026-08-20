"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addCourseToCart } from "@/lib/cart";

export function CourseAddToCartButton({ userId, courseId }: { userId?: string; courseId: string }) {
  const [loading, setLoading] = useState(false);

  if (!userId) {
    return (
    <Button asChild variant="outline" className="w-center">
  <Link href={`/login?redirect=/courses/${courseId}`} className="flex w-full items-center gap-2">
    <ShoppingCart className="h-4 w-4" />
    Add to Cart
  </Link>
</Button>
    );
  }

  async function handleClick() {
    setLoading(true);
    const count = await addCourseToCart(userId!, courseId);
    setLoading(false);

    if (count === null) {
      toast.error("Could not add to cart.");
      return;
    }
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: count }));
    toast.success("Added to cart.");
  }

  return (
    <Button onClick={handleClick} disabled={loading} variant="outline" className="w-full gap-2">
      <ShoppingCart className="h-4 w-4" />
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}