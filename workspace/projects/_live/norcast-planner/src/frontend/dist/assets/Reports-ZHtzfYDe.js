import { a as createLucideIcon, r as reactExports, u as useMilestoneStore, j as jsxRuntimeExports, B as Button, i as ChartNoAxesColumn, C as COLOR_MAP, S as STATUS_LABELS, c as cn } from "./index-DEWk5_GT.js";
import { u as useMilestones } from "./useMilestones-XdXD5gtp.js";
import { r as resolveElements, C as CircleCheck, m as motion } from "./proxy-PplbQiVh.js";
import { C as Clock } from "./clock-B2YbuKl6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M10 12.5 8 15l2 2.5", key: "1tg20x" }],
  ["path", { d: "m14 12.5 2 2.5-2 2.5", key: "yinavb" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z", key: "1mlx9k" }]
];
const FileCode = createLucideIcon("file-code", __iconNode$2);
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
  return (/* @__PURE__ */ new Date(`${dateStr}T00:00:00`)).toLocaleDateString("en-US", {
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: percent === 100 ? "All milestones complete ðŸŽ‰" : `${100 - percent}% remaining` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-3 bg-muted/40 rounded-full overflow-hidden print:bg-gray-200",
            role: "progressbar",
            "aria-valuenow": percent,
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-label": `Overall milestone completion: ${percent}%`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full",
                style: {
                  width: `${width}%`,
                  background: "linear-gradient(90deg, #22c55e 0%, #10b981 100%)",
                  transition: "width 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
                  boxShadow: percent === 100 ? "0 0 18px rgba(34,197,94,0.6)" : void 0
                },
                "aria-hidden": "true"
              }
            )
          }
        ),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center flex-shrink-0", children: [
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
              "aria-hidden": "true",
              className: "w-px flex-1 min-h-[1.5rem] mt-1",
              style: {
                background: `linear-gradient(to bottom, ${colors.hex}55, transparent)`
              }
            }
          )
        ] }),
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
            className: "flex-1 min-w-0 glass-card rounded-xl overflow-hidden mb-3 print:border print:border-gray-300 print:shadow-none print:bg-white print:rounded print:mb-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-[3px] w-full",
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
function generateHtmlExport(milestones, projectName, stats, isDark) {
  const now = /* @__PURE__ */ new Date();
  const exportDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  const statusColor = {
    completed: "#16a34a",
    "in-progress": "#d97706",
    upcoming: "#2563eb"
  };
  const statusBg = {
    completed: "#dcfce7",
    "in-progress": "#fef9c3",
    upcoming: "#dbeafe"
  };
  const accentHex = {
    red: "#ef4444",
    blue: "#3b82f6",
    yellow: "#eab308",
    indigo: "#4f46e5"
  };
  const sorted = [...milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const milestoneRows = sorted.map(
    (m) => `
    <tr style="border-bottom:1px solid #e5e7eb; page-break-inside:avoid;">
      <td style="padding:12px 16px; font-weight:700; color:${accentHex[m.color] ?? "#4f46e5"}; white-space:nowrap;">${m.step}</td>
      <td style="padding:12px 16px; white-space:nowrap; color:#374151;">${new Date(m.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
      <td style="padding:12px 16px; font-weight:600; color:#111827;">${m.title}</td>
      <td style="padding:12px 16px; color:#6b7280; line-height:1.5;">${m.desc}</td>
      <td style="padding:12px 16px; text-align:center;">
        <span style="display:inline-block; padding:3px 10px; border-radius:999px; font-size:12px; font-weight:600; color:${statusColor[m.status]}; background:${statusBg[m.status]};">${STATUS_LABELS[m.status]}</span>
      </td>
    </tr>`
  ).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${projectName} — Milestone Report</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; padding: 32px; }
  ${isDark ? `
    body { background: #080b12; color: #f3f4f6; }
    .stat-card, .progress-section, table { background: #11172a; border: 1px solid rgba(255,255,255,0.1); color: #fff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4); }
    .stat-label, .stat-sub, .progress-ticks, th { color: #9ca3af; }
    .stat-value, .progress-pct, .section-title { color: #fff; }
    .section-title { border-bottom-color: rgba(255,255,255,0.1); }
    tr { border-bottom: 1px solid rgba(255,255,255,0.1); }
    td[style*="color:#374151"] { color: #d1d5db !important; }
    td[style*="color:#111827"] { color: #f9fafb !important; }
    td[style*="color:#6b7280"] { color: #d1d5db !important; }
  ` : `
    body { background: #f9fafb; color: #111827; }
    .stat-card, .progress-section, table { background: white; border: 1px solid #e5e7eb; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08); }
    .stat-label, .stat-sub, .progress-ticks, th { color: #9ca3af; }
    .stat-value, .progress-pct, .section-title { color: #111827; }
    .section-title { border-bottom-color: #e5e7eb; }
    tr { border-bottom: 1px solid #e5e7eb; }
  `}
  .header { background: linear-gradient(135deg, #7c3aed, #2563eb); color: white; border-radius: 12px; padding: 28px 32px; margin-bottom: 28px; }
  .header h1 { font-size: 26px; font-weight: 800; margin-bottom: 4px; }
  .header p { opacity: 0.85; font-size: 14px; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 28px; }
  .stat-card { border-radius: 10px; padding: 16px 20px; }
  .stat-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
  .stat-value { font-size: 28px; font-weight: 800; line-height: 1; }
  .stat-sub { font-size: 12px; margin-top: 4px; }
  .progress-section { border-radius: 10px; padding: 20px 24px; margin-bottom: 28px; }
  .progress-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; }
  .progress-pct { font-size: 32px; font-weight: 800; }
  .progress-track { height: 12px; background: ${isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb"}; border-radius: 999px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #22c55e, #10b981); }
  .progress-ticks { display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px; }
  .section-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; padding-bottom: 8px; border-bottom-width: 2px; border-bottom-style: solid; }
  table { width: 100%; border-collapse: collapse; border-radius: 10px; overflow: hidden; font-size: 14px; }
  thead { background: #f3f4f6; }
  th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; }
  th:last-child, td:last-child { text-align: center; }
  tr:last-child td { border-bottom: none; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
  @media print { body { padding: 16px; background: white; } .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="header">
  <h1>${projectName} — Milestone Report</h1>
  <p>Exported on ${exportDate}</p>
</div>

<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-label">Total Milestones</div>
    <div class="stat-value">${stats.total}</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Completed</div>
    <div class="stat-value" style="color:#16a34a;">${stats.completed}</div>
    <div class="stat-sub">${stats.percent}% complete</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">In Progress</div>
    <div class="stat-value" style="color:#d97706;">${stats.inProgress}</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Upcoming</div>
    <div class="stat-value" style="color:#2563eb;">${stats.upcoming}</div>
  </div>
</div>

<div class="progress-section">
  <div class="progress-header">
    <div>
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;margin-bottom:4px;">Overall Progress</div>
      <div class="progress-pct">${stats.percent}%</div>
    </div>
    <div style="font-size:14px;color:#6b7280;">${stats.completed} of ${stats.total} milestones complete</div>
  </div>
  <div class="progress-track"><div class="progress-fill" style="width:${stats.percent}%;"></div></div>
  <div class="progress-ticks"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
</div>

<div class="section-title">Milestone Timeline</div>
<table>
  <thead>
    <tr>
      <th>Step</th>
      <th>Date</th>
      <th>Title</th>
      <th>Description</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    ${milestoneRows}
  </tbody>
</table>

<div class="footer">
  ${projectName} Â· Internal conference planning tool Â· Generated ${now.getFullYear()}
</div>
</body>
</html>`;
}
function exportToHtml(milestones, projectName, stats, isDark) {
  const html = generateHtmlExport(milestones, projectName, stats, isDark);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "norcast-report.html";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
function Reports() {
  const { milestones, stats } = useMilestones();
  const projectName = useMilestoneStore((s) => s.projectName);
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
  const handlePrint = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      const proceed = window.confirm(
        "Notice: The PDF export is optimized for standard documents and is perfectly formatted for printing.\n\nTo prevent wasting printer ink and to ensure maximum professional quality, all PDF reports are compiled in pristine Light Mode aesthetics regardless of your current workspace theme.\n\nProceed to print?"
      );
      if (!proceed) return;
    }
    window.print();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @media print {
          aside, nav, [data-sidebar],
          [data-ocid="reports.print.primary_button"],
          [data-ocid="reports.export_html.button"],
          .glow-bg, .dot-grid {
            display: none !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            transition: none !important;
            animation: none !important;
          }

          /* Break dashboard layout locks so PDF natively paginates instead of drawing scrollbars */
          body, html, #root, main, .h-screen, .overflow-hidden, .overflow-y-auto {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            position: static !important;
            background: white !important;
          }
          .glass-card {
            background: white !important;
            backdrop-filter: none !important;
            border: 1px solid #e5e7eb !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08) !important;
            color: #111827 !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .w-12.h-12, h2, h1 {
            opacity: 1 !important;
            transform: none !important;
          }

          .gradient-text {
            background: none !important;
            -webkit-background-clip: unset !important;
            -webkit-text-fill-color: black !important;
            color: black !important;
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => exportToHtml(milestones, projectName, stats, document.documentElement.classList.contains("dark")),
              "data-ocid": "reports.export_html.button",
              variant: "outline",
              className: "rounded-full gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode, { size: 15 }),
                "Export HTML"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handlePrint,
              "data-ocid": "reports.print.primary_button",
              className: "rounded-full gap-2",
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
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden print:block border-b border-gray-300 pb-4 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-black", children: "NorCast Planner — Project Reports" }),
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3", children: [
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
            sub: "first â†’ last milestone",
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
        "NorCast Planner Â· Internal conference planning tool Â·",
        " ",
        today.getFullYear()
      ] }) })
    ] })
  ] });
}
export {
  Reports as default
};
