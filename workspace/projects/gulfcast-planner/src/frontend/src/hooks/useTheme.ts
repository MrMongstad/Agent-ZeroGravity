import { useEffect } from "react";
import { useMilestoneStore } from "../store/useMilestoneStore";

export function useTheme() {
  const { theme, toggleTheme, setTheme } = useMilestoneStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return { theme, toggleTheme, setTheme, isDark: theme === "dark" };
}
