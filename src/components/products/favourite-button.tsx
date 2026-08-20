"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { toggleFavourite } from "@/lib/favourites";
import { cn } from "@/lib/utils";

interface FavouriteButtonProps {
  userId: string;
  productId: string;
  initialFavourited: boolean;
  className?: string;
}

export function FavouriteButton({ userId, productId, initialFavourited, className }: FavouriteButtonProps) {
  const [favourited, setFavourited] = useState(initialFavourited);
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const result = await toggleFavourite(userId, productId);
    setFavourited(result);
    setLoading(false);
    toast.success(result ? "Saved to Favourites" : "Removed from Favourites");
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={favourited ? "Remove from favourites" : "Save to favourites"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", favourited ? "fill-red-500 text-red-500" : "text-gray-400")} />
    </button>
  );
}