import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart2, LayoutDashboard, Milestone, Settings } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/milestones", label: "Milestones", icon: Milestone },
  { path: "/reports", label: "Reports", icon: BarChart2 },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const location = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-[rgba(255,255,255,0.08)] flex items-center justify-around px-2 py-2 print:hidden"
      aria-label="Bottom navigation"
    >
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
        const isActive =
          path === "/" ? location === "/" : location.startsWith(path);
        return (
          <Link
            key={path}
            to={path}
            data-ocid={`bottom_nav.${label.toLowerCase()}.link`}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-smooth",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
