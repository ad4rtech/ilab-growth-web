"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatKES } from "@/lib/format";
import { addProductToCart, addCourseToCart } from "@/lib/cart";
import { Minus, Plus, ShoppingCart, Lock, GraduationCap } from "lucide-react";

interface QuickBuyModalProps {
  itemType: "product" | "course";
  itemId: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  imageUrl?: string | null;
  detailHref: string;
  userId?: string;
  triggerLabel?: string;
  triggerClassName?: string;
}

export function QuickBuyModal({
  itemType,
  itemId,
  title,
  price,
  compareAtPrice,
  imageUrl,
  detailHref,
  userId,
  triggerLabel,
  triggerClassName,
}: QuickBuyModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [startingCheckout, setStartingCheckout] = useState(false);

  const isCourse = itemType === "course";
  const total = price * quantity;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setQuantity(1);
  }

  function requireLogin() {
    handleOpenChange(false);
    router.push(`/login?redirect=${detailHref}`);
  }

  async function handleAddToCart() {
    if (!userId) {
      requireLogin();
      return;
    }
    setAddingToCart(true);
    const count = isCourse
      ? await addCourseToCart(userId, itemId)
      : await addProductToCart(userId, itemId, quantity);
    setAddingToCart(false);

    if (count === null) {
      toast.error("Could not add to cart.");
      return;
    }
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: count }));
    toast.success("Added to cart.");
    handleOpenChange(false);
  }

  async function handleProceedToCheckout() {
    if (!userId) {
      requireLogin();
      return;
    }
    setStartingCheckout(true);
    const count = isCourse
      ? await addCourseToCart(userId, itemId)
      : await addProductToCart(userId, itemId, quantity);
    setStartingCheckout(false);

    if (count === null) {
      toast.error("Could not start checkout. Please try again.");
      return;
    }
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: count }));
    handleOpenChange(false);
    router.push("/checkout");
  }

  const Icon = isCourse ? GraduationCap : ShoppingCart;

  return (
    <>
      <Button onClick={() => setOpen(true)} className={triggerClassName ?? "shrink-0 gap-1.5 bg-orange-500 hover:bg-orange-600"} size="sm">
        <Icon className="h-3.5 w-3.5" />
        {triggerLabel ?? (isCourse ? "Enroll Now" : "Buy Now")}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isCourse ? "Enroll in this course" : "Buy this product"}</DialogTitle>
          </DialogHeader>

          <div className="flex gap-4">
            <Link
              href={detailHref}
              onClick={() => handleOpenChange(false)}
              className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-800"
            >
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={detailHref} onClick={() => handleOpenChange(false)}>
                <p className="font-semibold text-gray-900 hover:underline">{title}</p>
              </Link>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-lg font-bold">{formatKES(price)}</span>
                {compareAtPrice && compareAtPrice > price && (
                  <span className="text-sm text-muted-foreground line-through">{formatKES(compareAtPrice)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2">
            {isCourse ? (
              <p className="text-xs text-muted-foreground">
                Courses are limited to one enrollment per account — quantity isn&apos;t applicable here.
              </p>
            ) : (
              <div className="flex items-center justify-between">
                <Label className="text-sm">Quantity</Label>
                <div className="flex items-center gap-3 rounded-lg border px-2 py-1">
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
              </div>
            )}
          </div>

          {!isCourse && quantity > 1 && (
            <p className="text-right text-sm text-muted-foreground">
              Total: <span className="font-semibold text-gray-900">{formatKES(total)}</span>
            </p>
          )}

          <div className="mt-2 flex flex-col gap-2">
            <Button variant="outline" onClick={handleAddToCart} disabled={addingToCart} className="w-full gap-2">
              <ShoppingCart className="h-4 w-4" />
              {addingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              onClick={handleProceedToCheckout}
              disabled={startingCheckout}
              className="w-full gap-2 bg-blue-700 text-white hover:bg-blue-800"
            >
              <Lock className="h-4 w-4" />
              {startingCheckout ? "Starting..." : `Proceed to Checkout — ${formatKES(total)}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}