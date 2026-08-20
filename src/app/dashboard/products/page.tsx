import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { ProductsBrowser } from "@/components/products-browser";
import { ProductViewTabs } from "@/components/products/product-view-tabs";
import { MyLibraryView } from "@/components/products/my-library-view";
import { NewsletterSignup } from "@/components/newsletter-signup";
import type { Product } from "@/components/product-card";
import { getFavouriteIds } from "@/lib/favourites";
import { getCartCount } from "@/lib/cart";
import { Zap, Smartphone, Mail, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function DashboardProductsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "admin") redirect("/admin");

  const products = await getProducts();
  const userId = session.user.id;
  const favouriteIds = new Set(await getFavouriteIds(userId));
  const cartCount = await getCartCount(userId);

  return (
    <div className="flex min-h-screen flex-col">
<DashboardHeader
  fullName={session.user.name ?? "there"}
  userId={session.user.id}
  imageUrl={session.user.image ?? null}
  initialCartCount={cartCount}
/>
      {/* Hero */}
      <div className="bg-orange-600 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium text-orange-100">
            iLab Growth Digital Store
          </p>
          <h1
            style={{ fontFamily: "var(--font-ubuntu)" }}
            className="mt-2 text-3xl font-bold sm:text-4xl"
          >
            Ready-to-Use Tools for Growing Businesses
          </h1>
          <p className="mt-4 max-w-2xl text-orange-50">
            Download templates, toolkits, and strategic guides built by
            African business experts — and get to work immediately after
            purchase.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-orange-50">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Instant download
            </span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5" />
              M-Pesa &amp; card payments
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Email receipt included
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Lifetime access
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: All Products / My Library */}
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <ProductViewTabs
          allProductsSlot={<ProductsBrowser products={products} userId={userId} favouriteIds={favouriteIds} />}
          myLibrarySlot={<MyLibraryView userId={userId} products={products} />}
        />
      </div>

      {/* Trust bar */}
      <div className="border-y bg-orange-50/60 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-700 text-white">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Instant Download</p>
              <p className="text-xs text-muted-foreground">
                Access your files immediately after payment
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Smartphone className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">M-Pesa Supported</p>
              <p className="text-xs text-muted-foreground">
                Pay easily via M-Pesa across East Africa
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Card &amp; PayPal</p>
              <p className="text-xs text-muted-foreground">
                All major cards and PayPal accepted
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Email Receipt</p>
              <p className="text-xs text-muted-foreground">
                Full purchase receipt sent to your inbox
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-blue-700 px-4 py-14 text-center text-white sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-blue-200">
          Free Resources &amp; Updates
        </p>
        <h2
          style={{ fontFamily: "var(--font-ubuntu)" }}
          className="mt-2 text-2xl font-bold sm:text-3xl"
        >
          Join 12,000+ Entrepreneurs
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-blue-100">
          Subscribe to our newsletter and get free business templates, growth
          tips, and exclusive discounts delivered straight to your inbox.
        </p>
        <div className="mt-6">
          <NewsletterSignup />
        </div>
        <p className="mt-3 text-xs text-blue-200">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>

      <DashboardFooter />
    </div>
  );
}