import Image from "next/image";

const CREDENTIALS = [
  "Forbes Africa 30 Under 30",
  "Lagos Business School MBA",
  "15+ Years in Strategy",
  "BBC Africa Contributor",
];

export function FounderSpotlight() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_320px] lg:items-center">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            Meet the Founder
          </span>
          <h2
            className="mt-2 text-3xl font-bold text-neutral-900"
            style={{ fontFamily: "var(--font-ubuntu)" }}
          >
            Dr. Ifeoma Obi
          </h2>
          <p className="mt-1 text-sm font-medium text-blue-600">
            Founder &amp; CEO, iLab Growth
          </p>

          <p className="mt-5 text-neutral-600">
            With over 15 years in business strategy and a deep passion for
            African entrepreneurship, Ifeoma founded iLab Growth after seeing
            first-hand how the continent&apos;s most talented entrepreneurs
            were being held back by a lack of accessible, relevant business
            education.
          </p>
          <p className="mt-4 text-neutral-600">
            She holds an MBA from Lagos Business School and has been featured
            in Forbes Africa, Business Insider Africa, and the BBC as a
            leading voice on African SME development.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {CREDENTIALS.map((c) => (
              <span
                key={c}
                className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-64 overflow-hidden rounded-2xl bg-neutral-100 lg:w-full">
          <Image
            src="/about/founder.jpg"
            alt="Dr. Ifeoma Obi, Founder & CEO of iLab Growth"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}