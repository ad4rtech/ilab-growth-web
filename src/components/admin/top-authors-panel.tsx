// src/components/admin/top-authors-panel.tsx
import type { TopAuthor } from "@/lib/blog-admin";

interface TopAuthorsPanelProps {
  authors: TopAuthor[];
}

export function TopAuthorsPanel({ authors }: TopAuthorsPanelProps) {
  const max = Math.max(1, ...authors.map((a) => a.postCount));

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-ubuntu)" }}>
        Top Authors
      </h3>

      {authors.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No authored posts yet — set an author name when creating a post.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {authors.map((author) => (
            <li key={author.authorName} className="flex items-center gap-3">
              {author.authorAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.authorAvatarUrl}
                  alt={author.authorName}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gray-200" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800">{author.authorName}</p>
                <p className="text-xs text-muted-foreground">
                  {author.postCount} post{author.postCount === 1 ? "" : "s"}
                </p>
              </div>
              <div className="h-1.5 w-20 flex-none overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${(author.postCount / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}