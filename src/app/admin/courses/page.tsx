import { CoursesAdminDashboard } from "@/components/courses-admin-dashboard";
import type { Course } from "@/components/courses-table";

export const dynamic = "force-dynamic";

async function getCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getMonthlyEnrolments() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enrollments/admin/monthly`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function AdminCoursesPage() {
  const [courses, monthlyEnrolments] = await Promise.all([
    getCourses(),
    getMonthlyEnrolments(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1
          style={{ fontFamily: "var(--font-ubuntu)" }}
          className="text-2xl font-bold"
        >
          Courses
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your course catalogue.
        </p>
      </div>

      <CoursesAdminDashboard
        initialCourses={courses}
        monthlyEnrolments={monthlyEnrolments}
      />
    </div>
  );
}