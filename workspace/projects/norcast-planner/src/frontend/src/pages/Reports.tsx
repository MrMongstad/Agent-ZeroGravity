import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  FileCode,
  Printer,
  TrendingUp,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMilestones } from "../hooks/useMilestones";
import { useMilestoneStore } from "../store/useMilestoneStore";
import { COLOR_MAP, STATUS_LABELS } from "../types/milestone";
import type {
  Milestone,
  MilestoneColor,
  MilestoneStatus,
} from "../types/milestone";

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function daysBetween(a: Date, b: Date) {
  return Math.floor(Math.abs(b.getTime() - a.getTime()) / 86400000);
}

const STATUS_STYLE: Record<MilestoneStatus, string> = {
  completed: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  "in-progress": "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  upcoming: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
};

// â”€â”€â”€ StatCard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  delay = 0,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  sub?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-1 print:border print:border-gray-300 print:shadow-none print:rounded cursor-pointer"
    >
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium mb-1">
        <Icon size={13} />
        <span>{label}</span>
      </div>
      <p className="font-display font-black text-2xl text-foreground leading-none">
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </motion.div>
  );
}

// â”€â”€â”€ ProgressBar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ProgressBar({ percent }: { percent: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 400);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div
      className="glass-card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.01] print:border print:border-gray-300 print:shadow-none print:rounded"
      data-ocid="reports.progress.section"
    >
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-0.5">
            Overall Progress
          </p>
          <p className="font-display font-black text-3xl text-foreground leading-none">
            {percent}%
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {percent === 100
            ? "All milestones complete ðŸŽ‰"
            : `${100 - percent}% remaining`}
        </p>
      </div>

      <div
        className="h-3 bg-muted/40 rounded-full overflow-hidden print:bg-gray-200"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Overall milestone completion: ${percent}%`}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: "linear-gradient(90deg, #22c55e 0%, #10b981 100%)",
            transition: "width 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
            boxShadow:
              percent === 100 ? "0 0 18px rgba(34,197,94,0.6)" : undefined,
          }}
          aria-hidden="true"
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

// â”€â”€â”€ TimelineItem â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TimelineItem({
  milestone,
  index,
  isLast,
}: {
  milestone: Milestone;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });
  const colors = COLOR_MAP[milestone.color as MilestoneColor];

  return (
    <div
      ref={ref}
      className="flex items-start gap-4"
      data-ocid={`reports.timeline.item.${index + 1}`}
    >
      {/* Step badge + connector column */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.65 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            delay: index * 0.07,
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-display font-black border-2 flex-shrink-0 relative z-10"
          style={{
            borderColor: colors.hex,
            backgroundColor: `${colors.hex}18`,
            boxShadow: `0 0 16px ${colors.hex}40`,
            color: colors.hex,
          }}
          aria-hidden="true"
        >
          {milestone.step}
        </motion.div>
        {!isLast && (
          <div
            aria-hidden="true"
            className="w-px flex-1 min-h-[1.5rem] mt-1"
            style={{
              background: `linear-gradient(to bottom, ${colors.hex}55, transparent)`,
            }}
          />
        )}
      </div>

      {/* Milestone card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{
          delay: index * 0.07 + 0.05,
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex-1 min-w-0 glass-card rounded-xl overflow-hidden mb-3 print:border print:border-gray-300 print:shadow-none print:bg-white print:rounded print:mb-2"
      >
        {/* Accent top strip */}
        <div
          className="h-[3px] w-full"
          style={{ backgroundColor: colors.hex }}
        />

        <div className="p-4">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground font-medium">
              {formatDate(milestone.date)}
            </span>
            <span
              className={cn(
                "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                STATUS_STYLE[milestone.status],
              )}
            >
              {STATUS_LABELS[milestone.status]}
            </span>
          </div>

          <h3 className="font-display font-bold text-sm text-foreground mb-1 print:text-black">
            {milestone.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed print:text-gray-600">
            {milestone.desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// â”€â”€â”€ HTML Export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function generateHtmlExport(
  milestones: Milestone[],
  projectName: string,
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    upcoming: number;
    percent: number;
  },
  isDark: boolean,
): string {
  const now = new Date();
  const exportDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusColor: Record<MilestoneStatus, string> = {
    completed: "#16a34a",
    "in-progress": "#d97706",
    upcoming: "#2563eb",
  };
  const statusBg: Record<MilestoneStatus, string> = {
    completed: "#dcfce7",
    "in-progress": "#fef9c3",
    upcoming: "#dbeafe",
  };

  const accentHex: Record<string, string> = {
    red: "#ef4444",
    blue: "#3b82f6",
    yellow: "#eab308",
    indigo: "#4f46e5",
  };

  const sorted = [...milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const milestoneRows = sorted
    .map(
      (m) => `
    <tr style="border-bottom:1px solid #e5e7eb; page-break-inside:avoid;">
      <td style="padding:12px 16px; font-weight:700; color:${accentHex[m.color] ?? "#4f46e5"}; white-space:nowrap;">${m.step}</td>
      <td style="padding:12px 16px; white-space:nowrap; color:#374151;">${new Date(m.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
      <td style="padding:12px 16px; font-weight:600; color:#111827;">${m.title}</td>
      <td style="padding:12px 16px; color:#6b7280; line-height:1.5;">${m.desc}</td>
      <td style="padding:12px 16px; text-align:center;">
        <span style="display:inline-block; padding:3px 10px; border-radius:999px; font-size:12px; font-weight:600; color:${statusColor[m.status]}; background:${statusBg[m.status]};">${STATUS_LABELS[m.status]}</span>
      </td>
    </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${projectName} — Milestone Report</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; padding: 32px; }
  ${
    isDark
      ? `
    body { background: #080b12; color: #f3f4f6; }
    .stat-card, .progress-section, table { background: #11172a; border: 1px solid rgba(255,255,255,0.1); color: #fff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4); }
    .stat-label, .stat-sub, .progress-ticks, th { color: #9ca3af; }
    .stat-value, .progress-pct, .section-title { color: #fff; }
    .section-title { border-bottom-color: rgba(255,255,255,0.1); }
    tr { border-bottom: 1px solid rgba(255,255,255,0.1); }
    td[style*="color:#374151"] { color: #d1d5db !important; }
    td[style*="color:#111827"] { color: #f9fafb !important; }
    td[style*="color:#6b7280"] { color: #d1d5db !important; }
  `
      : `
    body { background: #f9fafb; color: #111827; }
    .stat-card, .progress-section, table { background: white; border: 1px solid #e5e7eb; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08); }
    .stat-label, .stat-sub, .progress-ticks, th { color: #9ca3af; }
    .stat-value, .progress-pct, .section-title { color: #111827; }
    .section-title { border-bottom-color: #e5e7eb; }
    tr { border-bottom: 1px solid #e5e7eb; }
  `
  }
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

function exportToHtml(
  milestones: Milestone[],
  projectName: string,
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    upcoming: number;
    percent: number;
  },
  isDark: boolean,
) {
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

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Reports() {
  const { milestones, stats } = useMilestones();
  const projectName = useMilestoneStore((s) => s.projectName);
  const today = new Date();

  const sorted = [...milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const kickoffDate = sorted[0] ? new Date(sorted[0].date) : null;
  const lastDate = sorted[sorted.length - 1]
    ? new Date(sorted[sorted.length - 1].date)
    : null;

  const daysSinceKickoff = kickoffDate ? daysBetween(kickoffDate, today) : 0;
  const totalSpan =
    kickoffDate && lastDate ? daysBetween(kickoffDate, lastDate) : 0;

  let avgDays = 0;
  if (sorted.length > 1) {
    const gaps = sorted
      .slice(1)
      .map(
        (m, i) =>
          new Date(m.date).getTime() - new Date(sorted[i].date).getTime(),
      );
    avgDays = Math.round(
      gaps.reduce((a, b) => a + b, 0) / gaps.length / 86400000,
    );
  }

  const handlePrint = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      const proceed = window.confirm(
        "Notice: The PDF export is optimized for standard documents and is perfectly formatted for printing.\n\nTo prevent wasting printer ink and to ensure maximum professional quality, all PDF reports are compiled in pristine Light Mode aesthetics regardless of your current workspace theme.\n\nProceed to print?",
      );
      if (!proceed) return;
    }
    window.print();
  };

  return (
    <>
      {/* Inline print styles — hides chrome, resets to B&W where needed, but preserves functional colors */}
      <style>{`
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
      `}</style>

      <div className="p-6 lg:p-8 space-y-8 min-h-full">
        {/* â”€â”€ Page Header â”€â”€ */}
        <div className="flex items-start justify-between gap-4 print:hidden">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">
              Analytics
            </p>
            <h1 className="gradient-text font-display font-black text-3xl lg:text-4xl">
              Reports
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() =>
                exportToHtml(
                  milestones,
                  projectName,
                  stats,
                  document.documentElement.classList.contains("dark"),
                )
              }
              data-ocid="reports.export_html.button"
              variant="outline"
              className="rounded-full gap-2"
            >
              <FileCode size={15} />
              Export HTML
            </Button>

            <Button
              onClick={handlePrint}
              data-ocid="reports.print.primary_button"
              className="rounded-full gap-2"
              style={{
                background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                color: "white",
                border: "none",
              }}
            >
              <Printer size={15} />
              Print / Export PDF
            </Button>
          </div>
        </div>

        {/* â”€â”€ Print-only header â”€â”€ */}
        <div className="hidden print:block border-b border-gray-300 pb-4 mb-2">
          <h1 className="text-xl font-bold text-black">
            NorCast Planner — Project Reports
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Printed on{" "}
            {today.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* â”€â”€ Progress Bar â”€â”€ */}
        <ProgressBar percent={stats.percent} />

        {/* â”€â”€ Stats Grid â”€â”€ */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard
            label="Total Milestones"
            value={String(stats.total)}
            icon={CheckCircle2}
            delay={0.05}
          />
          <StatCard
            label="Completed"
            value={`${stats.percent}%`}
            icon={TrendingUp}
            sub={`${stats.completed} of ${stats.total}`}
            delay={0.1}
          />
          <StatCard
            label="Avg Days Between"
            value={`${avgDays}d`}
            icon={Clock}
            sub="per milestone gap"
            delay={0.15}
          />
          <StatCard
            label="Days Since Kickoff"
            value={`${daysSinceKickoff}d`}
            icon={Calendar}
            sub={kickoffDate ? formatDate(sorted[0].date) : "—"}
            delay={0.2}
          />
          <StatCard
            label="Total Project Span"
            value={`${totalSpan}d`}
            icon={BarChart2}
            sub="first â†’ last milestone"
            delay={0.25}
          />
        </div>

        {/* â”€â”€ Timeline â”€â”€ */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="font-display font-bold text-xl text-foreground mb-5 print:text-black print:text-lg print:border-b print:border-gray-300 print:pb-2"
          >
            Milestone Timeline
          </motion.h2>

          <div data-ocid="reports.timeline.list" className="space-y-0">
            {sorted.map((milestone, index) => (
              <TimelineItem
                key={milestone.id}
                milestone={milestone}
                index={index}
                isLast={index === sorted.length - 1}
              />
            ))}
          </div>

          {sorted.length === 0 && (
            <div
              className="glass-card rounded-2xl p-10 text-center text-muted-foreground text-sm"
              data-ocid="reports.timeline.empty_state"
            >
              No milestones to display. Add milestones from the Milestones page.
            </div>
          )}
        </div>

        {/* â”€â”€ Print footer â”€â”€ */}
        <div className="hidden print:block border-t border-gray-300 pt-3 mt-4">
          <p className="text-xs text-gray-400">
            NorCast Planner Â· Internal conference planning tool Â·{" "}
            {today.getFullYear()}
          </p>
        </div>
      </div>
    </>
  );
}
