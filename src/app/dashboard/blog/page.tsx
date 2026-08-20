import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { BlogSortSelect, BlogSearchInput } from "@/components/blog/blog-controls";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { NewsletterBox } from "@/components/blog/newsletter-box";
import { MostViewedPanel } from "@/components/blog/most-viewed-panel";
import { SavedFilterPill } from "@/components/blog/saved-filter-pill";
import {
  getBlogCategoryCounts,
  getBlogTags,
  getPopularBlogPosts,
  getPublicBlogPosts,
} from "@/lib/blog";
import { getSavedPosts, getSavedIds, getMyMostViewed } from "@/lib/my-blog";
import { getCartCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

interface DashboardBlogPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function DashboardBlogPage({ searchParams }: DashboardBlogPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "admin") redirect("/admin");

  const userId = session.user.id;
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const category = params.category ?? "all";
  const tag = params.tag;
  const search = params.search;
  const sort = (params.sort as "recent" | "oldest" | "popular" | undefined) ?? "recent";
  const savedOnly = params.saved === "true";

  const [categoryCounts, tags, popularPosts, savedPosts, savedIds, mostViewed, cartCount] = await Promise.all([
    getBlogCategoryCounts(),
    getBlogTags(),
    getPopularBlogPosts(4),
    getSavedPosts(userId),
    getSavedIds(userId),
    getMyMostViewed(userId, 3),
    getCartCount(userId),
  ]);

  const postsResponse = savedOnly
    ? { posts: savedPosts, total: savedPosts.length, page: 1, pageSize: savedPosts.length, totalPages: 1 }
    : await getPublicBlogPosts({ page, category, tag, search, sort });

  const { posts, totalPages } = postsResponse;
  const [featuredPost, ...restPosts] = posts;

  const urlSearchParams = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => !!entry[1]),
  );

  return (
    <>
<DashboardHeader
  fullName={session.user.name ?? "there"}
  userId={session.user.id}
  imageUrl={session.user.image ?? null}
  initialCartCount={cartCount}
/>
      <main>
        <BlogHero categoryCounts={categoryCounts} />

        <section className="mx-auto max-w-6xl px-6 py-10 md:px-10">
          {mostViewed.length > 0 && (
            <div className="mb-8">
              <MostViewedPanel entries={mostViewed} />
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <SavedFilterPill savedCount={savedIds.length} />
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-ubuntu)" }}>
                  {savedOnly ? "Saved Articles" : "Latest Articles"}
                </h2>
                {!savedOnly && <BlogSortSelect />}
              </div>

              {posts.length === 0 ? (
                <div className="mt-10 rounded-xl border border-dashed p-10 text-center text-gray-500">
                  {savedOnly
                    ? "You haven't saved any articles yet — tap the bookmark icon on a post to save it here."
                    : search || (category && category !== "all") || tag
                      ? "No articles match your filters yet."
                      : "No published articles yet — check back soon."}
                </div>
              ) : (
                <>
                  <div className="mt-6">
                    <BlogPostCard
                      post={featuredPost}
                      variant="featured"
                      userId={userId}
                      isSaved={savedIds.includes(featuredPost.id)}
                    />
                  </div>

                  {restPosts.length > 0 && (
                    <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
                      {restPosts.map((post) => (
                        <BlogPostCard
                          key={post.id}
                          post={post}
                          variant="grid"
                          userId={userId}
                          isSaved={savedIds.includes(post.id)}
                        />
                      ))}
                    </div>
                  )}

                  {!savedOnly && (
                    <div className="mt-10">
                      <BlogPagination
                        currentPage={page}
                        totalPages={totalPages}
                        searchParams={urlSearchParams}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border bg-white p-1">
                <BlogSearchInput basePath="/dashboard/blog" />
              </div>
              <BlogSidebar
                categoryCounts={categoryCounts}
                popularPosts={popularPosts}
                tags={tags}
                activeCategory={category}
                basePath="/dashboard/blog"
              />
            </div>
          </div>
        </section>

        <NewsletterBox variant="banner" source="Blog" />
      </main>

      <DashboardFooter />
    </>
  );
}