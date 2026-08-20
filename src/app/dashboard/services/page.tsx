import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { ServicesHero } from "@/components/services/services-hero";
import { ServicesGrid } from "@/components/services/services-grid";
import { FreeDownloadBanner } from "@/components/services/free-download-banner";
import { HowItWorks } from "@/components/services/how-it-works";
import { ConsultationSection } from "@/components/services/consultation-section";
import { ServicesTestimonials } from "@/components/services/services-testimonials";
import { MyInquiriesPanel } from "@/components/services/my-inquiries-panel";
import { CallStatusBanner } from "@/components/services/call-status-banner";
import { getMyInquiries } from "@/lib/my-inquiries";
import { getCartCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function DashboardServicesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "admin") redirect("/admin");

  const userId = session.user.id;
  const [inquiries, cartCount] = await Promise.all([
    getMyInquiries(session.user.email),
    getCartCount(userId),
  ]);

  return (
    <>
<DashboardHeader
  fullName={session.user.name ?? "there"}
  userId={session.user.id}
  imageUrl={session.user.image ?? null}
  initialCartCount={cartCount}
/>      <main>
        <ServicesHero />
        <MyInquiriesPanel inquiries={inquiries} />
        <CallStatusBanner inquiries={inquiries} />
        <ServicesGrid />
        <FreeDownloadBanner />
        <HowItWorks />
        <ConsultationSection
          defaultName={session.user.name ?? undefined}
          defaultEmail={session.user.email}
        />
        <ServicesTestimonials />
      </main>
      <DashboardFooter />
    </>
  );
}