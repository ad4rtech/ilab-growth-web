"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Link2 from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Smartphone,
  Loader2,
  CheckCircle2,
  XCircle,
  Download,
  GraduationCap,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { formatKES } from "@/lib/format";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { OrderSummarySidebar } from "@/components/checkout/order-summary-sidebar";
import { BillingForm, type BillingDetails } from "@/components/checkout/billing-form";
import { PaymentMethodSelector } from "@/components/checkout/payment-method-selector";
import type { CartLineItem } from "@/lib/cart";

type OrderItemResult =
  | { type: "course"; id: string; title: string }
  | { type: "product"; id: string; title: string; fileUrl: string | null };

type OrderStatus = {
  id: string;
  status: "pending" | "completed" | "failed";
  total: number;
  mpesaReceiptNumber: string | null;
  resultDesc: string | null;
  items: OrderItemResult[];
};

type Step = "information" | "payment" | "confirmation";
type PaymentSubStage = "phone" | "pending" | "failed";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 30;

interface CheckoutFlowProps {
  items: CartLineItem[];
  defaultFirstName: string;
  defaultLastName: string;
  defaultEmail: string;
}

export function CheckoutFlow({ items, defaultFirstName, defaultLastName, defaultEmail }: CheckoutFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("information");
  const [billing, setBilling] = useState<BillingDetails>({
    firstName: defaultFirstName,
    lastName: defaultLastName,
    email: defaultEmail,
    streetAddress: "",
    city: "",
    country: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [phone, setPhone] = useState("");
  const [paymentStage, setPaymentStage] = useState<PaymentSubStage>("phone");
  const [customerMessage, setCustomerMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef = useRef(0);

  const total = items.reduce((sum, i) => {
    const price = i.product?.price ?? i.course?.price ?? 0;
    return sum + price * i.quantity;
  }, 0);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }
  useEffect(() => stopPolling, []);

  const infoValid =
    billing.firstName.trim() && billing.lastName.trim() && billing.email.trim() && agreedToTerms;

  function handleContinueToPayment() {
    if (!infoValid) return;
    setStep("payment");
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
          setStep("confirmation");
          window.dispatchEvent(new CustomEvent("cart:updated", { detail: 0 }));
          return;
        }
        if (data.status === "failed") {
          stopPolling();
          setOrderStatus(data);
          setErrorMessage(data.resultDesc || "Payment failed. Please try again or use a different payment method.");
          setPaymentStage("failed");
          return;
        }
      } catch {
        // keep trying
      }

      if (pollCountRef.current >= MAX_POLLS) {
        stopPolling();
        setErrorMessage("This is taking longer than expected. Check your phone for the M-Pesa prompt, or try again.");
        setPaymentStage("failed");
      }
    }, POLL_INTERVAL_MS);
  }

  async function handleSubmitPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;

    setSubmitting(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/checkout/mpesa/initiate-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone.trim(),
          billingFirstName: billing.firstName.trim(),
          billingLastName: billing.lastName.trim(),
          billingEmail: billing.email.trim(),
          billingAddress: billing.streetAddress.trim() || undefined,
          billingCity: billing.city.trim() || undefined,
          billingCountry: billing.country || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.message ?? "Could not start M-Pesa payment.");
        setPaymentStage("failed");
        setSubmitting(false);
        return;
      }

      setCustomerMessage(data.customerMessage || "Check your phone to complete payment.");
      setPaymentStage("pending");
      pollCountRef.current = 0;
      pollStatus(data.orderId);
    } catch {
      setErrorMessage("Network error. Check your connection and try again.");
      setPaymentStage("failed");
    } finally {
      setSubmitting(false);
    }
  }

  function retryPayment() {
    setPaymentStage("phone");
    setErrorMessage("");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link href="/cart" className="hover:underline">
          Your Cart
        </Link>
        <span>/</span>
        <span className="text-gray-900">Checkout</span>
      </nav>

      <div className="mt-6">
        <CheckoutSteps current={step === "information" ? 1 : step === "payment" ? 2 : 3} />
      </div>

      {step !== "confirmation" && (
        <div className="mt-8">
          <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
            Secure Checkout
          </h1>
          <p className="text-sm text-muted-foreground">Enter your information to complete your purchase.</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {step === "information" && (
            <>
              <BillingForm value={billing} onChange={setBilling} />
              <PaymentMethodSelector />

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <Checkbox checked={agreedToTerms} onCheckedChange={(v) => setAgreedToTerms(v === true)} />
                I agree to the{" "}
                <Link2 href="/terms" className="text-blue-700 hover:underline">
                  Terms of Service
                </Link2>{" "}
                and{" "}
                <Link2 href="/privacy" className="text-blue-700 hover:underline">
                  Privacy Policy
                </Link2>
              </label>

              <div className="flex flex-wrap gap-3">
                          <Button asChild variant="outline">
            <Link href="/cart" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
                <Button
                  onClick={handleContinueToPayment}
                  disabled={!infoValid}
                  className="flex-1 gap-2 bg-blue-700 hover:bg-blue-800 sm:flex-initial"
                >
                  Continue to Payment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {step === "payment" && paymentStage === "phone" && (
            <div className="rounded-xl border bg-gray-50 p-6">
              <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-lg font-bold">
                Pay with M-Pesa
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{formatKES(total)} total</p>

              <form onSubmit={handleSubmitPayment} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="checkout-phone">M-Pesa Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="checkout-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07XX XXX XXX"
                      className="bg-white pl-9"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">You&apos;ll get an M-Pesa PIN prompt on this number.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="outline" className="gap-2" onClick={() => setStep("information")}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit" disabled={submitting} className="flex-1 bg-blue-700 hover:bg-blue-800 sm:flex-initial">
                    {submitting ? "Starting..." : `Pay ${formatKES(total)}`}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {step === "payment" && paymentStage === "pending" && (
            <div className="flex flex-col items-center gap-3 rounded-xl border bg-gray-50 py-14 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
              <p className="font-medium">Waiting for M-Pesa confirmation...</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                {customerMessage} Enter your PIN on your phone to complete the payment.
              </p>
            </div>
          )}

          {step === "payment" && paymentStage === "failed" && (
            <div className="flex flex-col items-center gap-3 rounded-xl border bg-gray-50 py-14 text-center">
              <XCircle className="h-10 w-10 text-red-600" />
              <p className="font-medium">Payment failed. Please try again or use a different payment method.</p>
              <p className="max-w-xs text-sm text-muted-foreground">{errorMessage}</p>
              <Button onClick={retryPayment}>Try Again</Button>
            </div>
          )}

          {step === "confirmation" && orderStatus && (
            <>
              <div id="printable-receipt" className="rounded-xl border bg-gray-50 p-8 text-center">
                <div className="print:mb-6 print:text-left">
                  <p className="hidden text-lg font-bold print:block print:text-left" style={{ fontFamily: "var(--font-ubuntu)" }}>
                    iLab Growth
                  </p>
                  <p className="hidden text-xs text-gray-500 print:block print:text-left">Order Receipt</p>
                </div>

                <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 print:hidden" />
                <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-4 text-2xl font-bold print:mt-0 print:text-left">
                  Order Confirmed!
                </h2>
                <p className="mt-1 text-sm text-muted-foreground print:text-left">
                  Payment successful — your items are ready.
                </p>

                <div className="mt-4 space-y-1 text-left text-sm text-gray-600 print:mt-4">
                  <p>
                    <span className="font-medium text-gray-900">Order ID:</span> {orderStatus.id}
                  </p>
                  {orderStatus.mpesaReceiptNumber && (
                    <p>
                      <span className="font-medium text-gray-900">M-Pesa Receipt:</span> {orderStatus.mpesaReceiptNumber}
                    </p>
                  )}
                  <p>
                    <span className="font-medium text-gray-900">Date:</span>{" "}
                    {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Billed to:</span> {billing.firstName} {billing.lastName} (
                    {billing.email})
                  </p>
                </div>

                <div className="mx-auto mt-6 max-w-md space-y-2 text-left print:max-w-none">
                  {orderStatus.items.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 text-sm print:rounded-none"
                    >
                      <span className="font-medium text-gray-900">{item.title}</span>
                      <span className="print:hidden">
                        {item.type === "product" && item.fileUrl ? (
                          <a href={item.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-700 hover:underline">
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </a>
                        ) : item.type === "course" ? (
                          <Link href={`/courses/${item.id}`} className="flex items-center gap-1.5 text-blue-700 hover:underline">
                            <GraduationCap className="h-3.5 w-3.5" />
                            View Course
                          </Link>
                        ) : (
                          <span className="text-xs text-muted-foreground">File pending</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mx-auto mt-4 max-w-md border-t pt-3 text-right text-sm print:max-w-none">
                  <span className="font-bold text-gray-900">Total Paid: {formatKES(orderStatus.total)}</span>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
                  <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                    <Printer className="h-4 w-4" />
                    Print Receipt
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/cart?tab=library">Go to My Library</Link>
                  </Button>
                  <Button asChild className="bg-blue-700 hover:bg-blue-800">
                    <Link href="/orders">View Order History</Link>
                  </Button>
                </div>
              </div>

              <style jsx global>{`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #printable-receipt,
                  #printable-receipt * {
                    visibility: visible;
                  }
                  #printable-receipt {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                  }
                }
              `}</style>
            </>
          )}
        </div>

        <OrderSummarySidebar items={items} />
      </div>
    </div>
  );
}