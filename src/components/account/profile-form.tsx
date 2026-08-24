"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/lib/auth-client";

const COUNTRIES = ["Kenya", "Nigeria", "Ghana", "South Africa", "Uganda", "Tanzania", "Rwanda"];
const INDUSTRIES = [
  "Creative & Design",
  "Retail & E-commerce",
  "Food & Beverage",
  "Tech & Digital",
  "Agriculture",
  "Manufacturing",
  "Services",
  "Other",
];
const BUSINESS_STAGES = ["Idea Stage", "Just Starting (0–1 years)", "Growing (1–3 years)", "Established (3+ years)"];

interface ProfileFormProps {
  initial: {
    firstName: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
    phone: string;
    country: string;
    city: string;
    businessName: string;
    industry: string;
    businessStage: string;
    imageUrl: string;
    updatedAt: string | null;
  };
}

export function ProfileForm({ initial }: ProfileFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [phone, setPhone] = useState(initial.phone);
  const [country, setCountry] = useState(initial.country);
  const [city, setCity] = useState(initial.city);
  const [businessName, setBusinessName] = useState(initial.businessName);
  const [industry, setIndustry] = useState(initial.industry);
  const [businessStage, setBusinessStage] = useState(initial.businessStage);
  const [imageUrl, setImageUrl] = useState(initial.imageUrl);
  const [saving, setSaving] = useState(false);

  function discardChanges() {
    setFirstName(initial.firstName);
    setLastName(initial.lastName);
    setPhone(initial.phone);
    setCountry(initial.country);
    setCity(initial.city);
    setBusinessName(initial.businessName);
    setIndustry(initial.industry);
    setBusinessStage(initial.businessStage);
    setImageUrl(initial.imageUrl);
    toast.info("Changes discarded.");
  }

  async function handleSave() {
    setSaving(true);
    try {
      const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
      const { error } = await updateUser({
        name: fullName || undefined,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        phone: phone.trim() || undefined,
        country: country || undefined,
        city: city.trim() || undefined,
        businessName: businessName.trim() || undefined,
        industry: industry || undefined,
        businessStage: businessStage || undefined,
        image: imageUrl.trim() || undefined,
      });

      if (error) {
        toast.error(error.message ?? "Could not save changes.");
        return;
      }

      toast.success("Profile updated.");
      router.refresh();
    } catch {
      toast.error("Network error. Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemovePhoto() {
    setSaving(true);
    try {
      const { error } = await updateUser({ image: null });
      if (error) {
        toast.error(error.message ?? "Could not remove photo.");
        return;
      }
      setImageUrl("");
      toast.success("Photo removed.");
      router.refresh();
    } catch {
      toast.error("Network error. Could not remove photo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
          Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and how it appears on your account.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-bold text-gray-900">Profile Photo</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-lg font-bold text-blue-700">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              (firstName[0] ?? "") + (lastName[0] ?? "")
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... (paste an image URL)"
            />
            <p className="text-xs text-muted-foreground">
              No file upload system yet — paste a direct image link. JPG, PNG, or GIF.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={handleRemovePhoto} disabled={saving || !imageUrl}>
            Remove photo
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-bold text-gray-900">Personal Information</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label>Email Address</Label>
          <div className="flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2">
            <span className="flex-1 text-sm text-gray-500">{initial.email}</span>
            {initial.emailVerified && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Email can only be changed after re-verification. Contact support if needed.
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0712 345 678"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select
              value={country || "none"}
              onValueChange={(v) => setCountry(v && v !== "none" ? v : "")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select a country</SelectItem>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Nairobi" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-bold text-gray-900">Business Information</h2>
        <div className="mt-4 space-y-2">
          <Label htmlFor="businessName">Business / Brand Name</Label>
          <Input
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Your Business Ltd."
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Industry</Label>
            <Select
              value={industry || "none"}
              onValueChange={(v) => setIndustry(v && v !== "none" ? v : "")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select an industry</SelectItem>
                {INDUSTRIES.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Business Stage</Label>
            <Select
              value={businessStage || "none"}
              onValueChange={(v) => setBusinessStage(v && v !== "none" ? v : "")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select a stage</SelectItem>
                {BUSINESS_STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          {initial.updatedAt
            ? `Last updated: ${new Date(initial.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
            : "Not yet saved"}
        </p>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={discardChanges} disabled={saving}>
            Discard changes
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving} className="bg-blue-700 hover:bg-blue-800">
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}