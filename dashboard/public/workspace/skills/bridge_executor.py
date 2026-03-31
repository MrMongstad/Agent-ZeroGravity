"""
bridge_executor.py — JARVIS→Cline Bridge (Polling Loop)
Polls vortex_state.json and night_watch.md for unprocessed DIRECTIVE/DELEGATE tasks.
Routes each task to cline_executor.py for autonomous execution.
"""

import os
import json
import time
import subprocess
import hashlib
from datetime import datetime, timezone

# ─── Config ───────────────────────────────────────────────────────────────────
VORTEX_STATE_PATH   = "workspace/comms/vortex_state.json"
NIGHT_WATCH_PATH    = "workspace/protocols/night_watch.md"
LOG_DIR             = "workspace/memory/logs/vault"
ERROR_LOG           = "error_utf8.log"
PROCESSED_TASKS_PATH = "workspace/memory/processed_tasks.json"
STATE_JSON_PATH     = "workspace/state.json"
QUEUE_DIR           = "workspace/comms/queue"
POLL_INTERVAL       = 5   # seconds

# ─── State Bus ────────────────────────────────────────────────────────────────
def update_state(updates):
    if not os.path.exists(STATE_JSON_PATH):
        return
    try:
        with open(STATE_JSON_PATH, "r", encoding="utf-8-sig") as f:
            state = json.load(f)
        for key, value in updates.items():
            if isinstance(value, dict) and key in state and isinstance(state[key], dict):
                state[key].update(value)
            else:
                state[key] = value
        state["last_updated"] = datetime.now(timezone.utc).isoformat()
        with open(STATE_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2)
    except Exception as e:
        log_sentinel("ERROR", f"Failed to update state.json: {str(e)}")

# ─── Processed Task Registry ──────────────────────────────────────────────────
def load_processed_tasks():
    if os.path.exists(PROCESSED_TASKS_PATH):
        try:
            with open(PROCESSED_TASKS_PATH, "r", encoding="utf-8-sig") as f:
                return set(json.load(f))
        except Exception:
            return set()
    return set()

def save_processed_task(task_id):
    processed = list(load_processed_tasks())
    if task_id not in processed:
        processed.append(task_id)
        with open(PROCESSED_TASKS_PATH, "w", encoding="utf-8") as f:
            json.dump(processed, f)

# ─── Sentinel Logger ──────────────────────────────────────────────────────────
def log_sentinel(event_type, details):
    today = datetime.now().strftime("%Y-%m-%d")
    log_file = os.path.join(LOG_DIR, f"sentinel_{today}.jsonl")
    log_entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event": event_type,
        "details": details
    }
    try:
        os.makedirs(LOG_DIR, exist_ok=True)
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry) + "\n")
    except Exception as e:
        with open(ERROR_LOG, "a", encoding="utf-8") as ef:
            ef.write(f"[{datetime.now(timezone.utc).isoformat()}] Sentinel log failure: {str(e)}\n")

# ─── Task Sources ─────────────────────────────────────────────────────────────
def check_vortex_directives():
    if not os.path.exists(VORTEX_STATE_PATH):
        return []
    try:
        with open(VORTEX_STATE_PATH, "r", encoding="utf-8-sig") as f:
            state = json.load(f)
        new_tasks = []
        for conv_id, conv_data in state.get("active_conversations", {}).items():
            for msg in conv_data.get("history", []):
                if msg.get("type") in ["DIRECTIVE", "DELEGATE"] and msg.get("sender") == "jarvis":
                    task_id = hashlib.md5(f"{conv_id}:{msg.get('content')}".encode()).hexdigest()
                    new_tasks.append({
                        "id": task_id,
                        "conv_id": conv_id,
                        "source": f"vortex:{conv_id}",
                        "content": msg.get("content"),
                        "type": msg.get("type")
                    })
        return new_tasks
    except Exception as e:
        log_sentinel("ERROR", f"Failed to parse vortex state: {str(e)}")
        return []

def check_night_watch_backlog():
    import re
    if not os.path.exists(NIGHT_WATCH_PATH):
        return []
    try:
        with open(NIGHT_WATCH_PATH, "r", encoding="utf-8") as f:
            content = f.read()
        tasks = []
        for item in re.findall(r"- \[ \] QUEUED: (.*)", content):
            task_id = hashlib.md5(f"night_watch:{item}".encode()).hexdigest()
            tasks.append({"id": task_id, "conv_id": task_id, "source": "night_watch",
                          "content": item, "type": "QUEUED"})
        return tasks
    except Exception as e:
        log_sentinel("ERROR", f"Failed to parse night watch: {str(e)}")
        return []

