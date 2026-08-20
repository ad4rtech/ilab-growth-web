import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Submitted", "In Review", "Contacted", "Closed"];

function getStepStates(status: string): ("done" | "current" | "upcoming")[] {
  const submitted: "done" = "done";
  const inReview = status === "new" ? "current" : "done";
  const contacted = status === "new" ? "upcoming" : status === "contacted" ? "current" : "done";
  const closed = status === "closed" ? "current" : "upcoming";
  return [submitted, inReview, contacted, closed];
}

export function InquiryStatusSteps({ status }: { status: string }) {
  const states = getStepStates(status);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {STEPS.map((label, i) => {
        const state = states[i];
        const isTerminalCurrent = state === "current" && (label === "Contacted" || label === "Closed");
        return (
          <span
            key={label}
            className={cn(
              "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
              state === "done" && "border-blue-200 bg-blue-50 text-blue-700",
              state === "current" && isTerminalCurrent && "border-green-600 bg-green-600 text-white",
              state === "current" && !isTerminalCurrent && "border-orange-500 bg-orange-500 text-white",
              state === "upcoming" && "border-gray-200 text-gray-400",
            )}
          >
            {state === "done" && <Check className="h-3 w-3" />}
            {label}
          </span>
        );
      })}
    </div>
  );
}