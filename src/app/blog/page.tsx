// src/app/blog/page.tsx
import {
  getBlogCategoryCounts,
  getBlogTags,
  getPopularBlogPosts,
  getPublicBlogPosts,
} from "@/lib/blog";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { BlogSortSelect, BlogSearchInput } from "@/components/blog/blog-controls";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { NewsletterBox } from "@/components/blog/newsletter-box";

interface BlogPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const category = params.category ?? "all";
  const tag = params.tag;
  const search = params.search;
  const sort = (params.sort as "recent" | "oldest" | "popular" | undefined) ?? "recent";

  const [postsResponse, categoryCounts, tags, popularPosts] = await Promise.all([
    getPublicBlogPosts({ page, category, tag, search, sort }),
    getBlogCategoryCounts(),
    getBlogTags(),
    getPopularBlogPosts(4),
  ]);

  const { posts, totalPages } = postsResponse;
  const [featuredPost, ...restPosts] = posts;

  const urlSearchParams = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => !!entry[1]),
  );

  return (
    <>
      <SiteHeader />

      <main>
        <BlogHero categoryCounts={categoryCounts} />

        <section className="mx-auto max-w-6xl px-6 py-10 md:px-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-ubuntu)" }}>
                  Latest Articles
                </h2>
                <BlogSortSelect />
              </div>

              {posts.length === 0 ? (
                <div className="mt-10 rounded-xl border border-dashed p-10 text-center text-gray-500">
                  {search || (category && category !== "all") || tag
                    ? "No articles match your filters yet."
                    : "No published articles yet — check back soon."}
                </div>
              ) : (
                <>
                  <div className="mt-6">
                    <BlogPostCard post={featuredPost} variant="featured" />
                  </div>

                  {restPosts.length > 0 && (
                    <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
                      {restPosts.map((post) => (
                        <BlogPostCard key={post.id} post={post} variant="grid" />
                      ))}
                    </div>
                  )}

                  <div className="mt-10">
                    <BlogPagination
                      currentPage={page}
                      totalPages={totalPages}
                      searchParams={urlSearchParams}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border bg-white p-1">
                <BlogSearchInput />
              </div>
              <BlogSidebar
                categoryCounts={categoryCounts}
                popularPosts={popularPosts}
                tags={tags}
                activeCategory={category}
              />
            </div>
          </div>
        </section>

        <NewsletterBox variant="banner" source="Blog" />
      </main>

      <SiteFooter />
    </>
  );
}