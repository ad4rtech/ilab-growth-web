import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatKES } from "@/lib/format";

type FeaturedItem = {
  id: string;
  type: "Course" | "Product";
  title: string;
  price: number;
  imageUrl: string | null;
  href: string;
  // Real badge field from the Product model (e.g. "Bestseller", "Popular",
  // "Top Pick") — only Products have this; Course has no badge field, so
  // this stays undefined for courses and no badge renders.
  badgeLabel?: string | null;
};

async function getFeaturedItems(): Promise<FeaturedItem[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const [productsRes, coursesRes] = await Promise.all([
      fetch(`${apiUrl}/products?status=published&limit=2`, {
        next: { revalidate: 300 },
      }),
      fetch(`${apiUrl}/courses?limit=2`, { next: { revalidate: 300 } }),
    ]);

    const products = productsRes.ok ? await productsRes.json() : [];
    const courses = coursesRes.ok ? await coursesRes.json() : [];

    const productItems: FeaturedItem[] = (products.items ?? products ?? [])
      .slice(0, 2)
      .map((p: any) => ({
        id: p.id,
        type: "Product" as const,
        title: p.title,
        price: p.price,
        imageUrl: p.imageUrl ?? null,
        href: `/products/${p.id}`,
        // Mirrors ProductCard's logic exactly: Free overrides any set badge.
        badgeLabel: p.price === 0 ? "Free" : p.badge ?? null,
      }));

    const courseItems: FeaturedItem[] = (courses.items ?? courses ?? [])
      .slice(0, 2)
      .map((c: any) => ({
        id: c.id,
        type: "Course" as const,
        title: c.title,
        price: c.price,
        imageUrl: c.imageUrl ?? null,
        href: `/courses/${c.id}`,
        // No badge field on Course — intentionally omitted.
      }));

    return [...courseItems, ...productItems];
  } catch {
    return [];
  }
}

export async function FeaturedSection() {
  const items = await getFeaturedItems();

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-amber-600">
              Hand-Picked For You
            </span>
            <h2
              className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl"
              style={{ fontFamily: "var(--font-ubuntu)" }}
            >
              Featured Courses &amp; Products
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700 sm:block"
          >
            View all →
          </Link>
        </div>

        {items.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-500">
            Featured items aren&apos;t available right now — check back soon.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="overflow-hidden rounded-2xl border border-neutral-200"
              >
                <div className="relative aspect-[4/3] w-full bg-neutral-100">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  {/* Badge overlay — Products only, matches ProductCard */}
                  {item.badgeLabel && (
                    <span className="absolute left-2 top-2 rounded-md bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
                      {item.badgeLabel}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <span className="inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-blue-600">
                    {item.type}
                  </span>
                  <h3
                    className="mt-2 line-clamp-2 text-base font-semibold text-neutral-900"
                    style={{ fontFamily: "var(--font-ubuntu)" }}
                  >
                    {item.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-neutral-900">
                      {formatKES(item.price)}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Link href={item.href}>Get Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/products"
          className="mt-8 block text-center text-sm font-medium text-blue-600 hover:text-blue-700 sm:hidden"
        >
          View all →
        </Link>
      </div>
    </section>
  );
}