import { BookOpen, Package, ShieldCheck, Lock, Users, Headset } from "lucide-react";
import { formatKES } from "@/lib/format";
import type { CartLineItem } from "@/lib/cart";

export function OrderSummarySidebar({ items }: { items: CartLineItem[] }) {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => {
    const price = i.product?.price ?? i.course?.price ?? 0;
    return sum + price * i.quantity;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-gray-50 p-6">
        <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-lg font-bold">
          Order Summary
        </h2>

        <div className="mt-4 space-y-2">
          {items.map((item) => {
            const entity = item.course ?? item.product;
            if (!entity) return null;
            return (
              <div key={item.id} className="flex items-center gap-2 text-sm text-gray-700">
                {item.course ? <BookOpen className="h-3.5 w-3.5 shrink-0 text-gray-400" /> : <Package className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
                <span className="truncate">
                  {entity.title}
                  {item.quantity > 1 && <span className="text-gray-400"> × {item.quantity}</span>}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})
            </span>
            <span className="font-medium">{formatKES(total)}</span>
          </div>
        </div>

        <div className="mt-2 flex justify-between border-t pt-3">
          <span className="font-bold">Total</span>
          <span className="text-lg font-bold">{formatKES(total)}</span>
        </div>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        <p className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
          SSL Secured
        </p>
        <p className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-green-600" />
          128-bit Encryption
        </p>
        <p className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-green-600" />
          Trusted by 12,000+ customers
        </p>
      </div>

      <div className="rounded-xl border bg-blue-50 p-4">
        <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <Headset className="h-4 w-4 text-blue-700" />
          Questions?
        </p>
        <p className="mt-1 text-xs text-gray-600">Contact us anytime</p>
        <a href="mailto:support@ilabgrowth.com" className="mt-1 inline-block text-xs font-medium text-blue-700 hover:underline">
          support@ilabgrowth.com
        </a>
      </div>
    </div>
  );
}