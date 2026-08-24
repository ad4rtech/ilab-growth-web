"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { CreatableSelect } from "@/components/creatable-select";
import { ManageListDialog, type NamedItem } from "@/components/manage-list-dialog";

export default function NewProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [category, setCategory] = useState("");
  const [productType, setProductType] = useState("");
  const [badge, setBadge] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<NamedItem[]>([]);
  const [productTypes, setProductTypes] = useState<NamedItem[]>([]);

  useEffect(() => {
    loadCategories();
    loadProductTypes();
  }, []);

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

    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          price: priceNum,
          compareAtPrice: compareNum,
          category: category || undefined,
          productType: productType || undefined,
          badge: badge.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          fileUrl: fileUrl.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Could not create product.");
        setLoading(false);
        return;
      }

      toast.success("Product created.");
      router.push("/admin/products");
    } catch {
      toast.error("Network error. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1
          style={{ fontFamily: "var(--font-ubuntu)" }}
          className="text-2xl font-bold"
        >
          Add Product
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a new digital product for the storefront.
        </p>
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
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
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
                <Label htmlFor="compareAtPrice">
                  Compare-at Price (optional)
                </Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  min={0}
                  step={1}
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="2500"
                />
                <p className="text-xs text-muted-foreground">
                  Shown crossed out, for discounts.
                </p>
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
                  onValueChange={(v) => v !== null && setCategory(v)}
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
                  onValueChange={(v) => v !== null && setProductType(v)}
                  onCreate={handleCreateProductType}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge">Badge (optional)</Label>
              <Input
                id="badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Bestseller, New, Popular, Top Pick..."
              />
              <p className="text-xs text-muted-foreground">
                Free text shown as a small label on the product card. Leave
                blank for none.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                No image upload system yet — paste a direct image link.
                Leave blank to use a placeholder.
              </p>
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
                No file delivery system yet — paste a direct link if you
                have one.
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/products")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}