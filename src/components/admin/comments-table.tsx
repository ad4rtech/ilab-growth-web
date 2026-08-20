"use client";

// src/components/admin/comments-table.tsx
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Check, Ban, Trash2, MessageCircle } from "lucide-react";
import type { AdminComment } from "@/lib/comments-admin";

export function CommentsTable({ initialComments }: { initialComments: AdminComment[] }) {
  const [comments, setComments] = useState(initialComments);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: "approved" | "spam") {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        toast.error("Could not update comment.");
        return;
      }
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      toast.success(status === "approved" ? "Comment approved." : "Marked as spam.");
    } catch {
      toast.error("Network error.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Could not delete comment.");
        return;
      }
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Comment deleted.");
    } catch {
      toast.error("Network error.");
    } finally {
      setBusyId(null);
    }
  }

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <MessageCircle className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No comments here</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Nothing matches this filter right now.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Comment</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Post</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {comments.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="max-w-sm">
              <p className="line-clamp-2 text-sm">{c.content}</p>
            </TableCell>
            <TableCell>
              <p className="text-sm font-medium">{c.authorName}</p>
              <p className="text-xs text-muted-foreground">{c.authorEmail}</p>
            </TableCell>
            <TableCell>
              <Link
                href={`/blog/${c.blogPost.slug}`}
                target="_blank"
                className="text-sm text-blue-600 hover:underline"
              >
                {c.blogPost.title}
              </Link>
            </TableCell>
            <TableCell>
              {c.status === "approved" && (
                <Badge className="bg-green-600 hover:bg-green-600">Approved</Badge>
              )}
              {c.status === "pending" && <Badge variant="outline">Pending</Badge>}
              {c.status === "spam" && <Badge className="bg-red-600 hover:bg-red-600">Spam</Badge>}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(c.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                {c.status !== "approved" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:bg-green-50"
                    disabled={busyId === c.id}
                    onClick={() => setStatus(c.id, "approved")}
                    title="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                {c.status !== "spam" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                    disabled={busyId === c.id}
                    onClick={() => setStatus(c.id, "spam")}
                    title="Mark as spam"
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This permanently removes the comment. This can&apos;t be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        disabled={busyId === c.id}
                        onClick={() => handleDelete(c.id)}
                      >
                        {busyId === c.id ? "Deleting..." : "Delete"}
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