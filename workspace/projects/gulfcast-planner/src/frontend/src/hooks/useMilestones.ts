import { useMemo } from "react";
import { useMilestoneStore } from "../store/useMilestoneStore";
import type { Milestone } from "../types/milestone";

export function useMilestones() {
  const store = useMilestoneStore();

  const stats = useMemo(() => {
    const total = store.milestones.length;
    const completed = store.milestones.filter(
      (m) => m.status === "completed",
    ).length;
    const inProgress = store.milestones.filter(
      (m) => m.status === "in-progress",
    ).length;
    const upcoming = store.milestones.filter(
      (m) => m.status === "upcoming",
    ).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      total,
      completed,
      inProgress,
      upcoming,
      percent,
      remaining: total - completed,
    };
  }, [store.milestones]);

  return {
    milestones: store.milestones,
    stats,
    addMilestone: store.addMilestone,
    updateMilestone: store.updateMilestone,
    deleteMilestone: store.deleteMilestone,
    setMilestones: store.setMilestones,
  };
}

export type { Milestone };
