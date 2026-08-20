"use client";

// src/components/admin/subscribers-table.tsx
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Trash2, Mail } from "lucide-react";
import type { Subscriber } from "@/lib/subscribers-admin";

export function SubscribersTable({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, email: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Could not delete subscriber.");
        return;
      }
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      toast.success(`"${email}" removed.`);
    } catch {
      toast.error("Network error.");
    } finally {
      setDeletingId(null);
    }
  }

  if (subscribers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <Mail className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No subscribers yet</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subscriber</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscribers.map((s) => (
          <TableRow key={s.id}>
            <TableCell>
              <p className="text-sm font-medium">{s.name ?? s.email}</p>
              {s.name && <p className="text-xs text-muted-foreground">{s.email}</p>}
            </TableCell>
            <TableCell className="text-muted-foreground">{s.source ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(s.subscribedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {s.status === "active" ? (
                <Badge className="bg-green-600 hover:bg-green-600">Subscribed</Badge>
              ) : (
                <Badge variant="outline">Unsubscribed</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <AlertDialog>
                <AlertDialogTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove &quot;{s.email}&quot;?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently deletes the subscriber. This can&apos;t be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      disabled={deletingId === s.id}
                      onClick={() => handleDelete(s.id, s.email)}
                    >
                      {deletingId === s.id ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}