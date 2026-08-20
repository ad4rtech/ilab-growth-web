"use client";

import Link from "next/link";
import { BookOpen, Clock, Users } from "lucide-react";
import { formatKES } from "@/lib/format";
import { QuickBuyModal } from "@/components/quick-buy-modal";

export type Course = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  level: string | null;
  category: string | null;
  instructor: string | null;
  thumbnailUrl: string | null;
  badge: string | null;
  status: string;
  lessonCount: number | null;
  durationLabel: string | null;
  createdAt: string;
  _count?: { enrollments: number };
};

export function CourseCard({
  course,
  view = "grid",
  userId,
}: {
  course: Course;
  view?: "grid" | "list";
  userId?: string;
}) {
  const badgeLabel = course.price === 0 ? "Free" : course.badge;
  const students = course._count?.enrollments ?? 0;

  return (
    <div
      className={`group overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md ${
        view === "list" ? "flex flex-col sm:flex-row" : ""
      }`}
    >
      <Link
        href={`/courses/${course.id}`}
        className={`relative block flex-none overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 ${
          view === "list" ? "h-40 sm:h-auto sm:w-56" : "h-40 w-full"
        }`}
      >
        {course.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {badgeLabel && (
          <span className="absolute left-2 top-2 rounded-md bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
            {badgeLabel}
          </span>
        )}
        {course.level && (
          <span className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
            {course.level}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium text-orange-600">
          {course.category ?? "Course"}
        </p>
        <Link href={`/courses/${course.id}`}>
          <h3
            style={{ fontFamily: "var(--font-ubuntu)" }}
            className="font-semibold leading-snug hover:underline"
          >
            {course.title}
          </h3>
        </Link>
        {course.instructor && (
          <p className="text-sm text-muted-foreground">
            {course.instructor}
          </p>
        )}
        {course.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {course.description}
          </p>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {course.durationLabel && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {course.durationLabel}
            </span>
          )}
          {course.lessonCount != null && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {course.lessonCount} lessons
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {students} student{students === 1 ? "" : "s"}
          </span>
        </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">
              {formatKES(course.price)}
            </span>
            {course.compareAtPrice && course.compareAtPrice > course.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatKES(course.compareAtPrice)}
              </span>
            )}
          </div>

          <QuickBuyModal
            itemType="course"
            itemId={course.id}
            title={course.title}
            price={course.price}
            compareAtPrice={course.compareAtPrice}
            imageUrl={course.thumbnailUrl}
            detailHref={`/courses/${course.id}`}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
}