import { Check } from "lucide-react";
import { BookCallDialog } from "@/components/services/book-call-dialog";

const POINTS = [
  "Available Mon – Fri, 8am – 6pm EAT",
  "Video call via Zoom or Google Meet",
  "Instant calendar booking confirmation",
  "No credit card required",
];

export function DiscoveryCallPanel({ callCount }: { callCount: number }) {
  return (
    <div className="flex flex-col rounded-2xl bg-blue-700 p-8 text-white">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Free Consultation</p>
      <h3 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-2 text-2xl font-bold">
        Book a 30-Minute Discovery Call
      </h3>
      <p className="mt-3 text-blue-100">
        Speak directly with one of our business experts. No pressure, no commitment — just an
        honest conversation about your business and how we can help.
      </p>

      <ul className="mt-6 space-y-2">
        {POINTS.map((point) => (
          <li key={point} className="flex items-center gap-2 text-sm text-blue-50">
            <Check className="h-4 w-4 text-orange-400" />
            {point}
          </li>
        ))}
      </ul>

      {callCount > 0 && (
        <p className="mt-5 text-sm text-blue-100">
          Join {callCount.toLocaleString()} entrepreneur{callCount === 1 ? "" : "s"} who&apos;ve booked a call
        </p>
      )}

      <BookCallDialog />
    </div>
  );
}