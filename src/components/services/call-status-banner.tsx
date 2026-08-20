import { Video, Info } from "lucide-react";
import type { MyInquiry } from "@/lib/my-inquiries";

export function CallStatusBanner({ inquiries }: { inquiries: MyInquiry[] }) {
  const latestCall = inquiries.find((i) => i.inquiryType === "call");
  if (!latestCall || latestCall.status === "closed") return null;

  const contacted = latestCall.status === "contacted";

  return (
    <section className="px-6 pb-6">
      <div
        className={`mx-auto flex max-w-6xl flex-col gap-3 rounded-2xl px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${
          contacted ? "bg-green-600 text-white" : "bg-blue-50 text-blue-900"
        }`}
      >
        <div className="flex items-center gap-3">
          {contacted ? <Video className="h-5 w-5" /> : <Info className="h-5 w-5" />}
          <div>
            <p className="font-medium">
              {contacted
                ? "Your discovery call request has been picked up"
                : "Your discovery call request is pending"}
            </p>
            <p className={`text-sm ${contacted ? "text-green-50" : "text-blue-700"}`}>
              {contacted
                ? "Check your email for the confirmed time and meeting link from our team."
                : "We'll email you within 24 hours to confirm a time — no slot is booked yet."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}