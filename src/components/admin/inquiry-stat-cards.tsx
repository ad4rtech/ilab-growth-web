import { Inbox, Phone, MessageSquare } from "lucide-react";
import type { InquiryStats } from "@/lib/inquiries-admin";

export function InquiryStatCards({ stats }: { stats: InquiryStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Inquiries</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Inbox className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">{stats.total}</p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">General Inquiries</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <MessageSquare className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">{stats.general}</p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Call Requests</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Phone className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">{stats.call}</p>
      </div>
    </div>
  );
}