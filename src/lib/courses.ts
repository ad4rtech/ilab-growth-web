import type { Course } from "@/components/course-card";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// Fetches the public course list for /courses. CoursesBrowser already
// filters to status === "published" client-side, so this intentionally
// doesn't duplicate that filtering here — it just fetches and fails honest
// (empty array) if the API is unreachable, never fabricating course data.
export async function getPublicCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${API_URL}/courses`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items ?? data ?? []) as Course[];
  } catch {
    return [];
  }
}