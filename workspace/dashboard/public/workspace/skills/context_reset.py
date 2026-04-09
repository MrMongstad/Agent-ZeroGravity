import json
import os
import sys
from datetime import datetime

# Configuration
VORTEX_PATH = r"c:\Users\steph\Desktop\Antigravity and Agent 0\workspace\comms\vortex_state.json"
MAILBOX_PATH = r"c:\Users\steph\Desktop\Antigravity and Agent 0\workspace\comms\mailbox.json"
MEMORY_DIR = r"c:\Users\steph\Desktop\Antigravity and Agent 0\workspace\memory"

def load_json(path):
    if not os.path.exists(path):
        return [] if "mailbox" in path else {"active_conversations": {}}
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def run_reset():
    print("--- [CONTEXT RESET PROTOCOL START] ---")
    
    # 1. Load State
    state = load_json(VORTEX_PATH)
    mailbox = load_json(MAILBOX_PATH)
    
    active_convs = state.get("active_conversations", {})
    closed_ids = []
    
    # 2. Identify Conversations to Archive
    if not active_convs:
        print("No active conversations found.")
    else:
        for cid, details in list(active_convs.items()):
            # Every conversation in state is considered part of this session's history
            # Archive it regardless of status if we are doing a full session reset
            entry = {
                "id": cid,
                "timestamp": datetime.now().isoformat(),
                "sender": "system_reset",
                "recipient": "archive",
                "type": "ARCHIVE",
                "content": details
            }
            mailbox.append(entry)
            closed_ids.append(cid)
            del active_convs[cid]
            print(f"Archived: {cid}")

    # 3. Save Updated Files
    save_json(VORTEX_PATH, {"active_conversations": {}})
    save_json(MAILBOX_PATH, mailbox)
    
    # 4. Generate 15-Point Template
    today = datetime.now().strftime("%Y-%m-%d")
    template_path = os.path.join(MEMORY_DIR, f"MASTER_HANDOVER_TEMPLATE_{today}.md")
    
    template = f"""# 🧱 MASTER HANDOVER: [CONTEXT NAME]
**Date:** {today} | **Origin:** JARVIS-GaG Core-v2.13 | **Protocol:** 15-Point Zero-Context Reset

## 1. Executive Summary (ExecSum)
[150-300w, status, wins]

## 2. Scope (Norway/Autonomous Systems)
[Detail focus area]

## 3. Phases
[Current phase mapping]

## 4. Artifacts (Code/Docs)
[List new/modified files]

## 5. Findings (Confidence L/M/H)
[Key discoveries]

## 6. LogicFlow
[LaTeX sequences $A \\to B$]

## 7. Decision Rationale
[Why path X was chosen over Y]

## 8. Profile (StephanM/SlyMentor)
[Current alignment]

## 9. Data Evidence
[Metrics/Log snippets]

## 10. Risk Analysis
[$Risk = P(f) \\cdot I(s)$]

## 11. EmpireOpps
[Strategic growth points]

## 12. ActionItems
[Next steps for next session]

## 13. Gaps
[Unknowns/Blockers]

## 14. Reusable Models
[Design patterns established]

## 15. RefInfo
[Paths/Links]

---
**[SYSTEM STATUS: ARCHIVED & RESET]**
"""
    
    with open(template_path, 'w', encoding='utf-8') as f:
        f.write(template)
        
    print(f"Template generated at: {template_path}")
    print("--- [PROTOCOL COMPLETE: READY FOR ZERO-CONTEXT RESTART] ---")

if __name__ == "__main__":
    run_reset()
