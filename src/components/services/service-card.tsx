import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { formatKES } from "@/lib/format";
import { ServiceIcon } from "@/components/admin/service-icon";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/services";

export function ServiceCard({ service }: { service: Service }) {
  const featured = !!service.badge;

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border bg-white",
        featured ? "border-2 border-blue-700 shadow-lg" : "border-gray-200",
      )}
    >
      {featured && (
        <div className="rounded-t-xl bg-blue-700 py-2 text-center text-sm font-medium text-white">
          {service.badge}
        </div>
      )}

      <div className="flex flex-1 flex-col p-8">
        <span
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            featured ? "bg-blue-700 text-white" : "bg-blue-50 text-blue-700",
          )}
        >
          <ServiceIcon name={service.icon} className="h-6 w-6" />
        </span>

        <h3 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-5 text-xl font-bold text-gray-900">
          {service.title}
        </h3>
        {service.subtitle && <p className="mt-1 text-sm font-medium text-orange-600">{service.subtitle}</p>}
        {service.description && (
          <p className="mt-4 text-sm leading-relaxed text-gray-600">{service.description}</p>
        )}

        {service.whatsIncluded.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">What&apos;s Included</p>
            <ul className="mt-3 space-y-2">
              {service.whatsIncluded.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {service.duration && (
          <p className="mt-6 flex items-center gap-1.5 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            {service.duration}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t pt-6 mt-6">
          <p style={{ fontFamily: "var(--font-ubuntu)" }} className="text-lg font-bold text-gray-900">
            {service.price === null ? "Custom quote" : `From ${formatKES(service.price)}`}
          </p>
          <Link
            href={`#enquiry?service=${service.id}`}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition",
              featured
                ? "bg-blue-700 text-white hover:bg-blue-800"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100",
            )}
          >
            {service.ctaLabel ?? "Get Started"}
          </Link>
        </div>
      </div>
    </div>
  );
}