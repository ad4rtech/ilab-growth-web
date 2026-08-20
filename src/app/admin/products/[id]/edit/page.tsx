"use client";

// src/app/admin/products/[id]/edit/page.tsx
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatableSelect } from "@/components/creatable-select";
import { ManageListDialog, type NamedItem } from "@/components/manage-list-dialog";

const STATUS_ITEMS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const [loadingProduct, setLoadingProduct] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [category, setCategory] = useState("");
  const [productType, setProductType] = useState("");
  const [badge, setBadge] = useState("");
  const [status, setStatus] = useState("published");
  const [imageUrl, setImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>([""]);
  const [format, setFormat] = useState("");
  const [fileSizeLabel, setFileSizeLabel] = useState("");
  const [language, setLanguage] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<NamedItem[]>([]);
  const [productTypes, setProductTypes] = useState<NamedItem[]>([]);

  useEffect(() => {
    loadCategories();
    loadProductTypes();
    loadProduct();
  }, [productId]);

  async function loadProduct() {
    setLoadingProduct(true);
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, { cache: "no-store" });
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const p = await res.json();
      setTitle(p.title ?? "");
      setDescription(p.description ?? "");
      setPrice(p.price != null ? String(p.price) : "");
      setCompareAtPrice(p.compareAtPrice != null ? String(p.compareAtPrice) : "");
      setCategory(p.category ?? "");
      setProductType(p.productType ?? "");
      setBadge(p.badge ?? "");
      setStatus(p.status ?? "published");
      setImageUrl(p.imageUrl ?? "");
      setFileUrl(p.fileUrl ?? "");
      setWhatsIncluded(p.whatsIncluded?.length ? p.whatsIncluded : [""]);
      setFormat(p.format ?? "");
      setFileSizeLabel(p.fileSizeLabel ?? "");
      setLanguage(p.language ?? "");
      const existingGalleryUrls = (p.images ?? []).map((img: { url: string }) => img.url);
      setGalleryUrls(existingGalleryUrls.length ? existingGalleryUrls : [""]);
    } catch {
      setNotFound(true);
    } finally {
      setLoadingProduct(false);
    }
  }

  function loadCategories() {
    fetch("/api/admin/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: NamedItem[]) => setCategories(data))
      .catch(() => setCategories([]));
  }

  function loadProductTypes() {
    fetch("/api/admin/product-types")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: NamedItem[]) => setProductTypes(data))
      .catch(() => setProductTypes([]));
  }

  async function handleCreateCategory(name: string): Promise<boolean> {
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.message ?? "Could not add category.");
      return false;
    }
    const created: NamedItem = await res.json();
    setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    toast.success(`Category "${name}" added.`);
    return true;
  }

  async function handleCreateProductType(name: string): Promise<boolean> {
    const res = await fetch("/api/admin/product-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.message ?? "Could not add product type.");
      return false;
    }
    const created: NamedItem = await res.json();
    setProductTypes((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    toast.success(`Product type "${name}" added.`);
    return true;
  }

  function handleCategoryDeleted(id: string) {
    const deleted = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (deleted && category === deleted.name) setCategory("");
  }

  function handleProductTypeDeleted(id: string) {
    const deleted = productTypes.find((t) => t.id === id);
    setProductTypes((prev) => prev.filter((t) => t.id !== id));
    if (deleted && productType === deleted.name) setProductType("");
  }

  function updateWhatsIncluded(i: number, value: string) {
    setWhatsIncluded((prev) => prev.map((item, idx) => (idx === i ? value : item)));
  }
  function addWhatsIncluded() {
    setWhatsIncluded((prev) => [...prev, ""]);
  }
  function removeWhatsIncluded(i: number) {
    setWhatsIncluded((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateGalleryUrl(i: number, value: string) {
    setGalleryUrls((prev) => prev.map((item, idx) => (idx === i ? value : item)));
  }
  function addGalleryUrl() {
    setGalleryUrls((prev) => [...prev, ""]);
  }
  function removeGalleryUrl(i: number) {
    setGalleryUrls((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const priceNum = Number(price);
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!Number.isInteger(priceNum) || priceNum < 0) {
      toast.error("Price must be a whole number in KES (e.g. 1500).");
      return;
    }

    let compareNum: number | undefined;
    if (compareAtPrice.trim()) {
      compareNum = Number(compareAtPrice);
      if (!Number.isInteger(compareNum) || compareNum < 0) {
        toast.error("Compare-at price must be a whole number in KES.");
        return;
      }
      if (compareNum <= priceNum) {
        toast.error(
          "Compare-at price should be higher than the actual price (it's shown as the crossed-out original price)."
        );
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          price: priceNum,
          compareAtPrice: compareNum,
          category: category || undefined,
          productType: productType || undefined,
          badge: badge.trim() || undefined,
          status,
          imageUrl: imageUrl.trim() || undefined,
          fileUrl: fileUrl.trim() || undefined,
          whatsIncluded: whatsIncluded.map((i) => i.trim()).filter(Boolean),
          format: format.trim() || undefined,
          fileSizeLabel: fileSizeLabel.trim() || undefined,
          language: language.trim() || undefined,
          imageUrls: galleryUrls.map((u) => u.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Could not save changes.");
        setSaving(false);
        return;
      }

      toast.success("Product updated.");
      router.push("/admin/products");
    } catch {
      toast.error("Network error. Check your connection and try again.");
      setSaving(false);
    }
  }

  if (loadingProduct) {
    return <p className="text-sm text-muted-foreground">Loading product...</p>;
  }

  if (notFound) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This product couldn't be found — it may have been deleted.
        </p>
        <Button variant="outline" onClick={() => router.push("/admin/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
          Edit Product
        </h1>
        <p className="text-sm text-muted-foreground">Update this product's details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Product Details</CardTitle>
          <CardDescription>
            Prices are in Kenyan Shillings (KES), whole numbers only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (KSh)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compareAtPrice">Compare-at Price (optional)</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  min={0}
                  step={1}
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="2500"
                />
                <p className="text-xs text-muted-foreground">Shown crossed out, for discounts.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Category</Label>
                  <ManageListDialog
                    label="Category"
                    items={categories}
                    endpoint="categories"
                    onDeleted={handleCategoryDeleted}
                  />
                </div>
                <CreatableSelect
                  label="Category"
                  placeholder="Select a category"
                  items={categories.map((c) => c.name)}
                  value={category}
                  onValueChange={setCategory}
                  onCreate={handleCreateCategory}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Product Type</Label>
                  <ManageListDialog
                    label="Product Type"
                    items={productTypes}
                    endpoint="product-types"
                    onDeleted={handleProductTypeDeleted}
                  />
                </div>
                <CreatableSelect
                  label="Product Type"
                  placeholder="Select a type"
                  items={productTypes.map((t) => t.name)}
                  value={productType}
                  onValueChange={setProductType}
                  onCreate={handleCreateProductType}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="badge">Badge (optional)</Label>
                <Input
                  id="badge"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Bestseller, New, Popular, Top Pick..."
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select items={STATUS_ITEMS} value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
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

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Primary Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                No image upload system yet — paste a direct image link.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Gallery Images (optional)</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Additional images shown as thumbnails on the product page.
              </p>
              <div className="space-y-2">
                {galleryUrls.map((url, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={url}
                      onChange={(e) => updateGalleryUrl(i, e.target.value)}
                      placeholder="https://..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeGalleryUrl(i)}
                      disabled={galleryUrls.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addGalleryUrl}>
                <Plus className="h-3.5 w-3.5" />
                Add image
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl">Digital File URL (optional)</Label>
              <Input
                id="fileUrl"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                No file delivery system yet — paste a direct link if you have one.
              </p>
            </div>

            <div className="space-y-2">
              <Label>What&apos;s Included (optional)</Label>
              <p className="text-xs text-muted-foreground">
                Shown as a checklist on the product page.
              </p>
              <div className="space-y-2">
                {whatsIncluded.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateWhatsIncluded(i, e.target.value)}
                      placeholder="Executive Summary Template"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeWhatsIncluded(i)}
                      disabled={whatsIncluded.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addWhatsIncluded}>
                <Plus className="h-3.5 w-3.5" />
                Add item
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format">Format (optional)</Label>
                <Input
                  id="format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  placeholder="PDF, DOCX, XLSX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileSizeLabel">File Size (optional)</Label>
                <Input
                  id="fileSizeLabel"
                  value={fileSizeLabel}
                  onChange={(e) => setFileSizeLabel(e.target.value)}
                  placeholder="18.4 MB"
                />
                <p className="text-xs text-muted-foreground">
                  Manual text — not read from the actual file.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language (optional)</Label>
                <Input
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="English"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}