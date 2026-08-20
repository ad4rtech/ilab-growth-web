import Image from "next/image";

const TEAM = [
  {
    name: "Dr. Ifeoma Obi",
    role: "Founder & CEO",
    bio: "Former strategy consultant with 15+ years helping African SMEs scale. MBA from Lagos Business School. Founded iLab Growth in 2019.",
    photo: "/about/team/ifeoma.jpg",
  },
  {
    name: "Kwame Asante",
    role: "Head of Courses",
    bio: "Certified business coach and finance expert. Built and delivered training programs for 200+ SMEs across Ghana, Kenya, and Nigeria.",
    photo: "/about/team/kwame.jpg",
  },
  {
    name: "Ngozi Okafor",
    role: "Head of Digital Products",
    bio: "Entrepreneur and product designer. Previously launched two e-commerce businesses before joining iLab Growth to lead the digital store.",
    photo: "/about/team/ngozi.jpg",
  },
  {
    name: "Emmanuel Osei",
    role: "Lead Business Consultant",
    bio: "10 years in corporate strategy and SME consulting across West Africa. Specialises in growth acceleration and team leadership.",
    photo: "/about/team/emmanuel.jpg",
  },
];

export function TeamGrid() {
  return (
    <section className="bg-[#FDF1E3] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            Who We Are
          </span>
          <h2
            className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl"
            style={{ fontFamily: "var(--font-ubuntu)" }}
          >
            Meet the iLab Growth Team
          </h2>
          <p className="mt-4 text-neutral-600">
            A small, passionate team of African business experts, educators,
            and entrepreneurs united by one goal: your growth.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-900/5"
            >
              <div className="relative aspect-square w-full bg-neutral-200">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3
                  className="font-semibold text-neutral-900"
                  style={{ fontFamily: "var(--font-ubuntu)" }}
                >
                  {member.name}
                </h3>
                <p className="mt-0.5 text-sm font-medium text-amber-600">
                  {member.role}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}