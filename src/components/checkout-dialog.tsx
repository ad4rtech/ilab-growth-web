"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatKES } from "@/lib/format";
import {
  Smartphone,
  Loader2,
  CheckCircle2,
  XCircle,
  Download,
  GraduationCap,
  ShoppingCart,
} from "lucide-react";

type OrderStatus = {
  id: string;
  status: "pending" | "completed" | "failed";
  total: number;
  mpesaReceiptNumber: string | null;
  resultDesc: string | null;
  item:
    | null
    | { type: "course"; id: string; title: string }
    | { type: "product"; id: string; title: string; fileUrl: string | null };
};

type Stage =
  | "phone"
  | "pending"
  | "success"
  | "failed"
  | "login-required"
  | "error";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 30; // ~90 seconds, roughly matching Daraja's own STK timeout

export function CheckoutDialog({
  itemType,
  itemId,
  title,
  price,
  triggerLabel,
  triggerClassName = "gap-1.5 bg-orange-500 hover:bg-orange-600",
  triggerSize = "sm",
}: {
  itemType: "product" | "course";
  itemId: string;
  title: string;
  price: number;
  triggerLabel?: string;
  triggerClassName?: string;
  triggerSize?: "sm" | "default";
}) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("phone");
  const [phone, setPhone] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef = useRef(0);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  useEffect(() => stopPolling, []);

  function resetDialog() {
    stopPolling();
    pollCountRef.current = 0;
    setStage("phone");
    setErrorMessage("");
    setOrderStatus(null);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetDialog();
  }

  function pollStatus(orderId: string) {
    pollRef.current = setInterval(async () => {
      pollCountRef.current += 1;
      try {
        const res = await fetch(`/api/checkout/orders/${orderId}/status`);
        const data: OrderStatus = await res.json();

        if (data.status === "completed") {
          stopPolling();
          setOrderStatus(data);
          setStage("success");
          return;
        }
        if (data.status === "failed") {
          stopPolling();
          setOrderStatus(data);
          setErrorMessage(
            data.resultDesc ||
              "Payment failed. Please try again or use a different payment method."
          );
          setStage("failed");
          return;
        }
      } catch {
        // Transient network error while polling — keep trying until MAX_POLLS.
      }

      if (pollCountRef.current >= MAX_POLLS) {
        stopPolling();
        setErrorMessage(
          "This is taking longer than expected. Check your phone for the M-Pesa prompt, or try again."
        );
        setStage("failed");
      }
    }, POLL_INTERVAL_MS);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;

    setSubmitting(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/checkout/mpesa/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone.trim(), itemType, itemId }),
      });

      if (res.status === 401) {
        setStage("login-required");
        setSubmitting(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.message ?? "Could not start M-Pesa payment.");
        setStage("error");
        setSubmitting(false);
        return;
      }

      setCustomerMessage(
        data.customerMessage || "Check your phone to complete payment."
      );
      setStage("pending");
      pollCountRef.current = 0;
      pollStatus(data.orderId);
    } catch {
      setErrorMessage("Network error. Check your connection and try again.");
      setStage("error");
    } finally {
      setSubmitting(false);
    }
  }

  const defaultLabel = itemType === "course" ? "Enroll Now" : "Buy Now";
  const Icon = itemType === "course" ? GraduationCap : ShoppingCart;
  const loginRedirect =
    itemType === "course" ? `/courses/${itemId}` : `/products/${itemId}`;

  return (
    <>
      <Button
        size={triggerSize}
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        <Icon className="h-3.5 w-3.5" />
        {triggerLabel ?? defaultLabel}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          {stage === "phone" && (
            <>
              <DialogHeader>
                <DialogTitle>Pay with M-Pesa</DialogTitle>
                <DialogDescription>
                  {title} — {formatKES(price)}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">M-Pesa Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07XX XXX XXX"
                      className="pl-9"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You&apos;ll get an M-Pesa PIN prompt on this number.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-700 hover:bg-blue-800"
                  >
                    {submitting ? "Starting..." : `Pay ${formatKES(price)}`}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}

          {stage === "pending" && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
              <p className="font-medium">Waiting for M-Pesa confirmation...</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                {customerMessage} Enter your PIN on your phone to complete the
                payment.
              </p>
            </div>
          )}

          {stage === "success" && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
              <p className="text-lg font-semibold">
                {itemType === "course"
                  ? "Enrolled successfully! Start learning now."
                  : "Payment successful! Your order is confirmed."}
              </p>
              {orderStatus?.mpesaReceiptNumber && (
                <p className="text-xs text-muted-foreground">
                  M-Pesa receipt: {orderStatus.mpesaReceiptNumber}
                </p>
              )}

              {orderStatus?.item?.type === "product" &&
                orderStatus.item.fileUrl && (
                  <Button
                    asChild
                    className="gap-2 bg-blue-700 hover:bg-blue-800"
                  >
                    <a
                      href={orderStatus.item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download className="h-4 w-4" />
                      Download Now
                    </a>
                  </Button>
                )}
              {orderStatus?.item?.type === "product" &&
                !orderStatus.item.fileUrl && (
                  <p className="text-sm text-muted-foreground">
                    No file has been attached to this product yet —
                    we&apos;ll be in touch.
                  </p>
                )}
              {orderStatus?.item?.type === "course" && (
                <Button asChild className="gap-2 bg-blue-700 hover:bg-blue-800">
                  <Link href={`/courses/${orderStatus.item.id}`}>
                    View Course
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(false)}
              >
                Close
              </Button>
            </div>
          )}

          {(stage === "failed" || stage === "error") && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <XCircle className="h-10 w-10 text-red-600" />
              <p className="font-medium">
                Payment failed. Please try again or use a different payment
                method.
              </p>
              <p className="max-w-xs text-sm text-muted-foreground">
                {errorMessage}
              </p>
              <Button onClick={resetDialog}>Try Again</Button>
            </div>
          )}

          {stage === "login-required" && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="font-medium">Please log in to continue.</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                You need an account to{" "}
                {itemType === "course" ? "enroll in" : "purchase"} this{" "}
                {itemType}.
              </p>
              <Button asChild className="bg-blue-700 hover:bg-blue-800">
                <Link href={`/login?redirect=${loginRedirect}`}>Log In</Link>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}