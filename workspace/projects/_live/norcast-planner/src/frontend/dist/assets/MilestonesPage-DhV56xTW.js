import { a as createLucideIcon, r as reactExports, j as jsxRuntimeExports, c as cn, S as STATUS_LABELS, C as COLOR_MAP } from "./index-DEWk5_GT.js";
import { u as useKeyboardShortcuts, P as Plus, M as MilestoneModal } from "./useKeyboardShortcuts-C1_KN4Yz.js";
import { u as useMilestones } from "./useMilestones-XdXD5gtp.js";
import { m as motion, C as CircleCheck } from "./proxy-PplbQiVh.js";
import { A as AnimatePresence, P as Pen } from "./label-BMdIDjPt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "m3 16 4 4 4-4", key: "1co6wj" }],
  ["path", { d: "M7 20V4", key: "1yoxec" }],
  ["path", { d: "M11 4h10", key: "1w87gc" }],
  ["path", { d: "M11 8h7", key: "djye34" }],
  ["path", { d: "M11 12h4", key: "q8tih4" }]
];
const ArrowDownWideNarrow = createLucideIcon("arrow-down-wide-narrow", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }],
  ["path", { d: "M11 12h4", key: "q8tih4" }],
  ["path", { d: "M11 16h7", key: "uosisv" }],
  ["path", { d: "M11 20h10", key: "jvxblo" }]
];
const ArrowUpNarrowWide = createLucideIcon("arrow-up-narrow-wide", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "in-progress", label: "In Progress" },
  { value: "upcoming", label: "Upcoming" }
];
const FILTER_LABELS = {
  all: "All",
  completed: STATUS_LABELS.completed,
  "in-progress": STATUS_LABELS["in-progress"],
  upcoming: STATUS_LABELS.upcoming
};
const STATUS_STYLES = {
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "in-progress": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  upcoming: "bg-sky-500/15 text-sky-400 border-sky-500/30"
};
function GradientBtn({
  onClick,
  "aria-label": ariaLabel,
  "data-ocid": ocid,
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      "aria-label": ariaLabel,
      "data-ocid": ocid,
      className: cn(
        "flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-white transition-smooth hover:scale-105 active:scale-95 shadow-lg",
        className
      ),
      style: {
        background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
        boxShadow: "0 4px 20px rgba(167,139,250,0.35)"
      },
      children
    }
  );
}
function MilestoneCard({
  milestone,
  index,
  onEdit,
  onDelete
}) {
  const [confirming, setConfirming] = reactExports.useState(false);
  const colors = COLOR_MAP[milestone.color];
  const formattedDate = (/* @__PURE__ */ new Date(
    `${milestone.date}T00:00:00`
  )).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: -6 },
      transition: {
        delay: index * 0.045,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      },
      whileHover: { scale: 1.006, transition: { duration: 0.12 } },
      className: "glass-card rounded-2xl overflow-hidden group relative cursor-default",
      style: { borderLeft: `3px solid ${colors.hex}` },
      "data-ocid": `milestones.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-5 flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-11 h-11 rounded-xl flex items-center justify-center font-display font-black text-sm border-2 flex-shrink-0 transition-smooth group-hover:scale-110",
              colors.border,
              colors.bg
            ),
            style: { boxShadow: `0 0 14px rgba(${colors.glow}, 0.35)` },
            "aria-label": `Step ${milestone.step}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: colors.hex }, children: milestone.step })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "px-2 py-0.5 rounded-full text-xs border font-medium",
                  STATUS_STYLES[milestone.status]
                ),
                children: STATUS_LABELS[milestone.status]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 11 }),
              formattedDate
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "w-2 h-2 rounded-full flex-shrink-0",
                style: {
                  background: colors.hex,
                  boxShadow: `0 0 6px rgba(${colors.glow}, 0.6)`
                },
                "aria-label": `${colors.label} accent color`
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm text-foreground leading-snug", children: milestone.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed", children: milestone.desc })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", initial: false, children: confirming ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.88 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.88 },
            transition: { duration: 0.15 },
            className: "flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground mr-1 hidden sm:inline whitespace-nowrap", children: "Delete?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    onDelete(milestone.id);
                    setConfirming(false);
                  },
                  "aria-label": "Confirm delete",
                  "data-ocid": `milestones.confirm_button.${index + 1}`,
                  className: "flex items-center gap-1 px-2 py-1 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/35 transition-smooth text-xs font-semibold",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Yes" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setConfirming(false),
                  "aria-label": "Cancel delete",
                  "data-ocid": `milestones.cancel_button.${index + 1}`,
                  className: "flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-smooth text-xs font-semibold",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 13 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "No" })
                  ]
                }
              )
            ]
          },
          "confirm"
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.1 },
            className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onEdit(milestone),
                  "aria-label": `Edit ${milestone.title}`,
                  "data-ocid": `milestones.edit_button.${index + 1}`,
                  className: "p-2 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-smooth",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 14 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setConfirming(true),
                  "aria-label": `Delete ${milestone.title}`,
                  "data-ocid": `milestones.delete_button.${index + 1}`,
                  className: "p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-smooth",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                }
              )
            ]
          },
          "icons"
        ) }) })
      ] })
    }
  );
}
function MilestonesPage() {
  const { milestones, deleteMilestone } = useMilestones();
  const [filter, setFilter] = reactExports.useState("all");
  const [sortDir, setSortDir] = reactExports.useState("asc");
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const handleNew = reactExports.useCallback(() => {
    setEditTarget(null);
    setModalOpen(true);
  }, []);
  const handleEdit = reactExports.useCallback((m) => {
    setEditTarget(m);
    setModalOpen(true);
  }, []);
  const handleCloseModal = reactExports.useCallback(() => {
    setModalOpen(false);
    setEditTarget(null);
  }, []);
  useKeyboardShortcuts({
    onNewMilestone: handleNew,
    onCloseModal: () => setModalOpen(false)
  });
  const filtered = milestones.filter((m) => filter === "all" || m.status === filter).sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    return sortDir === "asc" ? diff : -diff;
  });
  const hasAny = milestones.length > 0;
  const hasFiltered = filtered.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 lg:p-8 space-y-6 min-h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-1 font-medium", children: "Planning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "gradient-text font-display font-black text-3xl lg:text-4xl leading-tight", children: "Milestones" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        GradientBtn,
        {
          onClick: handleNew,
          "aria-label": "Add milestone",
          "data-ocid": "milestones.add.primary_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Add Milestone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Add" })
          ]
        }
      )
    ] }),
    hasAny && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "fieldset",
        {
          className: "flex gap-2 flex-wrap border-0 p-0 m-0",
          "aria-label": "Filter milestones by status",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Filter milestones by status" }),
            FILTER_OPTIONS.map(({ value, label }) => {
              const active = filter === value;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setFilter(value),
                  "data-ocid": `milestones.filter.${value}`,
                  className: cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-smooth",
                    active ? "text-white border-transparent shadow-md" : "bg-muted/20 text-muted-foreground border-border/50 hover:text-foreground hover:bg-muted/40"
                  ),
                  style: active ? {
                    background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
                    boxShadow: "0 2px 12px rgba(167,139,250,0.3)"
                  } : void 0,
                  children: label
                },
                value
              );
            })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setSortDir((d) => d === "asc" ? "desc" : "asc"),
          "data-ocid": "milestones.sort.toggle",
          className: "ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth px-3 py-1.5 rounded-lg hover:bg-muted/30 border border-transparent hover:border-border/50",
          "aria-label": `Sort by date ${sortDir === "asc" ? "descending" : "ascending"}`,
          children: [
            sortDir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpNarrowWide, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownWideNarrow, { size: 13 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Date ",
              sortDir === "asc" ? "â†‘" : "â†“"
            ] })
          ]
        }
      )
    ] }),
    !hasAny ? (
      /* No milestones at all */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
          className: "glass-card rounded-2xl p-12 lg:p-16 text-center flex flex-col items-center gap-5",
          "data-ocid": "milestones.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-16 h-16 rounded-2xl flex items-center justify-center",
                style: {
                  background: "linear-gradient(135deg, rgba(167,139,250,0.2) 0%, rgba(96,165,250,0.2) 100%)",
                  border: "1px solid rgba(167,139,250,0.3)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 28, className: "text-primary" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground", children: "No milestones yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs leading-relaxed", children: "Start tracking your conference milestones by adding your first planning checkpoint." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              GradientBtn,
              {
                onClick: handleNew,
                "aria-label": "Add first milestone",
                "data-ocid": "milestones.empty_add.primary_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
                  "Add your first milestone"
                ]
              }
            )
          ]
        }
      )
    ) : !hasFiltered ? (
      /* Filtered — no results */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          className: "glass-card rounded-2xl p-10 text-center flex flex-col items-center gap-3",
          "data-ocid": "milestones.no_results.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground font-medium text-sm", children: [
              "No ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: FILTER_LABELS[filter] }),
              " ",
              "milestones"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: "None of your milestones match this filter." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setFilter("all"),
                "data-ocid": "milestones.clear_filter.button",
                className: "text-xs font-semibold text-primary hover:text-primary/80 transition-smooth underline underline-offset-2 mt-1",
                children: "Clear filter"
              }
            )
          ]
        }
      )
    ) : (
      /* Milestone list */
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          className: "space-y-3",
          "data-ocid": "milestones.list",
          initial: "hidden",
          animate: "visible",
          variants: {
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } }
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filtered.map((milestone, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            MilestoneCard,
            {
              milestone,
              index,
              onEdit: handleEdit,
              onDelete: deleteMilestone
            },
            milestone.id
          )) })
        }
      )
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: modalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MilestoneModal,
      {
        milestone: editTarget,
        onClose: handleCloseModal
      },
      "milestones-modal"
    ) })
  ] });
}
export {
  MilestonesPage as default
};
