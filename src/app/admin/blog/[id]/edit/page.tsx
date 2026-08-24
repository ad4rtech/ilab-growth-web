"use client";

// src/app/admin/blog/[id]/edit/page.tsx
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const postId = params.id;

  const [loadingPost, setLoadingPost] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<NamedItem[]>([]);

  useEffect(() => {
    loadCategories();
    loadPost();
  }, [postId]);

  async function loadPost() {
    setLoadingPost(true);
    try {
      const res = await fetch(`${API_URL}/blog-posts/${postId}`, { cache: "no-store" });
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const p = await res.json();
      if (!p) {
        setNotFound(true);
        return;
      }
      setTitle(p.title ?? "");
      setExcerpt(p.excerpt ?? "");
      setContent(p.content ?? "");
      setCoverImageUrl(p.coverImageUrl ?? "");
      setCategory(p.category ?? "");
      setStatus(p.status ?? "draft");
      setAuthorName(p.authorName ?? "");
      setAuthorAvatarUrl(p.authorAvatarUrl ?? "");
      setReadTimeMinutes(p.readTimeMinutes != null ? String(p.readTimeMinutes) : "");
      setTagsInput((p.tags ?? []).map((t: { tag: { name: string } }) => t.tag.name).join(", "));
    } catch {
      setNotFound(true);
    } finally {
      setLoadingPost(false);
    }
  }

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

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blog-posts/${postId}`, {
        method: "PATCH",
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
        toast.error(data?.message ?? "Could not save changes.");
        setSaving(false);
        return;
      }

      toast.success("Post updated.");
      router.push("/admin/blog");
    } catch {
      toast.error("Network error. Check your connection and try again.");
      setSaving(false);
    }
  }

  if (loadingPost) {
    return <p className="text-sm text-muted-foreground">Loading post...</p>;
  }

  if (notFound) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This post couldn't be found — it may have been deleted.
        </p>
        <Button variant="outline" onClick={() => router.push("/admin/blog")}>
          Back to Blog Posts
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
          Edit Blog Post
        </h1>
        <p className="text-sm text-muted-foreground">Update this article's details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Post Details</CardTitle>
          <CardDescription>The slug stays the same as when this post was created.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt (optional)</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
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
                placeholder="Plain text only — line breaks are preserved, but Markdown/HTML won't be formatted on the live page."
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
                  onValueChange={(v) => v !== null && setCategory(v)}
                  onCreate={handleCreateCategory}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  items={STATUS_ITEMS}
                  value={status}
                  onValueChange={(value) => {
                    if (value !== null) setStatus(value);
                  }}
                >
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
                Comma-separated. Replaces the post's existing tags entirely on save.
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
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}