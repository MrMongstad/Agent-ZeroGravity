"""
Sentinel Trace — Structured JSONL Logger for Antigravity System.

Usage:
    # Log an event
    python sentinel_trace.py --level info --event file_written --message "Updated GLOSSARY.md"

    # Log with file reference
    python sentinel_trace.py --level error --event command_failed --message "npm install failed" --stderr "ENOENT" --exit-code 1

    # Audit: scan for errors in today's log
    python sentinel_trace.py --audit

    # Audit: scan specific date
    python sentinel_trace.py --audit --date 2026-03-24
"""

import json
import os
import sys
import uuid
import argparse
from datetime import datetime, timezone

VAULT_DIR = os.path.join(os.path.dirname(__file__), "..", "memory", "logs", "vault")
SESSION_CORRELATION_ID = str(uuid.uuid4())[:8]


def get_log_path(date_str=None):
    """Get the JSONL log file path for a given date (default: today)."""
    if date_str is None:
        date_str = datetime.now().strftime("%Y-%m-%d")
    os.makedirs(VAULT_DIR, exist_ok=True)
    return os.path.join(VAULT_DIR, f"sentinel_{date_str}.jsonl")


def log_event(level, event, message, source="jarvis", correlation_id=None, **kwargs):
    """Append a structured JSONL entry to today's sentinel log."""
    entry = {
        "ts": datetime.now(timezone.utc).astimezone().isoformat(),
        "level": level,
        "event": event,
        "source": source,
        "correlation_id": correlation_id or SESSION_CORRELATION_ID,
        "message": message,
    }
    # Add optional fields if provided
    for key in ("file", "exit_code", "stderr", "duration_ms", "drift_score"):
        if key in kwargs and kwargs[key] is not None:
            entry[key] = kwargs[key]

    log_path = get_log_path()
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    return entry


def audit_logs(date_str=None, level_filter=None):
    """Scan a day's log for errors/warnings. Returns matching entries."""
    log_path = get_log_path(date_str)
    if not os.path.exists(log_path):
        print(f"No log file found: {log_path}")
        return []

    filter_levels = level_filter or ["error", "fatal", "warn"]
    matches = []

    with open(log_path, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
                if entry.get("level") in filter_levels:
                    matches.append(entry)
            except json.JSONDecodeError:
                print(f"  [CORRUPT] Line {line_num}: {line[:80]}")

    if matches:
        print(f"\n  Found {len(matches)} entries matching {filter_levels}:\n")
        for entry in matches:
            print(f"  [{entry['level'].upper()}] {entry['ts']} | {entry['event']} | {entry['message']}")
            if entry.get("stderr"):
                print(f"           stderr: {entry['stderr'][:200]}")
    else:
        print(f"  Clean. No {filter_levels} entries found.")

    return matches


def detect_loops(date_str=None, threshold=5, window_seconds=60):
    """Detect repeated events within a time window."""
    log_path = get_log_path(date_str)
    if not os.path.exists(log_path):
        return []

    entries = []
    with open(log_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    entries.append(json.loads(line))
                except json.JSONDecodeError:
                    pass

    loops = []
    for i, entry in enumerate(entries):
        count = sum(
            1 for e in entries[i:i + threshold * 2]
            if e.get("event") == entry.get("event")
        )
        if count >= threshold:
            loops.append({"event": entry["event"], "count": count, "first_ts": entry["ts"]})

    # Deduplicate
    seen = set()
    unique_loops = []
    for loop in loops:
        if loop["event"] not in seen:
            seen.add(loop["event"])
            unique_loops.append(loop)
            print(f"  [LOOP] Event '{loop['event']}' repeated {loop['count']}x starting at {loop['first_ts']}")

    return unique_loops


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sentinel Trace — Structured Logger")
    parser.add_argument("--audit", action="store_true", help="Scan logs for errors/warnings")
    parser.add_argument("--loops", action="store_true", help="Detect repeated event loops")
    parser.add_argument("--date", type=str, default=None, help="Date to audit (YYYY-MM-DD)")
    parser.add_argument("--level", type=str, default="info", help="Log level")
    parser.add_argument("--event", type=str, default="generic", help="Event name (snake_case)")
    parser.add_argument("--message", type=str, default="", help="Human-readable message")
    parser.add_argument("--source", type=str, default="jarvis", help="Origin service")
    parser.add_argument("--file", type=str, default=None, help="Affected file path")
    parser.add_argument("--stderr", type=str, default=None, help="Captured stderr")
    parser.add_argument("--exit-code", type=int, default=None, dest="exit_code", help="Exit code")

    args = parser.parse_args()

    if args.audit:
        audit_logs(date_str=args.date)
    elif args.loops:
        detect_loops(date_str=args.date)
    else:
        entry = log_event(
            level=args.level,
            event=args.event,
            message=args.message,
            source=args.source,
            file=args.file,
            stderr=args.stderr,
            exit_code=args.exit_code,
        )
        print(f"  Logged: [{entry['level']}] {entry['event']} — {entry['message']}")
