// src/components/admin/monthly-views-chart.tsx
import type { MonthlyViewsBucket } from "@/lib/blog-admin";

interface MonthlyViewsChartProps {
  data: MonthlyViewsBucket[];
}

export function MonthlyViewsChart({ data }: MonthlyViewsChartProps) {
  const max = Math.max(1, ...data.map((d) => d.views));
  const width = 900;
  const height = 260;
  const barGap = 14;
  const barWidth = data.length > 0 ? (width - barGap * (data.length - 1)) / data.length : 0;
  const chartHeight = 200;

  const hasAnyViews = data.some((d) => d.views > 0);

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-ubuntu)" }}>
        Monthly Page Views
      </h3>
      <p className="text-sm text-muted-foreground">
        Blog page views per month — last {data.length} months
      </p>

      {!hasAnyViews ? (
        <div className="mt-8 flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No page views logged yet — this fills in as people read published posts.
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="mt-6 h-[220px] w-full"
          role="img"
          aria-label="Blog page views per month, last 12 months"
        >
          {data.map((d, i) => {
            const barHeight = (d.views / max) * chartHeight;
            const x = i * (barWidth + barGap);
            const y = chartHeight - barHeight;
            return (
              <g key={i}>
                <rect x={x} y={y} width={barWidth} height={barHeight} rx={4} className="fill-blue-600" />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  className="fill-gray-500 text-[11px]"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}