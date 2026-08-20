import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutCta({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const prefix = isLoggedIn ? "/dashboard" : "";

  return (
    <section className="bg-blue-700 py-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2
          className="text-3xl font-bold text-white sm:text-4xl"
          style={{ fontFamily: "var(--font-ubuntu)" }}
        >
          Ready to Grow Your Business With Us?
        </h2>
        <p className="mt-4 text-blue-100">
          Whether you want to take a course, download a toolkit, or work
          directly with our team — we have something built exactly for where
          you are right now.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-amber-600 text-white hover:bg-amber-700"
          >
            <Link href={`${prefix}/courses`}>Explore Courses</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-neutral-900 hover:bg-neutral-100"
          >
            <Link href={`${prefix}/products`}>Browse Products</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white  text-blue-800 hover:bg-white/10"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}