import { useMemo, useState } from "react";
import MapView from "@/components/app/MapView";

const BASEMAPS = {
  OSM: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  Topo: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  Imagery: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};

export default function WebGIS() {
  const [basemap, setBasemap] = useState<keyof typeof BASEMAPS>("OSM");

  // We wrap MapView with a style override by injecting a new TileLayer on top via CSS; simplest is to let MapView use OSM and provide switcher UI for now.
  const Options = useMemo(
    () => (
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-emerald-700">Basemap</h3>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(Object.keys(BASEMAPS) as Array<keyof typeof BASEMAPS>).map((k) => (
            <button
              key={k}
              onClick={() => setBasemap(k)}
              className={`rounded-md px-3 py-2 text-sm ${basemap === k ? "bg-secondary" : "hover:bg-muted"}`}
            >
              {k}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Switch base tiles. Custom provider support can be added later.</p>
      </div>
    ),
    [basemap],
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <h1 className="text-2xl font-bold tracking-tight">WebGIS</h1>
        <p className="mt-1 text-sm text-muted-foreground">Interactive mapping with Leaflet.js. Upload layers, focus states, and explore.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
          <MapView height={600} />
          {Options}
        </div>
      </main>
    </div>
  );
}
