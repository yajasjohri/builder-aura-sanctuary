import { useMemo, useState } from "react";
import type { LayerItem } from "./MapView";

export default function SmartHelpPanel({ layers }: { layers: LayerItem[] }) {
  const [primaryLayerId, setPrimaryLayerId] = useState<string | null>(layers[0]?.id ?? null);
  const [secondaryLayerId, setSecondaryLayerId] = useState<string | null>(layers[1]?.id ?? null);

  const primary = useMemo(() => layers.find((l) => l.id === primaryLayerId) ?? null, [layers, primaryLayerId]);
  const secondary = useMemo(() => layers.find((l) => l.id === secondaryLayerId) ?? null, [layers, secondaryLayerId]);

  const [output, setOutput] = useState<string>("Use Smart Rules to analyze your data.");

  const runLandUse = () => {
    if (!primary) {
      setOutput("Select a layer first.");
      return;
    }
    const counts: Record<string, number> = {};
    for (const f of primary.data.features) {
      const props = (f as any).properties || {};
      const value =
        props.land_use ?? props.landuse ?? props.landUse ?? props.category ?? props.class ?? "Unknown";
      const key = String(value).trim() || "Unknown";
      counts[key] = (counts[key] ?? 0) + 1;
    }
    const total = primary.data.features.length;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const lines = [
      `Land Use summary for "${primary.name}" (features: ${total}):`,
      ...sorted.map(([k, v]) => `- ${k}: ${v} (${((v / total) * 100).toFixed(1)}%)`),
    ];
    setOutput(lines.join("\n"));
  };

  const runDetectChanges = () => {
    if (!primary || !secondary) {
      setOutput("Select two layers to compare.");
      return;
    }
    const a = primary.data.features as any[];
    const b = secondary.data.features as any[];

    const countDelta = a.length - b.length;

    const indexById = (arr: any[]) => {
      const map = new Map<string, any>();
      for (const f of arr) {
        const id = f.id ?? f.properties?.id ?? f.properties?.claim_id ?? f.properties?.gid ?? null;
        if (id != null) map.set(String(id), f);
      }
      return map;
    };

    const A = indexById(a);
    const B = indexById(b);

    const changed: string[] = [];
    if (A.size && B.size) {
      for (const [id, fa] of A) {
        const fb = B.get(id);
        if (!fb) continue;
        const pa = fa.properties || {};
        const pb = fb.properties || {};
        const keys = new Set([...Object.keys(pa), ...Object.keys(pb)]);
        for (const k of keys) {
          if (pa[k] !== pb[k]) {
            changed.push(`${id}: ${k} ${String(pa[k])} → ${String(pb[k])}`);
          }
        }
      }
    }

    const lines = [
      `Change detection between "${primary.name}" and "${secondary.name}":`,
      `- Feature count delta: ${countDelta > 0 ? "+" : ""}${countDelta}`,
      A.size && B.size
        ? `- Matched by id: ${Math.min(A.size, B.size)}. Changed fields: ${changed.length}`
        : "- No matching ids found; compared by counts only.",
      ...changed.slice(0, 50).map((c) => `  • ${c}`),
      changed.length > 50 ? `  …and ${changed.length - 50} more` : "",
    ].filter(Boolean);

    setOutput(lines.join("\n"));
  };

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-emerald-700">Smart Help</h3>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Select
          label="Primary layer"
          value={primaryLayerId ?? ""}
          onChange={setPrimaryLayerId}
          options={layers.map((l) => ({ label: l.name, value: l.id }))}
        />
        <Select
          label="Secondary layer"
          value={secondaryLayerId ?? ""}
          onChange={setSecondaryLayerId}
          options={layers.map((l) => ({ label: l.name, value: l.id }))}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={runLandUse} className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
          Find Land Use
        </button>
        <button onClick={runDetectChanges} className="rounded-md border px-3 py-2 text-xs font-semibold hover:bg-muted">
          Detect Changes
        </button>
      </div>
      <pre className="mt-3 max-h-64 overflow-auto rounded-md bg-muted p-3 text-xs text-foreground/90">
        {output}
      </pre>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border bg-background px-2 py-2 text-sm"
      >
        <option value="">—</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
