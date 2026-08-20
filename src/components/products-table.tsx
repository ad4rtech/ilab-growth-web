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
import { Trash2, Pencil, Package } from "lucide-react";

export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  category: string | null;
  productType: string | null;
  badge: string | null;
  status: string;
  fileUrl: string | null;
  createdAt: string;
};

export function ProductsTable({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Could not delete product.");
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success(`"${title}" deleted.`);
    } catch {
      toast.error("Network error. Could not delete product.");
    } finally {
      setDeletingId(null);
    }
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <Package className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No products yet</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Click &quot;Add Product&quot; to create your first digital product.
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
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.title}</TableCell>
            <TableCell>
              {p.category ? (
                <Badge variant="outline">{p.category}</Badge>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {p.productType ?? "—"}
            </TableCell>
            <TableCell>
              <div className="flex items-baseline gap-2">
                <span>{formatKES(p.price)}</span>
                {p.compareAtPrice && p.compareAtPrice > p.price && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatKES(p.compareAtPrice)}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              {p.badge ? (
                <Badge className="bg-orange-500 hover:bg-orange-500">
                  {p.badge}
                </Badge>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>
              <Badge
                className={
                  p.status === "published" ? "bg-green-600 hover:bg-green-600" : ""
                }
                variant={p.status === "published" ? "default" : "outline"}
              >
                {p.status === "published" ? "Published" : "Draft"}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(p.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/admin/products/${p.id}/edit`}
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
                      This permanently removes the product from your
                      catalogue and storefront. This can&apos;t be undone.
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