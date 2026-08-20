const MILESTONES = [
  {
    year: "2019",
    text: "iLab Growth founded in Nairobi, Kenya with a single consulting service offering.",
  },
  {
    year: "2020",
    text: "Launched the first digital product catalogue — 12 templates — during the COVID pivot to digital.",
  },
  {
    year: "2021",
    text: "Online course platform launched. First cohort of 400 students across 6 countries.",
  },
  {
    year: "2022",
    text: "Expanded to 18 African countries. Surpassed 5,000 entrepreneurs trained milestone.",
  },
  {
    year: "2023",
    text: "Growth Accelerator Program launched. 94% completion rate in first year.",
  },
  {
    year: "2025",
    text: "12,000+ entrepreneurs served. Full platform relaunch with new courses, products, and community hub.",
  },
];

export function Milestones() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            Our Journey
          </span>
          <h2
            className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl"
            style={{ fontFamily: "var(--font-ubuntu)" }}
          >
            Key Milestones
          </h2>
        </div>

        <ol className="mt-12 space-y-8 border-l-2 border-blue-100 pl-8">
          {MILESTONES.map((m) => (
            <li key={m.year} className="relative">
              <span className="absolute -left-[42px] flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
                {m.year.slice(2)}
              </span>
              <p className="pt-1 text-sm font-semibold text-blue-700">
                {m.year}
              </p>
              <p className="mt-1 text-neutral-700">{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}