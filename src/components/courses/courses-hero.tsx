const HIGHLIGHTS = [
  "Lifetime access",
  "Certificate of completion",
  "Mobile-friendly",
  "Community support",
];

export function CoursesHero() {
  return (
    <section className="bg-blue-700 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <span className="text-sm font-medium text-blue-200">
          iLab Growth Learning Platform
        </span>
        <h1
          className="mt-3 text-4xl font-bold text-white sm:text-5xl"
          style={{ fontFamily: "var(--font-ubuntu)" }}
        >
          Learn. Grow. Succeed.
        </h1>
        <p className="mt-4 max-w-2xl text-blue-100">
          Browse 150+ expert-led courses and digital resources built
          specifically for African entrepreneurs and SME owners. At your own
          pace, on any device.
        </p>

        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-blue-100">
          {HIGHLIGHTS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}