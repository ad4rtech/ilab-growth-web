import Link from "next/link";
import Image from "next/image";
import { getPublicBlogPosts, formatBlogDate } from "@/lib/blog";

export async function BlogPreviewSection() {
  const { posts } = await getPublicBlogPosts({ sort: "recent" });
  const featured = posts.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-amber-600">
              Stay Informed
            </span>
            <h2
              className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl"
              style={{ fontFamily: "var(--font-ubuntu)" }}
            >
              Latest from the Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700 sm:block"
          >
            Read all posts →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-neutral-200"
            >
              <div className="relative aspect-[16/10] w-full bg-neutral-100">
                {post.coverImageUrl && (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs">
                  {post.category && (
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-600">
                      {post.category}
                    </span>
                  )}
                  <span className="text-neutral-500">
                    {formatBlogDate(post.publishedAt)}
                  </span>
                </div>
                <h3
                  className="mt-3 line-clamp-2 text-lg font-semibold text-neutral-900"
                  style={{ fontFamily: "var(--font-ubuntu)" }}
                >
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-3 inline-block text-sm font-medium text-blue-600">
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/blog"
          className="mt-8 block text-center text-sm font-medium text-blue-600 hover:text-blue-700 sm:hidden"
        >
          Read all posts →
        </Link>
      </div>
    </section>
  );
}