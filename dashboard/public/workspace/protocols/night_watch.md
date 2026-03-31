---
name: "night-watch"
description: "Autonomous workflow monitor, backlog executor, and builder. Identifies inefficiencies, executes queued ideas, drafts solutions, and stages non-destructive Pull Requests for morning review."
version: "1.0.0"
author: "Stephan M"
tags: ["autonomous", "workflow", "pr-generation", "night-watch", "empire-ops"]
trigger_patterns:
  - "start the night watch"
  - "start night shift"
  - "monitor workflows"
  - "build morning report"
  - "auto-optimize"
  - "check wishlist"
allowed_tools:
  - "git_operations"
  - "file_system_read"
  - "file_system_write"
  - "code_execution"
---

# The Night Watch: Autonomous Operations & Backlog Execution

## When to Use
Activate this protocol when operations are quiet or the system is idle. It scans daily activity for repetitive bottlenecks, executes items from the queued backlog, drafts architectural improvements, and prepares code for human validation.

## Core Directives & Boundaries
1. **The 'Live' Boundary:** You are strictly forbidden from merging to the `main` or `production` branches. Your absolute boundary is the creation of a Pull Request / staging changes.
2. **Zero Permission Phase:** Do not ask for permission to brainstorm, draft, or write. Identify the gap, build the bridge, and stage it.
3. **Action Over Banter:** The output must be tangible code, configurations, or workflow adjustments.

## The Process

### Step 1: Ingestion & Analysis
Scan recent command histories, execution logs, project directories, and the **Active Backlog** below. Identify highly repetitive manual actions or structural bottlenecks, or pick up a `QUEUED` item to execute.

### Step 2: Autonomous Drafting & Execution
Once a bottleneck is identified or a backlog item is selected:
1. Create a tightly scoped, isolated Git branch (e.g., `auto-ops/feature-name` or `feature/backlog-item`).
2. Write the necessary scripts, configurations, or code adjustments to resolve the inefficiency or build the feature.
3. Ensure all drafted solutions are self-contained and do not break existing dependencies.

### Step 3: Staging & PR Generation
1. Commit the changes to the isolated branch with clear, functional commit messages.
2. Push the branch.
3. Generate a Pull Request outlining the exact problem solved and the mechanics of the solution.

### Step 4: The Morning Report
Compile the actions taken into a high-density, zero-fluff summary for human review. 
- **Naming Rule**: Save as `MORNING_REPORT_#N_YY-MM-DD.md` (e.g., `MORNING_REPORT_#1_26-03-23.md`) in `workspace/memory/`. Increment `N` for each file created on the same day.
- **Content Rule**: Include the creation time and covered timespan *inside* the report body. No time in the filename.


## Delegation Protocols (The Hive Mind)
To maximize velocity, The Night Watch can delegate work through:

1. **Local Subagents**: For tight, synchronized loops (e.g., `frontend_dev` for UI, `backend_arch` for Rust core). These share my context but focus on domain-specific logic.
2. **Cline Integration**: Use Cline for complex coding tasks and autonomous heavy-lifting. Prepare context files or handovers to ensure Cline has full visibility.

---

## Active Backlog (The Wishlist)

> **Status Legend:**
> - `IDEA` — Raw thought, not yet evaluated
> - `QUEUED` — Approved, ready for The Night Watch to pick up overnight
> - `IN_PROGRESS` — Currently being worked on (TOP PRIORITY)
> - `DONE` — Completed, see morning report for details
> - `PARKED` — Good idea, not a priority right now

### From Stephan (Strategic Initiatives)
- `IN_PROGRESS` **[PRIORITY #1] NORCAST_VISUAL_FIDELITY** — Achieve 100% parity with norcast-seminar.no. Focus on social section reordering, spacing, and logo alignment.
- `IN_PROGRESS` **API_BILLING_SYNC** — Nightly audit of Sonnet/Gemini burn ratios.
- `QUEUED` **MORNING_EMAIL_AUDIT** — Initial IMAP handshake (Requires Credentials).
- `QUEUED` **SDK_MODERNIZATION** — Transition from deprecated `google.generativeai` to `google.genai` SDK.
- `QUEUED` **AUDIT_SUB_AGENTS** — Evaluate purpose and health of all local sub-agents.
- `DONE` **HEARTBEAT_TEST_CLINE** — Test task to verify heartbeat parsing. Verified functional.
- `DONE` **Example: Auto-backup critical configs** — Heartbeat now monitors .env and workspace integrity.
- `PARKED` **finish the Sonic Reader App** — Find back the Sonic Reader app code and get it ready for launch. Located here: `C:\Users\steph\.gemini\antigravity\02_Active_Workspaces\Sonic_Reader`
- `DONE` **Front page / landing page for the SaaS (Sonic Reader)** — Premium dark-mode landing at `projects/Sonic_Reader_Landing/index.html`. Hero, features grid, 3-tier pricing, FAQ, CTA. Zero dependencies.
- `DONE` **Test Heartbeat Connectivity** — Verify that the new mailbox-based dispatch is triggering correctly.
- `IN_PROGRESS` **Build Sonic Reader v2** — Phase 1 (scaffold) ✅ Phase 2 (engine) ✅ Phase 3 (UI polish + settings + build config) ✅. Full frontend + backend staged. Branch: `feature/sonic-v2-phase2-engine`.

### From Antigravity (Automation Opportunities)
- `DONE` **API Key Health Monitor** — Scheduled task that pings each API endpoint nightly and flags expired/depleted keys in the morning report. Eliminates manual "does this key still work?" checks.
- `REMOVED` **Git Auto-Commit for Agent Zero Workdir** — Defunct (Agent Zero removed).
- `DONE` **Conversation Archive Compressor** — Extract key decisions into KIs and compress old conversations.
- `REMOVED` **Integrate Agent Zero Dispatcher** — Defunct (Agent Zero removed).
- `DONE` **Morning Report Web Dashboard** — Premium HTML dashboard at `ops/morning-report/index.html` that renders `report-data.json` live. Served at `localhost:8888`.
- `REMOVED` **Subagent Profiles** — Created `frontend_dev` and `backend_arch` agent profiles under `agent_zero/usr/agents/` for Hive Mind delegation. (Profiles removed).

---

## Review Checklist
- [ ] Branch is isolated from `main`.
- [ ] No live deployments initiated.
- [ ] Code addresses a specific, measurable bottleneck or queued backlog item.
- [ ] Morning Report is formatted, named according to `PREFIX_#N_YY-MM-DD.md`, and ready for review.
