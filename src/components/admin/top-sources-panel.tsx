// src/components/admin/top-sources-panel.tsx
import type { SourceBreakdown } from "@/lib/subscribers-admin";

export function TopSourcesPanel({ sources }: { sources: SourceBreakdown[] }) {
  const max = Math.max(1, ...sources.map((s) => s.count));

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-ubuntu)" }}>
        Top Signup Sources
      </h3>

      {sources.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No source data yet — this fills in as subscribers sign up from tagged forms
          (e.g. the blog page). Sources like course checkout won't appear until that
          feature exists.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {sources.map((s) => (
            <li key={s.source} className="flex items-center gap-3">
              <span className="w-40 flex-none truncate text-sm text-gray-700">{s.source}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${(s.count / max) * 100}%` }}
                />
              </div>
              <span className="w-12 flex-none text-right text-sm font-medium text-gray-900">
                {s.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}