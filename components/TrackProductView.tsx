"use client";

import { useEffect } from "react";

export default function TrackProductView({ product }: { product: any }) {
  useEffect(() => {
    // Get existing items
    const saved = localStorage.getItem("recentlyViewed");
    let items = saved ? JSON.parse(saved) : [];

    // Remove the item if it's already there (so we can move it to the top)
    items = items.filter((item: any) => item.id !== product.id);

    // Add the new item to the beginning of the list
    items.unshift({
      id: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
    });

    // Keep only the last 5 items
    items = items.slice(0, 5);

    // Save back to local storage
    localStorage.setItem("recentlyViewed", JSON.stringify(items));
  }, [product]);

  return null; // This component doesn't render anything visible
}