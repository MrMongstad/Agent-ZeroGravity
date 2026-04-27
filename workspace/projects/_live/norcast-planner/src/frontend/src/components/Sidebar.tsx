import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart2, LayoutDashboard, Milestone, Settings } from "lucide-react";
import { useMilestoneStore } from "../store/useMilestoneStore";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/milestones", label: "Milestones", icon: Milestone },
  { path: "/reports", label: "Reports", icon: BarChart2 },
  { path: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const location = useRouterState({ select: (s) => s.location.pathname });
  const projectName = useMilestoneStore((s) => s.projectName);

  return (
    <aside
      className={cn(
        "flex flex-col h-full glass-card border-r border-[rgba(255,255,255,0.08)] transition-smooth",
        collapsed ? "w-16" : "w-60",
      )}
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div
        className={cn(
          "flex items-center gap-3 p-4 border-b border-[rgba(255,255,255,0.06)]",
          collapsed && "justify-center px-0",
        )}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm text-white flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
          }}
          aria-label="NorCast brand mark"
        >
          NC
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display font-bold text-sm text-foreground leading-tight truncate">
              NorCast Planner
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {projectName}
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav
        className="flex-1 py-4 space-y-1 px-2"
        aria-label="Sidebar navigation"
      >
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive =
            path === "/" ? location === "/" : location.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              data-ocid={`nav.${label.toLowerCase()}.link`}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                collapsed ? "justify-center px-0 py-3" : "",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
              )}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle */}
      <div
        className={cn(
          "p-3 border-t border-[rgba(255,255,255,0.06)]",
          collapsed && "flex justify-center",
        )}
      >
        <ThemeToggle compact={collapsed} />
      </div>
    </aside>
  );
}
