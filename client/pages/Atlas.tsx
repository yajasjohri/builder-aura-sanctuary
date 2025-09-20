import MapView from "@/components/app/MapView";

export default function Atlas() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">FRA Atlas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Focus on Madhya Pradesh, Tripura, Odisha, and Telangana. Upload GeoJSON, filter states, and explore layers.
          </p>
        </div>
        <MapView height={600} />
      </main>
    </div>
  );
}
