import { useEffect } from "react";
import { useMilestoneStore } from "../store/useMilestoneStore";

type ShortcutHandlers = {
  onNewMilestone?: () => void;
  onCloseModal?: () => void;
};

export function useKeyboardShortcuts(handlers: ShortcutHandlers = {}) {
  const toggleTheme = useMilestoneStore((s) => s.toggleTheme);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      const isInput = ["input", "textarea", "select"].includes(tag);

      if (e.key === "Escape") {
        handlers.onCloseModal?.();
        return;
      }

      if (isInput) return;

      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        toggleTheme();
      } else if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        handlers.onNewMilestone?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme, handlers.onNewMilestone, handlers.onCloseModal]);
}
