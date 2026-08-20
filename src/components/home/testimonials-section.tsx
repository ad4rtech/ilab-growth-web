import Image from "next/image";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "iLab Growth completely transformed how I approach my online business. The digital marketing course gave me actionable strategies I could apply immediately.",
    name: "Amina Wanjiku",
    role: "Digital Entrepreneur, Nairobi",
    avatar: "/avatars/amina.jpg",
  },
  {
    quote:
      "The business consulting session was worth every penny. My revenue grew 40% within three months of implementing what I learned. Highly recommend iLab Growth!",
    name: "David Kofi",
    role: "SME Owner, Accra",
    avatar: "/avatars/david.jpg",
  },
  {
    quote:
      "As a first-generation entrepreneur, I needed guidance. The community here is incredibly supportive and the resources are top-notch and Africa-relevant.",
    name: "Fatima Diallo",
    role: "Founder, Lagos",
    avatar: "/avatars/fatima.jpg",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-[#FDF1E3] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            Success Stories
          </span>
          <h2
            className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl"
            style={{ fontFamily: "var(--font-ubuntu)" }}
          >
            What Our Community Says
          </h2>
          <p className="mt-4 text-neutral-600">
            Join thousands of African entrepreneurs who have grown their
            businesses with iLab Growth.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-900/5"
            >
              <div className="flex gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-700">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-neutral-100 pt-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-neutral-200">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-neutral-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}