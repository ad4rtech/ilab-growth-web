"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Trash2, GraduationCap, Package, Minus, Plus } from "lucide-react";
import { formatKES } from "@/lib/format";
import type { CartLineItem } from "@/lib/cart";
import { removeCartItem, updateCartItemQuantity } from "@/lib/cart";

export function CartItemCard({
  item,
  userId,
  onRemoved,
  onQuantityChanged,
}: {
  item: CartLineItem;
  userId: string;
  onRemoved: (id: string) => void;
  onQuantityChanged: (id: string, quantity: number) => void;
}) {
  const [removing, setRemoving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const isCourse = !!item.course;
  const entity = item.course ?? item.product;
  if (!entity) return null;

  const href = isCourse ? `/courses/${entity.id}` : `/products/${entity.id}`;
  const imageUrl = isCourse ? item.course!.thumbnailUrl : item.product!.imageUrl;
  const metaLine = isCourse
    ? [item.course!.category, "Course"].filter(Boolean).join(" · ")
    : [item.product!.category, item.product!.productType].filter(Boolean).join(" · ");
  const subMeta = isCourse
    ? [item.course!.lessonCount ? `${item.course!.lessonCount} lessons` : null, item.course!.durationLabel]
        .filter(Boolean)
        .join(" · ")
    : "Instant Download";
  const lineTotal = entity.price * item.quantity;

  async function handleRemove() {
    setRemoving(true);
    const count = await removeCartItem(item.id, userId);
    if (count === null) {
      toast.error("Could not remove item.");
      setRemoving(false);
      return;
    }
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: count }));
    onRemoved(item.id);
    toast.success("Removed from cart.");
  }

  async function handleQuantityChange(newQuantity: number) {
    if (newQuantity < 1) {
      handleRemove();
      return;
    }
    setUpdating(true);
    const count = await updateCartItemQuantity(item.id, userId, newQuantity);
    setUpdating(false);
    if (count === null) {
      toast.error("Could not update quantity.");
      return;
    }
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: count }));
    onQuantityChanged(item.id, newQuantity);
  }

  return (
    <div className="flex gap-4 border-b py-5 last:border-b-0">
      <Link href={href} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={entity.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            {isCourse ? <GraduationCap className="h-6 w-6" /> : <Package className="h-6 w-6" />}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-orange-600">{metaLine}</p>
          <Link href={href}>
            <h3 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-0.5 font-semibold text-gray-900 hover:underline">
              {entity.title}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-gray-500">{subMeta}</p>
        </div>

        <div className="mt-2 flex items-center gap-4">
          {isCourse ? (
            <span className="text-xs text-muted-foreground">Qty: 1 (courses are single-enrollment)</span>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border px-2 py-1">
              <button
                type="button"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={updating}
                className="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-40"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={updating}
                className="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={handleRemove}
            disabled={removing}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {removing ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-gray-900">{formatKES(lineTotal)}</p>
        {item.quantity > 1 && (
          <p className="text-xs text-muted-foreground">{formatKES(entity.price)} each</p>
        )}
        {entity.compareAtPrice && entity.compareAtPrice > entity.price && (
          <p className="text-xs text-muted-foreground line-through">{formatKES(entity.compareAtPrice * item.quantity)}</p>
        )}
      </div>
    </div>
  );
}