"use client";

// src/components/blog/share-button.tsx
// Real functionality (not a "coming soon" stub) — uses the native Web Share
// API where available, falls back to copying the link to the clipboard.
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  slug: string;
  title: string;
}

export function ShareButton({ slug, title }: ShareButtonProps) {
  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    const url = `${window.location.origin}/blog/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the share sheet — no-op
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy link. Please copy it from the address bar.");
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
    >
      <Share2 className="h-3.5 w-3.5" />
      Share
    </button>
  );
}