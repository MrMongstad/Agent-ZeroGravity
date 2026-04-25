import { r as reactExports, j as jsxRuntimeExports, L as LayoutDashboard, B as Button, c as cn, C as COLOR_MAP } from "./index-ByULjW2Y.js";
import { u as useKeyboardShortcuts, P as Plus, M as MilestoneModal } from "./useKeyboardShortcuts-BF6WQRla.js";
import { u as useMilestones } from "./useMilestones-DB0lJUyD.js";
import { m as motion, C as CircleCheck } from "./proxy-DzBZnJ3Y.js";
import { C as Clock, a as Calendar } from "./clock-D2fnYsNL.js";
import { A as AnimatePresence, P as Pen } from "./label-CTjz4LZA.js";
function useCountUp(target, duration = 500) {
  const [count, setCount] = reactExports.useState(0);
  const rafRef = reactExports.useRef(0);
  const startRef = reactExports.useRef(null);
  const startValRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const from = startValRef.current;
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
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
function ProgressRing({ percent }) {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const [dashOffset, setDashOffset] = reactExports.useState(circumference);
  const isComplete = percent >= 100;
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      setDashOffset(circumference - percent / 100 * circumference);
    }, 200);
    return () => clearTimeout(timer);
  }, [percent, circumference]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "relative flex items-center justify-center flex-shrink-0",
        isComplete && "progress-glow"
      ),
      "aria-label": `Progress: ${percent}%`,
      role: "img",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            width: radius * 2,
            height: radius * 2,
            className: "-rotate-90",
            "aria-hidden": "true",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "linearGradient",
                {
                  id: "ring-gradient",
                  x1: "0%",
                  y1: "0%",
                  x2: "100%",
                  y2: "100%",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#22c55e" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#86efac" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: radius,
                  cy: radius,
                  r: normalizedRadius,
                  stroke: "rgba(255,255,255,0.07)",
                  strokeWidth: stroke,
                  fill: "transparent"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: radius,
                  cy: radius,
                  r: normalizedRadius,
                  stroke: "url(#ring-gradient)",
                  strokeWidth: stroke,
                  fill: "transparent",
                  strokeDasharray: `${circumference} ${circumference}`,
                  strokeDashoffset: dashOffset,
                  strokeLinecap: "round",
                  style: {
                    transition: "stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)"
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-black text-2xl text-foreground leading-none", children: [
            percent,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground mt-0.5", children: "complete" })
        ] })
      ]
    }
  );
}
function StatChip({
  label,
  count,
  cls
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl text-xs font-medium",
        cls
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold tabular-nums", children: count })
      ]
    }
  );
}
function StatCard({
  label,
  value,
  icon: Icon,
  iconCls,
  valueCls,
  delay,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      className: "glass-card rounded-2xl p-5 flex items-center gap-4",
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
              iconCls
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium mb-1", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: cn(
                "font-display font-black text-3xl leading-none",
                valueCls
              ),
              children: value
            }
          )
        ] })
      ]
    }
  );
}
function MilestoneCard({
  milestone,
  index,
  onEdit
}) {
  const colors = COLOR_MAP[milestone.color];
  const cardRef = reactExports.useRef(null);
  const handleMouseMove = reactExports.useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = (y / rect.height - 0.5) * -15;
    const rotateY = (x / rect.width - 0.5) * 15;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  }, []);
  const handleMouseLeave = reactExports.useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    }
  }, []);
  const statusConfig = {
    completed: {
      label: "Completed",
      cls: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
    },
    "in-progress": {
      label: "In Progress",
      cls: "bg-amber-500/20 text-amber-400 border border-amber-500/30"
    },
    upcoming: {
      label: "Upcoming",
      cls: "bg-blue-500/20 text-blue-400 border border-blue-500/30"
    }
  };
  const st = statusConfig[milestone.status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center flex-shrink-0 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        whileHover: { scale: 1.08 },
        transition: { type: "spring", stiffness: 400, damping: 20 },
        className: cn(
          "w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-sm border-2 select-none cursor-default",
          colors.border,
          colors.bg
        ),
        style: {
          boxShadow: `0 0 18px rgba(${colors.glow}, 0.4), 0 0 6px rgba(${colors.glow}, 0.2)`
        },
        "data-ocid": `milestone.step_badge.${index + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: colors.hex }, children: milestone.step })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: cardRef,
        className: "relative flex-1 glass-card rounded-2xl overflow-hidden group cursor-default",
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        "data-ocid": `milestone.item.${index + 1}`,
        style: {
          willChange: "transform",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[3px] w-full", style: { background: colors.hex } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-2.5 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 11 }),
                (/* @__PURE__ */ new Date(`${milestone.date}T00:00:00`)).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                      st.cls
                    ),
                    children: st.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onEdit(milestone),
                    "aria-label": `Edit ${milestone.title}`,
                    "data-ocid": `milestone.edit_button.${index + 1}`,
                    className: "opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-smooth focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 13 })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm text-foreground leading-snug mb-1.5 truncate", children: milestone.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed line-clamp-2", children: milestone.desc })
          ] })
        ]
      }
    )
  ] });
}
function fireConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
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
    opacity: 1
  }));
  let frame = 0;
  const maxFrames = Math.round(3.2 * 60);
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.angle += p.spin;
      p.opacity = Math.max(0, 1 - frame / maxFrames);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
    }
    frame++;
    if (frame < maxFrames) requestAnimationFrame(draw);
    else canvas.remove();
  }
  draw();
}
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};
function Dashboard() {
  const { milestones, stats } = useMilestones();
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editMode, setEditMode] = reactExports.useState(false);
  const confettiFired = reactExports.useRef(false);
  const displayCompleted = useCountUp(stats.completed);
  const displayTotal = useCountUp(stats.total);
  const displayRemaining = useCountUp(stats.remaining);
  reactExports.useEffect(() => {
    if (stats.percent === 100 && !confettiFired.current) {
      confettiFired.current = true;
      setTimeout(fireConfetti, 600);
    }
  }, [stats.percent]);
  const handleNewMilestone = reactExports.useCallback(() => {
    setEditTarget(null);
    setEditMode(false);
    setModalOpen(true);
  }, []);
  const handleEdit = reactExports.useCallback((m) => {
    setEditTarget(m);
    setEditMode(true);
    setModalOpen(true);
  }, []);
  useKeyboardShortcuts({
    onNewMilestone: handleNewMilestone,
    onCloseModal: () => setModalOpen(false)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 lg:p-8 space-y-6 min-h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        className: "flex items-center justify-between",
        "data-ocid": "dashboard.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { size: 14, className: "text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest font-medium", children: "Dashboard" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "gradient-text font-display font-black text-3xl lg:text-4xl leading-tight", children: "Conference Planner" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleNewMilestone,
              "data-ocid": "dashboard.add_milestone.primary_button",
              className: "rounded-full gap-2 font-semibold shadow-lg",
              style: {
                background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)"
              },
              "aria-label": "Add new milestone (N)",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Add Milestone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Add" })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-3 gap-3 lg:gap-4",
        "data-ocid": "dashboard.stats.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Total Milestones",
              value: displayTotal,
              icon: LayoutDashboard,
              iconCls: "bg-violet-500/20 text-violet-400",
              valueCls: "text-foreground",
              delay: 0.05,
              ocid: "stats.total.card"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Completed",
              value: displayCompleted,
              icon: CircleCheck,
              iconCls: "bg-emerald-500/20 text-emerald-400",
              valueCls: "text-emerald-400",
              delay: 0.1,
              ocid: "stats.completed.card"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Remaining",
              value: displayRemaining,
              icon: Clock,
              iconCls: "bg-amber-500/20 text-amber-400",
              valueCls: "text-amber-400",
              delay: 0.15,
              ocid: "stats.remaining.card"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.2, duration: 0.45, ease: [0.4, 0, 0.2, 1] },
        className: "glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6",
        "data-ocid": "dashboard.progress_ring.card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-4 text-center sm:text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-black text-5xl lg:text-6xl text-foreground leading-none tabular-nums", children: displayCompleted }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: displayCompleted }),
                " ",
                "of",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: displayTotal }),
                " ",
                "milestones complete"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 max-w-[200px] mx-auto sm:mx-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatChip,
                {
                  label: "Completed",
                  count: stats.completed,
                  cls: "bg-emerald-500/15 text-emerald-400"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatChip,
                {
                  label: "In Progress",
                  count: stats.inProgress,
                  cls: "bg-amber-500/15 text-amber-400"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatChip,
                {
                  label: "Upcoming",
                  count: stats.upcoming,
                  cls: "bg-blue-500/15 text-blue-400"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressRing, { percent: stats.percent }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.milestones.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 0.35 },
          className: "mb-5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Milestone Stepper" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              milestones.length,
              " milestone",
              milestones.length !== 1 ? "s" : "",
              " — hover a card to interact"
            ] })
          ]
        }
      ),
      milestones.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          className: "glass-card rounded-2xl p-12 text-center",
          "data-ocid": "dashboard.milestones.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 28, className: "text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold mb-1", children: "No milestones yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-5", children: "Start tracking your conference milestones by adding the first one." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleNewMilestone,
                "data-ocid": "dashboard.empty_add.primary_button",
                className: "rounded-full gap-2",
                style: {
                  background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
                  "Add your first milestone"
                ]
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          variants: listVariants,
          initial: "hidden",
          animate: "visible",
          className: "space-y-0",
          "data-ocid": "milestone.list",
          children: milestones.map((milestone, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              variants: itemVariants,
              className: "relative pb-5",
              children: [
                index < milestones.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute left-6 top-[52px] w-px",
                    style: {
                      height: "calc(100% - 52px)",
                      background: "linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, transparent 100%)"
                    },
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MilestoneCard,
                  {
                    milestone,
                    index,
                    onEdit: handleEdit
                  }
                )
              ]
            },
            milestone.id
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: modalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MilestoneModal,
      {
        milestone: editMode ? editTarget : null,
        onClose: () => setModalOpen(false)
      },
      "dashboard-modal"
    ) })
  ] });
}
export {
  Dashboard as default
};
