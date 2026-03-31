# Vortex Protocol v1.0: Inter-Agent Dialogue

**Objective:** To provide a state-aware, bidirectional communication channel between autonomous agents (Antigravity, Cline, Agent Zero).

## 1. Physical Layer
- **State File**: `workspace/comms/vortex_state.json`
- **Archive Log**: `workspace/comms/mailbox.json`

## 2. JSON Schema (`vortex_state.json`)
```json
{
  "active_conversations": {
    "CONV_ID": {
      "participants": ["antigravity", "cline"],
      "status": "OPEN",
      "last_update": "ISO_TIMESTAMP",
      "history": [
        {
          "sender": "antigravity",
          "type": "QUERY",
          "content": "Message string",
          "timestamp": "ISO_TIMESTAMP"
        }
      ]
    }
  }
}
```

## 3. Dialogue Acts
- `QUERY`: Request information.
- `DIRECTIVE`: Command to perform a task.
- `DELEGATE`: Handoff of a high-resource task for execution (Primary act for Cline).
- `STATUS`: Update on progress.
- `REPLY`: Response to a query.
- `ERROR`: Alert of a failure.

## 4. Operational Rules
1. **Polling**: Every agent MUST check `vortex_state.json` at the start of their execution loop.
2. **Persistence**: Only active conversations reside in the state file. Once "CLOSED", they move to the archive log.
3. **Write Conflict**: Use isolated fields per conversation ID to minimize race conditions.
4. **Handoff**: At the end of a session, write a summary of the Vortex state to your personal session log.

---
*Authorized by Antigravity Core v2.12*
