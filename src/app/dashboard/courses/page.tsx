import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { CoursesHero } from "@/components/courses/courses-hero";
import { CoursesTrustBand } from "@/components/courses/courses-trust-band";
import { CoursesBrowser } from "@/components/courses-browser";
import { CourseViewTabs } from "@/components/courses/course-view-tabs";
import { MyLearningView } from "@/components/courses/my-learning-view";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { getPublicCourses } from "@/lib/courses";
import { getUserEnrollments } from "@/lib/my-learning";
import { getCartCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function DashboardCoursesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "admin") redirect("/admin");

  const userId = session.user.id;
  const [courses, enrollments, cartCount] = await Promise.all([
    getPublicCourses(),
    getUserEnrollments(userId),
    getCartCount(userId),
  ]);

  return (
    <>
<DashboardHeader
  fullName={session.user.name ?? "there"}
  userId={session.user.id}
  imageUrl={session.user.image ?? null}
  initialCartCount={cartCount}
/>   
 <main>
        <CoursesHero />
        <div className="mx-auto max-w-6xl px-6 py-12">
          <CourseViewTabs
            enrolledCount={enrollments.length}
            myLearningSlot={<MyLearningView userId={userId} enrollments={enrollments} />}
            allCoursesSlot={<CoursesBrowser courses={courses} userId={session?.user.id} />}
          />
        </div>
        <CoursesTrustBand />
        <NewsletterCta />
      </main>
      <DashboardFooter />
    </>
  );
} 