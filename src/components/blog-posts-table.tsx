"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Pencil, FileText } from "lucide-react";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  status: string;
  displayStatus?: string; // "draft" | "published" | "scheduled" — falls back to status if absent
  publishedAt: string | null;
  createdAt: string;
  authorName: string | null;
  readTimeMinutes: number | null;
  viewCount?: number;
  commentCount?: number;
  coverImageUrl?: string | null;
};

export function BlogPostsTable({
  initialPosts,
}: {
  initialPosts: BlogPost[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blog-posts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Could not delete post.");
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success(`"${title}" deleted.`);
    } catch {
      toast.error("Network error. Could not delete post.");
    } finally {
      setDeletingId(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <FileText className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No blog posts yet</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Click &quot;New Blog Post&quot; to write your first article.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>Comments</TableHead>
          <TableHead>Read Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                {p.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.coverImageUrl}
                    alt=""
                    className="h-10 w-10 flex-none rounded-md object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 flex-none rounded-md bg-gray-100" />
                )}
                <span>{p.title}</span>
              </div>
            </TableCell>
            <TableCell>
              {p.category ? (
                <Badge variant="outline">{p.category}</Badge>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {p.authorName ?? <span>—</span>}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {(p.displayStatus ?? p.status) === "published" ? (p.viewCount ?? 0).toLocaleString() : <span>—</span>}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {(p.displayStatus ?? p.status) === "published" ? (p.commentCount ?? 0).toLocaleString() : <span>—</span>}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {p.readTimeMinutes ? `${p.readTimeMinutes} min` : <span>—</span>}
            </TableCell>
            <TableCell>
              {(() => {
                const displayStatus = p.displayStatus ?? p.status;
                if (displayStatus === "published") {
                  return <Badge className="bg-green-600 hover:bg-green-600">Published</Badge>;
                }
                if (displayStatus === "scheduled") {
                  return <Badge className="bg-amber-500 hover:bg-amber-500">Scheduled</Badge>;
                }
                return <Badge variant="outline">Draft</Badge>;
              })()}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(p.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/admin/blog/${p.id}/edit`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <AlertDialog>
                <AlertDialogTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete &quot;{p.title}&quot;?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently removes the post from the blog. This
                      can&apos;t be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      disabled={deletingId === p.id}
                      onClick={() => handleDelete(p.id, p.title)}
                    >
                      {deletingId === p.id ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}