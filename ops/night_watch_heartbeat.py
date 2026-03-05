import os
import sys
import time
import subprocess
from datetime import datetime

BASE_DIR = r"c:\Users\steph\Desktop\Antigravity and Agent 0"
NIGHT_WATCH_PATH = os.path.join(BASE_DIR, "THE_NIGHT_WATCH.md")
DISPATCH_PATH = os.path.join(BASE_DIR, "comms", "dispatch.py")

def log(msg):
    # Print to console and optionally to a log file
    out = f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}"
    print(out)
    with open(os.path.join(BASE_DIR, "ops", "night_watch.log"), "a", encoding="utf-8") as f:
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
            
        # Dispatch the task to Agent Zero
        prompt = (
            f"NIGHT WATCH PROTOCOL INITIATED.\n\n"
            f"Please execute the following task from the backlog:\n{task_name}\n\n"
            f"Please review the contents of THE_NIGHT_WATCH.md for strict boundaries. "
            f"Remember, your boundary is to create a Pull Request / stage changes only."
        )
        
        log("Dispatching task to Agent Zero via comms/dispatch.py...")
        try:
            # We don't want to block the heartbeat indefinitely, but dispatch wait could be long.
            # Assuming dispatch API is fast and Agent Zero queues it.
            result = subprocess.run(
                [sys.executable, DISPATCH_PATH, prompt],
                capture_output=True,
                text=True,
                check=True
            )
            log("Task dispatched successfully.")
            log(f"Dispatch Output: {result.stdout.strip()}")
        except subprocess.CalledProcessError as e:
            log(f"Failed to dispatch task. Error: {e.stderr.strip() if e.stderr else str(e)}")
            # Revert the task status
            lines[match_index] = lines[match_index].replace("`IN_PROGRESS`", "`QUEUED`")
            with open(NIGHT_WATCH_PATH, "w", encoding="utf-8") as f:
                f.writelines(lines)
            log("Task reverted to QUEUED status due to dispatch failure.")
    else:
        log("No QUEUED tasks found in backlog.")

def main():
    log("Starting Night Watch Heartbeat. Monitoring active backlog...")
    if len(sys.argv) > 1 and sys.argv[1] == "--once":
        check_for_work()
        return

    while True:
        check_for_work()
        time.sleep(3600)  # Check once an hour

if __name__ == "__main__":
    main()
