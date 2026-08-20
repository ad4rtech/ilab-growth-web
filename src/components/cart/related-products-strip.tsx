import { Package } from "lucide-react";
import { ProductCard, type Product } from "@/components/product-card";

async function getSuggestions(excludeIds: string[]): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { cache: "no-store" });
    if (!res.ok) return [];
    const all = (await res.json()) as Product[];
    return all.filter((p) => !excludeIds.includes(p.id)).slice(0, 4);
  } catch {
    return [];
  }
}

export async function RelatedProductsStrip({ excludeIds }: { excludeIds: string[] }) {
  const suggestions = await getSuggestions(excludeIds);
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-14">
      <div className="flex items-end justify-between">
        <div>
          <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-xl font-bold">
            You Might Also Like
          </h2>
          <p className="text-sm text-muted-foreground">Hand-picked for African entrepreneurs like you</p>
        </div>
        <a href="/dashboard/products" className="text-sm font-medium text-blue-700 hover:underline">
          View all products
        </a>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {suggestions.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}