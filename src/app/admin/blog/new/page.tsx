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
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft");
  const [authorName, setAuthorName] = useState("");
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState("");
  const [readTimeMinutes, setReadTimeMinutes] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<NamedItem[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  function loadCategories() {
    fetch("/api/admin/blog-categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: NamedItem[]) => setCategories(data))
      .catch(() => setCategories([]));
  }

  async function handleCreateCategory(name: string): Promise<boolean> {
    const res = await fetch("/api/admin/blog-categories", {
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

  function handleCategoryDeleted(id: string) {
    const deleted = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (deleted && category === deleted.name) setCategory("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!content.trim()) {
      toast.error("Content is required.");
      return;
    }

    let parsedReadTime: number | undefined;
    if (readTimeMinutes.trim()) {
      const n = parseInt(readTimeMinutes, 10);
      if (Number.isNaN(n) || n < 1) {
        toast.error("Read time must be a whole number of 1 or more.");
        return;
      }
      parsedReadTime = n;
    }

    const tagNames = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim() || undefined,
          content: content.trim(),
          coverImageUrl: coverImageUrl.trim() || undefined,
          category: category || undefined,
          status,
          authorName: authorName.trim() || undefined,
          authorAvatarUrl: authorAvatarUrl.trim() || undefined,
          readTimeMinutes: parsedReadTime,
          tagNames: tagNames.length ? tagNames : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Could not create blog post.");
        setLoading(false);
        return;
      }

      toast.success(
        status === "published" ? "Blog post published." : "Draft saved."
      );
      router.push("/admin/blog");
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
          New Blog Post
        </h1>
        <p className="text-sm text-muted-foreground">
          Write and publish an article to the blog.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Post Details</CardTitle>
          <CardDescription>
            A URL-friendly slug is generated automatically from the title.
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
              <Label htmlFor="excerpt">Excerpt (optional)</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="A short summary shown in the blog list and previews."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                required
                placeholder="Write the full article here. Plain text only — line breaks are preserved, but Markdown/HTML won't be formatted on the live page."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Category</Label>
                  <ManageListDialog
                    label="Category"
                    items={categories}
                    endpoint="blog-categories"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="authorName">Author Name (optional)</Label>
                <Input
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Dr. Amara Mensah"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="readTimeMinutes">Read Time in Minutes (optional)</Label>
                <Input
                  id="readTimeMinutes"
                  type="number"
                  min={1}
                  value={readTimeMinutes}
                  onChange={(e) => setReadTimeMinutes(e.target.value)}
                  placeholder="e.g. 6"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorAvatarUrl">Author Avatar URL (optional)</Label>
              <Input
                id="authorAvatarUrl"
                value={authorAvatarUrl}
                onChange={(e) => setAuthorAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                No image upload system yet — paste a direct image link.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="SME, Entrepreneurship, M-Pesa"
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated. New tags are created automatically.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">Cover Image URL (optional)</Label>
              <Input
                id="coverImageUrl"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                No image upload system yet — paste a direct image link.
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : status === "published"
                    ? "Publish Post"
                    : "Save Draft"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/blog")}
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