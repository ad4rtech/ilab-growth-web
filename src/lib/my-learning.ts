import type { Course } from "@/components/course-card";
import type { EnrolledCourse } from "@/components/courses/my-learning-card";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ASSUMPTION: GET /enrollments?userId= returns full enrollment records with
// a nested `course` relation and `progress`. If your actual endpoint returns
// a different shape (e.g. just courseIds), this needs adjusting.
interface RawEnrollment {
  id: string;
  progress: number;
  courseId: string;
  course: Course;
}

export async function getUserEnrollments(userId: string): Promise<EnrolledCourse[]> {
  if (!userId) return [];
  try {
    const res = await fetch(`${API_URL}/enrollments?userId=${userId}`, { cache: "no-store" });
    if (!res.ok) return [];
    const raw = (await res.json()) as RawEnrollment[];
    return raw
      .filter((e) => e.course)
      .map((e) => ({ enrollmentId: e.id, progress: e.progress, course: e.course }));
  } catch {
    return [];
  }
}