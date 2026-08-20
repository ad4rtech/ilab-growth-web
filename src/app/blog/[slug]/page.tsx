// src/app/blog/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  formatBlogDate,
  getBlogPostBySlug,
  getPublicBlogPosts,
  type PublicBlogPost,
} from "@/lib/blog";
import { BlogContent } from "@/components/blog/blog-content";
import { ShareButton } from "@/components/blog/share-button";
import { RelatedPosts } from "@/components/blog/related-posts";
import { BlogComments } from "@/components/blog/blog-comments";
import { NewsletterBox } from "@/components/blog/newsletter-box";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const post = await getBlogPostBySlug(slug, session?.user.id);

  if (!post) {
    notFound();
  }

  const related = post.category
    ? (await getPublicBlogPosts({ category: post.category, page: 1 })).posts
        .filter((p) => p.slug !== post.slug)
        .slice(0, 3)
    : [];

  const blogBasePath = session ? "/dashboard/blog" : "/blog";

  return (
    <main>
      <div className="mx-auto max-w-3xl px-6 pt-8 md:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-gray-500">
          <Link href={blogBasePath} className="hover:text-blue-600">
            Blog
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {post.category ? (
            <Link
              href={`${blogBasePath}?category=${encodeURIComponent(post.category)}`}
              className="hover:text-blue-600"
            >
              {post.category}
            </Link>
          ) : (
            <span>Article</span>
          )}
        </nav>

        {/* Header */}
        <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
          {post.category && (
            <Badge variant="secondary" className="rounded-full bg-blue-50 text-blue-700">
              {post.category}
            </Badge>
          )}
          {post.publishedAt && <span>{formatBlogDate(post.publishedAt)}</span>}
          {post.readTimeMinutes && <span>· {post.readTimeMinutes} min read</span>}
        </div>

        <h1
          className="mt-3 text-3xl font-bold leading-tight text-gray-900 md:text-4xl"
          style={{ fontFamily: "var(--font-ubuntu)" }}
        >
          {post.title}
        </h1>

        {post.excerpt && <p className="mt-4 text-lg text-gray-600">{post.excerpt}</p>}

        <div className="mt-6 flex items-center justify-between border-y py-4">
          <div className="flex items-center gap-3">
            {post.authorAvatarUrl ? (
              <Image
                src={post.authorAvatarUrl}
                alt={post.authorName ?? "Author"}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200" />
            )}
            <span className="text-sm font-medium text-gray-800">
              {post.authorName ?? "iLab Growth Team"}
            </span>
          </div>
          <ShareButton slug={post.slug} title={post.title} />
        </div>
      </div>

      {/* Cover image */}
      <div className="mx-auto mt-8 max-w-4xl px-6 md:px-10">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            width={1400}
            height={700}
            className="h-auto w-full rounded-xl object-cover"
            priority
          />
        ) : (
          <div className="flex h-[320px] w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
            No cover image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-10">
        <BlogContent content={post.content} />

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t pt-6">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`${blogBasePath}?tag=${encodeURIComponent(tag)}`}
                className="rounded-full border px-3 py-1 text-xs text-gray-600 hover:border-gray-400"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10">
          <BlogComments slug={post.slug} />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-16 md:px-10">
        <RelatedPosts posts={related} />
      </div>

      <NewsletterBox variant="banner" source="Blog" />
    </main>
  );
}