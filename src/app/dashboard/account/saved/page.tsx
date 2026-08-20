import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { ProductCard } from "@/components/product-card";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { getFavourites } from "@/lib/favourites";
import { getSavedPosts } from "@/lib/my-blog";
import { getOrderCount, getSavedItemsCount } from "@/lib/account";
import { getCartCount } from "@/lib/cart";
import { Bookmark } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SavedItemsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = session.user as typeof session.user & { banned?: boolean };
  const userId = user.id;

  const [favourites, savedPosts, orderCount, savedCount, cartCount] = await Promise.all([
    getFavourites(userId),
    getSavedPosts(userId),
    getOrderCount(userId),
    getSavedItemsCount(userId),
    getCartCount(userId),
  ]);

  return (
    <>
      <DashboardHeader fullName={user.name ?? "there"} userId={userId} initialCartCount={cartCount} />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-10 lg:flex-row">
          <AccountSidebar
            name={user.name ?? "there"}
            email={user.email}
            imageUrl={user.image ?? null}
            emailVerified={!!user.emailVerified}
            banned={!!user.banned}
            orderCount={orderCount}
            savedCount={savedCount}
          />

          <div className="flex-1 space-y-10">
            <div>
              <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
                Saved Items
              </h1>
              <p className="text-sm text-muted-foreground">
                Everything you&apos;ve saved for later, in one place.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-gray-900">Products ({favourites.length})</h2>
              {favourites.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No saved products yet.</p>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {favourites.map((f) => (
                    <ProductCard key={f.product.id} product={f.product} userId={userId} isFavourited />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="font-bold text-gray-900">Articles ({savedPosts.length})</h2>
              {savedPosts.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No saved articles yet.</p>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
                  {savedPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} userId={userId} isSaved />
                  ))}
                </div>
              )}
            </div>

            {favourites.length === 0 && savedPosts.length === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
                <Bookmark className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Tap the heart or bookmark icon on any product or article to save it here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <DashboardFooter />
    </>
  );
}