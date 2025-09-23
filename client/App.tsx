import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Atlas from "./pages/Atlas";
import NotFound from "./pages/NotFound";
import Header from "@/components/app/Header";
import Footer from "@/components/app/Footer";
import { Suspense, lazy } from "react";

const DSS = lazy(() => import("./pages/DSS"));
const WebGIS = lazy(() => import("./pages/WebGIS"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-background">
          <Header />
          <div className="flex-1">
            <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dss" element={<DSS />} />
                <Route path="/atlas" element={<Atlas />} />
                <Route path="/webgis" element={<WebGIS />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