# ─── Night Watch Completion ────────────────────────────────────────────────────
def mark_night_watch_done(task_content):
    if not os.path.exists(NIGHT_WATCH_PATH):
        return
    try:
        with open(NIGHT_WATCH_PATH, "r", encoding="utf-8") as f:
            content = f.read()
        new_content = content.replace(
            f"- [ ] QUEUED: {task_content}",
            f"- [x] DONE: {task_content}"
        )
        with open(NIGHT_WATCH_PATH, "w", encoding="utf-8") as f:
            f.write(new_content)
    except Exception as e:
        log_sentinel("ERROR", f"Failed to mark Night Watch item done: {str(e)}")

# ─── Task Dispatcher ──────────────────────────────────────────────────────────
def trigger_agent_loop(task):
    """Routes a task to the Cline autonomous executor."""
    log_sentinel("TRIGGER", f"Executing task from {task['source']}: {task['content'][:50]}...")

    # 1. Cache Check
    try:
        from cache_check import check_cache
        match_found, existing_id = check_cache(task['content'])
        if match_found:
            log_sentinel("CACHE_HIT", f"Already processed: {existing_id}. Skipping.")
            print(f"[-] Cache Hit: {existing_id}. Skipping.")
            save_processed_task(task['id'])
            return
    except ImportError:
        log_sentinel("WARNING", "cache_check.py not found. Skipping cache audit.")
    except Exception as e:
        log_sentinel("ERROR", f"Cache check failed: {str(e)}")

    # 2. Budget Check
    try:
        result = subprocess.run(
            ["python", "workspace/skills/token_terminator.py", "--check", "--mission", task['content']],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            log_sentinel("BUDGET_EXCEEDED", f"Task {task['id']} blocked.")
            print(f"[!] BUDGET EXCEEDED: {result.stdout}")
            return
    except Exception as e:
        log_sentinel("ERROR", f"Token-Terminator check failed: {str(e)}")

    # 3. Dispatch to Cline Executor
    print(f"[*] Dispatching to Cline Executor: {task['content'][:100]}...")
    try:
        import sys as _sys
        skills_dir = os.path.dirname(os.path.abspath(__file__))
        if skills_dir not in _sys.path:
            _sys.path.insert(0, skills_dir)
        from cline_executor import run as cline_run

        result = cline_run(task['conv_id'], task['content'])
        log_sentinel("SUCCESS", f"Task {task['id']} complete. Rounds={result['rounds']} Tools={result['tool_calls']}")
        save_processed_task(task['id'])

        if task['source'] == 'night_watch':
            mark_night_watch_done(task['content'])

    except Exception as e:
        log_sentinel("ERROR", f"Cline Executor failed for task {task['id']}: {str(e)}")
        print(f"[!] Cline Executor error: {e}")

# ─── Main Polling Loop ────────────────────────────────────────────────────────
def main_loop():
    log_sentinel("HEARTBEAT", "Cline-Nexus Bridge Started.")
    print("[!] Cline-Nexus Bridge Active. Polling for directives...")
    update_state({"agent_status": {"nexus": "running"}})
    consecutive_failures = 0

    try:
        while True:
            try:
                # Update heartbeat
                if os.path.exists(STATE_JSON_PATH):
                    with open(STATE_JSON_PATH, "r", encoding="utf-8") as f:
                        state = json.load(f)
                    state["heartbeat_count"] = state.get("heartbeat_count", 0) + 1
                    state["last_heartbeat"] = datetime.now(timezone.utc).isoformat()
                    with open(STATE_JSON_PATH, "w", encoding="utf-8") as f:
                        json.dump(state, f, indent=2)

                tasks = []
                tasks.extend(check_vortex_directives())
                tasks.extend(check_night_watch_backlog())

                # Check for completions
                try:
                    from queue_reader import process_queue
                    process_queue()
                except Exception as e:
                    log_sentinel("ERROR", f"Queue Reader failure: {e}")

                current_task_info = None
                if tasks:
                    processed = load_processed_tasks()
                    for task in tasks:
                        if task['id'] not in processed:
                            trigger_agent_loop(task)
                            current_task_info = task['id']
                        else:
                            print(f"[-] Skipping already processed task: {task['id']}")

                update_state({"current_task": current_task_info, "last_checkpoint": "polling_complete"})
                log_sentinel("HEARTBEAT", f"Active. Found {len(tasks)} items in queue.")
                consecutive_failures = 0

            except Exception as e:
                consecutive_failures += 1
                log_sentinel("ERROR", f"Loop failure ({consecutive_failures}/3): {str(e)}")
                if consecutive_failures >= 3:
                    log_sentinel("HALT", "3-Strike Rule triggered. Shutting down.")
                    break

            time.sleep(POLL_INTERVAL)

    finally:
        update_state({"agent_status": {"nexus": "idle"}})
        log_sentinel("HEARTBEAT", "Cline-Nexus Bridge Stopped.")


if __name__ == "__main__":
    main_loop()
