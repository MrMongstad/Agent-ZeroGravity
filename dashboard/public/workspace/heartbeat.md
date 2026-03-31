# Heartbeat Maintenance Cycle
# This file defines the automated tasks performed every 30 minutes to ensure system health.

## 0. Trigger Logic
- **Interval:** 30 Minutes.
- **Trigger:** Windows Task Scheduler → `workspace/skills/heartbeat_runner.ps1`
- **Fallback:** Manual via `workspace/skills/start_night_watch.bat`

## 1. Memory Maintenance
- **Action:** Check current session logs.
- **Procedure:** 
  1. Generate a brief summary of all interactions since the last heartbeat.
  2. Append summary to `workspace/memory/session_YYYY-MM-DD.md`.
  3. If significant architectural decisions were made, update `workspace/memory.md`.

## 2. Context Compaction Guard
- **Action:** Monitor context window usage.
- **Procedure:** If the context is nearing its limit, perform a "Compaction Flush": save the full technical state to `workspace/memory/` AND `workspace/memory.md` before clearing the transient session.
- **Settings:**
  - `set compaction memory flush enable to true`
  - `set memory search.experimental.session memory to true`

## 3. Task & To-Do Reconciliation
- **Action:** Reconcile `task.md` with filesystem changes.
- **Procedure:** Check for newly created artifacts or reports. Mark corresponding `task.md` items as `[x]`.

## 4. Cron Health Check
- **Action:** Verify that background tasks (Morning Reports, Night Watch) successfully executed.
- **Procedure:** Check `workspace/memory/logs/` for new errors. If errors are detected, notify Stephan in the next interaction.

## 5. Security Scan (Least Access)
- **Action:** Verify `.env` is not indexed or exposed.
- **Procedure:** Confirm `.gitignore` excludes `.env` and log files.
