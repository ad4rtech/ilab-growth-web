import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CoursesHero } from "@/components/courses/courses-hero";
import { CoursesTrustBand } from "@/components/courses/courses-trust-band";
import { CoursesBrowser } from "@/components/courses-browser";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { getPublicCourses } from "@/lib/courses";

export default async function CoursesPage() {
  const [courses, session] = await Promise.all([
    getPublicCourses(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <CoursesHero />
        <div className="mx-auto max-w-6xl px-6 py-12">
          <CoursesBrowser courses={courses} userId={session?.user.id} />
        </div>
        <CoursesTrustBand />
        <NewsletterCta />
      </main>
      <SiteFooter />
    </>
  );
}