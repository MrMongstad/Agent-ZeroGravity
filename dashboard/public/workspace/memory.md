# Long-Term Memory: Insights & Decisions

## Architectural Guardrails
- **Design Pattern:** Moritz/Isenberg 10-Step Optimization (Adopted 2026.03.23).
- **Filesystem:** Unified `workspace/` hierarchy. All agent context lives here.
- **Model Fallback:** Claude 3.5 Sonnet (primary) → Claude 3.5 Haiku (utility) → OpenRouter → OpenAI.
- **Embeddings:** HuggingFace local (`sentence-transformers/all-MiniLM-L6-v2`) — no external vector DB needed.
- **Security:** `.env` for secrets, `.gitignore` for exclusion. Prompt injection defense in `agents.md`.

## Critical Decisions (Chronological)
- **2026.03.05:** Sonic Reader V2 scaffold complete: Vite/React/Tauri 2.0, GhostOverlay, Chrome Legacy Window fix (recursive vault search in `scraper.rs`). 3 commits staged on isolated branch.
- **2026.03.06:** Fixed critical path breakage after directory rename (`Antigravity & Agent 0` → `Antigravity and Agent 0`). Patched `dispatch.py` and `start_agent_zero.vbs`. Also fixed: UTF-16 LE log corruption (PowerShell `>` operator), tmux `list_sessions` crash on Windows, PtyProcess `.kill()` AttributeError.
- **2026.03.16:** Cline integrated as Specialist Operator under Agent 0 Protocol v1.2. Synchronized with Imperial Master Bridge.
- **2026.03.23 (01:41 CET):** Full System Rebuild initiated. Migrated from scattered dirs to unified `workspace/` (Moritz/Isenberg model).
- **2026.03.23 (02:10 CET):** Bulletproof Rebuild Plan v2.0 approved. 14 issues identified, 29-step plan executed.
- **2026.03.23 (02:10 CET):** Hardcoded API key removed from `mcp config.json`. Exposed key rotated.
- **2026.03.23 (02:56 CET):** `Antigravity-Heartbeat` Task Scheduler registered. First pulse confirmed clean (exit 0).

## Known System Behaviours & Gotchas
- **PowerShell `>` operator writes UTF-16 LE** — always use Python/Node file writers for logs, never shell redirection.
- **Directory rename breaks hardcoded paths** — all scripts use `BASE_DIR` variable, never hardcoded `&` in paths.
- **Chrome Legacy Window bug** — `element_from_point()` returns dummy handle. Fixed in V2 `scraper.rs` via recursive vault search.
- **Agent Zero watchdog:** `watchdog.bat` pings `localhost:5000/health` every 60s. If down, restarts `run_ui.py`.
- **Tmux on Windows:** `list_sessions` raises `FileNotFoundError` if tmux not installed. Guarded with `try/except FileNotFoundError`.

## Legacy System Knowledge
- **Night Watch Protocol:** Background heartbeat polls `workspace/protocols/night_watch.md` for QUEUED tasks → dispatches to Agent Zero via `workspace/skills/dispatch.py` → writes to `workspace/comms/mailbox.json`.
- **Hive Mind:** Night Watch can delegate to local sub-agents (`frontend_dev`, `backend_arch`) or Cline.
- **Morning Report Dashboard:** `workspace/skills/morning-report/index.html` renders `report-data.json` live at `localhost:8888`.
- **API Health Monitor:** `ops/api_health_monitor.py` (now migrated) — pings API endpoints nightly, flags expired keys.
- **Git Auto-Commit:** `_60_workdir_autocommit.py` in Agent Zero extension — commits `usr/workdir` changes after tasks.

## Active Project Status (as of 2026.03.23)
| Project | Phase | Next Action |
|:---|:---|:---|
| Sonic Reader V2 | Phase 3 pending (UI polish, settings, build config) | PR review required |
| Sonic Reader Landing | DONE | Live at `projects/Sonic_Reader_Landing/` |
| morgenrapport-triage | Active | Ongoing |
| Auto-backup configs | IN_PROGRESS | Night Watch to continue |

## User Preferences
- **Tone:** High-Octane, Dry Wit, Zero-Fluff (Jarvis persona).
- **Verification:** Mandatory HitL before broad system execution. Use `<ask>` tag.
- **Privacy:** Reject all cookies. No personal data spread.
- **Cost:** OAuth method preferred. Conservative budget. Flag anything exceeding normal token usage.
- **Logs:** PowerShell UTF-16 avoided. Python/Node writers only for log files.
- **Reporting Standard:** All reports and logs must use `PREFIX_#N_YY-MM-DD.md` (e.g., `MORNING_REPORT_#1_26-03-23.md`). Increment `N` for each file created on the same day. Include the creation time and covered timespan *inside* the report body. No time in the filename.

