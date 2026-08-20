"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { formatKES } from "@/lib/format";
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
import { Trash2, Pencil, Briefcase } from "lucide-react";

export type Service = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  compareAtPrice: number | null;
  category: string | null;
  serviceType: string | null;
  badge: string | null;
  status: string;
  createdAt: string;
};

export function ServicesTable({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Could not delete service.");
        return;
      }
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success(`"${title}" deleted.`);
    } catch {
      toast.error("Network error. Could not delete service.");
    } finally {
      setDeletingId(null);
    }
  }

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <Briefcase className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No services yet</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Click &quot;Add New Service&quot; to create your first service listing.
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
          <TableHead>Type</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Badge</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Added</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="font-medium">{s.title}</TableCell>
            <TableCell>
              {s.category ? <Badge variant="outline">{s.category}</Badge> : <span className="text-muted-foreground">—</span>}
            </TableCell>
            <TableCell className="text-muted-foreground">{s.serviceType ?? "—"}</TableCell>
            <TableCell>
              {s.price === null ? (
                <span className="text-muted-foreground">Custom quote</span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span>{formatKES(s.price)}</span>
                  {s.compareAtPrice && s.compareAtPrice > s.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatKES(s.compareAtPrice)}
                    </span>
                  )}
                </div>
              )}
            </TableCell>
            <TableCell>
              {s.badge ? (
                <Badge className="bg-orange-500 hover:bg-orange-500">{s.badge}</Badge>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>
              <Badge
                className={s.status === "published" ? "bg-green-600 hover:bg-green-600" : ""}
                variant={s.status === "published" ? "default" : "outline"}
              >
                {s.status === "published" ? "Published" : "Draft"}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/admin/services/${s.id}/edit`}
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
                      <AlertDialogTitle>Delete &quot;{s.title}&quot;?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This permanently removes the service from your services page. This can&apos;t be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deletingId === s.id}
                        onClick={() => handleDelete(s.id, s.title)}
                      >
                        {deletingId === s.id ? "Deleting..." : "Delete"}
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