// src/components/blog/related-posts.tsx
import type { PublicBlogPost } from "@/lib/blog";
import { BlogPostCard } from "./blog-post-card";

interface RelatedPostsProps {
  posts: PublicBlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t pt-10">
      <h2
        className="text-xl font-bold text-gray-900"
        style={{ fontFamily: "var(--font-ubuntu)" }}
      >
        Related Articles
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} variant="grid" />
        ))}
      </div>
    </section>
  );
}