"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Plus, Upload, Download, Search, Tag } from "lucide-react";
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
import { ManageServiceCategoriesDialog } from "@/components/admin/manage-service-categories-dialog";
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

interface ServicesToolbarProps {
  atCapacity: boolean;
  maxServices: number;
}

export function ServicesToolbar({ atCapacity, maxServices }: ServicesToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<NamedItem[]>([]);
  const [importOpen, setImportOpen] = useState(false);
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function loadCategories() {
    fetch("/api/admin/categories?type=service")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: NamedItem[]) => setCategories(data))
      .catch(() => setCategories([]));
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    params.delete("page");
    router.push(`/admin/services?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateParam("search", String(formData.get("search") ?? "").trim());
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/services/export-csv");
      if (!res.ok) {
        toast.error("Could not generate export.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `services-${new Date().toISOString().slice(0, 10)}.csv`;
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
      const res = await fetch("/api/admin/services/bulk-import", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message ?? "Import failed.");
        return;
      }
      setImportResult(data as BulkImportResult);
      if (data.created > 0) {
        toast.success(`${data.created} service${data.created === 1 ? "" : "s"} imported.`);
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
        {atCapacity ? (
          <Button disabled title={`Limit of ${maxServices} services reached`}>
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Service ({maxServices}/{maxServices})
            </span>
          </Button>
        ) : (
          <Button asChild className="bg-blue-700 hover:bg-blue-800">
            <Link href="/admin/services/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Service
            </Link>
          </Button>
        )}

        <Button variant="outline" className="gap-2" onClick={() => setImportOpen(true)}>
          <Upload className="h-4 w-4" />
          Bulk Import
        </Button>

        <Button variant="outline" className="gap-2" onClick={handleExport} disabled={exporting}>
          <Download className="h-4 w-4" />
          {exporting ? "Exporting..." : "Export CSV"}
        </Button>

        <Button variant="outline" className="gap-2" onClick={() => setCategoriesDialogOpen(true)}>
          <Tag className="h-4 w-4" />
          Manage Categories
        </Button>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              defaultValue={searchParams.get("search") ?? ""}
              placeholder="Search services..."
              className="w-56 pl-9"
            />
          </form>

          <Select
            value={searchParams.get("category") ?? "all"}
            onValueChange={(v) => updateParam("category", v ?? "all")}
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
            onValueChange={(v) => updateParam("status", v ?? "all")}
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
            <DialogTitle>Bulk Import Services</DialogTitle>
            <DialogDescription>
              Columns: title, subtitle, description, whatsIncluded (pipe-separated, e.g.
              &quot;Item one|Item two&quot;), duration, icon, price, ctaLabel, badge, category,
              serviceType, status. Only <code>title</code> required. Import stops once the{" "}
              {maxServices}-service limit is reached.
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

      <ManageServiceCategoriesDialog
        open={categoriesDialogOpen}
        onOpenChange={setCategoriesDialogOpen}
        onCategoriesChanged={loadCategories}
      />
    </div>
  );
}