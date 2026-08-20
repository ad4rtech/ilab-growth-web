import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function AboutHero({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const prefix = isLoggedIn ? "/dashboard" : "";

  return (
    <section className="bg-blue-700">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-sm font-medium text-blue-200">Our Story</span>
          <h1
            className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl"
            style={{ fontFamily: "var(--font-ubuntu)" }}
          >
            Built for African Entrepreneurs. By People Who Get It.
          </h1>
          <p className="mt-5 text-blue-100">
            iLab Growth was born from a simple belief: that African
            entrepreneurs deserve world-class business education and tools —
            without the Western bias, the jargon, or the price tag that
            excludes most people.
          </p>
          <p className="mt-4 text-blue-100">
            Since 2019 we&apos;ve trained over 12,000 entrepreneurs across 18
            African countries through online courses, digital products, and
            hands-on consulting — and we&apos;re just getting started.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              <Link href={`${prefix}/courses`}>Explore Our Courses</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-blue-800 hover:bg-white/10"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-blue-900">
          <Image
            src="/about/team-office.jpg"
            alt="The iLab Growth team working together"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}