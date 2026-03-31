# Skill Manifest: Antigravity System

## Active Skills

| Skill | File | Status | Security Audit |
|:---|:---|:---|:---|
| Voice Bypass (Whisper) | `voice_bypass.py` | ✅ Active | ✅ Local-only, no external calls |
| Night Watch Heartbeat | `night_watch_heartbeat.py` | ✅ Active | ✅ Internal dispatch only |
| Heartbeat Runner | `heartbeat_runner.ps1` | ✅ Active | ✅ Local filesystem operations |
| Night Watch Launcher | `start_night_watch.bat` | ✅ Active | ✅ Calls local Python |
| API Key Tester | `test_key.py` | ⚠️ Utility | ⚠️ Makes external API call |
| Morning Report | `morning-report/` | ✅ Active | ✅ Local HTML/JSON |
| Sentinel Trace | `sentinel_trace.py` | ✅ Active | ✅ Local JSONL logging, no external calls |
| Scratchpad | `mcp-server-scratchpad` | ✅ Active | ✅ uvx-powered reasoning log |
| **Imperial Master Bridge v1.2** | `bridge_executor.py` | **✅ MASTER** | **Real-time 5s Synchronicity** |
| Context Reset | `context_reset.py` | ✅ Active | ✅ Local JSON archival & templating |
| **Shared Soul** | `sync_soul.py` | **✅ SYNCED** | **Cross-Agent Context Sync** |

## Active Agent Profiles

| Agent | File | Role | Model |
|:---|:---|:---|:---|
| Jarvis (Antigravity) | `workspace/agents/JARVIS.md` | Primary Controller | gemini-2.0-pro-exp / claude-3-5-sonnet |
| Cline | `workspace/agents/CLINE.md` | Coding Specialist | claude-3-5-sonnet-latest |
| Nexus | `workspace/agents/NEXUS.md` | Comms Hub | gemini-2.0-flash |

## Skill Activation Protocol
1. Before activating any marketplace skill, **review its source code**.
2. Check for: prompt injection, data exfiltration, unauthorized API calls.
3. Log activation in `workspace/memory/session_YYYY-MM-DD.md`.

## Custom Skill Creation
When a workflow repeats more than twice:
1. Tell the agent to package it as a skill.
2. Save to `workspace/skills/[skill_name].py` or `.md`.
3. Add entry to this manifest.
4. Test in isolation before integrating into heartbeat cycle.
