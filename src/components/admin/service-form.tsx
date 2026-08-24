"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_ICON_OPTIONS, ServiceIcon } from "@/components/admin/service-icon";
import { ManageServiceCategoriesDialog } from "@/components/admin/manage-service-categories-dialog";
import type { NamedItem } from "@/components/manage-list-dialog";
import type { AdminService } from "@/lib/services-admin";

const STATUS_ITEMS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

interface ServiceFormProps {
  initial?: AdminService; // present when editing (form is create/edit-agnostic)
}

export function ServiceForm({ initial }: ServiceFormProps) {
  const router = useRouter();
  const isEdit = !!initial;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>(
    initial?.whatsIncluded?.length ? initial.whatsIncluded : [""],
  );
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "Briefcase");
  const [isCustomQuote, setIsCustomQuote] = useState(initial ? initial.price === null : false);
  const [price, setPrice] = useState(initial?.price != null ? String(initial.price) : "");
  const [ctaLabel, setCtaLabel] = useState(initial?.ctaLabel ?? "");
  const [badge, setBadge] = useState(initial?.badge ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [serviceType, setServiceType] = useState(initial?.serviceType ?? "");
  const [status, setStatus] = useState(initial?.status ?? "published");
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState<NamedItem[]>([]);
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);

  function loadCategories() {
    fetch("/api/admin/categories?type=service")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: NamedItem[]) => setCategories(data))
      .catch(() => setCategories([]));
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function updateItem(i: number, value: string) {
    setWhatsIncluded((prev) => prev.map((item, idx) => (idx === i ? value : item)));
  }
  function addItem() {
    setWhatsIncluded((prev) => [...prev, ""]);
  }
  function removeItem(i: number) {
    setWhatsIncluded((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        description: description.trim() || undefined,
        whatsIncluded: whatsIncluded.map((i) => i.trim()).filter(Boolean),
        duration: duration.trim() || undefined,
        icon,
        price: isCustomQuote ? undefined : price ? parseInt(price, 10) : undefined,
        ctaLabel: ctaLabel.trim() || undefined,
        badge: badge.trim() || undefined,
        category: category || undefined,
        serviceType: serviceType.trim() || undefined,
        status,
      };

      const url = isEdit ? `/api/admin/services/${initial!.id}` : "/api/admin/services";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.message ?? "Could not save service.");
        return;
      }

      toast.success(`"${title}" ${isEdit ? "updated" : "created"}.`);
      router.push("/admin/services");
      router.refresh();
    } catch {
      toast.error("Network error. Could not save service.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle (short tagline)</Label>
          <Input
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Personalised strategy for your growth stage"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>

      <div className="space-y-2">
        <Label>What&apos;s Included</Label>
        <div className="space-y-2">
          {whatsIncluded.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={item} onChange={(e) => updateItem(i, e.target.value)} placeholder="Initial business audit" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeItem(i)}
                disabled={whatsIncluded.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addItem}>
          <Plus className="h-3.5 w-3.5" />
          Add item
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration / Time</Label>
          <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="4 weeks" />
        </div>

        <div className="space-y-2">
          <Label>Icon</Label>
          <Select value={icon} onValueChange={(v) => v !== null && setIcon(v)} items={SERVICE_ICON_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}>
            <SelectTrigger>
              <SelectValue>
                <span className="flex items-center gap-2">
                  <ServiceIcon name={icon} className="h-4 w-4" />
                  {icon}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SERVICE_ICON_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  <span className="flex items-center gap-2">
                    <o.Icon className="h-4 w-4" />
                    {o.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => v !== null && setStatus(v)} items={STATUS_ITEMS}>
            <SelectTrigger>
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Pricing</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="customQuote"
              checked={isCustomQuote}
              onCheckedChange={(v) => setIsCustomQuote(v === true)}
            />
            <Label htmlFor="customQuote" className="font-normal">
              Custom quote (no fixed price — e.g. Corporate Training)
            </Label>
          </div>
          {!isCustomQuote && (
            <Input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="199"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ctaLabel">CTA Button Label</Label>
          <Input
            id="ctaLabel"
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            placeholder={isCustomQuote ? "Request a Quote" : "Book a Session"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="badge">Badge (e.g. &quot;Most Popular&quot;)</Label>
          <Input id="badge" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Leave blank for no badge" />
          <p className="text-xs text-muted-foreground">
            Setting a badge also gives this card the highlighted blue border and solid CTA button.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Category</Label>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto gap-1 p-0 text-xs"
              onClick={() => setCategoriesDialogOpen(true)}
            >
              <Tag className="h-3 w-3" />
              Manage Categories
            </Button>
          </div>
          <Select
            value={category || "none"}
            onValueChange={(v) => setCategory(v && v !== "none" ? v : "")}
            items={[{ value: "none", label: "No category" }, ...categories.map((c) => ({ value: c.name, label: c.name }))]}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No category</SelectItem>
              {categories.length === 0 ? (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">
                  None yet — use &quot;Manage Categories&quot; to add one.
                </p>
              ) : (
                categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type</Label>
          <Input id="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t pt-4">
        <Button type="submit" className="bg-blue-700 hover:bg-blue-800" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Service"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/services")}>
          Cancel
        </Button>
      </div>

      <ManageServiceCategoriesDialog
        open={categoriesDialogOpen}
        onOpenChange={setCategoriesDialogOpen}
        onCategoriesChanged={loadCategories}
      />
    </form>
  );
}