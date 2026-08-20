const STATS = [
  { value: "12,000+", label: "Entrepreneurs Trained" },
  { value: "150+", label: "Digital Products & Courses" },
  { value: "18", label: "African Countries Reached" },
  { value: "94%", label: "Client Satisfaction Rate" },
];

export function AboutStats() {
  return (
    <section className="bg-[#FDF1E3] py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 text-center lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p
              className="text-3xl font-bold text-blue-700 sm:text-4xl"
              style={{ fontFamily: "var(--font-ubuntu)" }}
            >
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-neutral-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}