import { Briefcase } from "lucide-react";
import { getPublishedServices } from "@/lib/services";
import { ServiceCard } from "@/components/services/service-card";

export async function ServicesGrid() {
  const services = await getPublishedServices();

  return (
    <section id="services" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Our Services</p>
          <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-2 text-3xl font-bold text-gray-900">
            Choose the Right Support for Your Business
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Every engagement is tailored to your goals — whether you&apos;re starting out or scaling up.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="mt-14 flex flex-col items-center gap-2 py-12 text-center text-gray-500">
            <Briefcase className="h-8 w-8" />
            <p>No services published yet — check back soon.</p>
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}