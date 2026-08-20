interface GrowthBucket {
  label: string;
  count: number;
}

export function SubscriberGrowthChart({ data }: { data: GrowthBucket[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const width = 300;
  const height = 220;
  const barGap = 6;
  const barWidth = data.length > 0 ? (width - barGap * (data.length - 1)) / data.length : 0;
  const chartHeight = 160;

  const hasAnyGrowth = data.some((d) => d.count > 0);

  if (!hasAnyGrowth) {
    return null;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full" role="img" aria-label="Subscriber growth, last 12 months">
      {data.map((d, i) => {
        const barHeight = (d.count / max) * chartHeight;
        const x = i * (barWidth + barGap);
        const y = chartHeight - barHeight;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx={2} className="fill-blue-600" />
            {i % 2 === 0 && (
              <text x={x + barWidth / 2} y={chartHeight + 18} textAnchor="middle" className="fill-gray-500 text-[9px]">
                {d.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}