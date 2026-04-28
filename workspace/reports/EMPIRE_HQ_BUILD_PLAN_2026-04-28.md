# Empire HQ v3.0 — Build Plan
**Date:** 2026-04-28 | **Status:** APPROVED → EXECUTING
**Source:** `AUDIT_2026-04-28.md` — Top 3 Findings
**Constraint:** Weightless Mandate (zero `node_modules`, no build step, zero external dependencies installed locally)

---

## Execution Order

The 3 audit findings are sequenced as build phases — NOT parallel. Each phase unblocks the next.

```
Phase 0: .env Audit (prerequisite — ~30 min)
    ↓
Phase 1: Empire HQ Core + Library Panel (resolves #3 — MD readability)
    ↓
Phase 2: Status Panel — Multi-Root Git Sync (resolves #1)
```

> Finding #2 (env vars) is resolved in Phase 0. It is a prerequisite, not a feature.

---

## Phase 0 — Environment Centralization
**Audit Finding:** #2 | **Time Estimate:** 30 min | **No PR required — config only**

### Goal
Map every env key referenced across all scripts/configs to a single `root/.env`. Identify gaps. Fill them.

### Steps

| # | Action | Target |
|---|--------|--------|
| 0.1 | Grep all `process.env`, `os.environ`, and `.env` references across workspace | All files in `workspace/` |
| 0.2 | Cross-reference against current `.env` at root | `c:\Users\steph\Desktop\Antigravity and Agent 0\.env` |
| 0.3 | List every **missing key** with its source file | Output: inline table |
| 0.4 | Populate missing keys (placeholder or real value) | `.env` — never commit |
| 0.5 | Verify `build_library.js` and any other scripts load correctly | Run smoke test |

### Success Criteria
- [ ] Zero undefined env keys at runtime across all workspace scripts
- [ ] `.env` is the single source of truth
- [ ] `.gitignore` confirmed to exclude `.env`

---

## Phase 1 — Empire HQ Core + Library Panel
**Audit Finding:** #3 (MD readability) | **Time Estimate:** 2–3 hrs | **Branch + PR required**

### Goal
Spin up `empire-hq/` — a bare-metal Node.js HTTP server on `localhost:3737` with a beautiful Markdown reader as its first panel. Inter font, soft typography, rendered GFM — no editor, no monospace hell.

### Architecture
```
empire-hq/
├── server.js          ← HTTP + SSE server (Node built-ins only)
├── index.html         ← Shell: nav + panel container
├── style.css          ← Design system (Inter, dark mode, glassmorphism or chosen style)
├── app.js             ← Client JS (fetch, marked.js via CDN, routing)
└── panels/
    └── library.js     ← MD file browser + renderer logic
```

### Steps

| # | Action | Detail |
|---|--------|--------|
| 1.1 | Create `empire-hq/` directory in workspace root | `workspace/empire-hq/` |
| 1.2 | Write `server.js` | Node `http` module. Serves static files. Exposes `/api/files` (list `.md` files) and `/api/read?path=` (stream file content). SSE endpoint `/api/watch` for live-reload. |
| 1.3 | Write `index.html` | Shell layout. Left sidebar (file tree), right panel (reading canvas). Links Inter from Google Fonts CDN. Loads `marked.js` from CDN. |
| 1.4 | Write `style.css` | Dark mode base. Inter font stack. Prose typography for the reading panel. Sidebar styling. One of the 5 blueprints as visual base. |
| 1.5 | Write `app.js` | Fetches file list → renders sidebar. On click: fetches raw MD → passes to `marked.parse()` → renders in canvas. SSE listener for auto-reload. |
| 1.6 | Wire file watcher in `server.js` | `fs.watch()` on `workspace/memory/` and `workspace/reports/`. Push SSE event on change. |
| 1.7 | Add `npm start` shortcut | `package.json` with `"start": "node server.js"` — single command launch. |
| 1.8 | Smoke test | Open `localhost:3737`. Navigate to `AUDIT_2026-04-28.md`. Confirm it renders with formatted table, headings, Inter font. |

### Visual Style Decision (pick before building `style.css`)
- Option A: **Spatial Glassmorphism** — frosted panels, UV + cyan, depth
- Option B: **Neo-Cybernetic Terminal** — black void, neon green, CRT feel
- Option C: **Swiss Monochrome** — E-ink, editorial, pure contrast

> ⚠️ Architect selects style before Phase 1.4. Default: **Spatial Glassmorphism** if no input.

### Success Criteria
- [ ] Server starts with `node server.js` — zero install step
- [ ] File tree lists all `.md` files in `workspace/memory/` and `workspace/reports/`
- [ ] Clicking a file renders it with Inter font + GFM formatting
- [ ] Tables, headings, code blocks all render correctly
- [ ] Live reload triggers within 2 seconds of file save

---

## Phase 2 — Status Panel: Multi-Root Git Sync
**Audit Finding:** #1 (multi-root state sync) | **Time Estimate:** 1–2 hrs | **Extends Phase 1**

### Goal
Second panel in Empire HQ showing real-time Git status of all 5 workspace roots. One glance = full sync picture.

### Repos to Monitor
| Root | Path |
|------|------|
| Agent-ZeroGravity | `c:\Users\steph\Desktop\Antigravity and Agent 0` |
| Prompt Magic | `...\projects\_active\Prompt Magic` |
| Sonic Reader V3 | `...\projects\_active\Sonic_Reader_V3` |
| LFS-R2-Proxy | `...\projects\_live\LFS-R2-Proxy` |
| norcast-planner | `...\projects\_live\norcast-planner` |

### Steps

| # | Action | Detail |
|---|--------|--------|
| 2.1 | Add `/api/gitstatus` endpoint to `server.js` | `child_process.execSync('git status --short && git log --oneline -3')` per repo. Returns JSON. |
| 2.2 | Add `/api/gitpull` endpoint (gated) | Triggers `git pull` on a specific root. Architect-only action button. |
| 2.3 | Write `panels/status.js` | Polls `/api/gitstatus` every 30s. Card per repo: name, branch, dirty file count, last 3 commits. 🟢 clean / 🟡 uncommitted / 🔴 behind remote. |
| 2.4 | Add Status tab to nav | Tab switcher between Library and Status panels in `index.html`. |
| 2.5 | Smoke test | Dirty a file in one repo. Confirm card goes 🟡 within 30s. |

### Success Criteria
- [ ] All 5 roots visible in Status panel
- [ ] Dirty state detected within 30s
- [ ] Branch name and last commit shown per repo
- [ ] Zero new dependencies (Node `child_process` built-in only)

---

## Execution Checklist

```
[ ] Phase 0: .env audit complete — all keys mapped
[ ] Style decision made (A / B / C)
[ ] Phase 1: empire-hq/ live on localhost:3737
[ ] Phase 1: Smoke test passed
[ ] Phase 2: Status panel live — all 5 roots monitored
[ ] PR raised for empire-hq/ addition
[ ] AUDIT_2026-04-28.md Top 3 marked resolved
```

---

## Deferred (Phase 3+)
- API Credits panel (Finding #11)
- Morning Report automation (Finding #9)
- Improvement tracker kanban

---

*Next action: Architect confirms visual style (A/B/C) → execute Phase 0 → Phase 1.*
