import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { Button } from "@/components/ui/button";
import { getCartCount } from "@/lib/cart";
import { Compass, Home, ArrowLeft } from "lucide-react";

export default async function NotFound() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const cartCount = user ? await getCartCount(user.id) : 0;
  const homeHref = user ? "/dashboard" : "/";
  const coursesHref = user ? "/dashboard/courses" : "/courses";
  const productsHref = user ? "/dashboard/products" : "/products";

  return (
    <div className="flex min-h-screen flex-col">
      {user ? (
        <DashboardHeader
          fullName={user.name ?? "there"}
          userId={user.id}
          imageUrl={user.image ?? null}
          initialCartCount={cartCount}
        />
      ) : (
        <SiteHeader />
      )}

      <main className="flex flex-1 items-center justify-center bg-[#FDF1E3] px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-blue-700 shadow-lg shadow-blue-700/20">
            <Compass className="h-12 w-12 text-white" strokeWidth={1.5} />
          </div>

          <p
            style={{ fontFamily: "var(--font-ubuntu)" }}
            className="mt-8 text-7xl font-bold text-blue-700"
          >
            404
          </p>
          <h1
            style={{ fontFamily: "var(--font-ubuntu)" }}
            className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl"
          >
            Looks like you've wandered off the map
          </h1>
          <p className="mt-3 text-neutral-600">
            The page you're looking for doesn't exist, moved, or never made
            it past the drawing board. Let's get you back on track.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
           <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800">
  <Link href={homeHref} className="flex items-center justify-center gap-2">
    <Home className="h-4 w-4" />
    Back to {user ? "Dashboard" : "Home"}
  </Link>
</Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href={coursesHref}>Explore Courses</Link>
            </Button>
          </div>

          <div className="mt-6">
            <Link
              href={productsHref}
              className="text-sm font-medium text-blue-700 hover:underline"
            >
              or browse our digital products →
            </Link>
          </div>
        </div>
      </main>

      {user ? <DashboardFooter /> : <SiteFooter />}
    </div>
  );
}