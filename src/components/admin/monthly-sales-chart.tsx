// src/components/admin/monthly-sales-chart.tsx
import type { MonthlySalesBucket } from "@/lib/products-admin";

interface MonthlySalesChartProps {
  data: MonthlySalesBucket[];
}

export function MonthlySalesChart({ data }: MonthlySalesChartProps) {
  const max = Math.max(1, ...data.map((d) => d.unitsSold));
  const width = 900;
  const height = 260;
  const barGap = 14;
  const barWidth = data.length > 0 ? (width - barGap * (data.length - 1)) / data.length : 0;
  const chartHeight = 200;

  const hasAnySales = data.some((d) => d.unitsSold > 0);

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-ubuntu)" }}>
            Monthly Product Sales
          </h3>
          <p className="text-sm text-muted-foreground">
            Units sold per month — last {data.length} months
          </p>
        </div>
      </div>

      {!hasAnySales ? (
        <div className="mt-8 flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No sales yet — this chart fills in once orders start coming through.
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="mt-6 h-[220px] w-full"
          role="img"
          aria-label="Units sold per month, last 12 months"
        >
          {data.map((d, i) => {
            const barHeight = (d.unitsSold / max) * chartHeight;
            const x = i * (barWidth + barGap);
            const y = chartHeight - barHeight;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={4}
                  className="fill-blue-600"
                />
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