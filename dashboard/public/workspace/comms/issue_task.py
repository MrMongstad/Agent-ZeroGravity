import json
import uuid
from datetime import datetime, timezone

state_path = "workspace/comms/vortex_state.json"
with open(state_path, "r", encoding="utf-8") as f:
    state = json.load(f)

conv_id = f"FETCH_MACRO_{uuid.uuid4().hex[:8].upper()}"
state["active_conversations"][conv_id] = {
    "created_at": datetime.now(timezone.utc).isoformat(),
    "status": "active",
    "agents": ["jarvis", "cline"],
    "history": [
        {
            "sender": "jarvis",
            "recipient": "cline",
            "type": "DIRECTIVE",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "content": "Use your fetch MCP server to read https://news.ycombinator.com and extract the top 3 story titles. Save the results in workspace/comms/hn_fetch_results.md."
        }
    ]
}

state["last_updated"] = datetime.now(timezone.utc).isoformat()

with open(state_path, "w", encoding="utf-8") as f:
    json.dump(state, f, indent=2)

print(f"Task issued with ID: {conv_id}")
