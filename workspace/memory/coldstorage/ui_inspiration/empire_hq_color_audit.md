# Empire HQ — Color Harmony Audit

## Palette Under Review (v2)

| Swatch | Hex | HSL | Role | Coolors Name |
|---|---|---|---|---|
| ⬛ | `#0d1117` | 215°, 31%, 7% | Page background | Ink Black |
| ⬛ | `#161b22` | 215°, 20%, 11% | Card surfaces | — |
| ⬛ | `#30363d` | 212°, 12%, 21% | Card borders | — |
| ⬜ | `#ffffff` | 0°, 0%, 100% | Primary text | White |
| 🩶 | `#8b949e` | 210°, 9%, 58% | Secondary text | — |
| 🔵 | `#58a6ff` | 214°, 100%, 67% | Cyan accent | Cool Horizon |
| 🟢 | `#3fb950` | 127°, 50%, 49% | Green accent | Jade Green |
| 🟡 | `#d29922` | 41°, 73%, 48% | Amber accent | Goldenrod |
| 🔴 | `#f85149` | 3°, 93%, 63% | Red accent | Tomato |
| 🟠 | `#e8a855` | 35°, 78%, 62% | Copper accent | Sunlit Clay |

---

## 1. Background & Surface Layer — ✅ PASS

```
#0d1117 (7%)  →  #161b22 (11%)  →  #30363d (21%)
  215°/31%        215°/20%          212°/12%
```

**Verdict:** Textbook dark-mode gradient. All three share a unified cool blue-grey undertone (~212-215°). Saturation decreases as lightness increases, preventing any hue drift. This is the GitHub dark palette — battle-tested.

---

## 2. Text Hierarchy — ✅ PASS

| Text Color | vs `#0d1117` | WCAG Level |
|---|---|---|
| `#ffffff` (primary) | **19.1:1** | ✅ AAA |
| `#8b949e` (secondary) | **6.1:1** | ✅ AA (normal), AAA (large) |

**Verdict:** Both pass. Secondary text at 6.1:1 is comfortable for labels and metadata. The 210° hue of the grey matches the background family — no color temperature clash.

---

## 3. Accent Colors vs Background — Contrast Audit

| Accent | vs `#0d1117` | WCAG | Verdict |
|---|---|---|---|
| Cyan `#58a6ff` | **7.5:1** | ✅ AAA | Excellent |
| Green `#3fb950` | **7.4:1** | ✅ AAA | Excellent |
| Amber `#d29922` | **7.5:1** | ✅ AAA | Excellent |
| Copper `#e8a855` | **9.2:1** | ✅ AAA | Excellent |
| Red `#f85149` | **5.6:1** | ⚠️ AA only | Borderline for small text |

> [!WARNING]
> **Red `#f85149` fails AAA** (needs 7:1 for normal text). It's fine for large badge pills like "CRITICAL" but risky for small inline text like sparkline labels. If red appears as small body text, bump to `#ff7b73` (7.2:1).

---

## 4. Hue Wheel Distribution — 🔴 CRITICAL ISSUE

```
        Cyan 214°
       /          \
      /    149° GAP \    ← empty (purple zone, banned)
     /     (41% of   \
    /      wheel)      \
Red 3° ←——————————→ Green 127°
    \     38°  /  86°  /
     \       /       /
   Copper 35°    /
   Amber 41° ——/
```

### Hue Gaps Between Adjacent Accents

| From → To | Gap | Verdict |
|---|---|---|
| Red 3° → Copper 35° | 32° | ⚠️ Tight |
| Copper 35° → Amber 41° | **6°** | 🔴 **COLLISION** |
| Amber 41° → Green 127° | 86° | ✅ Good |
| Green 127° → Cyan 214° | 87° | ✅ Good |
| Cyan 214° → Red 3° | 149° | Empty (purple ban) |

