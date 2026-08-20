import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { LoggedInHero } from "@/components/home/logged-in-hero";
import { ContinueWhereLeftOff } from "@/components/home/continue-where-left-off";
import { FeaturesSection } from "@/components/home/features-section";
import { FeaturedSection } from "@/components/home/featured-section";
import { BlogPreviewSection } from "@/components/home/blog-preview-section";
import { getContinueLearning } from "@/lib/dashboard";
import { getCartCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  // Admins get their own dashboard at /admin — they should never see the
  // client-facing personalized view, even if they navigate here directly.
  const role = (session.user as { role?: string }).role;
  if (role === "admin") redirect("/admin");

  const [continueLearning, cartCount] = await Promise.all([
    getContinueLearning(session.user.id),
    getCartCount(session.user.id),
  ]);
  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <>
      <DashboardHeader
        fullName={session.user.name ?? "there"}
        userId={session.user.id}
        imageUrl={session.user.image ?? null}
        initialCartCount={cartCount}
      />
      <main>
        <LoggedInHero userId={session.user.id} name={firstName} continueLearning={continueLearning} />
        <ContinueWhereLeftOff userId={session.user.id} />
        <FeaturesSection isLoggedIn={true} />
        <FeaturedSection />
        <BlogPreviewSection />
      </main>
      <DashboardFooter />
    </>
  );
}