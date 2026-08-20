"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { toggleSavePost } from "@/lib/my-blog";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  userId: string;
  blogPostId: string;
  initialSaved: boolean;
  className?: string;
}

export function SaveButton({ userId, blogPostId, initialSaved, className }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const result = await toggleSavePost(userId, blogPostId);
    setSaved(result);
    setLoading(false);
    toast.success(result ? "Saved to your reading list" : "Removed from saved");
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={saved ? "Remove from saved" : "Save for later"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 shadow-sm transition hover:bg-white",
        className,
      )}
    >
      <Bookmark className={cn("h-4 w-4", saved ? "fill-blue-700 text-blue-700" : "text-gray-500")} />
    </button>
  );
}