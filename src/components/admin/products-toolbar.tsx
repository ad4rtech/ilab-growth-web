"use client";

// src/components/admin/products-toolbar.tsx
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Plus, Upload, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { NamedItem } from "@/components/manage-list-dialog";

const STATUS_ITEMS = [
  { value: "all", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

interface BulkImportResult {
  totalRows: number;
  created: number;
  errors: { row: number; message: string }[];
}

export function ProductsToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<NamedItem[]>([]);
  const [importOpen, setImportOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: NamedItem[]) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/admin/products?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateParam("search", String(formData.get("search") ?? "").trim());
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/products/export-csv");
      if (!res.ok) {
        toast.error("Could not generate export.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Export downloaded.");
    } catch {
      toast.error("Network error during export.");
    } finally {
      setExporting(false);
    }
  }

  async function handleImportSubmit() {
    if (!selectedFile) {
      toast.error("Choose a CSV file first.");
      return;
    }
    setImporting(true);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await fetch("/api/admin/products/bulk-import", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message ?? "Import failed.");
        return;
      }
      setImportResult(data as BulkImportResult);
      if (data.created > 0) {
        toast.success(`${data.created} product${data.created === 1 ? "" : "s"} imported.`);
        router.refresh();
      }
    } catch {
      toast.error("Network error during import.");
    } finally {
      setImporting(false);
    }
  }

  function closeImportDialog() {
    setImportOpen(false);
    setImportResult(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild className="bg-blue-700 hover:bg-blue-800">
          <Link href="/admin/products/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Product
          </Link>
        </Button>

        <Button variant="outline" className="gap-2" onClick={() => setImportOpen(true)}>
          <Upload className="h-4 w-4" />
          Bulk Import
        </Button>

        <Button variant="outline" className="gap-2" onClick={handleExport} disabled={exporting}>
          <Download className="h-4 w-4" />
          {exporting ? "Exporting..." : "Export CSV"}
        </Button>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              defaultValue={searchParams.get("search") ?? ""}
              placeholder="Search products..."
              className="w-56 pl-9"
            />
          </form>

          <Select
            value={searchParams.get("category") ?? "all"}
            onValueChange={(v) => updateParam("category", v)}
            items={[{ value: "all", label: "All Categories" }, ...categories.map((c) => ({ value: c.name, label: c.name }))]}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get("status") ?? "all"}
            onValueChange={(v) => updateParam("status", v)}
            items={STATUS_ITEMS}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ITEMS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Dialog open={importOpen} onOpenChange={(open) => (open ? setImportOpen(true) : closeImportDialog())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Import Products</DialogTitle>
            <DialogDescription>
              Upload a CSV with columns: title, description, price, compareAtPrice, category,
              productType, badge, status, imageUrl, fileUrl. Only <code>title</code> and{" "}
              <code>price</code> are required per row.
            </DialogDescription>
          </DialogHeader>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            className="rounded-md border p-2 text-sm"
          />

          {importResult && (
            <div className="rounded-md border bg-muted/50 p-3 text-sm">
              <p className="font-medium">
                {importResult.created} of {importResult.totalRows} rows imported.
              </p>
              {importResult.errors.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto text-xs text-red-600">
                  {importResult.errors.map((e, i) => (
                    <p key={i}>
                      Row {e.row}: {e.message}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeImportDialog}>
              {importResult ? "Close" : "Cancel"}
            </Button>
            {!importResult && (
              <Button onClick={handleImportSubmit} disabled={importing || !selectedFile}>
                {importing ? "Importing..." : "Import"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}