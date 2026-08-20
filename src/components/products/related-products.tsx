import { Package } from "lucide-react";
import { ProductCard, type Product } from "@/components/product-card";

async function getRelatedProducts(productId: string): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/related?limit=3`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as Product[];
  } catch {
    return [];
  }
}

export async function RelatedProducts({ productId }: { productId: string }) {
  const related = await getRelatedProducts(productId);
  if (related.length === 0) return null;

  return (
    <div className="mt-14">
      <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-xl font-bold">
        You May Also Like
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}