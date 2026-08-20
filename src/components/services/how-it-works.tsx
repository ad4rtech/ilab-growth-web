const STEPS = [
  {
    number: "01",
    title: "Book a Free Call",
    description: "Schedule a no-obligation 30-minute discovery call with our team to discuss your needs.",
  },
  {
    number: "02",
    title: "We Assess & Propose",
    description: "We review your business situation and send a tailored proposal within 48 hours.",
  },
  {
    number: "03",
    title: "Work Begins",
    description: "Once you confirm, we kick off with a structured onboarding and clear milestones.",
  },
  {
    number: "04",
    title: "Grow & Measure",
    description: "Track your progress with regular check-ins and measurable KPIs throughout the engagement.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-orange-50 px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Simple Process</p>
        <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-2 text-3xl font-bold text-gray-900">
          How It Works
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                {step.number}
              </span>
              <h3 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-4 font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}