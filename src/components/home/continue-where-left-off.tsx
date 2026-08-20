import Link from "next/link";
import { Clock } from "lucide-react";
import { getActivity } from "@/lib/dashboard";
import { ActivityCard } from "@/components/home/activity-card";

export async function ContinueWhereLeftOff({ userId }: { userId: string }) {
  const activity = await getActivity(userId, 4);

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Pick Up Where You Left Off
            </p>
            <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-2 text-2xl font-bold text-gray-900">
              Continue Where You Left Off
            </h2>
          </div>
          <Link href="/orders" className="hidden text-sm font-medium text-blue-600 hover:text-blue-700 sm:block">
            View all activity →
          </Link>
        </div>

        {activity.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 py-12 text-center text-gray-500">
            <Clock className="h-8 w-8" />
            <p>No activity yet — enroll in a course or grab a product to get started.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {activity.map((item) => (
              <ActivityCard
                key={item.type === "course" ? item.enrollmentId : `${item.orderId}-${item.product.id}`}
                item={item}
                userId={userId}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}