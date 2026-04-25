import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MilestoneModal } from "../components/MilestoneModal";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useMilestones } from "../hooks/useMilestones";
import { useMilestoneStore } from "../store/useMilestoneStore";
import { COLOR_MAP } from "../types/milestone";
import type { Milestone, MilestoneStatus } from "../types/milestone";

// â”€â”€â”€ Count-up hook (requestAnimationFrame) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function useCountUp(target: number, duration = 500) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const startValRef = useRef(0);

  useEffect(() => {
    const from = startValRef.current;
    startRef.current = null;

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        startValRef.current = target;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return count;
}

// â”€â”€â”€ Progress Ring â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProgressRing({ percent }: { percent: number }) {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const [dashOffset, setDashOffset] = useState(circumference);
  const isComplete = percent >= 100;
  const gradientId = `ring-gradient-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashOffset(circumference - (percent / 100) * circumference);
    }, 200);
    return () => clearTimeout(timer);
  }, [percent, circumference]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center flex-shrink-0",
        isComplete && "progress-glow",
      )}
      aria-label={`Progress: ${percent}%`}
      role="img"
    >
      <svg
        width={radius * 2}
        height={radius * 2}
        className="-rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#86efac" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={stroke}
          fill="transparent"
        />
        {/* Progress */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-black text-2xl text-foreground leading-none">
          {percent}%
        </span>
        <span className="text-[10px] text-muted-foreground mt-0.5">
          complete
        </span>
      </div>
    </div>
  );
}

// â”€â”€â”€ Stat Chip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StatChip({
  label,
  count,
  cls,
}: { label: string; count: number; cls: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl text-xs font-medium",
        cls,
      )}
    >
      <span>{label}</span>
      <span className="font-bold tabular-nums">{count}</span>
    </div>
  );
}

// â”€â”€â”€ Stat Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StatCard({
  label,
  value,
  icon: Icon,
  iconCls,
  valueCls,
  delay,
  ocid,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconCls: string;
  valueCls: string;
  delay: number;
  ocid: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card rounded-2xl p-5 flex items-center gap-4"
      data-ocid={ocid}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          iconCls,
        )}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium mb-1">
          {label}
        </p>
        <p
          className={cn(
            "font-display font-black text-3xl leading-none",
            valueCls,
          )}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}

// â”€â”€â”€ Milestone Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MilestoneCard({
  milestone,
  index,
  onEdit,
}: {
  milestone: Milestone;
  index: number;
  onEdit: (m: Milestone) => void;
}) {
  const colors = COLOR_MAP[milestone.color];

  const statusConfig: Record<MilestoneStatus, { label: string; cls: string }> =
    {
      completed: {
        label: "Completed",
        cls: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      },
      "in-progress": {
        label: "In Progress",
        cls: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      },
      upcoming: {
        label: "Upcoming",
        cls: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      },
    };

  const st = statusConfig[milestone.status];

  return (
    <div className="flex items-start gap-4">
      {/* Step badge */}
      <div className="flex flex-col items-center flex-shrink-0 mt-1 relative z-10 w-12">
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-sm border-2 select-none cursor-default bg-background",
            colors.border,
            colors.bg,
          )}
          style={{
            boxShadow: `0 0 18px rgba(${colors.glow}, 0.4), 0 0 6px rgba(${colors.glow}, 0.2)`,
          }}
          data-ocid={`milestone.step_badge.${index + 1}`}
        >
          <span style={{ color: colors.hex }}>{milestone.step}</span>
        </motion.div>
        
        <div className="mt-3 flex flex-col items-center justify-center glass-card px-2 py-1.5 rounded-lg border border-white/5 border-t-white/10 shadow-lg text-center backdrop-blur-md">
          <span className="text-[9px] font-bold tracking-widest uppercase mb-0.5 opacity-80" style={{ color: colors.hex }}>
            {new Date(`${milestone.date}T00:00:00`).toLocaleDateString("en-US", { month: "short" })}
          </span>
          <span className="text-sm font-black leading-none" style={{ color: colors.hex }}>
            {new Date(`${milestone.date}T00:00:00`).toLocaleDateString("en-US", { day: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Card */}
      <div
        className="relative flex-1 glass-card rounded-2xl overflow-hidden group hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-default"
        data-ocid={`milestone.item.${index + 1}`}
        style={{
          willChange: "transform",
        }}
      >
        {/* Top accent strip */}
        <div className="h-[3px] w-full" style={{ background: colors.hex }} />
        <div className="p-4">
          <div className="flex items-center justify-end gap-2 mb-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                  st.cls,
                )}
              >
                {st.label}
              </span>
              <button
                type="button"
                onClick={() => onEdit(milestone)}
                aria-label={`Edit ${milestone.title}`}
                data-ocid={`milestone.edit_button.${index + 1}`}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-smooth focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Edit2 size={13} />
              </button>
            </div>
          </div>
          <h3 className="font-display font-bold text-sm text-foreground leading-snug mb-1.5 truncate">
            {milestone.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {milestone.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Confetti burst â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function fireConfetti(): () => void {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return () => {};
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ["#a78bfa", "#60a5fa", "#22c55e", "#eab308", "#ef4444"];
  const particles = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 80,
    r: Math.random() * 6 + 3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx: (Math.random() - 0.5) * 5,
    vy: Math.random() * 4 + 2,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.18,
    opacity: 1,
  }));

  let frame = 0;
  let rafId = 0;
  let cancelled = false;
  const maxFrames = Math.round(3.2 * 60);

  function draw() {
    if (cancelled) return;
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // gravity
      p.angle += p.spin;
      p.opacity = Math.max(0, 1 - frame / maxFrames);
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.angle);
      ctx!.globalAlpha = p.opacity;
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx!.restore();
    }
    frame++;
    if (frame < maxFrames) rafId = requestAnimationFrame(draw);
    else canvas.remove();
  }
  rafId = requestAnimationFrame(draw);

  // Return cleanup fn â€” call this to cancel mid-animation
  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
    canvas.remove();
  };
}

// â”€â”€â”€ Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function Dashboard() {
  const { milestones, stats } = useMilestones();
  const projectName = useMilestoneStore((s) => s.projectName);
  const [editTarget, setEditTarget] = useState<Milestone | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const confettiFired = useRef(false);

  const displayCompleted = useCountUp(stats.completed);
  const displayTotal = useCountUp(stats.total);
  const displayRemaining = useCountUp(stats.remaining);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (stats.percent === 100 && !confettiFired.current) {
      confettiFired.current = true;
      timer = setTimeout(() => {
        cleanup = fireConfetti();
      }, 600);
    }

    return () => {
      clearTimeout(timer);
      cleanup?.();
    };
  }, [stats.percent]);

  const handleNewMilestone = useCallback(() => {
    setEditTarget(null);
    setEditMode(false);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((m: Milestone) => {
    setEditTarget(m);
    setEditMode(true);
    setModalOpen(true);
  }, []);

  useKeyboardShortcuts({
    onNewMilestone: handleNewMilestone,
    onCloseModal: () => setModalOpen(false),
  });

  return (
    <div className="p-5 lg:p-8 space-y-6 min-h-full">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
        data-ocid="dashboard.page"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard size={14} className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Dashboard
            </p>
          </div>
          <h1 className="gradient-text font-display font-black text-3xl lg:text-4xl leading-tight">
            {projectName}
          </h1>
        </div>
        <Button
          onClick={handleNewMilestone}
          data-ocid="dashboard.add_milestone.primary_button"
          className="rounded-full gap-2 font-semibold shadow-lg"
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
          }}
          aria-label="Add new milestone (N)"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Milestone</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </motion.div>

      {/* Stats row removed per user request to merge into progress board */}

      {/* Progress dashboard card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 hover:scale-[1.005] hover:-translate-y-0.5 transition-all duration-500 ease-out"
        data-ocid="dashboard.progress_ring.card"
      >
        {/* Left: count + label + chips */}
        <div className="flex-1 min-w-0 space-y-4 text-center sm:text-left">
          <div>
            <div className="font-display font-black text-5xl lg:text-6xl text-foreground leading-none tabular-nums">
              {displayCompleted}
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">
              <span className="text-foreground font-semibold">
                {displayCompleted}
              </span>{" "}
              of{" "}
              <span className="text-foreground font-semibold">
                {displayTotal}
              </span>{" "}
              milestones complete
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
             <div className="bg-background/40 rounded-2xl p-4 flex items-center gap-4 border border-border/40 min-w-[160px] shadow-[3px_-2px_15px_1px_rgba(20,20,20,0.22),0_12px_25px_-6px_rgba(0,0,0,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 ease-out">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.15)] flex items-center justify-center shrink-0">
                   <CheckCircle2 size={18} />
                </div>
                <div>
                   <p className="text-[11px] text-muted-foreground font-semibold mb-1 uppercase tracking-[0.08em]">Completed</p>
                   <p className="font-display font-black text-2xl leading-none text-emerald-500 tabular-nums">{displayCompleted}</p>
                </div>
             </div>
             
             <div className="bg-background/40 rounded-2xl p-4 flex items-center gap-4 border border-border/40 min-w-[160px] shadow-[3px_-2px_15px_1px_rgba(20,20,20,0.22),0_12px_25px_-6px_rgba(0,0,0,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 ease-out">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.15)] flex items-center justify-center shrink-0">
                   <Clock size={18} />
                </div>
                <div>
                   <p className="text-[11px] text-muted-foreground font-semibold mb-1 uppercase tracking-[0.08em]">Remaining</p>
                   <p className="font-display font-black text-2xl leading-none text-amber-500 tabular-nums">{displayRemaining}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right: progress ring */}
        <div className="flex-shrink-0">
          <ProgressRing percent={stats.percent} />
        </div>
      </motion.div>

      {/* Milestone Stepper */}
      <div data-ocid="dashboard.milestones.section">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mb-5"
        >
          <h2 className="font-display font-bold text-lg text-foreground">
            Milestone Stepper
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {milestones.length} milestone{milestones.length !== 1 ? "s" : ""} â€”
            hover a card to interact
          </p>
        </motion.div>

        {milestones.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-12 text-center"
            data-ocid="dashboard.milestones.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold mb-1">
              No milestones yet
            </p>
            <p className="text-muted-foreground text-sm mb-5">
              Start tracking your conference milestones by adding the first one.
            </p>
            <Button
              onClick={handleNewMilestone}
              data-ocid="dashboard.empty_add.primary_button"
              className="rounded-full gap-2"
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
              }}
            >
              <Plus size={15} />
              Add your first milestone
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-0"
            data-ocid="milestone.list"
          >
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                variants={itemVariants}
                className="relative pb-5"
              >
                {/* Connector line between steps */}
                {index < milestones.length - 1 && (
                  <div
                    className="absolute left-6 top-[52px] w-px"
                    style={{
                      height: "calc(100% - 52px)",
                      background:
                        "linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, transparent 100%)",
                    }}
                    aria-hidden="true"
                  />
                )}
                <MilestoneCard
                  milestone={milestone}
                  index={index}
                  onEdit={handleEdit}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <MilestoneModal
            key="dashboard-modal"
            milestone={editMode ? editTarget : null}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
