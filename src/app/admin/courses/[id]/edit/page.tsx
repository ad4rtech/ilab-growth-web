import { notFound } from "next/navigation";
import { CourseForm } from "@/components/course-form";
import type { Course } from "@/components/courses-table";

export const dynamic = "force-dynamic";

async function getCourse(id: string): Promise<Course | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) notFound();

  return <CourseForm mode="edit" initialCourse={course} />;
}