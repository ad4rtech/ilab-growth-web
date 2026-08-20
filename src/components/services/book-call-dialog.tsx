"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { submitServiceInquiry } from "@/lib/services";

export function BookCallDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
      inquiryType: "call",
      message: "Requested a free discovery call.",
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.message ?? "Could not submit request.");
      return;
    }

    toast.success("Request received! We'll email you to confirm a time.");
    setName("");
    setEmail("");
    setPhone("");
    setOpen(false);
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="mt-8 w-full gap-2 bg-orange-500 py-6 text-base text-white hover:bg-orange-600"
      >
        <Calendar className="h-4 w-4" />
        Book My Free Call
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Your Free Discovery Call</DialogTitle>
            <DialogDescription>
              Share your details and our team will email you to confirm a time — no calendar
              booking yet, but we&apos;ll reach out within 24 hours.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="call-name">Full Name</Label>
              <Input id="call-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="call-email">Email Address</Label>
              <Input
                id="call-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="call-phone">Phone / WhatsApp (optional)</Label>
              <Input id="call-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <Button type="submit" disabled={submitting} className="w-full bg-blue-700 hover:bg-blue-800">
              {submitting ? "Submitting..." : "Request Call"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}