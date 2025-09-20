import MapView from "@/components/app/MapView";

import { useState } from "react";
import type { LayerItem } from "@/components/app/MapView";
import SmartHelpPanel from "@/components/app/SmartHelpPanel";

export default function Atlas() {
  const [layers, setLayers] = useState<LayerItem[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">FRA Atlas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Focus on Madhya Pradesh, Tripura, Odisha, and Telangana. Upload GeoJSON, filter states, and explore layers.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
          <MapView height={600} layers={layers} onLayersChange={setLayers} />
          <SmartHelpPanel layers={layers} />
        </div>
      </main>
    </div>
  );
}
