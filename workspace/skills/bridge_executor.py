import os
import json
import time
import subprocess
from datetime import datetime, timezone
import re
import hashlib

# Configuration
VORTEX_STATE_PATH = "workspace/comms/vortex_state.json"
NIGHT_WATCH_PATH = "workspace/memory/night_watch.md"
LOG_DIR = "workspace/memory/logs/vault"
ERROR_LOG = "error_utf8.log"
PROCESSED_TASKS_PATH = "workspace/memory/processed_tasks.json"
STATE_JSON_PATH = "workspace/state.json"
QUEUE_DIR = "workspace/comms/queue"

def update_state(updates):
    if not os.path.exists(STATE_JSON_PATH):
        return
    try:
        with open(STATE_JSON_PATH, "r", encoding="utf-8") as f:
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

def load_processed_tasks():
    if os.path.exists(PROCESSED_TASKS_PATH):
        try:
            with open(PROCESSED_TASKS_PATH, "r", encoding="utf-8") as f:
                return set(json.load(f))
        except:
            return set()
    return set()

def save_processed_task(task_id):
    processed = list(load_processed_tasks())
    if task_id not in processed:
        processed.append(task_id)
        with open(PROCESSED_TASKS_PATH, "w", encoding="utf-8") as f:
            json.dump(processed, f)

def log_sentinel(event_type, details):
    """Logs events to the sentinel trace file in JSONL format."""
    today = datetime.now().strftime("%Y-%m-%d")
    log_file = os.path.join(LOG_DIR, f"sentinel_{today}.jsonl")
    
    log_entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event": event_type,
        "details": details
    }
    
    try:
        if not os.path.exists(LOG_DIR):
            os.makedirs(LOG_DIR)
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry) + "\n")
    except Exception as e:
        with open(ERROR_LOG, "a", encoding="utf-8") as ef:
            ef.write(f"[{datetime.now(timezone.utc).isoformat()}] Failed to write to sentinel log: {str(e)}\n")

def check_vortex_directives():
    """Checks vortex_state.json for unhandled DIRECTIVE or DELEGATE acts."""
    if not os.path.exists(VORTEX_STATE_PATH):
        return []

    try:
        with open(VORTEX_STATE_PATH, "r", encoding="utf-8") as f:
            state = json.load(f)
            
        new_tasks = []
        conversations = state.get("active_conversations", {})
        for conv_id, conv_data in conversations.items():
            history = conv_data.get("history", [])
            for msg in history:
                if msg.get("type") in ["DIRECTIVE", "DELEGATE"]:
                    # Use a stable hash of the content as an ID for now
                    task_id = hashlib.md5(f"{conv_id}:{msg.get('content')}".encode()).hexdigest()
                    new_tasks.append({
                        "id": task_id,
                        "source": f"vortex:{conv_id}",
                        "content": msg.get("content"),
                        "type": msg.get("type")
                    })
        return new_tasks
    except Exception as e:
        log_sentinel("ERROR", f"Failed to parse vortex state: {str(e)}")
        return []

