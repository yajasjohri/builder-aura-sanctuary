import { MapContainer, TileLayer, GeoJSON, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";

type FeatureCollection = { type: "FeatureCollection"; features: any[]; };

export type LayerItem = {
  id: string;
  name: string;
  data: FeatureCollection;
  color?: string;
};

export type StateTarget = {
  name: string;
  center: [number, number]; // [lat, lng]
  zoom?: number;
  bounds?: [[number, number], [number, number]]; // [[southWestLat, southWestLng], [northEastLat, northEastLng]]
};

const STATES: Record<string, StateTarget> = {
  "Madhya Pradesh": { name: "Madhya Pradesh", center: [23.4733, 77.9470], zoom: 6 },
  Tripura: { name: "Tripura", center: [23.9408, 91.9882], zoom: 8 },
  Odisha: { name: "Odisha", center: [20.9517, 85.0985], zoom: 7 },
  Telangana: { name: "Telangana", center: [18.1124, 79.0193], zoom: 7 },
};

const defaultCenter: [number, number] = [22.9734, 78.6569]; // India centroid-ish

export default function MapView({
  initialCenter = defaultCenter,
  height = 420,
  layers: layersProp,
  onLayersChange,
}: {
  initialCenter?: [number, number];
  height?: number;
  layers?: LayerItem[];
  onLayersChange?: (layers: LayerItem[]) => void;
}) {
  const mapRef = useRef<L.Map | null>(null);
  const [internalLayers, setInternalLayers] = useState<LayerItem[]>(layersProp ?? []);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Sync internal state when used in controlled mode
  useEffect(() => {
    if (layersProp) setInternalLayers(layersProp);
  }, [layersProp]);

  const layers = layersProp ?? internalLayers;
  const updateLayers = (next: LayerItem[] | ((prev: LayerItem[]) => LayerItem[])) => {
    const resolved = typeof next === "function" ? (next as (p: LayerItem[]) => LayerItem[])(layers) : next;
    onLayersChange?.(resolved);
    if (!layersProp) setInternalLayers(resolved);
  };

  const handleMapRef = (map: L.Map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    if (!selectedState || !mapRef.current) return;
    const st = STATES[selectedState];
    if (st.bounds) {
      mapRef.current.fitBounds(st.bounds);
    } else if (st.center) {
      mapRef.current.setView(st.center, st.zoom ?? 7, { animate: true });
    }
  }, [selectedState]);

  const stateMarkers = useMemo(() => {
    return Object.values(STATES).map((s) => (
      <CircleMarker key={s.name} center={s.center} radius={6} pathOptions={{ color: "#10b981", fillColor: "#10b981" }} />
    ));
  }, []);

  const onFileUpload = async (file: File) => {
    const text = await file.text();
    const json = JSON.parse(text) as FeatureCollection;
    const color = randomColor();
    updateLayers((prev) => [
      ...prev,
      {
        id: `${file.name}-${Date.now()}`,
        name: file.name.replace(/\.geojson$/i, ""),
        data: json,
        color,
      },
    ]);
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
      <div className="rounded-xl border bg-card shadow-sm">
        <MapContainer
          center={initialCenter}
          zoom={5}
          style={{ height }}
          className="rounded-xl"
          whenCreated={handleMapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {stateMarkers}
          {layers.map((lyr) => (
            <GeoJSON
              key={lyr.id}
              data={lyr.data as any}
              style={() => ({ color: lyr.color ?? "#2563eb", weight: 2, fillOpacity: 0.2 })}
              onEachFeature={(_f, l) => {
                l.bindTooltip(lyr.name, { direction: "top", opacity: 0.8 });
              }}
            />
          ))}
        </MapContainer>
      </div>
      <aside className="rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-emerald-700">Focus States</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {Object.keys(STATES).map((name) => (
            <button
              key={name}
              onClick={() => setSelectedState(name)}
              className="rounded-md border bg-muted px-3 py-2 text-left text-sm hover:bg-secondary"
            >
              {name}
            </button>
          ))}
        </div>
        <div className="mt-4 h-px w-full bg-border" />
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-emerald-700">Layers</h4>
          <ul className="mt-2 space-y-2">
            {layers.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: l.color }} />
                  {l.name}
                </span>
                <button
                  onClick={() => updateLayers((prev) => prev.filter((x) => x.id !== l.id))}
                  className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                >
                  Remove
                </button>
              </li>
            ))}
            {layers.length === 0 && (
              <li className="text-sm text-muted-foreground">No layers added yet</li>
            )}
          </ul>
          <UploadGeoJSON onUpload={onFileUpload} />
        </div>
      </aside>
    </div>
  );
}

function UploadGeoJSON({ onUpload }: { onUpload: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="mt-3">
      <input
        ref={inputRef}
        type="file"
        accept=".geojson,application/geo+json,application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="mt-2 w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
      >
        Add GeoJSON Layer
      </button>
      <p className="mt-2 text-xs text-muted-foreground">
        Upload GeoJSON exported from QGIS. Layers are rendered with unique colors.
      </p>
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
