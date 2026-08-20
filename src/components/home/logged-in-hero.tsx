import { ContinueLearningButton } from "@/components/home/continue-learning-button";
import type { ContinueLearning } from "@/lib/dashboard";

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

interface LoggedInHeroProps {
  userId: string;
  name: string;
  continueLearning: ContinueLearning | null;
}

export function LoggedInHero({ userId, name, continueLearning }: LoggedInHeroProps) {
  return (
    <section className="bg-blue-700 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-200">Welcome back</p>
          <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-2 text-3xl font-bold sm:text-4xl">
            Good to see you, {name}!
          </h1>
          <p className="mt-3 text-blue-100">Pick up right where you left off.</p>
        </div>

        {continueLearning && (
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-gray-900 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                {continueLearning.course.category && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                    {continueLearning.course.category}
                  </p>
                )}
                <h3 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-1 text-lg font-bold text-gray-900">
                  {continueLearning.course.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {continueLearning.course.instructor ? `${continueLearning.course.instructor} · ` : ""}
                  Last accessed {timeAgo(continueLearning.lastAccessedAt)}
                </p>
              </div>
              <ContinueLearningButton
                userId={userId}
                courseId={continueLearning.course.id}
                className="shrink-0 bg-blue-700 text-white hover:bg-blue-800"
              />
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span className="font-semibold text-gray-900">{continueLearning.progress}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${continueLearning.progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}