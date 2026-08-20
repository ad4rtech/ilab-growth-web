"use client";

// src/components/blog/blog-comments.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface CommentItem {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface BlogCommentsProps {
  slug: string;
}

export function BlogComments({ slug }: BlogCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/blog-posts/public/comments/${slug}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: CommentItem[]) => setComments(data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const authorName = String(formData.get("authorName") ?? "").trim();
    const authorEmail = String(formData.get("authorEmail") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    if (!authorName || !authorEmail || !content) {
      toast.error("Fill in your name, email, and comment.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/blog-posts/public/comments/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName, authorEmail, content }),
      });
      if (!res.ok) {
        toast.error("Could not post your comment. Try again.");
        return;
      }
      const created: CommentItem = await res.json();
      setComments((prev) => [created, ...prev]);
      form.reset();
      toast.success("Comment posted.");
    } catch {
      toast.error("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="border-t pt-8">
      <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-ubuntu)" }}>
        {loading ? "Comments" : `${comments.length} Comment${comments.length === 1 ? "" : "s"}`}
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-xl border p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input name="authorName" placeholder="Your name" required />
          <Input name="authorEmail" type="email" placeholder="Your email (not published)" required />
        </div>
        <Textarea name="content" placeholder="Write a comment..." rows={3} required />
        <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
          {submitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      {!loading && comments.length > 0 && (
        <ul className="mt-6 space-y-5">
          {comments.map((c) => (
            <li key={c.id} className="border-b pb-5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">{c.authorName}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{c.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}