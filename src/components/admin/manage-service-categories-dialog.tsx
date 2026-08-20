"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { NamedItem } from "@/components/manage-list-dialog";

interface ManageServiceCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoriesChanged: () => void; // parent refetches its dropdown list after add/remove
}

export function ManageServiceCategoriesDialog({
  open,
  onOpenChange,
  onCategoriesChanged,
}: ManageServiceCategoriesDialogProps) {
  const [categories, setCategories] = useState<NamedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function loadCategories() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories?type=service");
      const data = res.ok ? await res.json() : [];
      setCategories(data as NamedItem[]);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) loadCategories();
  }, [open]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    setAdding(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type: "service" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.message ?? "Could not add category.");
        return;
      }
      setNewName("");
      await loadCategories();
      onCategoriesChanged();
      toast.success(`"${name}" added.`);
    } catch {
      toast.error("Network error. Could not add category.");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(id: string, name: string) {
    setRemovingId(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Could not remove category.");
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
      onCategoriesChanged();
      toast.success(`"${name}" removed.`);
    } catch {
      toast.error("Network error. Could not remove category.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Service Categories</DialogTitle>
          <DialogDescription>
            These are separate from Product categories — adding one here only makes it available
            on the Services page.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Consulting"
          />
          <Button type="submit" disabled={adding || !newName.trim()} className="gap-1">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </form>

        <div className="max-h-64 space-y-1 overflow-y-auto">
          {loading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Loading...</p>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <Tag className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No service categories yet.</p>
            </div>
          ) : (
            categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span>{c.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-600 hover:bg-red-50"
                  disabled={removingId === c.id}
                  onClick={() => handleRemove(c.id, c.name)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}