import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

interface ThemeToggleProps {
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={compact ? "icon" : "sm"}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-ocid="theme.toggle"
      className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
      title="Toggle theme (D)"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      {!compact && (
        <span className="ml-2 text-xs">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </Button>
  );
}
