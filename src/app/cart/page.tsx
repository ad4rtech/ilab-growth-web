import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { CartPageTabs } from "@/components/cart/cart-page-tabs";
import { CartView } from "@/components/cart/cart-view";
import { RelatedProductsStrip } from "@/components/cart/related-products-strip";
import { MyLibraryView } from "@/components/products/my-library-view";
import { getCartItems, getCartCount } from "@/lib/cart";
import type { Product } from "@/components/product-card";

export const dynamic = "force-dynamic";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

interface CartPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function CartPage({ searchParams }: CartPageProps) {
  const { tab } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/cart");

  const user = session.user as typeof session.user & { role?: string };
  if (user.role === "admin") redirect("/admin");

  const userId = user.id;
  const [items, cartCount, products] = await Promise.all([
    getCartItems(userId),
    getCartCount(userId),
    getProducts(),
  ]);

  const excludeIds = items.filter((i) => i.productId).map((i) => i.productId as string);

  return (
    <>
      <DashboardHeader
        fullName={user.name ?? "there"}
        userId={userId}
        imageUrl={user.image ?? null}
        initialCartCount={cartCount}
      />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:underline">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-900">Your Cart</span>
        </nav>

        <div className="mt-6">
          <CartPageTabs
            initialTab={tab === "library" ? "library" : "cart"}
            cartSlot={
              <>
                <CartView userId={userId} initialItems={items} />
                <RelatedProductsStrip excludeIds={excludeIds} />
              </>
            }
            librarySlot={<MyLibraryView userId={userId} products={products} />}
          />
        </div>
      </main>

      <DashboardFooter />
    </>
  );
}