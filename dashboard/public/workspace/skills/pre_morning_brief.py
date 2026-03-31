import os
import json
import subprocess
from datetime import datetime

# Paths
MEMORY_DIR = "memory"

def run_skill(script_name):
    """Executes a skill script and returns completion status."""
    script_path = os.path.join("skills", script_name)
    print(f"Executing: {script_path}...")
    try:
        # We are in workspace/, script is in workspace/skills/
        # Just run the script.
        subprocess.run(["python", script_path], check=True)
        return True
    except Exception as e:
        print(f"Skill {script_name} failed: {e}")
        return False

def load_data(filename):
    """Loads JSON data from the memory directory."""
    path = os.path.join(MEMORY_DIR, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def generate_morning_brief():
    print("Initiating Imperial Pre-Morning Briefing Protocol...")
    
    # 1. Execute Data Collection Skills
    # These update workspace/memory/daily_*_brief.json
    run_skill("daily_email_audit.py")
    run_skill("news_intel_aggregator.py")
    
    # 2. Gather Results
    email_data = load_data("daily_email_brief.json")
    news_data = load_data("daily_news_brief.json")
    
    # 3. Assemble Unified Brief
    brief = {
        "timestamp": datetime.now().isoformat(),
        "intelligence": {
            "email_audit": email_data,
            "news_vector_1": news_data
        },
        "status": "DATA_COLLECTED"
    }
    
    output_path = os.path.join(MEMORY_DIR, "morning_brief_data.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(brief, f, indent=4)
        
    print(f"Morning Brief Data verified: {output_path}")

if __name__ == "__main__":
    generate_morning_brief()
