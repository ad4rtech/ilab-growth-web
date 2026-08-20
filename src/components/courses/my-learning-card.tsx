import Link from "next/link";
import { BookOpen, Clock, Award } from "lucide-react";
import { ContinueLearningButton } from "@/components/home/continue-learning-button";
import type { Course } from "@/components/course-card";

export interface EnrolledCourse {
  enrollmentId: string;
  progress: number;
  course: Course;
}

export function MyLearningCard({ enrollment, userId }: { enrollment: EnrolledCourse; userId: string }) {
  const { course, progress } = enrollment;
  const isCompleted = progress >= 100;
  const badgeLabel = course.price === 0 ? "Free" : course.badge;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md">
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
        {course.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.thumbnailUrl} alt={course.title} className="absolute inset-0 h-full w-full object-cover" />
        )}
        {badgeLabel && (
          <span className="absolute left-2 top-2 rounded-md bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
            {badgeLabel}
          </span>
        )}
        {isCompleted ? (
          <span className="absolute right-2 top-2 rounded-md bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
            Completed
          </span>
        ) : (
          course.level && (
            <span className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
              {course.level}
            </span>
          )
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium text-orange-600">{course.category ?? "Course"}</p>
        <Link href={`/courses/${course.id}`}>
          <h3 style={{ fontFamily: "var(--font-ubuntu)" }} className="font-semibold leading-snug hover:underline">
            {course.title}
          </h3>
        </Link>
        {course.instructor && <p className="text-sm text-muted-foreground">{course.instructor}</p>}

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {course.lessonCount != null && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {course.lessonCount} lessons
            </span>
          )}
          {course.durationLabel && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {course.durationLabel}
            </span>
          )}
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-gray-900">{progress}% complete</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full ${isCompleted ? "bg-green-500" : "bg-blue-600"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4">
          {isCompleted ? (
            <div className="flex gap-2">
              <Link
                href={`/courses/${course.id}`}
                className="flex-1 rounded-lg border px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Review Course
              </Link>
              {/* Certificate issuance is explicitly "infrastructure ready, activation
                  deferred" per the PRD — honest disabled state, not a fake certificate. */}
              <button
                disabled
                title="Certificates are coming soon"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400"
              >
                <Award className="h-3.5 w-3.5" />
                Coming Soon
              </button>
            </div>
          ) : (
            <ContinueLearningButton
              userId={userId}
              courseId={course.id}
              className="w-full bg-blue-700 text-white hover:bg-blue-800"
            />
          )}
        </div>
      </div>
    </div>
  );
}