import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServicesHero } from "@/components/services/services-hero";
import { ServicesGrid } from "@/components/services/services-grid";
import { FreeDownloadBanner } from "@/components/services/free-download-banner";
import { HowItWorks } from "@/components/services/how-it-works";
import { ConsultationSection } from "@/components/services/consultation-section";
import { ServicesTestimonials } from "@/components/services/services-testimonials";


export const dynamic = "force-dynamic";

export default function ServicesPage() {
  return (
    <>
    <SiteHeader />  

      <ServicesHero />
      <ServicesGrid />
      <FreeDownloadBanner />
      <HowItWorks />
      <ConsultationSection />
      <ServicesTestimonials />

      <SiteFooter />
    </>
  );
}