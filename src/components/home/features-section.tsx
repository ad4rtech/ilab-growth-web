"use client";

import Link from "next/link";
import { GraduationCap, Package, Briefcase, Users, ArrowRight, Clock } from "lucide-react";

function buildFeatures(isLoggedIn: boolean) {
  const prefix = isLoggedIn ? "/dashboard" : "";
  return [
    {
      icon: GraduationCap,
      title: "Online Courses",
      description:
        "Self-paced and cohort courses on business growth, digital marketing, finance, and more.",
      href: `${prefix}/courses`,
    },
    {
      icon: Package,
      title: "Digital Products",
      description:
        "Ready-to-use templates, toolkits, and guides to accelerate your business operations.",
      href: `${prefix}/products`,
    },
    {
      icon: Briefcase,
      title: "Business Consulting",
      description:
        "Personalised strategy sessions and consulting packages for SMEs at every stage.",
      href: `${prefix}/services`,
    },
    {
      icon: Users,
      title: "Community & Networking",
      description:
        "Join a vibrant community of African entrepreneurs sharing ideas, leads, and support.",
      href: null, // not built yet — honest "Coming Soon" state, not a dead link
    },
  ];
}

export function FeaturesSection({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const features = buildFeatures(isLoggedIn);

  return (
    <section className="bg-[#FDF1E3] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            What We Offer
          </span>
          <h2
            className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl"
            style={{ fontFamily: "var(--font-ubuntu)" }}
          >
            Everything Your Business Needs
          </h2>
          <p className="mt-4 text-neutral-600">
            From learning to tools to community — iLab Growth is your
            one-stop business growth partner.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-900/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                <feature.icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3
                className="mt-4 text-lg font-semibold text-neutral-900"
                style={{ fontFamily: "var(--font-ubuntu)" }}
              >
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {feature.description}
              </p>
              {feature.href ? (
                <Link
                  href={feature.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}