import { useEffect, useState } from "react";
import MapView from "@/components/app/MapView";
import { Link } from "react-router-dom";

export default function Index() {
  const [exampleFromServer, setExampleFromServer] = useState("");
  useEffect(() => {
    fetchDemo();
  }, []);

  const fetchDemo = async () => {
    try {
      const response = await fetch("/api/demo");
      const data = (await response.json()) as { message: string };
      setExampleFromServer(data.message);
    } catch (error) {
      console.error("Error fetching demo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-background">
      <main>
        {/* Hero */}
        <section className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1000px_500px_at_50%_-20%,hsl(var(--accent)/0.15),transparent)]" />
          <div className="container py-14 sm:py-18 lg:py-22">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-border">
                  AI-powered FRA Atlas & WebGIS DSS
                </div>
                <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
                  Integrated Monitoring of the Forest Rights Act
                </h1>
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  A modern decision support system for states of Madhya Pradesh, Tripura, Odisha,
                  and Telangana. Upload GeoJSON from QGIS, visualize with Leaflet.js, and leverage
                  AI-driven smart rules for land-use insights and change detection.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a href="#atlas" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-95">
                    Open Atlas
                  </a>
                  <Link to="/atlas" className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-muted">
                    Full-screen WebGIS
                  </Link>
                </div>
                {exampleFromServer && (
                  <p className="mt-3 text-xs text-muted-foreground">{exampleFromServer}</p>
                )}

                <div className="mt-8 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <TechPill label="QGIS" />
                  <TechPill label="GeoJSON" />
                  <TechPill label="Python" />
                  <TechPill label="Flask" />
                  <TechPill label="Leaflet.js" />
                  <TechPill label="AI" />
                  <TechPill label="Smart Rules" />
                  <TechPill label="WebGIS" />
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-emerald-200/40 to-emerald-100/20 blur-2xl" />
                <div className="overflow-hidden rounded-xl border bg-card shadow-xl" id="atlas">
                  <MapView height={420} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sections: Prepare, Server, WebGIS, Smart Help */}
        <section className="container py-10 sm:py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              title="Prepare"
              subtitle="QGIS + Spreadsheet"
              points={[
                "Digitize and validate layers in QGIS",
                "Export clean GeoJSON for the server",
                "Organize claims and attributes in Sheets/Excel",
              ]}
            />
            <InfoCard
              title="Server"
              subtitle="GeoJSON + Python + Flask"
              points={[
                "Serve versioned GeoJSON via APIs",
                "Authenticate and log operations",
                "Automate ETL pipelines for updates",
              ]}
            />
            <InfoCard
              title="WebGIS"
              subtitle="Leaflet.js + HTML/CSS/JS"
              points={[
                "Interactive basemaps & overlays",
                "State filters for MP, Tripura, Odisha, Telangana",
                "Upload custom layers on the fly",
              ]}
            />
            <InfoCard
              title="Smart Help"
              subtitle="AI + Smart Rules"
              points={[
                "Find land use from attributes",
                "Detect changes across versions",
                "Explain recommendations with transparent rules",
              ]}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function TechPill({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-emerald-700 shadow-sm dark:bg-card">
      <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
      {label}
    </div>
  );
}

function InfoCard({
  title,
  subtitle,
  points,
}: {
  title: string;
  subtitle: string;
  points: string[];
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-emerald-700">{subtitle}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
