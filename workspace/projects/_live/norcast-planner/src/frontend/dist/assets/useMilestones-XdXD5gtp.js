import { u as useMilestoneStore, r as reactExports } from "./index-DEWk5_GT.js";
function useMilestones() {
  const store = useMilestoneStore();
  const stats = reactExports.useMemo(() => {
    const total = store.milestones.length;
    const completed = store.milestones.filter(
      (m) => m.status === "completed"
    ).length;
    const inProgress = store.milestones.filter(
      (m) => m.status === "in-progress"
    ).length;
    const upcoming = store.milestones.filter(
      (m) => m.status === "upcoming"
    ).length;
    const percent = total > 0 ? Math.round(completed / total * 100) : 0;
    return {
      total,
      completed,
      inProgress,
      upcoming,
      percent,
      remaining: total - completed
    };
  }, [store.milestones]);
  return {
    milestones: store.milestones,
    stats,
    addMilestone: store.addMilestone,
    updateMilestone: store.updateMilestone,
    deleteMilestone: store.deleteMilestone,
    setMilestones: store.setMilestones
  };
}
export {
  useMilestones as u
};
