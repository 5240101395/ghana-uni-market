"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Map...</div>
});

export default function MapWrapper({ lat, lng, title }: { lat: number, lng: number, title: string }) {
  return <MapComponent lat={lat} lng={lng} title={title} />;
}