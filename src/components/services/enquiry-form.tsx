"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitServiceInquiry } from "@/lib/services";
import type { Service } from "@/lib/services";

interface EnquiryFormProps {
  services: Service[];
  defaultName?: string;
  defaultEmail?: string;
}

export function EnquiryForm({ services, defaultName = "", defaultEmail = "" }: EnquiryFormProps) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    setSubmitting(true);
    const result = await submitServiceInquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      businessName: businessName.trim() || undefined,
      serviceId: serviceId || undefined,
      message: message.trim() || undefined,
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.message ?? "Could not submit enquiry.");
      return;
    }

    toast.success("Enquiry submitted! We'll be in touch within 24 hours.");
    setPhone("");
    setBusinessName("");
    setServiceId("");
    setMessage("");
    if (!defaultName) setName("");
    if (!defaultEmail) setEmail("");
  }

  return (
    <div id="enquiry" className="rounded-2xl border border-orange-100 bg-orange-50 p-8">
      <h3 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold text-gray-900">
        Send Us an Enquiry
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        Tell us about your business and goals — we&apos;ll get back to you within 24 hours.
      </p>

      {(defaultName || defaultEmail) && (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
          <UserCheck className="h-3.5 w-3.5 shrink-0" />
          Your name and email are pre-filled from your profile.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. David Kofi"
              className="bg-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone / WhatsApp</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254 7XX XXX XXX"
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your Company Ltd."
              className="bg-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Service of Interest</Label>
          <Select
            value={serviceId || "none"}
            onValueChange={(v) => setServiceId(v === "none" ? "" : v)}
            items={[{ value: "none", label: "Select a service..." }, ...services.map((s) => ({ value: s.id, label: s.title }))]}
          >
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select a service...</SelectItem>
              {services.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Tell us about your business &amp; goals</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your business, current challenges, and what you hope to achieve..."
            className="bg-white"
            rows={4}
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full gap-2 bg-blue-700 py-6 text-base text-white hover:bg-blue-800"
        >
          <Send className="h-4 w-4" />
          {submitting ? "Submitting..." : "Submit Enquiry"}
        </Button>

        <p className="text-center text-xs text-gray-500">
          We respect your privacy. Your information is never shared with third parties.
        </p>
      </form>
    </div>
  );
}