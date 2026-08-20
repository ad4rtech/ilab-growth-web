import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "iLab Growth completely transformed how I approach my online business. The digital marketing course gave me actionable strategies I could apply immediately.",
    name: "Amina Wanjiku",
    role: "Digital Entrepreneur, Nairobi",
  },
  {
    quote:
      "The business consulting session was worth every penny. My revenue grew 40% within three months of implementing what I learned. Highly recommend iLab Growth!",
    name: "David Kofi",
    role: "SME Owner, Accra",
  },
  {
    quote:
      "As a first-generation entrepreneur, I needed guidance. The community here is incredibly supportive and the resources are top-notch and Africa-relevant.",
    name: "Fatima Diallo",
    role: "Founder, Lagos",
  },
];

export function ServicesTestimonials() {
  return (
    <section className="bg-orange-50 px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Success Stories</p>
        <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-2 text-3xl font-bold text-gray-900">
          What Our Community Says
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          Join thousands of African entrepreneurs who have grown their businesses with iLab Growth.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-gray-100 bg-white p-6 text-left">
              <div className="flex gap-0.5 text-orange-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-700">&quot;{t.quote}&quot;</p>
              <div className="mt-5 border-t pt-4">
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}