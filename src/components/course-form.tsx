"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import type { Course } from "@/components/courses-table";

const STATUS_ITEMS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

export function CourseForm({
  mode,
  initialCourse,
}: {
  mode: "create" | "edit";
  initialCourse?: Course & { whatYoullLearn?: string[] };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialCourse?.title ?? "");
  const [description, setDescription] = useState(
    initialCourse?.description ?? ""
  );
  const [price, setPrice] = useState(
    initialCourse ? String(initialCourse.price) : ""
  );
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialCourse?.compareAtPrice ? String(initialCourse.compareAtPrice) : ""
  );
  const [level, setLevel] = useState(initialCourse?.level ?? "");
  const [category, setCategory] = useState(initialCourse?.category ?? "");
  const [instructor, setInstructor] = useState(
    initialCourse?.instructor ?? ""
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialCourse?.thumbnailUrl ?? ""
  );
  const [badge, setBadge] = useState(initialCourse?.badge ?? "");
  const [status, setStatus] = useState(initialCourse?.status ?? "draft");
  const [lessonCount, setLessonCount] = useState(
    initialCourse?.lessonCount ? String(initialCourse.lessonCount) : ""
  );
  const [durationLabel, setDurationLabel] = useState(
    initialCourse?.durationLabel ?? ""
  );
  const [whatYoullLearn, setWhatYoullLearn] = useState<string[]>(
    initialCourse?.whatYoullLearn?.length ? initialCourse.whatYoullLearn : [""]
  );
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<NamedItem[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  function loadCategories() {
    fetch("/api/admin/course-categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: NamedItem[]) => setCategories(data))
      .catch(() => setCategories([]));
  }

  async function handleCreateCategory(name: string): Promise<boolean> {
    const res = await fetch("/api/admin/course-categories", {
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
    setCategories((prev) =>
      [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
    );
    toast.success(`Category "${name}" added.`);
    return true;
  }

  function handleCategoryDeleted(id: string) {
    const deleted = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (deleted && category === deleted.name) setCategory("");
  }

  function updateWhatYoullLearn(i: number, value: string) {
    setWhatYoullLearn((prev) => prev.map((item, idx) => (idx === i ? value : item)));
  }
  function addWhatYoullLearn() {
    setWhatYoullLearn((prev) => [...prev, ""]);
  }
  function removeWhatYoullLearn(i: number) {
    setWhatYoullLearn((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const priceNum = Number(price);
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!Number.isInteger(priceNum) || priceNum < 0) {
      toast.error("Price must be a whole number in KES (e.g. 4900).");
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

    let lessonCountNum: number | undefined;
    if (lessonCount.trim()) {
      lessonCountNum = Number(lessonCount);
      if (!Number.isInteger(lessonCountNum) || lessonCountNum < 0) {
        toast.error("Lesson count must be a whole number.");
        return;
      }
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      price: priceNum,
      compareAtPrice: compareNum,
      level: level.trim() || undefined,
      category: category || undefined,
      instructor: instructor.trim() || undefined,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      badge: badge.trim() || undefined,
      status,
      lessonCount: lessonCountNum,
      durationLabel: durationLabel.trim() || undefined,
      whatYoullLearn: whatYoullLearn.map((i) => i.trim()).filter(Boolean),
    };

    setLoading(true);
    try {
      const res = await fetch(
        mode === "edit"
          ? `/api/admin/courses/${initialCourse!.id}`
          : "/api/admin/courses",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(
          data?.message ??
            `Could not ${mode === "edit" ? "update" : "create"} course.`
        );
        setLoading(false);
        return;
      }

      toast.success(mode === "edit" ? "Course updated." : "Course created.");
      router.push("/admin/courses");
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
          {mode === "edit" ? "Edit Course" : "Add Course"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "edit"
            ? "Update this course's details."
            : "Create a new course for the catalogue."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Course Details</CardTitle>
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
                  placeholder="4900"
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
                  placeholder="8900"
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
                    endpoint="course-categories"
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
                <Label htmlFor="level">Level (optional)</Label>
                <Input
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  placeholder="Beginner, Intermediate, Advanced..."
                />
                <p className="text-xs text-muted-foreground">
                  Free text — kept simple for now.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor (optional)</Label>
              <Input
                id="instructor"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="Dr. Amara Mensah"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lessonCount">Lesson Count (optional)</Label>
                <Input
                  id="lessonCount"
                  type="number"
                  min={0}
                  step={1}
                  value={lessonCount}
                  onChange={(e) => setLessonCount(e.target.value)}
                  placeholder="24"
                />
                <p className="text-xs text-muted-foreground">
                  Manually entered — no lesson-builder yet.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationLabel">
                  Duration Label (optional)
                </Label>
                <Input
                  id="durationLabel"
                  value={durationLabel}
                  onChange={(e) => setDurationLabel(e.target.value)}
                  placeholder="8h 30m"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>What You&apos;ll Learn (optional)</Label>
              <p className="text-xs text-muted-foreground">
                Shown as a checklist on the course detail page.
              </p>
              <div className="space-y-2">
                {whatYoullLearn.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateWhatYoullLearn(i, e.target.value)}
                      placeholder="Build a complete digital marketing strategy"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeWhatYoullLearn(i)}
                      disabled={whatYoullLearn.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addWhatYoullLearn}>
                <Plus className="h-3.5 w-3.5" />
                Add item
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                items={STATUS_ITEMS}
                value={status}
                onValueChange={(v) => v !== null && setStatus(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
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

            <div className="space-y-2">
              <Label htmlFor="badge">Badge (optional)</Label>
              <Input
                id="badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Bestseller, New, Popular, Top Pick..."
              />
              <p className="text-xs text-muted-foreground">
                Free text shown as a small label on the course card. Leave
                blank for none.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL (optional)</Label>
              <Input
                id="thumbnailUrl"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                No image upload system yet — paste a direct image link.
                Leave blank to use a placeholder.
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading
                  ? mode === "edit"
                    ? "Saving..."
                    : "Creating..."
                  : mode === "edit"
                    ? "Save Changes"
                    : "Create Course"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/courses")}
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