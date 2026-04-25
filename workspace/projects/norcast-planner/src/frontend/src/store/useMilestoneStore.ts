import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Milestone } from "../types/milestone";
import { DEFAULT_MILESTONES } from "../types/milestone";

interface MilestoneStore {
  milestones: Milestone[];
  theme: "dark" | "light";
  projectName: string;
  initialized: boolean;

  setMilestones: (milestones: Milestone[]) => void;
  addMilestone: (milestone: Omit<Milestone, "id" | "step">) => void;
  updateMilestone: (id: number, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: number) => void;
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
  setProjectName: (name: string) => void;
  resetToDefaults: () => void;
}

export const useMilestoneStore = create<MilestoneStore>()(
  persist(
    (set, get) => ({
      milestones: DEFAULT_MILESTONES,
      theme: "dark",
      projectName: "NorCast 2026",
      initialized: true,

      setMilestones: (milestones) => set({ milestones }),

      addMilestone: (data) => {
        const { milestones } = get();
        const maxId =
          milestones.length > 0 ? Math.max(...milestones.map((m) => m.id)) : 0;
        const newStep = String(maxId + 1).padStart(2, "0");
        const newMilestone: Milestone = {
          ...data,
          id: maxId + 1,
          step: newStep,
        };
        set({ milestones: [...milestones, newMilestone] });
      },

      updateMilestone: (id, updates) => {
        const { milestones } = get();
        set({
          milestones: milestones.map((m) =>
            m.id === id ? { ...m, ...updates } : m,
          ),
        });
      },

      deleteMilestone: (id) => {
        const { milestones } = get();
        const filtered = milestones.filter((m) => m.id !== id);
        // Re-number steps
        const renumbered = filtered.map((m, i) => ({
          ...m,
          step: String(i + 1).padStart(2, "0"),
        }));
        set({ milestones: renumbered });
      },

      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
        document.documentElement.classList.toggle("dark", next === "dark");
      },

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle("dark", theme === "dark");
      },

      setProjectName: (name) => set({ projectName: name }),

      resetToDefaults: () => {
        set({ milestones: DEFAULT_MILESTONES, projectName: "NorCast 2026" });
      },
    }),
    {
      name: "NorCast-planner",
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle(
            "dark",
            state.theme === "dark",
          );
        }
      },
    },
  ),
);
