import os
import json
import time
import logging
from datetime import datetime
from dotenv import load_dotenv

# Setup basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - VORTEX - %(levelname)s - %(message)s')

# Resolve root directory (the parent of the workspace/ folder)
# Script is in scripts/, so parent is workspace/, and parent of that is root.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(os.path.dirname(SCRIPT_DIR)) 
load_dotenv(dotenv_path=os.path.join(ROOT_DIR, ".env"))

# State file configuration relative to the root
STATE_FILE = os.path.join(ROOT_DIR, "workspace", "comms", "vortex_state.json")

def atomic_write_json(file_path, data):
    """Writes JSON data atomically to prevent corruption during polling."""
    temp_file = f"{file_path}.tmp"
    with open(temp_file, 'w') as f:
        json.dump(data, f, indent=2)
    os.replace(temp_file, file_path)

def poll_vortex():
    logging.info(f"Vortex Daemon started. Polling {STATE_FILE}...")
    
    while True:
        try:
            if not os.path.exists(STATE_FILE):
                logging.warning(f"Waiting for {STATE_FILE} to be initialized...")
                time.sleep(5)
                continue

            with open(STATE_FILE, 'r') as f:
                state = json.load(f)

            # Check for new tasks in the task_queue
            queue = state.get("task_queue", [])
            modified = False

            for task in queue:
                if task.get("status") == "pending":
                    task_id = task.get("id", "unknown")
                    payload = task.get("content", "N/A")
                    
                    logging.info(f"CAPTURED TASK [{task_id}]: {payload}")
                    
                    # Mark as processing
                    task["status"] = "processing"
                    task["picked_up_at"] = datetime.utcnow().isoformat() + "Z"
                    modified = True
                    
                    # --- DELEGATION LOGIC ---
                    # In a real scenario, this is where we trigger a sub-agent process.
                    # For now, it just signals that the system is 'listening'.
                    # --- END DELEGATION ---

            if modified:
                state["last_updated"] = datetime.utcnow().isoformat() + "Z"
                atomic_write_json(STATE_FILE, state)
                logging.info("Vortex state updated. Task pushed to processing pipeline.")

        except json.JSONDecodeError:
            logging.error("Vortex state file is currently being written or is malformed. Retrying...")
        except Exception as e:
            logging.error(f"Daemon Loop Error: {str(e)}")

        time.sleep(5)

if __name__ == "__main__":
    poll_vortex()
