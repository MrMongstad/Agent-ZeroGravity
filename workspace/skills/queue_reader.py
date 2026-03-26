import os
import json
import time
from datetime import datetime, timezone

# Protocol Config
QUEUE_DIR = "workspace/comms/queue"
VORTEX_STATE_PATH = "workspace/comms/vortex_state.json"
STATE_JSON_PATH = "workspace/state.json"
LOG_DIR = "workspace/memory/logs/vault"

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
        print(f"Failed to log sentinel: {e}")

def process_queue():
    if not os.path.exists(QUEUE_DIR):
        return

    # 1. Scan for .status or .done files (Cline marks completion)
    # Note: Cline might write a specific status file or update the task file
    for filename in os.listdir(QUEUE_DIR):
        if filename.endswith(".done") or filename.endswith(".status"):
            task_id = filename.split(".")[0]
            status_file = os.path.join(QUEUE_DIR, filename)
            
            try:
                with open(status_file, "r", encoding="utf-8") as f:
                    status_content = f.read().strip()
                
                # 2. Update vortex_state.json
                if os.path.exists(VORTEX_STATE_PATH):
                    with open(VORTEX_STATE_PATH, "r", encoding="utf-8") as f:
                        vortex = json.load(f)
                    
                    # Log finding the completion
                    log_sentinel("HANDSHAKE_RECEIVE", f"Task {task_id} marked as {filename.split('.')[-1]}")
                    
                    # Update status in vortex (Simplified logic: finding the conversation)
                    # For now, we update the master state.
                    if os.path.exists(STATE_JSON_PATH):
                        with open(STATE_JSON_PATH, "r", encoding="utf-8") as f:
                            state = json.load(f)
                        state["agent_status"]["cline"] = "idle"
                        state["current_task"] = None
                        with open(STATE_JSON_PATH, "w", encoding="utf-8") as f:
                            json.dump(state, f, indent=2)

                # 3. Cleanup: Move to archive or delete
                os.remove(status_file)
                # Also remove the original .task file if it exists
                task_path = os.path.join(QUEUE_DIR, f"{task_id}.task")
                if os.path.exists(task_path):
                    os.remove(task_path)
                    
                print(f"[+] 2-Way Handshake Complete: Task {task_id} processed.")
            except Exception as e:
                log_sentinel("ERROR", f"Failed to process queue item {filename}: {e}")

if __name__ == "__main__":
    process_queue()
