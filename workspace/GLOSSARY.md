# Official Terminology: Antigravity & OpenClaw Framework Glossary

> Source: Stephan's Gemini research thread. Canonical reference for all naming conventions.

## Directory Conventions

| Term | Framework | Definition |
|:---|:---|:---|
| `workspace/` | Antigravity | The active execution sandbox. Agent writes, tests, and breaks temporary files here before moving to `output/`. |
| `artifacts/` | Antigravity | Directory for tangible deliverables (code diffs, task lists, recordings). Replaces raw terminal logs. |
| `memory/` | Antigravity | Persistent episodic storage. Exists outside the active context window to maintain system history. |
| `context/` | OpenClaw | Local session memory and conversational state as raw Markdown. Bypasses vector databases. |
| `skills/` | OpenClaw | Atomic, single-purpose functions (e.g., `extract_invoice.py`). LLM strings these together for broader plans. |
| `tools/` | Both | Physical manifestation of agent capabilities. Local bash scripts, Python utilities, MCP endpoints. |
| `prompts/` | Both | Modular, task-specific instructions. Injected fragments to reduce context drift. |
| `output/` | Both | Staging ground for the morning report. Generated code, scraped data, PR drafts route here for review. |
| `logs/` | Both | Raw execution traces. Diagnostic bloodline. Includes `stdout`, `stderr`, and structured telemetry. |
| `scripts/` | Both | Sandbox for modular bash scripts handling pre-flight environment checks. |
| `tests/` | Both | PR validation arena. Generated functions must pass assertions before moving to `output/`. |
| `nodes/` | Antigravity | Discrete logic gates or specialized micro-agents within the orchestration layer. |
| `queue/` | Antigravity | Asynchronous staging area (Redis or local JSON). Manages task handoff between Agent Zero and OpenClaw. |
| `history/` | OpenClaw | Immutable, timestamped session transcripts for debugging and hallucination recognition. |
| `jobs/` | OpenClaw | Isolated scripts for headless, scheduled execution. Engines of background income systems. |
| `bin/` | OpenClaw | Binary execution surfaces: gateway, agent, send, onboarding, doctor. Essential for RPC mode. |
| `extensions/` | Antigravity | MCP servers and custom tool integrations bridging the agent-first IDE with external data systems. |
| `models/` | Antigravity | Pydantic schemas enforcing strict data shapes for `<json_output>`. |
| `utils/` | Both | Pure, non-agentic Python/Bash functions (regex, sanitization). Keeps logic path clean. |
| `gateway/` | Antigravity | Traffic controller. Manages WebSocket + REST between Agent Zero terminal and OpenClaw browser context. |
| `frontend/` | OpenClaw | React/Next.js dashboard components. Visual command center for pipeline monitoring. |
| `canvas/` | OpenClaw | Configurations for Live Canvas host. Renders real-time interactive UI elements. |
| `xml/` | Both | Strict schema definitions for validating agent payloads. |

## Core Files

| Term | Framework | Definition |
|:---|:---|:---|
| `AGENTS.md` | Antigravity | The definitive prompt contract. Establishes identity, permissions, behavior boundaries for sub-agents. |
| `instructions.md` | Both | Genetic code of the agent instance. System prompt, formatting rules, behavioral guardrails. |
| `heartbeat.md` | Both | Autonomous pulse check. Chronologically appended status log tied to `cron.yaml`. If it stops, the loop hung. |
| `config.yaml` | Both | Static counterpart to `.env`. Non-sensitive constants: retry limits, token ceilings, model routing. |
| `cron.yaml` | OpenClaw | The heartbeat schedule. Defines intervals for autonomous background tasks. |
| `.env` | Both | Master variable file. API keys, database URIs, OAuth credentials. Aggressively excluded from VCS. |
| `.gitignore` | Both | The structural firewall. Excludes `context/`, `history/`, `keys.json`, `.env`. |
| `state.json` | Antigravity | Core artifact of Weightless State model. Tracks exact checkpoint of running jobs for crash recovery. |
| `.gag_state` | Antigravity | Nucleus of Weightless State architecture. Shared memory bus between Agent Zero and OpenClaw. |
| `orchestrator.py` | Antigravity | Central nervous system for GAG. Routes `<invoke>` commands and manages `.gag_state` lockfile. |
| `main.py` | Both | Ignition switch. Initializes orchestration, binds terminal to LLM, reads `AGENTS.md`. |
| `app.py` | Both | Alternative ignition. Used when local agent exposes a webhook or lightweight API server. |
| `docker-compose.yml` | Both | Isolation blueprint. Maps volumes (`skills/`, `context/`) while sandboxing from host OS. |
| `Dockerfile` | Both | Blueprint for isolation. Defines exact OS state for agent execution. |
| `.cursorrules` | Antigravity | IDE-level system prompts. Injects Architect-Alpha parameters into editing environment. |
| `settings.json` | OpenClaw | Global configuration matrix. LLM endpoints, token limits, timeout thresholds. |
| `keys.json` | Both | Encrypted credential vault. Access tokens for APIs. Essential for headless operations. |
| `browser_state.json` | Antigravity | Caches session data, DOM structures, auth tokens for Browser Agent. |
| `Makefile` | Both | Macro-command register. Bundles complex docker/build/reset commands into single-word executions. |

