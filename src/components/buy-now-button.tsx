"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, GraduationCap, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProductToCart, addCourseToCart } from "@/lib/cart";
import { formatKES } from "@/lib/format";

interface BuyNowButtonProps {
  itemType: "product" | "course";
  itemId: string;
  price: number;
  quantity?: number;
  userId?: string;
  redirectPath: string;
  label?: string;
  className?: string;
}

export function BuyNowButton({
  itemType,
  itemId,
  price,
  quantity = 1,
  userId,
  redirectPath,
  label,
  className,
}: BuyNowButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isCourse = itemType === "course";

  async function handleClick() {
    if (!userId) {
      router.push(`/login?redirect=${redirectPath}`);
      return;
    }

    setLoading(true);
    const count = isCourse
      ? await addCourseToCart(userId, itemId)
      : await addProductToCart(userId, itemId, quantity);
    setLoading(false);

    if (count === null) {
      toast.error("Could not start checkout. Please try again.");
      return;
    }

    window.dispatchEvent(new CustomEvent("cart:updated", { detail: count }));
    router.push("/checkout");
  }

  const Icon = isCourse ? GraduationCap : ShoppingCart;
  const defaultLabel = isCourse
    ? `Enroll Now — ${formatKES(price)}`
    : `Buy Now — ${formatKES(price * quantity)}`;

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={className ?? "w-full justify-center gap-2 bg-blue-700 text-white hover:bg-blue-800"}
    >
      {loading ? (
        "Starting checkout..."
      ) : (
        <>
          <Icon className="h-4 w-4" />
          {label ?? defaultLabel}
        </>
      )}
    </Button>
  );
}