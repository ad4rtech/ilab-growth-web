"use client";

import { useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MyLearningCard, type EnrolledCourse } from "@/components/courses/my-learning-card";

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function MyLearningView({ userId, enrollments }: { userId: string; enrollments: EnrolledCourse[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    let result = enrollments;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((e) => e.course.title.toLowerCase().includes(q));
    }
    if (status === "completed") result = result.filter((e) => e.progress >= 100);
    if (status === "in-progress") result = result.filter((e) => e.progress < 100);
    return result;
  }, [enrollments, search, status]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
            My Learning
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {enrollments.length} enrolled course{enrollments.length === 1 ? "" : "s"} — keep up the momentum!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter..."
            className="w-48"
          />
          <Select items={STATUS_OPTIONS} value={status} onValueChange={(v) => v !== null && setStatus(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-20 text-center">
          <GraduationCap className="h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No courses yet</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Enroll in a course below to start building your library.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No courses match that filter.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <MyLearningCard key={e.enrollmentId} enrollment={e} userId={userId} />
          ))}
        </div>
      )}

      <div className="my-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
          Discover more courses to add to your library
        </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
    </div>
  );
}