import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { AboutHero } from "@/components/about/about-hero";
import { AboutStats } from "@/components/about/about-stats";
import { MissionVision } from "@/components/about/mission-vision";
import { CoreValues } from "@/components/about/core-values";
import { FounderSpotlight } from "@/components/about/founder-spotlight";
import { TeamGrid } from "@/components/about/team-grid";
import { Milestones } from "@/components/about/milestones";
import { AboutCta } from "@/components/about/about-cta";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { getCartCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as (typeof session extends null ? never : NonNullable<typeof session>["user"]) | undefined;
  const cartCount = user ? await getCartCount(user.id) : 0;

  return (
    <>
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
      <main>
        <AboutHero isLoggedIn={!!user} />
        <AboutStats />
        <MissionVision />
        <CoreValues />
        <FounderSpotlight />
        <TeamGrid />
        <Milestones />
        <AboutCta isLoggedIn={!!user} />
        <NewsletterCta />
      </main>
      {user ? <DashboardFooter /> : <SiteFooter />}
    </>
  );
}