import { Heart, Lightbulb, ShieldCheck, TrendingUp } from "lucide-react";

const VALUES = [
  {
    icon: Heart,
    title: "Community First",
    description:
      "We build for African entrepreneurs, by people who understand the African business context — not borrowed Western frameworks.",
  },
  {
    icon: Lightbulb,
    title: "Practical Over Theoretical",
    description:
      "Every course, product, and service we create must deliver actionable, real-world value you can apply on day one.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description:
      "We say what we mean, price fairly, and stand behind everything we sell with clear refund and support policies.",
  },
  {
    icon: TrendingUp,
    title: "Growth Mindset",
    description:
      "We believe every entrepreneur can grow — with the right tools, knowledge, and support at the right time.",
  },
];

export function CoreValues() {
  return (
    <section className="bg-[#FDF1E3] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            What We Stand For
          </span>
          <h2
            className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl"
            style={{ fontFamily: "var(--font-ubuntu)" }}
          >
            Our Core Values
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-900/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                <value.icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3
                className="mt-4 text-base font-semibold text-neutral-900"
                style={{ fontFamily: "var(--font-ubuntu)" }}
              >
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}