def check_night_watch_backlog():
    """Checks night_watch.md for QUEUED items."""
    if not os.path.exists(NIGHT_WATCH_PATH):
        return []

    try:
        with open(NIGHT_WATCH_PATH, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Look for patterns like - [ ] QUEUED: Task description
        queued_items = re.findall(r"- \[ \] QUEUED: (.*)", content)
        tasks = []
        for item in queued_items:
            task_id = hashlib.md5(f"night_watch:{item}".encode()).hexdigest()
            tasks.append({"id": task_id, "source": "night_watch", "content": item, "type": "QUEUED"})
        return tasks
    except Exception as e:
        log_sentinel("ERROR", f"Failed to parse night watch: {str(e)}")
        return []

def trigger_agent_loop(task):
    """Triggers the appropriate agent loop for the task."""
    log_sentinel("TRIGGER", f"Executing task from {task['source']}: {task['content'][:50]}...")
    
    # --- Protocol Phase 4: Cache & Budget Check ---
    # 1. Cache Check
    try:
        from cache_check import check_cache
        match_found, existing_id = check_cache(task['content'])
        if match_found:
            log_sentinel("CACHE_HIT", f"Task already processed: {existing_id}. Skipping.")
            print(f"[-] Cache Hit: {existing_id}. Skipping redundant task.")
            save_processed_task(task['id'])
            return
    except ImportError:
        log_sentinel("WARNING", "cache_check.py not found in path. Skipping cache audit.")
    except Exception as e:
        log_sentinel("ERROR", f"Cache check failed: {str(e)}")

    # 2. Token Terminator (Budget Enforcement)
    try:
        # We run this as a subprocess to handle the sys.exit(1) on budget failure
        result = subprocess.run(
            ["python", "workspace/skills/token_terminator.py", "--check", "--mission", task['content']],
            capture_output=True,
            text=True
        )
        if result.returncode != 0:
            log_sentinel("BUDGET_EXCEEDED", f"Task {task['id']} blocked by Token-Terminator.")
            print(f"[!] BUDGET EXCEEDED: {result.stdout}")
            return # Don't process this task
    except Exception as e:
        log_sentinel("ERROR", f"Token-Terminator check failed: {str(e)}")
    # -----------------------------------------------

    print(f"[*] Dispatching task to Nexus/Cline: {task['content'][:100]}...")
    
    if not os.path.exists(QUEUE_DIR):
        os.makedirs(QUEUE_DIR)
        
    task_file_path = os.path.join(QUEUE_DIR, f"{task['id']}.task")
    try:
        with open(task_file_path, "w", encoding="utf-8") as f:
            f.write(task['content'])
        log_sentinel("SUCCESS", f"Task {task['id']} queued successfully at {task_file_path}.")
        save_processed_task(task['id'])
    except Exception as e:
        log_sentinel("ERROR", f"Failed to write task file: {str(e)}")

    # If it's a Night Watch item, we should ideally mark it DONE in the MD
    if task['source'] == "night_watch":
        mark_night_watch_done(task['content'])

def mark_night_watch_done(task_content):
    if not os.path.exists(NIGHT_WATCH_PATH):
        return
    try:
        with open(NIGHT_WATCH_PATH, "r", encoding="utf-8") as f:
            content = f.read()
        new_content = content.replace(f"- [ ] QUEUED: {task_content}", f"- [x] DONE: {task_content}")
        with open(NIGHT_WATCH_PATH, "w", encoding="utf-8") as f:
            f.write(new_content)
    except Exception as e:
        log_sentinel("ERROR", f"Failed to mark Night Watch item done: {str(e)}")

def main_loop():
    """Main polling loop for the bridge."""
    log_sentinel("HEARTBEAT", "Cline-Nexus Bridge Started.")
    print("[!] Cline-Nexus Bridge Active. Polling for directives...")
    
    update_state({"agent_status": {"nexus": "running"}})
    
    consecutive_failures = 0
    
    try:
        while True:
            try:
                # Update Heartbeat in state.json
                with open(STATE_JSON_PATH, "r", encoding="utf-8") as f:
                    state = json.load(f)
                state["heartbeat_count"] = state.get("heartbeat_count", 0) + 1
                state["last_heartbeat"] = datetime.now(timezone.utc).isoformat()
                with open(STATE_JSON_PATH, "w", encoding="utf-8") as f:
                    json.dump(state, f, indent=2)

                tasks = []
                tasks.extend(check_vortex_directives())
                tasks.extend(check_night_watch_backlog())
                
                current_task_info = None
                
                if tasks:
                    processed = load_processed_tasks()
                    for task in tasks:
                        if task['id'] not in processed:
                            trigger_agent_loop(task)
                            current_task_info = task['id']
                        else:
                            print(f"[-] Skipping already processed task: {task['id']}")
                
                update_state({
                    "current_task": current_task_info,
                    "last_checkpoint": "polling_complete"
                })
                
                log_sentinel("HEARTBEAT", f"Active. Found {len(tasks)} items in queue.")
                consecutive_failures = 0 # Reset on success
                
            except Exception as e:
                consecutive_failures += 1
                log_sentinel("ERROR", f"Loop failure ({consecutive_failures}/3): {str(e)}")
                
                if consecutive_failures >= 3:
                    log_sentinel("HALT", "3-Strike Rule triggered. Shutting down.")
                    with open(ERROR_LOG, "a", encoding="utf-8") as ef:
                        ef.write(f"[{datetime.now(timezone.utc).isoformat()}] BRIDGE CRITICAL FAILURE: 3-strike rule.\n")
                    break
            
            # Poll every 60 seconds (scaled for this demo/task context)
            time.sleep(60)
            
    finally:
        update_state({"agent_status": {"nexus": "idle"}})
        log_sentinel("HEARTBEAT", "Cline-Nexus Bridge Stopped.")

if __name__ == "__main__":
    main_loop()
