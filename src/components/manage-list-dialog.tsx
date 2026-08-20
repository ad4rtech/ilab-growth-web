"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Trash2, Settings2 } from "lucide-react";

export type NamedItem = { id: string; name: string };

export function ManageListDialog({
  label,
  items,
  endpoint,
  onDeleted,
}: {
  label: string;
  items: NamedItem[];
  endpoint: "categories" | "product-types" | "blog-categories" | "course-categories";
  onDeleted: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(item: NamedItem) {
    setDeletingId(item.id);
    try {
      const res = await fetch(`/api/admin/${endpoint}/${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? `Could not delete "${item.name}".`);
        return;
      }
      onDeleted(item.id);
      toast.success(`"${item.name}" deleted.`);
    } catch {
      toast.error("Network error. Could not delete.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-auto gap-1 p-0 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(true)}
      >
        <Settings2 className="h-3 w-3" />
        Manage {label.toLowerCase()}s
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage {label}s</DialogTitle>
        </DialogHeader>
        <div className="max-h-80 space-y-1 overflow-y-auto py-2">
          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No {label.toLowerCase()}s yet.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted"
              >
                <span className="text-sm">{item.name}</span>
                <AlertDialog>
                  <AlertDialogTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete &quot;{item.name}&quot;?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This removes it from the picklist for new products.
                        Existing products already using this {label.toLowerCase()}{" "}
                        keep their current label — this doesn&apos;t change
                        them.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deletingId === item.id}
                        onClick={() => handleDelete(item)}
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}