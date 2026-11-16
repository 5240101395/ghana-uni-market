"use client";

import { useState } from "react";

export default function ImageGallery({ images, title }: { images: string[], title: string }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-slate-100 flex items-center justify-center text-slate-400 rounded-xl">
        No Image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <img src={activeImage} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                activeImage === img ? "border-blue-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`${title} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}