"use client";

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

type MonthlyDatum = { month: string; count?: number; revenue?: number };

export function MonthlyBarChart({
  data,
  valueKey = "count",
  formatValue = (v: number) => String(v),
}: {
  data: MonthlyDatum[];
  valueKey?: "count" | "revenue";
  formatValue?: (v: number) => string;
}) {
  const values = data.map((d) => d[valueKey] ?? 0);
  const max = Math.max(1, ...values);

  return (
    <div>
      <div className="flex h-40 items-end gap-2">
        {data.map((d) => {
          const value = d[valueKey] ?? 0;
          const label = MONTH_LABELS[Number(d.month.split("-")[1]) - 1];
          return (
            <div key={d.month} className="flex flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[10px] text-muted-foreground">
                {value > 0 ? formatValue(value) : ""}
              </span>
              <div
                className="w-full rounded-t bg-blue-700"
                style={{ height: `${Math.max(2, (value / max) * 140)}px` }}
                title={`${label}: ${formatValue(value)}`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        {data.map((d) => (
          <span key={d.month}>{MONTH_LABELS[Number(d.month.split("-")[1]) - 1]}</span>
        ))}
      </div>
    </div>
  );
}