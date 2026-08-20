import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import type { MostViewedEntry } from "@/lib/my-blog";

export function MostViewedPanel({ entries }: { entries: MostViewedEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="flex items-center gap-2 font-bold text-gray-900" style={{ fontFamily: "var(--font-ubuntu)" }}>
        <Eye className="h-4 w-4 text-blue-700" />
        Your Most Viewed
        <span className="text-sm font-normal text-gray-400">Articles you keep coming back to</span>
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {entries.map(({ post, viewCount }) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {post.coverImageUrl && (
                <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />
              )}
            </div>
            <div className="min-w-0">
              {post.category && (
                <span className="text-xs font-medium text-blue-700">{post.category}</span>
              )}
              <p className="truncate text-sm font-semibold text-gray-900">{post.title}</p>
              <p className="text-xs text-gray-400">
                Viewed {viewCount}x
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}