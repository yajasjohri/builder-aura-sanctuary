import { useMemo, useState } from "react";
import {
  claims as initial,
  statsByState,
  STATES,
  type Claim,
} from "@/data/mock-claims";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Dashboard() {
  const [stateFilter, setStateFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered: Claim[] = useMemo(() => {
    return initial.filter(
      (c) =>
        (stateFilter === "All" || c.state === stateFilter) &&
        [c.id, c.claimant, c.village, c.status, c.state]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
    );
  }, [stateFilter, search]);

  const stats = useMemo(() => statsByState(filtered), [filtered]);
  const totals = useMemo(
    () => ({
      Pending: filtered.filter((c) => c.status === "Pending").length,
      Claimed: filtered.filter((c) => c.status === "Claimed").length,
      Rejected: filtered.filter((c) => c.status === "Rejected").length,
    }),
    [filtered],
  );

  const chartData = (STATES as readonly string[]).map((s) => ({
    state: s,
    Pending: stats[s as keyof typeof stats]?.Pending ?? 0,
    Claimed: stats[s as keyof typeof stats]?.Claimed ?? 0,
    Rejected: stats[s as keyof typeof stats]?.Rejected ?? 0,
  }));

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <h1 className="text-2xl font-bold tracking-tight">Claims Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track pending, claimed, and rejected claims across focus states.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <KPI
            label="Pending"
            value={totals.Pending}
            tone="bg-amber-100 text-amber-900"
          />
          <KPI
            label="Claimed"
            value={totals.Claimed}
            tone="bg-emerald-100 text-emerald-900"
          />
          <KPI
            label="Rejected"
            value={totals.Rejected}
            tone="bg-rose-100 text-rose-900"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Claimed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="Rejected"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-emerald-700">Filters</h3>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <label className="text-xs">
                <span className="mb-1 block text-muted-foreground">State</span>
                <select
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs">
                <span className="mb-1 block text-muted-foreground">Search</span>
                <input
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Search by id, claimant, village..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <Th>ID</Th>
                <Th>Claimant</Th>
                <Th>Village</Th>
                <Th>State</Th>
                <Th>Area (ha)</Th>
                <Th>Status</Th>
                <Th>Submitted</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t">
                  <Td>{c.id}</Td>
                  <Td>{c.claimant}</Td>
                  <Td>{c.village}</Td>
                  <Td>{c.state}</Td>
                  <Td>{c.areaHa.toFixed(2)}</Td>
                  <Td>
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-medium ${
                        c.status === "Pending"
                          ? "bg-amber-100 text-amber-900"
                          : c.status === "Claimed"
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-rose-100 text-rose-900"
                      }`}
                    >
                      {c.status}
                    </span>
                  </Td>
                  <Td>{new Date(c.submittedAt).toLocaleDateString()}</Td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <Td colSpan={7} className="text-center text-muted-foreground">
                    No rows match filters.
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function KPI({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={`mt-1 inline-flex rounded-md px-2 py-1 text-lg font-bold ${tone}`}
      >
        {value}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
      {children}
    </th>
  );
}
function Td({
  children,
  colSpan,
  className,
}: {
  children: React.ReactNode;
  colSpan?: number;
  className?: string;
}) {
  return (
    <td colSpan={colSpan} className={`px-4 py-3 ${className ?? ""}`}>
      {children}
    </td>
  );
}
