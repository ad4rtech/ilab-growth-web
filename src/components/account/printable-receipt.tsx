"use client";

import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatKES } from "@/lib/format";
import type { FullReceipt } from "@/lib/orders";

export function PrintableReceipt({ receipt }: { receipt: FullReceipt }) {
  const billedTo = [receipt.billingFirstName, receipt.billingLastName].filter(Boolean).join(" ");

  return (
    <>
      <div id="printable-receipt" className="rounded-xl border bg-white p-8">
        <div className="hidden print:mb-6 print:block">
          <p style={{ fontFamily: "var(--font-ubuntu)" }} className="text-lg font-bold">
            iLab Growth
          </p>
          <p className="text-xs text-gray-500">Order Receipt</p>
        </div>

        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-xl font-bold">
          Receipt
        </h1>

        <div className="mt-4 space-y-1 text-sm text-gray-600">
          <p><span className="font-medium text-gray-900">Order ID:</span> {receipt.id}</p>
          {receipt.mpesaReceiptNumber && (
            <p><span className="font-medium text-gray-900">M-Pesa Receipt:</span> {receipt.mpesaReceiptNumber}</p>
          )}
          <p>
            <span className="font-medium text-gray-900">Date:</span>{" "}
            {new Date(receipt.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          {billedTo && (
            <p>
              <span className="font-medium text-gray-900">Billed to:</span> {billedTo}
              {receipt.billingEmail && ` (${receipt.billingEmail})`}
            </p>
          )}
        </div>

        <div className="mt-6 space-y-2">
          {receipt.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-2 text-sm">
              <span className="text-gray-900">
                {item.title}
                {item.quantity > 1 && <span className="text-gray-400"> × {item.quantity}</span>}
              </span>
              <span className="font-medium">{formatKES(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t pt-3 text-right">
          <span className="font-bold text-gray-900">Total Paid</span>
          <span className="font-bold text-gray-900">{formatKES(receipt.total)}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between print:hidden">
       <Button asChild variant="outline">
          <Link href="/dashboard/account/receipts" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <Button onClick={() => window.print()} className="gap-2 bg-blue-700 hover:bg-blue-800">
          <Printer className="h-4 w-4" />
          Print Receipt
        </Button>
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
  );
}