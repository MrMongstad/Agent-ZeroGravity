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
    out = f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}"
    print(out)
    with open(os.path.join(BASE_DIR, "workspace", "memory", "logs", "night_watch.log"), "a", encoding="utf-8") as f:
        f.write(out + "\n")

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
            
        log("DISPATCH DISABLED: Agent Zero has been decommissioned. Task remains in IN_PROGRESS status.")
        log("Manual intervention or new executor (Cline) required for task execution.")
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
