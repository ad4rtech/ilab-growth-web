interface DailyRevenueBucket {
  label: string;
  revenue: number;
}

export function RevenueChart({ data }: { data: DailyRevenueBucket[] }) {
  const max = Math.max(1, ...data.map((d) => d.revenue));
  const width = 700;
  const height = 220;
  const barGap = 16;
  const barWidth = data.length > 0 ? (width - barGap * (data.length - 1)) / data.length : 0;
  const chartHeight = 160;

  const hasAnyRevenue = data.some((d) => d.revenue > 0);

  if (!hasAnyRevenue) {
    return null;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full" role="img" aria-label="Daily revenue, last 7 days">
      {data.map((d, i) => {
        const barHeight = (d.revenue / max) * chartHeight;
        const x = i * (barWidth + barGap);
        const y = chartHeight - barHeight;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx={4} className="fill-blue-600" />
            <text x={x + barWidth / 2} y={chartHeight + 20} textAnchor="middle" className="fill-gray-500 text-[11px]">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}