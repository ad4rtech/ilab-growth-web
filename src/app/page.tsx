import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { FeaturedSection } from "@/components/home/featured-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { BlogPreviewSection } from "@/components/home/blog-preview-section";
import { NewsletterCta } from "@/components/home/newsletter-cta";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    const role = (session.user as { role?: string }).role;
    redirect(role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturesSection isLoggedIn={false} />
        <FeaturedSection />
        <TestimonialsSection />
        <BlogPreviewSection />
        <NewsletterCta />
      </main>
      <SiteFooter />
    </>
  );
}