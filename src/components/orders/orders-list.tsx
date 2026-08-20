"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Package, GraduationCap, Trash2, ClipboardCheck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatKES } from "@/lib/format";
import { hideOrder, type OrderSummary } from "@/lib/orders";

function statusBadgeClass(status: string) {
  if (status === "completed") return "bg-green-100 text-green-700";
  if (status === "failed") return "bg-red-100 text-red-700";
  return "bg-orange-100 text-orange-700";
}

export function OrdersList({ initialOrders }: { initialOrders: OrderSummary[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleHide(id: string) {
    setRemovingId(id);
    const ok = await hideOrder(id);
    setRemovingId(null);
    if (!ok) {
      toast.error("Could not remove order from your history.");
      return;
    }
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.success("Order removed from your history.");
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
        <ClipboardCheck className="h-8 w-8 text-muted-foreground" />
        <p className="font-medium text-gray-900">No orders yet</p>
        <p className="text-sm text-muted-foreground">Purchases you make will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center gap-4 rounded-xl border bg-white p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            {order.item?.type === "course" ? <GraduationCap className="h-5 w-5" /> : <Package className="h-5 w-5" />}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-gray-900">{order.item?.title ?? "Order"}</p>
            <p className="text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              {order.mpesaReceiptNumber && ` · ${order.mpesaReceiptNumber}`}
            </p>
          </div>

          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(order.status)}`}>
            {order.status}
          </span>

          <p className="shrink-0 font-semibold text-gray-900">{formatKES(order.total)}</p>

          {order.status === "completed" && (
            <Link
              href={`/dashboard/account/receipts/${order.id}`}
              className="shrink-0 text-xs font-medium text-blue-700 hover:underline"
            >
              Receipt
            </Link>
          )}

          <AlertDialog>
            <AlertDialogTrigger className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove this order from your history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This only removes it from your view — it stays on record for support and accounting purposes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  disabled={removingId === order.id}
                  onClick={() => handleHide(order.id)}
                >
                  {removingId === order.id ? "Removing..." : "Remove"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}