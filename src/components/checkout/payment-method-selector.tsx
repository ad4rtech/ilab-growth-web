"use client";

import { Smartphone, CreditCard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export function PaymentMethodSelector() {
  return (
    <div className="rounded-xl border bg-gray-50 p-6">
      <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-lg font-bold">
        Payment Method
      </h2>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3 rounded-xl border-2 border-blue-700 bg-blue-50 px-4 py-4">
          <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-700" />
          </span>
          <Smartphone className="h-5 w-5 text-blue-700" />
          <div>
            <p className="text-sm font-semibold text-gray-900">M-Pesa (Daraja)</p>
            <p className="text-xs text-muted-foreground">Mobile money for Kenya, Tanzania &amp; Uganda</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border px-4 py-4 opacity-60">
          <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300" />
          <CreditCard className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500">Debit / Credit Card</p>
            <p className="text-xs text-muted-foreground">Visa, Mastercard, and international cards</p>
          </div>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">Coming Soon</span>
        </div>

        <div className="flex items-center gap-3 rounded-xl border px-4 py-4 opacity-60">
          <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300" />
          <Wallet className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500">PayPal</p>
            <p className="text-xs text-muted-foreground">Fast &amp; secure international payments</p>
          </div>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">Coming Soon</span>
        </div>
      </div>
    </div>
  );
}