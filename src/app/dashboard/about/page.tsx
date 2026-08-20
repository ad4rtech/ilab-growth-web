import { headers } from "next/headers";
import { auth } from "@/lib/auth";
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
  const userId = session?.user.id;
  const cartCount = userId ? await getCartCount(userId) : 0;

  return (
    <>
      <DashboardHeader
        fullName={session?.user.name ?? "there"}
        userId={userId ?? ""}
        initialCartCount={cartCount}
      />
      <main>
        <AboutHero />
        <AboutStats />
        <MissionVision />
        <CoreValues />
        <FounderSpotlight />
        <TeamGrid />
        <Milestones />
        <AboutCta />
        <NewsletterCta />
      </main>
      <DashboardFooter />
    </>
  );
}