"use client";

import { useState } from "react";
import { Inbox, ChevronUp, ChevronDown } from "lucide-react";
import { InquiryStatusSteps } from "@/components/services/inquiry-status-steps";
import type { MyInquiry } from "@/lib/my-inquiries";

function statusMessage(inq: MyInquiry): string {
  if (inq.status === "closed") return "This inquiry has been closed.";
  if (inq.status === "contacted") return "Our team has reached out — check your email for next steps.";
  return "Your inquiry is being reviewed. We'll be in touch within 24 hours.";
}

export function MyInquiriesPanel({ inquiries }: { inquiries: MyInquiry[] }) {
  const [open, setOpen] = useState(true);
  if (inquiries.length === 0) return null;

  return (
    <section className="px-6 py-6">
      <div className="mx-auto max-w-6xl rounded-2xl border bg-white">
        <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 font-semibold text-gray-900">
            <Inbox className="h-4 w-4 text-blue-700" />
            My Inquiries
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-700 px-1.5 text-xs font-semibold text-white">
              {inquiries.length}
            </span>
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-500">
            {open ? "Hide" : "Show"}
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </button>

        {open && (
          <div className="divide-y border-t">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {inq.serviceTitle ?? (inq.inquiryType === "call" ? "Discovery Call Request" : "General Inquiry")}{" "}
                    <span className="ml-1 text-xs font-normal text-gray-400">{inq.referenceCode}</span>
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">{statusMessage(inq)}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Submitted{" "}
                    {new Date(inq.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <InquiryStatusSteps status={inq.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}