> [!CAUTION]
> **Copper (#e8a855) and Amber (#d29922) are 6° apart on the hue wheel.** The minimum for reliable human distinction is ~30°. At sparkline/progress-bar scale, these two colors are **indistinguishable**. This is the single biggest problem in the palette.

### Inter-Color Luminance Contrast

| Pair | Contrast | Verdict |
|---|---|---|
| Copper ↔ Amber | **1.22:1** | 🔴 Indistinguishable |
| Green ↔ Cyan | **1.02:1** | ⚠️ Low, but 87° hue gap saves it |
| Red ↔ Amber | **1.37:1** | ⚠️ Low, but 38° hue gap helps |
| Red ↔ Copper | **1.65:1** | Acceptable with 32° hue gap |

---

## 5. Recommendation: Replace Copper with Teal

**Drop** `#e8a855` (copper-gold, 35°). **Replace with** `#2dd4bf` (teal, 170°).

### Why Teal?

```
BEFORE (v2):                          AFTER (v3):
Red 3°                                Red 3°
Copper 35°  ← 6° collision!          Amber 41°
Amber 41°                             Green 127°
Green 127°                            Teal 170°  ← NEW, fills the gap
Cyan 214°                             Cyan 214°

Min gap: 6° 🔴                        Min gap: 31° ✅
```

| From → To | Gap (v3) | Verdict |
|---|---|---|
| Red 3° → Amber 41° | 38° | ✅ |
| Amber 41° → Green 127° | 86° | ✅ |
| Green 127° → Teal 170° | 43° | ✅ |
| Teal 170° → Cyan 214° | 44° | ✅ |

**Every gap ≥ 38°.** Distribution is dramatically more even.

### Teal `#2dd4bf` Validation

| Check | Result |
|---|---|
| Contrast vs `#0d1117` | **9.9:1** ✅ AAA |
| Hue separation from Green | 43° ✅ (clearly mint/teal, not "green") |
| Hue separation from Cyan | 44° ✅ (clearly warm-teal, not "blue") |
| Visual feel | Aquamarine/mint — premium, calming, techy |
| No purple/pink/magenta? | ✅ Confirmed |

---

## 6. Final Palette — v3 (Audited)

````carousel
### Coolors: v2 Palette (with collision)

![v2 palette showing copper and goldenrod collision](C:/Users/steph/.gemini/antigravity/brain/779ea848-676e-44ef-92c4-98e5e2826b1e/empire_hq_full_palette_v2_1777391965530.png)

Notice how **Goldenrod** and **Sunlit Clay** are nearly identical side-by-side.
<!-- slide -->
### Coolors: Proposed v3 (collision fixed)

![v3 palette without copper, with teal](C:/Users/steph/.gemini/antigravity/brain/779ea848-676e-44ef-92c4-98e5e2826b1e/empire_hq_palette_initial_1777391935290.png)

**Turquoise** (#2DD4BF) replaces copper — clear visual distinction from every other accent.
````

### Style Tokens — v3 Final

| Token | Hex | HSL | Role |
|---|---|---|---|
| `--bg-primary` | `#0d1117` | 215°, 31%, 7% | Page background |
| `--bg-card` | `#161b22` | 215°, 20%, 11% | Card surfaces |
| `--border` | `#30363d` | 212°, 12%, 21% | Card/panel borders |
| `--text-primary` | `#ffffff` | achromatic | Primary values, headings |
| `--text-secondary` | `#8b949e` | 210°, 9%, 58% | Labels, metadata, timestamps |
| `--accent-cyan` | `#58a6ff` | 214°, 100%, 67% | Active nav, CPU gauge, links |
| `--accent-green` | `#3fb950` | 127°, 50%, 49% | Healthy status, RAM gauge, RX network |
| `--accent-amber` | `#d29922` | 41°, 73%, 48% | Warnings, temperature gauge, Google AI |
| `--accent-red` | `#f85149` | 3°, 93%, 63% | Critical status, alerts, Replicate bar |
| `--accent-teal` | `#2dd4bf` | 170°, 67%, 50% | TX network, Anthropic bar, secondary data |

> [!TIP]
> **Optional red upgrade for small text:** If `#f85149` appears as normal-size body text (not just badge pills), swap to `#ff7b73` (HSL 3°, 100%, 73%) for AAA compliance at 7.2:1.

---

## 7. Updated Prompt — v3

```
UI design, full-page screenshot of a dark-mode developer command center dashboard called "Empire HQ", ultra-detailed desktop web application, 9:16 tall portrait aspect ratio showing the entire page from top navigation to bottom footer without any cropping.

TOP NAVIGATION BAR: Horizontal tab bar at the very top with tabs labeled "Dashboard" (active, highlighted in cyan), "Library", "Projects", "Processes", "Settings". Subtle bottom border separating nav from content. Small Empire HQ logo on the far left.

ROW 1 — SYSTEM METRICS STRIP: Seven equally-spaced metric tiles in a horizontal row spanning full width. Each tile is a dark card with rounded corners containing: a label in muted grey uppercase text, a large bold value in white, and a tiny sparkline graph below. The seven tiles are: CPU 38% (cyan sparkline), RAM 62% (green sparkline), Disk I/O R:1.2 W:9.4 MB/s (amber sparkline), GPU 68°C (orange sparkline), Active Projects 4 (cyan bar), Git Commits 12 (green bar), Network ↑1.2 ↓9.4 MB/s (teal and green dual sparkline).

ROW 2 — CRITICAL ALERT BANNER: Full-width amber/dark-orange warning banner with left amber accent border. Text reads "CRITICAL: Build failed for 'data-pipeline' in 'feat/authentication'". Right side has ghost buttons: "Restart Build", "View Logs", "Dismiss".

ROW 3 — API CREDITS HORIZONTAL STRIP: Compact approximately 80px tall horizontal strip spanning full width, dark charcoal background slightly different shade than main background. Contains four inline provider cards side by side: OpenAI with teal progress bar at 67% showing "$34/$50", Anthropic with aquamarine teal progress bar at 82% showing "$82/$100", Google AI with amber progress bar at 45% showing "$23/$50", Replicate with red progress bar at 91% showing "$4.50/$5.00". Far right shows "Daily Burn: $12.40/day" with a tiny 7-day cost sparkline.

ROW 4 — MAIN THREE-COLUMN LAYOUT (largest section, approximately 60% of total page height):

LEFT COLUMN — "Top Processes": Five stacked process cards, each card is a dark rounded rectangle showing: process name in bold white (node.exe, chrome.exe, code.exe, python.exe, docker.exe), PID number, a colored status pill badge (green "RUNNING", amber "WARNING", red "CRITICAL"), CPU percentage with a small horizontal progress bar, RAM usage in MB. Each card has three small ghost action buttons at the bottom: "Audit", "Restart", "Kill".

CENTER COLUMN — "Workspace Projects" plus Network Monitor: Top section shows a clean data table with 5 project rows. Each row shows: project name, git branch with branch icon, last commit time, modified file count, and a build status dot (green checkmark or amber warning). Below the table is a "Network Traffic — 12h" area chart showing RX (green line) and TX (teal/aquamarine line) over a 12-hour timeline, with filled gradient areas under the lines. Below the chart: "Top Consumer: chrome.exe — 4.2 MB/s".

RIGHT COLUMN — "System Health": Three semi-circular donut gauge charts arranged vertically at the top — CPU Load 38% with cyan arc, RAM Usage 62% with green arc, Temperature 68°C with amber arc. Each gauge has the metric name below it and the value displayed large in the center of the arc. Below the gauges is a smaller "Network I/O" dual-line chart showing RX in green and TX in teal over time. Below that: "Top Network Consumer: chrome.exe — 19.4 MB/s".

ROW 5 — FOOTER: Minimal footer strip showing "Empire HQ v3.0 • Last refresh: 2s ago • Auto-refresh: 5s" in muted grey text.

VISUAL STYLE: Dark mode with background color #0d1117 (GitHub dark). Cards use #161b22 with subtle 1px borders of #30363d. Text hierarchy uses white for primary values, #8b949e for secondary labels. Accent color palette uses exactly five colors: cyan #58a6ff, green #3fb950, amber #d29922, red #f85149, and teal #2dd4bf. No purple, no pink, no magenta, no copper-gold anywhere in the design. The color palette follows a harmonious hue distribution with minimum 38-degree spacing on the color wheel. Frosted glassmorphism on card surfaces with subtle backdrop blur. Soft drop shadows. Modern sans-serif typography using Inter font family. Micro-sparklines use gradient fills. All data visualizations use smooth anti-aliased rendering. Premium, polished, production-ready UI/UX design. 8K resolution, hyper-detailed interface design.
```
