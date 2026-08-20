// src/components/blog/blog-sidebar.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatBlogDate, type CategoryCounts, type PublicBlogPost, type TagCount } from "@/lib/blog";
import { NewsletterBox } from "./newsletter-box";

interface BlogSidebarProps {
  categoryCounts: CategoryCounts;
  popularPosts: PublicBlogPost[];
  tags: TagCount[];
  activeCategory: string;
  basePath?: string;
}

export function BlogSidebar({
  categoryCounts,
  popularPosts,
  tags,
  activeCategory,
  basePath = "/blog",
}: BlogSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Categories */}
      <div className="rounded-xl border bg-white p-5">
        <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-ubuntu)" }}>
          Categories
        </h3>
        <ul className="mt-3 space-y-1">
          <li>
            <Link
              href={basePath}
              scroll={false}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                activeCategory === "all"
                  ? "bg-blue-50 font-medium text-blue-700"
                  : "text-gray-600 hover:bg-gray-50",
              )}
            >
              All Posts
              <span>{categoryCounts.all}</span>
            </Link>
          </li>
          {categoryCounts.categories.map((c) => (
            <li key={c.name}>
              <Link
                href={`${basePath}?category=${encodeURIComponent(c.name)}`}
                scroll={false}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                  activeCategory === c.name
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                {c.name}
                <span>{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular posts */}
      {popularPosts.length > 0 && (
        <div className="rounded-xl border bg-white p-5">
          <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-ubuntu)" }}>
            Popular Posts
          </h3>
          <ul className="mt-3 space-y-4">
            {popularPosts.map((post, i) => (
              <li key={post.id} className="flex gap-3">
                <span className="text-lg font-bold text-gray-200">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-gray-800 hover:text-blue-600"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1 text-xs text-gray-400">{formatBlogDate(post.publishedAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="rounded-xl border bg-white p-5">
          <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-ubuntu)" }}>
            Tags
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`${basePath}?tag=${encodeURIComponent(tag.name)}`}
                scroll={false}
                className="rounded-full border px-3 py-1 text-xs text-gray-600 hover:border-gray-400"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <NewsletterBox variant="sidebar" source="Blog" />
    </aside>
  );
}