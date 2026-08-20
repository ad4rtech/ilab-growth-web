import { Package, Heart, Info } from "lucide-react";
import { MyLibraryCard, type LibraryProduct } from "@/components/products/my-library-card";
import { ProductCard, type Product } from "@/components/product-card";
import { MoveToCartButton } from "@/components/products/move-to-cart-button";
import { getFavourites } from "@/lib/favourites";

interface OrderRecord {
  status: string;
  createdAt?: string;
  item: { type: string; id: string; fileUrl?: string | null } | null;
}

async function getOrders(userId: string): Promise<OrderRecord[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/orders?userId=${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as OrderRecord[];
  } catch {
    return [];
  }
}

export async function MyLibraryView({ userId, products }: { userId: string; products: Product[] }) {
  const [orders, favourites] = await Promise.all([getOrders(userId), getFavourites(userId)]);
  const favouriteIds = new Set(favourites.map((f) => f.productId));

  const purchased: LibraryProduct[] = orders
    .filter((o) => o.status === "completed" && o.item?.type === "product")
    .map((o) => {
      const product = products.find((p) => p.id === o.item!.id);
      if (!product) return null;
      return {
        id: product.id,
        title: product.title,
        category: product.category,
        productType: product.productType,
        badge: product.badge,
        imageUrl: product.imageUrl,
        fileUrl: o.item!.fileUrl ?? null,
        // /payments/orders may or may not include an order-level createdAt —
        // omit the "Purchased on" line rather than fabricate a date if absent.
        purchasedAt: o.createdAt ?? null,
      };
    })
    .filter((p): p is LibraryProduct => p !== null)
    .sort((a, b) => {
      if (!a.purchasedAt || !b.purchasedAt) return 0;
      return new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime();
    });

  return (
    <div className="space-y-14">
      <div>
        <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-xl font-bold">
          My Library
        </h2>
        <p className="text-sm text-muted-foreground">
          {purchased.length} purchased product{purchased.length === 1 ? "" : "s"}
        </p>

        {purchased.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-20 text-center">
            <Package className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No purchases yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Products you buy will show up here with lifetime access to download.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {purchased.map((p) => (
              <MyLibraryCard key={p.id} product={p} userId={userId} isFavourited={favouriteIds.has(p.id)} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-xl font-bold">
            My Favourites
          </h2>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {favourites.length} saved
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Items you&apos;ve saved for later — buy when you&apos;re ready, or move to cart now.
        </p>

        {favourites.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
            <Heart className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No favourites yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Tap the heart icon on any product to save it here.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {favourites.map((f) => (
              <ProductCard
                key={f.product.id}
                product={f.product}
                userId={userId}
                isFavourited
                ctaOverride={<MoveToCartButton userId={userId} productId={f.product.id} />}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <strong>Re-download anytime.</strong> All your purchased files are stored in your
          library forever. You&apos;ll never lose access — just come back here and hit Download.
        </p>
      </div>
    </div>
  );
}