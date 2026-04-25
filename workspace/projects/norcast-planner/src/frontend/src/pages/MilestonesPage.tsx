import { cn } from "@/lib/utils";
import {
  CalendarDays,
  CheckCircle2,
  Edit2,
  Plus,
  SortAsc,
  SortDesc,
  Trash2,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { MilestoneModal } from "../components/MilestoneModal";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useMilestones } from "../hooks/useMilestones";
import { COLOR_MAP, STATUS_LABELS } from "../types/milestone";
import type { Milestone, MilestoneStatus } from "../types/milestone";

type FilterType = "all" | MilestoneStatus;

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "in-progress", label: "In Progress" },
  { value: "upcoming", label: "Upcoming" },
];

/** Labels map that safely includes "all" to avoid undefined rendering */
const FILTER_LABELS: Record<FilterType, string> = {
  all: "All",
  completed: STATUS_LABELS.completed,
  "in-progress": STATUS_LABELS["in-progress"],
  upcoming: STATUS_LABELS.upcoming,
};

const STATUS_STYLES: Record<MilestoneStatus, string> = {
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "in-progress": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  upcoming: "bg-sky-500/15 text-sky-400 border-sky-500/30",
};

/** Reusable gradient pill button */
function GradientBtn({
  onClick,
  "aria-label": ariaLabel,
  "data-ocid": ocid,
  children,
  className,
}: {
  onClick: () => void;
  "aria-label": string;
  "data-ocid"?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      data-ocid={ocid}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-white transition-smooth hover:scale-[1.02] active:scale-95 shadow-lg",
        className,
      )}
      style={{
        background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
        boxShadow: "0 4px 20px rgba(167,139,250,0.35)",
      }}
    >
      {children}
    </button>
  );
}

