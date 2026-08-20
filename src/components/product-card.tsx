"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { formatKES } from "@/lib/format";
import { FavouriteButton } from "@/components/products/favourite-button";
import { QuickBuyModal } from "@/components/quick-buy-modal";

export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  category: string | null;
  productType: string | null;
  badge: string | null;
  imageUrl: string | null;
  createdAt: string;
};

export function ProductCard({
  product,
  view = "grid",
  userId,
  isFavourited = false,
  ctaOverride,
}: {
  product: Product;
  view?: "grid" | "list";
  userId?: string;
  isFavourited?: boolean;
  ctaOverride?: React.ReactNode;
}) {
  const badgeLabel = product.price === 0 ? "Free" : product.badge;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md ${
        view === "list" ? "flex flex-col sm:flex-row" : ""
      }`}
    >
      <Link
        href={`/products/${product.id}`}
        className={`relative block flex-none overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 ${
          view === "list" ? "h-40 sm:h-auto sm:w-56" : "h-40 w-full"
        }`}
      >
        {product.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {badgeLabel && (
          <span className="absolute left-2 top-2 rounded-md bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
            {badgeLabel}
          </span>
        )}
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
          <Eye className="h-3 w-3" />
          Preview
        </span>
      </Link>

      {userId && (
        <FavouriteButton
          userId={userId}
          productId={product.id}
          initialFavourited={isFavourited}
          className="absolute right-2 top-2"
        />
      )}

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium text-orange-600">
          {[product.category, product.productType].filter(Boolean).join(" · ")}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3
            style={{ fontFamily: "var(--font-ubuntu)" }}
            className="font-semibold leading-snug hover:underline"
          >
            {product.title}
          </h3>
        </Link>
        {product.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        )}
<div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">
              {formatKES(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatKES(product.compareAtPrice)}
              </span>
            )}
          </div>
          {ctaOverride ?? (
            <QuickBuyModal
              itemType="product"
              itemId={product.id}
              title={product.title}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              imageUrl={product.imageUrl}
              detailHref={`/products/${product.id}`}
              userId={userId}
            />
          )}
        </div>
      </div>
    </div>
  );
}