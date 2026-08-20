import Link from "next/link";
import { ContinueLearningButton } from "@/components/home/continue-learning-button";
import type { ActivityItem } from "@/lib/dashboard";

export function ActivityCard({ item, userId }: { item: ActivityItem; userId: string }) {
  if (item.type === "course") {
    const { course, progress } = item;
    return (
      <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="relative aspect-[4/3] w-full bg-gray-100">
          {course.thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          {course.category && (
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">{course.category}</p>
          )}
          <h3 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-1 text-base font-bold text-gray-900">
            {course.title}
          </h3>
          {course.instructor && <p className="mt-1 text-sm text-gray-500">{course.instructor}</p>}
          {(course.lessonCount || course.durationLabel) && (
            <p className="mt-1 text-xs text-gray-400">
              {course.lessonCount ? `${course.lessonCount} lessons` : ""}
              {course.lessonCount && course.durationLabel ? " · " : ""}
              {course.durationLabel ?? ""}
            </p>
          )}

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span className="font-semibold text-gray-900">{progress}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-green-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <ContinueLearningButton
            userId={userId}
            courseId={course.id}
            className="mt-4 w-full bg-blue-700 text-white hover:bg-blue-800"
          />
        </div>
      </div>
    );
  }

  const { product } = item;
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        {product.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <span className="absolute left-2 top-2 rounded-md bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
          Purchased
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {product.category && (
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">{product.category}</p>
        )}
        <h3 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-1 text-base font-bold text-gray-900">
          {product.title}
        </h3>
        <p className="mt-1 text-xs text-gray-400">{product.productType ?? "Digital Product"} · Instant Download</p>

        <Link
          href="/orders"
          className="mt-4 inline-flex items-center justify-center rounded-lg border border-blue-700 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
        >
          View Order
        </Link>
      </div>
    </div>
  );
}