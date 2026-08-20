import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "12,000+", label: "Entrepreneurs Trained" },
  { value: "150+", label: "Digital Products" },
  { value: "98%", label: "Satisfaction Rate" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image + dark overlay */}
      <div className="absolute inset-0">
        <Image
          src="/hero-workspace.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-neutral-900/70" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center sm:py-28">
        <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/20">
          Empowering African Entrepreneurs &amp; SMEs
        </span>

        <h1
          className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
          style={{ fontFamily: "var(--font-ubuntu)" }}
        >
          Grow Your Business with the Right Tools &amp; Knowledge
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-neutral-200">
          Access world-class courses, digital products, and business growth
          strategies designed for African entrepreneurs and SME owners.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-amber-600 text-white hover:bg-amber-700"
          >
            <Link href="/courses">Explore Courses</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-neutral-900 hover:bg-neutral-100"
          >
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>

        <dl className="mt-14 grid grid-cols-3 gap-8 sm:gap-16">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd
                className="text-3xl font-bold text-white sm:text-4xl"
                style={{ fontFamily: "var(--font-ubuntu)" }}
              >
                {stat.value}
              </dd>
              <p className="mt-1 text-sm text-neutral-300">{stat.label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}