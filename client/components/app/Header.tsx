import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-background/70">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 shadow-inner" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-emerald-700 group-hover:text-emerald-800 dark:text-emerald-400">
              FRA Atlas
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              AI WebGIS DSS
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {[
            { to: "/", label: "Home" },
            { to: "/dss", label: "DSS" },
            { to: "/atlas", label: "FRA Atlas" },
            { to: "/webgis", label: "WebGIS" },
            { to: "/dashboard", label: "Dashboard" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive: active }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active || isActive(item.to)
                    ? "bg-secondary text-secondary-foreground"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
