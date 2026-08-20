import Link from "next/link";
import { Briefcase } from "lucide-react";
import type { TopService } from "@/lib/services-admin";

interface TopServicesPanelProps {
  services: TopService[];
}

export function TopServicesPanel({ services }: TopServicesPanelProps) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-ubuntu)" }}>
        Most Inquired Services
      </h3>
      <p className="text-sm text-muted-foreground">Top services by inquiry count</p>

      {services.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-6 text-center">
          <Briefcase className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No inquiries yet.</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {services.map(({ service, inquiries }) => (
            <li key={service.id} className="flex items-center justify-between gap-3">
              <Link
                href={`/admin/services/${service.id}/edit`}
                className="truncate text-sm font-medium text-gray-900 hover:text-blue-700"
              >
                {service.title}
              </Link>
              <span className="shrink-0 text-sm text-muted-foreground">
                {inquiries} inquir{inquiries === 1 ? "y" : "ies"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}