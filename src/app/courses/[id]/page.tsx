import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { BuyNowButton } from "@/components/buy-now-button";
import { CourseAddToCartButton } from "@/components/course-add-to-cart-button";
import { ShareButtons } from "@/components/products/share-buttons";
import { RelatedCourses } from "@/components/courses/related-courses";
import { getCartCount } from "@/lib/cart";
import { formatKES } from "@/lib/format";
import {
  ChevronRight,
  Clock,
  BookOpen,
  Users,
  Users2,
  CheckCircle2,
  Check,
  Award,
  Smartphone,
  RefreshCw,
  CreditCard,
  Wallet,
} from "lucide-react";

export const dynamic = "force-dynamic";

type Course = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  level: string | null;
  category: string | null;
  instructor: string | null;
  thumbnailUrl: string | null;
  badge: string | null;
  status: string;
  lessonCount: number | null;
  durationLabel: string | null;
  whatYoullLearn: string[];
  _count?: { enrollments: number };
};

async function getCourse(id: string): Promise<Course | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function checkEnrolled(userId: string, courseId: string): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enrollments?userId=${userId}`, { cache: "no-store" });
    if (!res.ok) return false;
    const enrollments: Array<{ courseId: string }> = await res.json();
    return enrollments.some((e) => e.courseId === courseId);
  } catch {
    return false;
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourse(id);
  if (!course) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as (typeof session extends null ? never : NonNullable<typeof session>["user"]) & { role?: string } | undefined;

  const isEnrolled = user ? await checkEnrolled(user.id, course.id) : false;
  const cartCount = user ? await getCartCount(user.id) : 0;

  const badgeLabel = course.price === 0 ? "Free" : course.badge;
  const students = course._count?.enrollments ?? 0;
  const percentOff =
    course.compareAtPrice && course.compareAtPrice > course.price
      ? Math.round((1 - course.price / course.compareAtPrice) * 100)
      : null;
  const detailPath = `/courses/${course.id}`;

  return (
    <div className="flex min-h-screen flex-col">
      {user ? (
        <DashboardHeader fullName={user.name ?? "there"} userId={user.id} imageUrl={user.image ?? null} initialCartCount={cartCount} />
      ) : (
        <SiteHeader />
      )}

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/courses" className="hover:underline">Courses</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{course.title}</span>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="relative h-64 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 md:h-96">
              {course.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.thumbnailUrl} alt={course.title} className="absolute inset-0 h-full w-full object-cover" />
              )}
              {badgeLabel && (
                <span className="absolute left-3 top-3 rounded-md bg-orange-500 px-2 py-1 text-xs font-medium text-white">{badgeLabel}</span>
              )}
              {course.level && (
                <span className="absolute right-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">{course.level}</span>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-3 rounded-xl bg-orange-50 p-4">
                <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                <div>
                  <p className="text-sm font-semibold">Lifetime Access</p>
                  <p className="text-xs text-muted-foreground">Revisit content anytime</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-orange-50 p-4">
                <Award className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                <div>
                  <p className="text-sm font-semibold">Certificate</p>
                  <p className="text-xs text-muted-foreground">Of completion</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-orange-50 p-4">
                <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                <div>
                  <p className="text-sm font-semibold">Mobile-Friendly</p>
                  <p className="text-xs text-muted-foreground">Learn on any device</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-orange-50 p-4">
                <Users2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                <div>
                  <p className="text-sm font-semibold">Community Support</p>
                  <p className="text-xs text-muted-foreground">Learn alongside peers</p>
                </div>
              </div>
            </div>

            {course.whatYoullLearn.length > 0 && (
              <div className="mt-8 rounded-xl border p-6">
                <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-lg font-bold">What You&apos;ll Learn</h2>
                <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                  {course.whatYoullLearn.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.description && (
              <div className="mt-8">
                <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-lg font-bold">About This Course</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{course.description}</p>
              </div>
            )}

            <RelatedCourses courseId={course.id} userId={user?.id} />
          </div>

          <div>
            <div className="rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-orange-600">{course.category ?? "Course"}</p>
                {badgeLabel && (
                  <span className="rounded-full bg-orange-500 px-2.5 py-1 text-xs font-medium text-white">{badgeLabel}</span>
                )}
              </div>

              <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-2 text-2xl font-bold">{course.title}</h1>
              {course.instructor && <p className="mt-1 text-sm text-muted-foreground">By {course.instructor}</p>}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {course.durationLabel && (
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{course.durationLabel}</span>
                )}
                {course.lessonCount != null && (
                  <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" />{course.lessonCount} lessons</span>
                )}
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{students} student{students === 1 ? "" : "s"}</span>
              </div>

              <div className="mt-4 flex items-baseline gap-3">
                <p className="text-3xl font-bold text-gray-900">{formatKES(course.price)}</p>
                {course.compareAtPrice && course.compareAtPrice > course.price && (
                  <>
                    <p className="text-lg text-muted-foreground line-through">{formatKES(course.compareAtPrice)}</p>
                    {percentOff !== null && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">{percentOff}% off</span>
                    )}
                  </>
                )}
              </div>

              <div className="mt-5 space-y-2">
                {isEnrolled ? (
                  <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">You&apos;re enrolled in this course</span>
                  </div>
                ) : (
                  <>
                    <BuyNowButton
                      itemType="course"
                      itemId={course.id}
                      price={course.price}
                      userId={user?.id}
                      redirectPath={detailPath}
                    />
                    <CourseAddToCartButton userId={user?.id} courseId={course.id} />
                  </>
                )}
              </div>

              <div className="mt-6 border-t pt-5">
                <p className="text-center text-xs text-muted-foreground">Secure payment via</p>
                <div className="mt-2 flex justify-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs">
                    <CreditCard className="h-3.5 w-3.5" />Card
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs">
                    <Smartphone className="h-3.5 w-3.5" />M-Pesa
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs">
                    <Wallet className="h-3.5 w-3.5" />PayPal
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border p-4">
              <p className="text-sm font-medium">Share this course</p>
              <ShareButtons path={detailPath} title={course.title} />
            </div>
          </div>
        </div>
      </div>

      {user ? <DashboardFooter /> : <SiteFooter />}
    </div>
  );
}