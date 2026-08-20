import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ServicesHero() {
  return (
    <section className="bg-blue-700 px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
          Expert Business Services
        </p>
        <h1
          style={{ fontFamily: "var(--font-ubuntu)" }}
          className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl"
        >
          We Help African Businesses Grow — Strategically
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-blue-100">
          From one-on-one consulting to full-scale training programs, iLab Growth delivers
          hands-on support tailored to African SMEs and entrepreneurs at every stage of growth.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-orange-500 text-white hover:bg-orange-600">
            <Link href="#enquiry">Book a Free Consultation</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white bg-transparent text-white hover:bg-white/10"
          >
            <Link href="#services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}