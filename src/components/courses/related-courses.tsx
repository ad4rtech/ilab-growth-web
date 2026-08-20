import { CourseCard, type Course } from "@/components/course-card";

async function getRelatedCourses(courseId: string): Promise<Course[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/related?limit=3`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as Course[];
  } catch {
    return [];
  }
}

export async function RelatedCourses({ courseId, userId }: { courseId: string; userId?: string }) {
  const related = await getRelatedCourses(courseId);
  if (related.length === 0) return null;

  return (
    <div className="mt-14">
      <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-xl font-bold">
        You May Also Like
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((c) => (
          <CourseCard key={c.id} course={c} userId={userId} />
        ))}
      </div>
    </div>
  );
}