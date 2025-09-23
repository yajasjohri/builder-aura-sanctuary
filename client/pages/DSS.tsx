import { useState } from "react";
import SmartHelpPanel from "@/components/app/SmartHelpPanel";
import type { LayerItem } from "@/components/app/MapView";

export default function DSS() {
  const [layers, setLayers] = useState<LayerItem[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Decision Support System
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload one or two GeoJSON layers to run land use summaries and change
          detection with transparent Smart Rules.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <UploadZone onLayers={setLayers} />
            <ul className="mt-4 space-y-2 text-sm">
              {layers.map((l) => (
                <li key={l.id} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: l.color }}
                    />
                    {l.name}
                  </span>
                </li>
              ))}
              {layers.length === 0 && (
                <li className="text-muted-foreground">
                  No layers uploaded yet.
                </li>
              )}
            </ul>
          </div>
          <SmartHelpPanel layers={layers} />
        </div>
      </main>
    </div>
  );
}

function UploadZone({ onLayers }: { onLayers: (layers: LayerItem[]) => void }) {
  const [list, setList] = useState<LayerItem[]>([]);

  const addFile = async (file: File) => {
    const text = await file.text();
    const json = JSON.parse(text);
    const color = randomColor();
    const layer: LayerItem = {
      id: `${file.name}-${Date.now()}`,
      name: file.name.replace(/\.geojson$/i, ""),
      data: json,
      color,
    };
    const next = [...list, layer];
    setList(next);
    onLayers(next);
  };

  return (
    <div>
      <div
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) addFile(f);
        }}
        onDragOver={(e) => e.preventDefault()}
        className="grid place-items-center rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground"
      >
        Drag & drop GeoJSON here or
        <label className="ml-1 cursor-pointer text-emerald-700 underline">
          browse
          <input
            type="file"
            accept=".geojson,application/geo+json,application/json"
            className="sr-only"
            onChange={(e) => {
              const fl = e.target.files?.[0];
              if (fl) addFile(fl);
            }}
          />
        </label>
      </div>
    </div>
  );
}

function randomColor() {
  const hues = [152, 189, 28, 210, 340, 260];
  const h = hues[Math.floor(Math.random() * hues.length)];
  const s = 70;
  const l = 45;
  return `hsl(${h} ${s}% ${l}%)`;
}
