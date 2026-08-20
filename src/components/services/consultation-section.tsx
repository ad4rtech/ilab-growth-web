import { getPublishedServices, getCallBookingCount } from "@/lib/services";
import { DiscoveryCallPanel } from "@/components/services/discovery-call-panel";
import { EnquiryForm } from "@/components/services/enquiry-form";

interface ConsultationSectionProps {
  defaultName?: string;
  defaultEmail?: string;
}

export async function ConsultationSection({ defaultName, defaultEmail }: ConsultationSectionProps) {
  const [services, callCount] = await Promise.all([getPublishedServices(), getCallBookingCount()]);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
        <DiscoveryCallPanel callCount={callCount} />
        <EnquiryForm services={services} defaultName={defaultName} defaultEmail={defaultEmail} />
      </div>
    </section>
  );
}