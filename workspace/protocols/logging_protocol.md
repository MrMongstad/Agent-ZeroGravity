# Logging Protocol: Antigravity System

> Canonical reference for all structured logging. Aligns with OpenTelemetry and ClawHub best practices.

## Log Format

All operational logs use **JSONL** (JSON Lines). One JSON object per line.

### Required Fields

| Field | Type | Example | Description |
|:------|:-----|:--------|:------------|
| `ts` | ISO 8601 | `2026-03-24T17:30:00+01:00` | Timestamp with timezone |
| `level` | enum | `info` | One of: `debug`, `info`, `warn`, `error`, `fatal` |
| `event` | snake_case | `file_written` | Machine-readable event name |
| `source` | string | `sentinel` | Origin service or skill |
| `correlation_id` | UUID | `a1b2c3d4-...` | Groups related entries across a session |
| `message` | string | `Updated GLOSSARY.md` | Human-readable description |

### Optional Fields

| Field | Type | Description |
|:------|:-----|:------------|
| `file` | string | File path affected |
| `exit_code` | int | Terminal command exit code (0 = success) |
| `stderr` | string | Captured stderr output |
| `duration_ms` | int | Execution time in milliseconds |
| `drift_score` | float | 0.0–1.0 deviation from objective (drift analysis only) |

## Log Levels

| Level | Use |
|:------|:----|
| `debug` | Verbose trace data. Disabled in production. |
| `info` | Normal operations (file writes, tool calls). |
| `warn` | Recoverable issues (retry, fallback triggered). |
| `error` | Failed operations (terminal errors, tool failures). |
| `fatal` | System halt required. Escalate to Architect. |

## File Locations

| File | Path | Purpose |
|:-----|:-----|:--------|
| Sentinel Trace | `memory/logs/vault/sentinel.jsonl` | Primary structured log |
| Error Log | `memory/logs/error.log` | Legacy error capture |
| Night Watch | `memory/logs/night_watch.log` | Heartbeat cycle log |

## Terminal Error Capture

All terminal commands must have their `stderr` and `exit_code` captured. Failed commands (`exit_code != 0`) are logged at `error` level with the full `stderr` output.

## Log Rotation

- Daily rotation: `sentinel_YYYY-MM-DD.jsonl`
- Retain 30 days in `vault/`
- Older logs archived or pruned per Architect directive

## Audit Procedure

1. **On-Demand:** Run `sentinel_trace.py --audit` to scan for `error`/`fatal` entries.
2. **Drift Analysis:** Compare last N actions against the session's stated `<goal>` to detect objective drift.
3. **Loop Detection:** Flag any `event` that repeats >5 times within 60 seconds.

## Example Entry

```json
{"ts":"2026-03-24T17:30:00+01:00","level":"info","event":"file_written","source":"jarvis","correlation_id":"a1b2c3d4","message":"Updated GLOSSARY.md","file":"workspace/GLOSSARY.md"}
```
