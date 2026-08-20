import { Award, Smartphone, Infinity as InfinityIcon, Headphones } from "lucide-react";

const ITEMS = [
  {
    icon: Award,
    title: "Certificate of Completion",
    description: "Earn proof of your new skills",
  },
  {
    icon: Smartphone,
    title: "Mobile-Friendly",
    description: "Learn on any device, anywhere",
  },
  {
    icon: InfinityIcon,
    title: "Lifetime Access",
    description: "Revisit course content anytime",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Get help from instructors & peers",
  },
];

export function CoursesTrustBand() {
  return (
    <section className="bg-[#FDF1E3] py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <item.icon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                {item.title}
              </p>
              <p className="text-sm text-neutral-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}