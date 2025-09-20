export default function Footer() {
  return (
    <footer className="border-t bg-white/60 dark:bg-background/70">
      <div className="container flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} FRA Atlas & WebGIS DSS. All rights reserved.
        </p>
        <div className="text-xs text-muted-foreground">
          Built with Leaflet.js • GeoJSON • Python/Flask • QGIS • AI Smart Rules
        </div>
      </div>
    </footer>
  );
}
