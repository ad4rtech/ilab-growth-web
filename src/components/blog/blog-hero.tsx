"use client";

// src/components/blog/blog-hero.tsx
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { CategoryCounts } from "@/lib/blog";

interface BlogHeroProps {
  categoryCounts: CategoryCounts;
  basePath?: string;
}

export function BlogHero({ categoryCounts, basePath = "/blog" }: BlogHeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "all";

  function setCategory(name: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (name === "all") {
      params.delete("category");
    } else {
      params.set("category", name);
    }
    params.delete("page"); // reset pagination when filter changes
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  }

  const pills = [
    { name: "all", label: "All" },
    ...categoryCounts.categories.map((c) => ({ name: c.name, label: c.name })),
  ];

  return (
    <section className="bg-[#FCEEE0] px-6 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium text-orange-600">iLab Growth Content Hub</p>
        <h1
          className="mt-2 max-w-2xl text-4xl font-bold leading-tight text-gray-900 md:text-5xl"
          style={{ fontFamily: "var(--font-ubuntu)" }}
        >
          Insights to Grow Your African Business
        </h1>
        <p className="mt-4 max-w-xl text-gray-600">
          Expert articles, practical guides, and real-world stories — curated for entrepreneurs
          and SME owners building businesses across Africa.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {pills.map((pill) => (
            <button
              key={pill.name}
              onClick={() => setCategory(pill.name)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                activeCategory === pill.name
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}