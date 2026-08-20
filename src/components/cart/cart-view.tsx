"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Shield, Zap, Infinity as InfinityIcon, Headset, Smartphone, CreditCard, Wallet, Lock } from "lucide-react";
import { formatKES } from "@/lib/format";
import { CartItemCard } from "@/components/cart/cart-item-card";
import { Button } from "@/components/ui/button";
import type { CartLineItem } from "@/lib/cart";

export function CartView({ userId, initialItems }: { userId: string; initialItems: CartLineItem[] }) {
  const [items, setItems] = useState(initialItems);

  function handleRemoved(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleQuantityChanged(id: string, quantity: number) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => {
    const price = i.product?.price ?? i.course?.price ?? 0;
    return sum + price * i.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-24 text-center">
        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        <p className="font-medium text-gray-900">Your cart is empty</p>
        <p className="max-w-xs text-sm text-muted-foreground">Browse products and courses to add something here.</p>
        <Link href="/dashboard/products" className="text-sm font-medium text-blue-700 hover:underline">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
              Your Cart
            </h1>
            <p className="text-sm text-muted-foreground">Review your items before checking out.</p>
          </div>
          <span className="text-sm text-muted-foreground">
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-6 rounded-xl border bg-white px-5">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              userId={userId}
              onRemoved={handleRemoved}
              onQuantityChanged={handleQuantityChanged}
            />
          ))}
        </div>

        <Link href="/dashboard/products" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Continue Shopping
        </Link>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border bg-gray-50 p-6">
          <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-lg font-bold">
            Order Summary
          </h2>

          <div className="mt-4 space-y-2 text-sm">
            {items.map((item) => {
              const entity = item.course ?? item.product;
              if (!entity) return null;
              const lineTotal = entity.price * item.quantity;
              return (
                <div key={item.id} className="flex justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">
                    {entity.title}
                    {item.quantity > 1 && <span className="text-gray-400"> × {item.quantity}</span>}
                  </span>
                  <span className="shrink-0 font-medium">{formatKES(lineTotal)}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between border-t pt-3 text-sm">
            <span className="text-muted-foreground">
              Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})
            </span>
            <span className="font-medium">{formatKES(total)}</span>
          </div>

          <div className="mt-2 flex justify-between border-t pt-3">
            <span className="font-bold">Total</span>
            <span className="text-lg font-bold">{formatKES(total)}</span>
          </div>

          <div className="mt-5">
         <Button asChild className="w-full bg-blue-700 py-6 text-base text-white hover:bg-blue-800">
  <Link href="/checkout" className="flex items-center justify-center gap-2">
    <Lock className="h-4 w-4" />
    Proceed to Checkout
  </Link>
</Button> 
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">Secure checkout — pay with</p>
          <div className="mt-2 flex justify-center gap-2">
            <span className="flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs">
              <Smartphone className="h-3.5 w-3.5" />
              M-Pesa
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs">
              <CreditCard className="h-3.5 w-3.5" />
              Card
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs">
              <Wallet className="h-3.5 w-3.5" />
              PayPal
            </span>
          </div>

          <div className="mt-5 space-y-2 border-t pt-4 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" />
              SSL Secured &amp; encrypted checkout
            </p>
            <p className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5" />
              Instant delivery after payment
            </p>
            <p className="flex items-center gap-2">
              <InfinityIcon className="h-3.5 w-3.5" />
              Lifetime access to your purchases
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-blue-50 p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Headset className="h-4 w-4 text-blue-700" />
            Need help?
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Our team is available to assist with any questions about your order.
          </p>
          <Link href="/about" className="mt-1 inline-block text-xs font-medium text-blue-700 hover:underline">
            Contact support →
          </Link>
        </div>
      </div>
    </div>
  );
}