## Observability & Telemetry

| Term | Official Standard | Definition |
|:---|:---|:---|
| `Observability` | SRE/DevOps | The ability to measure the internal state of the system by examining its logs, metrics, and traces. |
| `Telemetry` | Industry Std | The automatic recording and transmission of operational data (errors, events) to a central vault for analysis. |
| `JSONL` | RFC 8259 | JSON Lines. Standard format for high-velocity logging. Each line is a valid JSON object. |
| `Trace` | OpenTelemetry | A complete record of a single path of execution through the system. |
| `Correlation ID` | Distributed Systems | A unique UUID used to group all log entries related to a specific user request or agent session. |
| `Drift Analysis` | AI Alignment | The process of detecting deviation between the agent's current actions and its original objective. |
| `Sentinel` | Monitoring | A specialized service or agent dedicated to watching for failures and enforcing state integrity. |

## Observability & Telemetry

| Term | Standard | Definition |
|:---|:---|:---|
| `Observability` | SRE/DevOps | Ability to measure system state via logs, metrics, and traces. |
| `Telemetry` | Industry | Automatic recording and transmission of operational data for analysis. |
| `JSONL` | RFC 8259 | JSON Lines — one JSON object per line. Standard for structured logging. |
| `Drift Analysis` | AI Safety | Detecting deviation between agent actions and the original objective. |

## XML Execution Tags

| Tag | Framework | Function |
|:---|:---|:---|
| `<action>` | OpenClaw | Signals initiation of a concrete task. Precedes tool invocation block. |
| `<ask>` | Antigravity | Human-in-the-loop trigger. Halts execution for clarification or 'Live' button. |
| `<bash>` | Both | Raw terminal command payload. Monitored to prevent destructive OS operations. |
| `<call_tool>` | Both | Breaks out of text-generation into external script/MCP/API interface. |
| `<click>` | OpenClaw | Precision DOM interaction. Fired after `<observation>` confirms bounding box. |
| `<decision>` | Antigravity | Outputs agent's logic flow before action. Critical for auditing reasoning. |
| `<error>` | Both | Standardized failure output. Routes stack trace back into `<reasoning>` loop. |
| `<execute>` | Both | Terminal XML wrapper. Contains exact code/script string to run. |
| `<fill>` | OpenClaw | Injects dynamic data into input fields without breaking execution flow. |
| `<function_call>` | Both | Hard departure from NLG into structured parameter parsing. |
| `<goal>` | Antigravity | Anchors LLM at loop start. Prevents multi-step context drift. |
| `<invoke>` | Antigravity | Master agent spins up sub-agent. Passes state without duplicating context window. |
| `<json_output>` | Both | Enforces strict schema. Forces raw JSON output for API/database piping. |
| `<knowledge>` | Antigravity | Invokes local RAG queries without external API token burn. |
| `<loop>` | Antigravity | Defines autonomous recursive cycle boundaries with exit conditions. |
| `<navigate>` | OpenClaw | Browser routing. Loads specific DOM, bypasses UI clutter. |
| `<observation>` | OpenClaw | Post-action state read. Grounds next `<decision>` in reality. |
| `<plan>` | Both | Post-goal logic mapping. Maps sequential steps before burning tokens. |
| `<read>` / `<write>` | Antigravity | Strict I/O bounds. Limits file access to `workspace/` and `artifacts/`. |
| `<reasoning>` | Both | Internal monologue evaluating `<observation>`. First audit target for hallucination loops. |
| `<scroll>` / `<type>` | OpenClaw | DOM interaction tags for infinite-scroll parsing and human-like data entry. |
| `<tool_call>` | Both | Immediate script execution from `tools/` or `skills/`. Paired with `<json_output>`. |
| `<update>` | Antigravity | Write to `.gag_state`. Forces explicit state change declaration. |
| `<wait>` | OpenClaw | Hard pause for DOM rendering. Prevents token burn on failed `<observation>` cycles. |
| `$0 / exit 1` | Both | Bash return codes monitored by orchestration. Non-zero triggers self-correction loop. |
