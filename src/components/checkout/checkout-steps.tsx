import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, label: "Information" },
  { n: 2, label: "Payment" },
  { n: 3, label: "Confirmation" },
] as const;

export function CheckoutSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-3">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                s.n <= current ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-400",
              )}
            >
              {s.n}
            </span>
            <span className={cn("text-sm font-medium", s.n <= current ? "text-gray-900" : "text-gray-400")}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && <div className="h-px w-16 bg-gray-200" />}
        </div>
      ))}
    </div>
  );
}