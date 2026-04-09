# Imperial Master Bridge Protocol (Agent 0 v1.2)

## 1. Overview
The Imperial Master Bridge (IMB) is a high-speed, real-time communication layer designed to allow Cline and Google Antigravity (GAG) to synchronize state, delegate tasks, and share context with minimal latency. It leverages the "Vortex" state management system as its physical backplane.

## 2. Core Components

### 2.1 The Vortex State (`workspace/comms/vortex_state.json`)
The live, authoritative state of all active inter-agent communications.
- **Real-time Requirement**: Polling frequency < 5 seconds or FS event triggers.
- **Locking**: Atomic writes using isolated conversation IDs.

### 2.2 The Message Queue (`workspace/comms/queue/`)
A high-integrity handshake system for task execution.
- `.task`: A new directive issued by Antigravity.
- `.done`: A completion signal issued by Cline, including a summary and artifact links.
- `.error`: A failure signal with trace logs for Antigravity's remediation.

### 2.3 Shared Soul (`workspace/soul.md` & `workspace/memory/`)
A persistent context layer that stores:
- **Project Goals**: High-level empire objectives.
- **Agent Roles**: Specializations and available tools.
- **Session History**: Lessons learned and cross-agent insights.

## 3. The Imperial Handshake (Workflow)

1. **Initiation**: Antigravity writes a `DIRECTIVE` or `DELEGATE` act to `vortex_state.json`.
2. **Detection**: `bridge_executor.py` detects the new act and creates a `.task` file in `workspace/comms/queue/`.
3. **Execution**: Cline picks up the `.task`, checks `token_terminator.py` (budget), and executes.
4. **Completion**: Cline writes a `.done` file to the queue and updates `vortex_state.json` with a `STATUS` or `REPLY` act.
5. **Acknowledge**: Antigravity/Nexus processes the `.done` file, archives the conversation to `mailbox.json`, and updates the shared memory.

## 4. Synergy Matrix (Strengths)

| Agent | Strength | Role in Bridge |
| :--- | :--- | :--- |
| **Antigravity (Jarvis)** | Strategic reasoning, high-level planning, resource orchestration. | The Architect: Issues directives and manages budget. |
| **Cline** | Deep technical execution, multi-file coding, terminal operations. | The Specialist Operator: Executes complex technical tasks. |

## 5. Security & Safety
- **Budget Guardrail**: Every task must pass `token_terminator.py` before execution.
- **3-Strike Rule**: Automatic halt on 3 consecutive failures to prevent token burn loops.
- **Isolated Branches**: No direct pushes; all work via PR for human/AI cross-review.
