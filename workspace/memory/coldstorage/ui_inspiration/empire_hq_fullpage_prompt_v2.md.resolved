# Empire HQ — Full-Page Image Generation Prompt v2

> **Change from v1:** Replaced all purple/magenta/pink (`#bc8cff`) with **copper-gold (`#e8a855`)** — a warm metallic accent that creates a cool-cyan ↔ warm-copper temperature polarity. No purple, no pink, no magenta anywhere.

---

## The Prompt

```
UI design, full-page screenshot of a dark-mode developer command center dashboard called "Empire HQ", ultra-detailed desktop web application, 9:16 tall portrait aspect ratio showing the entire page from top navigation to bottom footer without any cropping.

TOP NAVIGATION BAR: Horizontal tab bar at the very top with tabs labeled "Dashboard" (active, highlighted in cyan), "Library", "Projects", "Processes", "Settings". Subtle bottom border separating nav from content. Small Empire HQ logo on the far left.

ROW 1 — SYSTEM METRICS STRIP: Seven equally-spaced metric tiles in a horizontal row spanning full width. Each tile is a dark card with rounded corners containing: a label in muted grey uppercase text, a large bold value in white, and a tiny sparkline graph below. The seven tiles are: CPU 38% (cyan sparkline), RAM 62% (green sparkline), Disk I/O R:1.2 W:9.4 MB/s (amber sparkline), GPU 68°C (orange sparkline), Active Projects 4 (cyan bar), Git Commits 12 (green bar), Network ↑1.2 ↓9.4 MB/s (copper-gold and green dual sparkline).

ROW 2 — CRITICAL ALERT BANNER: Full-width amber/dark-orange warning banner with left amber accent border. Text reads "CRITICAL: Build failed for 'data-pipeline' in 'feat/authentication'". Right side has ghost buttons: "Restart Build", "View Logs", "Dismiss".

ROW 3 — API CREDITS HORIZONTAL STRIP: Compact approximately 80px tall horizontal strip spanning full width, dark charcoal background slightly different shade than main background. Contains four inline provider cards side by side: OpenAI with teal progress bar at 67% showing "$34/$50", Anthropic with warm copper-gold progress bar at 82% showing "$82/$100", Google AI with amber progress bar at 45% showing "$23/$50", Replicate with red progress bar at 91% showing "$4.50/$5.00". Far right shows "Daily Burn: $12.40/day" with a tiny 7-day cost sparkline.

ROW 4 — MAIN THREE-COLUMN LAYOUT (largest section, approximately 60% of total page height):

LEFT COLUMN — "Top Processes": Five stacked process cards, each card is a dark rounded rectangle showing: process name in bold white (node.exe, chrome.exe, code.exe, python.exe, docker.exe), PID number, a colored status pill badge (green "RUNNING", amber "WARNING", red "CRITICAL"), CPU percentage with a small horizontal progress bar, RAM usage in MB. Each card has three small ghost action buttons at the bottom: "Audit", "Restart", "Kill".

CENTER COLUMN — "Workspace Projects" plus Network Monitor: Top section shows a clean data table with 5 project rows. Each row shows: project name, git branch with branch icon, last commit time, modified file count, and a build status dot (green checkmark or amber warning). Below the table is a "Network Traffic — 12h" area chart showing RX (green line) and TX (copper-gold line) over a 12-hour timeline, with filled gradient areas under the lines. Below the chart: "Top Consumer: chrome.exe — 4.2 MB/s".

RIGHT COLUMN — "System Health": Three semi-circular donut gauge charts arranged vertically at the top — CPU Load 38% with cyan arc, RAM Usage 62% with green arc, Temperature 68°C with amber arc. Each gauge has the metric name below it and the value displayed large in the center of the arc. Below the gauges is a smaller "Network I/O" dual-line chart showing RX in green and TX in copper-gold over time. Below that: "Top Network Consumer: chrome.exe — 19.4 MB/s".

ROW 5 — FOOTER: Minimal footer strip showing "Empire HQ v3.0 • Last refresh: 2s ago • Auto-refresh: 5s" in muted grey text.

VISUAL STYLE: Dark mode with background color #0d1117 (GitHub dark). Cards use #161b22 with subtle 1px borders of #30363d. Text hierarchy uses white for primary values, #8b949e for secondary labels. Accent color palette: cyan #58a6ff, green #3fb950, amber #d29922, red #f85149, copper-gold #e8a855. No purple, no pink, no magenta anywhere in the design. Frosted glassmorphism on card surfaces with subtle backdrop blur. Soft drop shadows. Modern sans-serif typography using Inter font family. Micro-sparklines use gradient fills. All data visualizations use smooth anti-aliased rendering. Premium, polished, production-ready UI/UX design. 8K resolution, hyper-detailed interface design.
```

---

## Style Tokens Reference (v2)

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0d1117` | Page background |
| `--bg-card` | `#161b22` | Card surfaces |
| `--border` | `#30363d` | Card borders |
| `--text-primary` | `#ffffff` | Primary values |
| `--text-secondary` | `#8b949e` | Labels, metadata |
| `--accent-cyan` | `#58a6ff` | Active nav, CPU gauge |
| `--accent-green` | `#3fb950` | Healthy status, RAM gauge, RX network |
| `--accent-amber` | `#d29922` | Warnings, temperature |
| `--accent-red` | `#f85149` | Critical status, alerts |
| `--accent-copper` | `#e8a855` | TX network, Anthropic bar, secondary accent |
| `--font` | `Inter` | All typography |

## Color Rationale

> **Why copper-gold instead of purple?**
> - **Temperature polarity**: Cyan (cool/tech) ↔ Copper (warm/metal) creates visual tension that feels intentional, not random
> - **Industrial premium**: Evokes machined brass, oxidized bronze — fits the "command center" metaphor
> - **Distinctness from amber**: `#e8a855` (copper) sits at a higher luminance and warmer hue than `#d29922` (amber), so warnings and TX lines won't bleed together
> - **No RGB gamer vibes**: Purple/magenta skews the palette toward gaming aesthetics; copper keeps it grounded and professional
