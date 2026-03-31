import os
import sys
import time
import subprocess
from datetime import datetime

BASE_DIR = r"c:\Users\steph\Desktop\Antigravity and Agent 0"
NIGHT_WATCH_PATH = os.path.join(BASE_DIR, "workspace", "protocols", "night_watch.md")
DISPATCH_PATH = os.path.join(BASE_DIR, "workspace", "skills", "dispatch.py")

def log(msg):
    # Print to console and optionally to a log file
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    iso_timestamp = datetime.now().isoformat()
    out = f"[{timestamp}] {msg}"
    print(out)
    
    # 1. Standard night_watch.log
    log_dir = os.path.join(BASE_DIR, "workspace", "memory", "logs")
    os.makedirs(log_dir, exist_ok=True)
    with open(os.path.join(log_dir, "night_watch.log"), "a", encoding="utf-8") as f:
        f.write(out + "\n")
        
    # 2. Sentinel JSONL for Morning Report integration
    vault_dir = os.path.join(log_dir, "vault")
    os.makedirs(vault_dir, exist_ok=True)
    sentinel_file = os.path.join(vault_dir, f"sentinel_{datetime.now().strftime('%Y-%m-%d')}.jsonl")
    log_entry = {
        "timestamp": iso_timestamp,
        "event": "HEARTBEAT_MAINTENANCE",
        "details": msg
    }
    with open(sentinel_file, "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry) + "\n")

def check_for_work():
    if not os.path.exists(NIGHT_WATCH_PATH):
        log("THE_NIGHT_WATCH.md not found.")
        return

    try:
        with open(NIGHT_WATCH_PATH, "r", encoding="utf-8") as f:
            lines = f.readlines()
    except Exception as e:
        log(f"Error reading Night Watch file: {e}")
        return

    found_queued = False
    task_name = ""
    match_index = -1

    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("- `QUEUED`") or stripped.startswith("- QUEUED"):
            found_queued = True
            task_name = stripped
            match_index = i
            # Change status to IN_PROGRESS
            lines[i] = line.replace("`QUEUED`", "`IN_PROGRESS`", 1).replace("- QUEUED", "- `IN_PROGRESS`", 1)
            break

    if found_queued:
        log(f"Found queued task: {task_name}")
        
        # Save file to update status (optimistic lock)
        with open(NIGHT_WATCH_PATH, "w", encoding="utf-8") as f:
            f.writelines(lines)
            
        log("DISPATCH: Agent Zero decommissioned. Task marked as IN_PROGRESS for Bridge Executor processing.")
        log("The [Cline-Nexus Bridge] will now ingest this task from the protocols backlog.")
    else:
        log("No QUEUED tasks found in backlog.")

def main():
    log("Starting Night Watch Heartbeat. Monitoring active backlog...")
    if len(sys.argv) > 1 and sys.argv[1] == "--once":
        check_for_work()
        return

    while True:
        check_for_work()
        time.sleep(300)  # Check every 5 minutes for better responsiveness

if __name__ == "__main__":
    main()
