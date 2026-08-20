"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter an email address.");
      return;
    }
    toast.info("Newsletter signup is coming soon — not yet connected.");
    setEmail("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
    >
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address..."
        className="bg-white text-foreground"
      />
      <Button
        type="submit"
        className="flex-none bg-orange-500 hover:bg-orange-600"
      >
        Subscribe Free
      </Button>
    </form>
  );
}