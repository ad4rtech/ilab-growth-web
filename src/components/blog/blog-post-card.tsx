// src/components/blog/blog-post-card.tsx
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatBlogDate, type PublicBlogPost } from "@/lib/blog";
import { ShareButton } from "./share-button";
import { SaveButton } from "./save-button";

interface BlogPostCardProps {
  post: PublicBlogPost;
  variant?: "featured" | "grid";
  userId?: string;
  isSaved?: boolean;
}

export function BlogPostCard({ post, variant = "grid", userId, isSaved = false }: BlogPostCardProps) {
  const isFeatured = variant === "featured";

  return (
    <article>
      <div className="relative overflow-hidden rounded-xl">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            width={isFeatured ? 1200 : 600}
            height={isFeatured ? 640 : 400}
            className={isFeatured ? "h-[360px] w-full object-cover" : "h-[220px] w-full object-cover"}
          />
        ) : (
          <div
            className={
              (isFeatured ? "h-[360px]" : "h-[220px]") +
              " flex w-full items-center justify-center bg-gray-100 text-sm text-gray-400"
            }
          >
            No cover image
          </div>
        )}
        {post.isPopular && (
          <Badge className="absolute left-3 top-3 bg-orange-500 text-white hover:bg-orange-500">
            Popular
          </Badge>
        )}
        {post.isNew && !post.isPopular && (
          <Badge className="absolute left-3 top-3 bg-blue-600 text-white hover:bg-blue-600">
            New
          </Badge>
        )}
        {userId && (
          <SaveButton
            userId={userId}
            blogPostId={post.id}
            initialSaved={isSaved}
            className="absolute right-3 top-3"
          />
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
        {post.category && (
          <Badge variant="secondary" className="rounded-full bg-blue-50 text-blue-700">
            {post.category}
          </Badge>
        )}
        {post.publishedAt && <span>{formatBlogDate(post.publishedAt)}</span>}
        {post.readTimeMinutes && <span>· {post.readTimeMinutes} min read</span>}
      </div>

      <Link href={`/blog/${post.slug}`}>
        <h3
          className={
            (isFeatured ? "text-2xl" : "text-lg") +
            " mt-2 font-bold text-gray-900 hover:underline"
          }
          style={{ fontFamily: "var(--font-ubuntu)" }}
        >
          {post.title}
        </h3>
      </Link>

      {post.excerpt && <p className="mt-2 text-gray-600">{post.excerpt}</p>}

      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-2">
          {post.authorAvatarUrl ? (
            <Image
              src={post.authorAvatarUrl}
              alt={post.authorName ?? "Author"}
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-gray-200" />
          )}
          <span className="text-sm text-gray-700">{post.authorName ?? "iLab Growth Team"}</span>
        </div>
        <div className="flex items-center gap-4">
          <ShareButton slug={post.slug} title={post.title} />
          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}