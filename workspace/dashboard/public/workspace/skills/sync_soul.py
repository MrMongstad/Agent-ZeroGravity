import os
import json
from datetime import datetime, timezone

SOUL_PATH = "workspace/soul.md"
STATE_PATH = "workspace/state.json"
MEMORY_LOG = "workspace/memory/session_2026-03-26.md"

def sync_soul():
    """Synchronizes the shared soul context between agents."""
    if not os.path.exists(STATE_PATH):
        return

    try:
        with open(STATE_PATH, "r", encoding="utf-8-sig") as f:
            state = json.load(f)

        # Build soul summary
        soul_content = f"""# The Imperial Soul (Shared Context)
Last Updated: {datetime.now(timezone.utc).isoformat()}

## Active Agent Status
- Nexus/Bridge: {state.get('agent_status', {}).get('nexus', 'unknown')}
- Cline: {state.get('agent_status', {}).get('cline', 'unknown')}

## Current Directive
Task ID: {state.get('current_task', 'None')}

## Empire Insights
- Real-time Bridge Active (5s polling)
- 3-Strike Safety Protocol Engaged
- Token Terminator Budgeting: ACTIVE
"""

        with open(SOUL_PATH, "w", encoding="utf-8") as f:
            f.write(soul_content)
            
        print(f"[+] Soul synchronized at {datetime.now(timezone.utc).isoformat()}")

    except Exception as e:
        print(f"[-] Soul sync failed: {e}")

if __name__ == "__main__":
    sync_soul()
