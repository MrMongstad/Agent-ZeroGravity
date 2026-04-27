import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "@tanstack/react-router";
import { useTheme } from "../hooks/useTheme";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function Layout() {
  useTheme(); // ensures html class stays in sync

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Ambient glow layer */}
      <div className="glow-bg" aria-hidden="true" />
      {/* Dot grid overlay */}
      <div
        className="dot-grid fixed inset-0 pointer-events-none z-0 opacity-60"
        aria-hidden="true"
      />

      {/* Desktop layout: fixed sidebar + scrollable main */}
      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Desktop full sidebar (1024px+) */}
        <div className="hidden lg:flex flex-shrink-0 h-full print:hidden">
          <Sidebar collapsed={false} />
        </div>

        {/* Tablet collapsed sidebar (768â€“1023px) */}
        <div className="hidden md:flex lg:hidden flex-shrink-0 h-full print:hidden">
          <Sidebar collapsed={true} />
        </div>

        {/* Main scrollable content */}
        <main
          className="flex-1 overflow-y-auto pb-20 md:pb-0 flex flex-col"
          id="main-content"
          aria-label="Main content"
        >
          <div className="flex-1">
            <Outlet />
          </div>
          {/* Branding footer */}
          <footer className="px-6 py-3 text-center text-xs text-muted-foreground/60 print:hidden border-t border-border/20">
            Â© {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth underline underline-offset-2"
            >
              Built with love using caffeine.ai
            </a>
          </footer>
        </main>
      </div>

      {/* Mobile bottom nav (<768px) */}
      <div className="md:hidden print:hidden">
        <BottomNav />
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}
