"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CourseViewTabsProps {
  allCoursesSlot: React.ReactNode;
  myLearningSlot: React.ReactNode;
  enrolledCount: number;
}

export function CourseViewTabs({ allCoursesSlot, myLearningSlot, enrolledCount }: CourseViewTabsProps) {
  const [tab, setTab] = useState<"all" | "learning">("learning");

  return (
    <div>
      <div className="flex gap-6 border-b">
        <button
          onClick={() => setTab("all")}
          className={cn(
            "border-b-2 px-1 pb-3 text-sm font-medium",
            tab === "all" ? "border-blue-700 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700",
          )}
        >
          All Courses
        </button>
        <button
          onClick={() => setTab("learning")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium",
            tab === "learning" ? "border-blue-700 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700",
          )}
        >
          My Learning
          {enrolledCount > 0 && (
            <span
              className={cn(
                "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                tab === "learning" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-600",
              )}
            >
              {enrolledCount}
            </span>
          )}
        </button>
      </div>

      <div className="mt-8">{tab === "learning" ? myLearningSlot : allCoursesSlot}</div>
    </div>
  );
}