/** Individual milestone card with inline delete confirmation */
function MilestoneCard({
  milestone,
  index,
  onEdit,
  onDelete,
}: {
  milestone: Milestone;
  index: number;
  onEdit: (m: Milestone) => void;
  onDelete: (id: number) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const colors = COLOR_MAP[milestone.color];

  const formattedDate = new Date(
    `${milestone.date}T00:00:00`,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{
        delay: index * 0.045,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ scale: 1.01, transition: { duration: 0.12 } }}
      className="glass-card rounded-2xl overflow-hidden group relative cursor-default"
      style={{ borderLeft: `3px solid ${colors.hex}` }}
      data-ocid={`milestones.item.${index + 1}`}
    >
      <div className="p-4 sm:p-5 flex items-start gap-4">
        {/* Step badge */}
        <div className="bg-background dark:bg-transparent rounded-xl shadow-sm">
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center font-display font-black text-sm border-2 flex-shrink-0 transition-smooth group-hover:scale-[1.04] bg-card/40 backdrop-blur-md",
              colors.border,
              colors.bg,
            )}
            style={{ boxShadow: `0 0 14px rgba(${colors.glow}, 0.35)` }}
            aria-label={`Step ${milestone.step}`}
          >
            <span style={{ color: colors.hex }}>{milestone.step}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs border font-medium",
                STATUS_STYLES[milestone.status],
              )}
            >
              {STATUS_LABELS[milestone.status]}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays size={11} />
              {formattedDate}
            </span>
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: colors.hex,
                boxShadow: `0 0 6px rgba(${colors.glow}, 0.6)`,
              }}
              aria-label={`${colors.label} accent color`}
            />
          </div>
          <h3 className="font-display font-bold text-sm text-foreground leading-snug">
            {milestone.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {milestone.desc}
          </p>
        </div>

        {/* Actions — hover reveal with inline confirm */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <AnimatePresence mode="wait" initial={false}>
            {confirming ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1"
              >
                <span className="text-xs text-muted-foreground mr-1 hidden sm:inline whitespace-nowrap">
                  Delete?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(milestone.id);
                    setConfirming(false);
                  }}
                  aria-label="Confirm delete"
                  data-ocid={`milestones.confirm_button.${index + 1}`}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/35 transition-smooth text-xs font-semibold"
                >
                  <CheckCircle2 size={13} />
                  <span className="hidden sm:inline">Yes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  aria-label="Cancel delete"
                  data-ocid={`milestones.cancel_button.${index + 1}`}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-smooth text-xs font-semibold"
                >
                  <XCircle size={13} />
                  <span className="hidden sm:inline">No</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="icons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth"
              >
                <button
                  type="button"
                  onClick={() => onEdit(milestone)}
                  aria-label={`Edit ${milestone.title}`}
                  data-ocid={`milestones.edit_button.${index + 1}`}
                  className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  aria-label={`Delete ${milestone.title}`}
                  data-ocid={`milestones.delete_button.${index + 1}`}
                  className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-smooth"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function MilestonesPage() {
  const { milestones, deleteMilestone } = useMilestones();
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Milestone | null>(null);

  const handleNew = useCallback(() => {
    setEditTarget(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((m: Milestone) => {
    setEditTarget(m);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditTarget(null);
  }, []);

  useKeyboardShortcuts({
    onNewMilestone: handleNew,
    onCloseModal: () => setModalOpen(false),
  });

  const filtered = milestones
    .filter((m) => filter === "all" || m.status === filter)
    .sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortDir === "asc" ? diff : -diff;
    });

  const hasAny = milestones.length > 0;
  const hasFiltered = filtered.length > 0;

  return (
    <div className="p-6 lg:p-8 space-y-6 min-h-full">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-medium">
            Planning
          </p>
          <h1 className="gradient-text font-display font-black text-3xl lg:text-4xl leading-tight">
            Milestones
          </h1>
        </div>
        <GradientBtn
          onClick={handleNew}
          aria-label="Add milestone"
          data-ocid="milestones.add.primary_button"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Milestone</span>
          <span className="sm:hidden">Add</span>
        </GradientBtn>
      </div>

      {/* Filter + Sort bar — only shown when milestones exist */}
      {hasAny && (
        <div className="flex flex-wrap items-center gap-2">
          <fieldset
            className="flex gap-2 flex-wrap border-0 p-0 m-0"
            aria-label="Filter milestones by status"
          >
            <legend className="sr-only">Filter milestones by status</legend>
            {FILTER_OPTIONS.map(({ value, label }) => {
              const active = filter === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  data-ocid={`milestones.filter.${value}`}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-smooth",
                    active
                      ? "text-white border-transparent shadow-md"
                      : "bg-muted/20 text-muted-foreground border-border/50 hover:text-foreground hover:bg-muted/40",
                  )}
                  style={
                    active
                      ? {
                          background:
                            "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
                          boxShadow: "0 2px 12px rgba(167,139,250,0.3)",
                        }
                      : undefined
                  }
                >
                  {label}
                </button>
              );
            })}
          </fieldset>

          <button
            type="button"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            data-ocid="milestones.sort.toggle"
            className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth px-3 py-1.5 rounded-lg hover:bg-muted/30 border border-transparent hover:border-border/50"
            aria-label={`Sort by date ${sortDir === "asc" ? "descending" : "ascending"}`}
          >
            {sortDir === "asc" ? <SortAsc size={13} /> : <SortDesc size={13} />}
            <span>Date {sortDir === "asc" ? "â†‘" : "â†“"}</span>
          </button>
        </div>
      )}

      {/* Content */}
      {!hasAny ? (
        /* No milestones at all */
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="glass-card rounded-2xl p-12 lg:p-16 text-center flex flex-col items-center gap-5"
          data-ocid="milestones.empty_state"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(167,139,250,0.2) 0%, rgba(96,165,250,0.2) 100%)",
              border: "1px solid rgba(167,139,250,0.3)",
            }}
          >
            <CalendarDays size={28} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display font-bold text-xl text-foreground">
              No milestones yet
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Start tracking your conference milestones by adding your first
              planning checkpoint.
            </p>
          </div>
          <GradientBtn
            onClick={handleNew}
            aria-label="Add first milestone"
            data-ocid="milestones.empty_add.primary_button"
          >
            <Plus size={16} />
            Add your first milestone
          </GradientBtn>
        </motion.div>
      ) : !hasFiltered ? (
        /* Filtered — no results */
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-2xl p-10 text-center flex flex-col items-center gap-3"
          data-ocid="milestones.no_results.empty_state"
        >
          <p className="text-foreground font-medium text-sm">
            No <span className="text-primary">{FILTER_LABELS[filter]}</span>{" "}
            milestones
          </p>
          <p className="text-muted-foreground text-xs">
            None of your milestones match this filter.
          </p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            data-ocid="milestones.clear_filter.button"
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-smooth underline underline-offset-2 mt-1"
          >
            Clear filter
          </button>
        </motion.div>
      ) : (
        /* Milestone list */
        <motion.div
          className="space-y-3"
          data-ocid="milestones.list"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((milestone, index) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                index={index}
                onEdit={handleEdit}
                onDelete={deleteMilestone}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <MilestoneModal
            key="milestones-modal"
            milestone={editTarget}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
