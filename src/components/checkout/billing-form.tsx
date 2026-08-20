"use client";

import { Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRIES = ["Kenya", "Nigeria", "Ghana", "South Africa", "Uganda", "Tanzania", "Rwanda"];

export interface BillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  city: string;
  country: string;
}

interface BillingFormProps {
  value: BillingDetails;
  onChange: (value: BillingDetails) => void;
}

export function BillingForm({ value, onChange }: BillingFormProps) {
  function update<K extends keyof BillingDetails>(key: K, val: BillingDetails[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="rounded-xl border bg-gray-50 p-6">
      <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-lg font-bold">
        Billing Address
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" value={value.firstName} onChange={(e) => update("firstName", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={value.lastName} onChange={(e) => update("lastName", e.target.value)} required />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" value={value.email} onChange={(e) => update("email", e.target.value)} required />
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="streetAddress">Street Address</Label>
        <Input
          id="streetAddress"
          value={value.streetAddress}
          onChange={(e) => update("streetAddress", e.target.value)}
          placeholder="123 Business Park Ave"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={value.city} onChange={(e) => update("city", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Select
            value={value.country || "none"}
            onValueChange={(v) => update("country", v === "none" ? "" : v)}
            items={[{ value: "none", label: "Select a country" }, ...COUNTRIES.map((c) => ({ value: c, label: c }))]}
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
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
        <Zap className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Everything in your order is delivered instantly — digital files by direct download and
          courses via immediate account access. No physical shipping.
        </p>
      </div>
    </div>
  );
}