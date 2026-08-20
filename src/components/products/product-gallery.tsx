"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  badgeLabel?: string | null;
}

export function ProductGallery({ images, alt, badgeLabel }: ProductGalleryProps) {
  const gallery = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);

  if (gallery.length === 0) {
    return (
      <div className="relative h-64 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 md:h-96" />
    );
  }

  return (
    <div>
      <div className="relative h-64 overflow-hidden rounded-xl bg-gray-100 md:h-96">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gallery[active]} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
        {badgeLabel && (
          <span className="absolute left-3 top-3 rounded-md bg-orange-500 px-2 py-1 text-xs font-medium text-white">
            {badgeLabel}
          </span>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 flex gap-2">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                active === i ? "border-blue-700" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${alt} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}