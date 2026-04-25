import { a as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, i as ChartNoAxesColumn, C as COLOR_MAP, S as STATUS_LABELS, c as cn } from "./index-ByULjW2Y.js";
import { u as useMilestones } from "./useMilestones-DB0lJUyD.js";
import { r as resolveElements, C as CircleCheck, m as motion } from "./proxy-DzBZnJ3Y.js";
import { C as Clock, a as Calendar } from "./clock-D2fnYsNL.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
];
const Printer = createLucideIcon("printer", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
const thresholds = {
  some: 0,
  all: 1
};
function inView(elementOrSelector, onStart, { root, margin: rootMargin, amount = "some" } = {}) {
  const elements = resolveElements(elementOrSelector);
  const activeIntersections = /* @__PURE__ */ new WeakMap();
  const onIntersectionChange = (entries) => {
    entries.forEach((entry) => {
      const onEnd = activeIntersections.get(entry.target);
      if (entry.isIntersecting === Boolean(onEnd))
        return;
      if (entry.isIntersecting) {
        const newOnEnd = onStart(entry.target, entry);
        if (typeof newOnEnd === "function") {
          activeIntersections.set(entry.target, newOnEnd);
        } else {
          observer.unobserve(entry.target);
        }
      } else if (typeof onEnd === "function") {
        onEnd(entry);
        activeIntersections.delete(entry.target);
      }
    });
  };
  const observer = new IntersectionObserver(onIntersectionChange, {
    root,
    rootMargin,
    threshold: typeof amount === "number" ? amount : thresholds[amount]
  });
  elements.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}
function useInView(ref, { root, margin, amount, once = false, initial = false } = {}) {
  const [isInView, setInView] = reactExports.useState(initial);
  reactExports.useEffect(() => {
    if (!ref.current || once && isInView)
      return;
    const onEnter = () => {
      setInView(true);
      return once ? void 0 : () => setInView(false);
    };
    const options = {
      root: root && root.current || void 0,
      margin,
      amount
    };
    return inView(ref.current, onEnter, options);
  }, [root, ref, margin, once, amount]);
  return isInView;
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function daysBetween(a, b) {
  return Math.floor(Math.abs(b.getTime() - a.getTime()) / 864e5);
}
const STATUS_STYLE = {
  completed: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  "in-progress": "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  upcoming: "bg-blue-500/15 text-blue-400 border border-blue-500/30"
};
function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  delay = 0
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      className: "glass-card rounded-2xl p-5 flex flex-col gap-1 print:border print:border-gray-300 print:shadow-none print:rounded",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground text-xs font-medium mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 13 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-2xl text-foreground leading-none", children: value }),
        sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
      ]
    }
  );
}
function ProgressBar({ percent }) {
  const [width, setWidth] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 400);
    return () => clearTimeout(t);
  }, [percent]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "glass-card rounded-2xl p-6 print:border print:border-gray-300 print:shadow-none print:rounded",
      "data-ocid": "reports.progress.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest font-medium mb-0.5", children: "Overall Progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-black text-3xl text-foreground leading-none", children: [
              percent,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: percent === 100 ? "All milestones complete 🎉" : `${100 - percent}% remaining` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted/40 rounded-full overflow-hidden print:bg-gray-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full rounded-full",
            style: {
              width: `${width}%`,
              background: "linear-gradient(90deg, #22c55e 0%, #10b981 100%)",
              transition: "width 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
              boxShadow: percent === 100 ? "0 0 18px rgba(34,197,94,0.6)" : void 0
            },
            "aria-label": `Overall milestone completion: ${percent}%`
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "0%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "25%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "50%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "75%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100%" })
        ] })
      ]
    }
  );
}
function TimelineItem({
  milestone,
  index,
  isLast
}) {
  const ref = reactExports.useRef(null);
  const inView2 = useInView(ref, { once: true, margin: "-40px 0px" });
  const colors = COLOR_MAP[milestone.color];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref,
      className: "flex items-start gap-4",
      "data-ocid": `reports.timeline.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center flex-shrink-0 print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.65 },
              animate: inView2 ? { opacity: 1, scale: 1 } : {},
              transition: {
                delay: index * 0.07,
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1]
              },
              className: "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-display font-black border-2 flex-shrink-0 relative z-10",
              style: {
                borderColor: colors.hex,
                backgroundColor: `${colors.hex}18`,
                boxShadow: `0 0 16px ${colors.hex}40`,
                color: colors.hex
              },
              "aria-hidden": "true",
              children: milestone.step
            }
          ),
          !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-px flex-1 min-h-[1.5rem] mt-1",
              style: {
                background: `linear-gradient(to bottom, ${colors.hex}55, transparent)`
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden print:flex items-center justify-center w-8 h-8 rounded border border-gray-400 text-sm font-bold text-gray-700 flex-shrink-0 mt-0.5", children: milestone.step }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: -20 },
            animate: inView2 ? { opacity: 1, x: 0 } : {},
            transition: {
              delay: index * 0.07 + 0.05,
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1]
            },
            className: "flex-1 min-w-0 glass-card rounded-xl overflow-hidden mb-3 print:border print:border-gray-300 print:shadow-none print:rounded print:mb-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-[3px] w-full print:hidden",
                  style: { backgroundColor: colors.hex }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: formatDate(milestone.date) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                        STATUS_STYLE[milestone.status]
                      ),
                      children: STATUS_LABELS[milestone.status]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm text-foreground mb-1 print:text-black", children: milestone.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed print:text-gray-600", children: milestone.desc })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function Reports() {
  const { milestones, stats } = useMilestones();
  const today = /* @__PURE__ */ new Date();
  const sorted = [...milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const kickoffDate = sorted[0] ? new Date(sorted[0].date) : null;
  const lastDate = sorted[sorted.length - 1] ? new Date(sorted[sorted.length - 1].date) : null;
  const daysSinceKickoff = kickoffDate ? daysBetween(kickoffDate, today) : 0;
  const totalSpan = kickoffDate && lastDate ? daysBetween(kickoffDate, lastDate) : 0;
  let avgDays = 0;
  if (sorted.length > 1) {
    const gaps = sorted.slice(1).map(
      (m, i) => new Date(m.date).getTime() - new Date(sorted[i].date).getTime()
    );
    avgDays = Math.round(
      gaps.reduce((a, b) => a + b, 0) / gaps.length / 864e5
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @media print {
          aside, nav, [data-sidebar],
          [data-ocid="reports.print.primary_button"],
          .glow-bg, .dot-grid {
            display: none !important;
          }
          body, html {
            background: white !important;
            color: black !important;
          }
          .glass-card {
            background: white !important;
            backdrop-filter: none !important;
            border: 1px solid #ccc !important;
            box-shadow: none !important;
          }
          .gradient-text {
            background: none !important;
            -webkit-background-clip: unset !important;
            -webkit-text-fill-color: black !important;
            color: black !important;
            animation: none !important;
          }
          * {
            box-shadow: none !important;
            text-shadow: none !important;
            animation: none !important;
            transition: none !important;
          }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:flex { display: flex !important; }
        }
      ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 lg:p-8 space-y-8 min-h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 print:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1", children: "Analytics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "gradient-text font-display font-black text-3xl lg:text-4xl", children: "Reports" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => window.print(),
            "data-ocid": "reports.print.primary_button",
            className: "rounded-full gap-2 shrink-0",
            style: {
              background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
              color: "white",
              border: "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 15 }),
              "Print / Export PDF"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden print:block border-b border-gray-300 pb-4 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-black", children: "GulfCast Planner — Project Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500 mt-0.5", children: [
          "Printed on",
          " ",
          today.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { percent: stats.percent }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Total Milestones",
            value: String(stats.total),
            icon: CircleCheck,
            delay: 0.05
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Completed",
            value: `${stats.percent}%`,
            icon: TrendingUp,
            sub: `${stats.completed} of ${stats.total}`,
            delay: 0.1
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Avg Days Between",
            value: `${avgDays}d`,
            icon: Clock,
            sub: "per milestone gap",
            delay: 0.15
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Days Since Kickoff",
            value: `${daysSinceKickoff}d`,
            icon: Calendar,
            sub: kickoffDate ? formatDate(sorted[0].date) : "—",
            delay: 0.2
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Total Project Span",
            value: `${totalSpan}d`,
            icon: ChartNoAxesColumn,
            sub: "first → last milestone",
            delay: 0.25
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.h2,
          {
            initial: { opacity: 0, y: 6 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3, duration: 0.4 },
            className: "font-display font-bold text-xl text-foreground mb-5 print:text-black print:text-lg print:border-b print:border-gray-300 print:pb-2",
            children: "Milestone Timeline"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "reports.timeline.list", className: "space-y-0", children: sorted.map((milestone, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          TimelineItem,
          {
            milestone,
            index,
            isLast: index === sorted.length - 1
          },
          milestone.id
        )) }),
        sorted.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "glass-card rounded-2xl p-10 text-center text-muted-foreground text-sm",
            "data-ocid": "reports.timeline.empty_state",
            children: "No milestones to display. Add milestones from the Milestones page."
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden print:block border-t border-gray-300 pt-3 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400", children: [
        "GulfCast Planner · Internal conference planning tool ·",
        " ",
        today.getFullYear()
      ] }) })
    ] })
  ] });
}
export {
  Reports as default
};
