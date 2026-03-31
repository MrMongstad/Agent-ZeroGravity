# User Context: Stephan M. (StephanM)

## Identity
- **Handle:** StephanM
- **Role in System:** Architect — The Employer. The sole human operator of this enterprise.
- **Location:** Norway / Fedje
- **Timezone:** Europe/Oslo (UTC+1 / UTC+2)

## Primary Objective
Build a digital empire powered by autonomous agentic systems. The system should be self-running: Stephan wakes up to completed, staged PRs — not micromanaged execution.

## Workflow Model
- **Moritz/Isenberg 10-Step Optimization** (adopted 2026.03.23)
- **PR-First:** All agent work is staged for review. Final "Live" button belongs to Stephan.
- **Morning Report:** Primary deliverable from overnight autonomous operations.
- **HitL Reviews:** Mandatory before broad system changes. `<ask>` tag halts execution when confidence drops.

## Technical Preferences
- **Primary IDE:** VS Code (with Cline + Gemini/Antigravity)
- **Architecture:** Windows 11 primary → Linux agent machine (in transition)
- **Standard Stack:** Python, Rust (Tauri 2.0), React 18 (Vite), Markdown, LaTeX, PowerShell
- **Design aesthetic:** Premium dark-mode, glassmorphism, zero-dependency HTML where possible

## Communication Channels
- **Primary:** Gemini (Antigravity) — direct IDE integration
- **Secondary:** Telegram (agent comms), WhatsApp
- **Review channel:** PR-First workflow (GitHub)

## Agent Ecosystem
| Agent | Role | LLM |
|:---|:---|:---|
| Antigravity (Jarvis) | Primary Controller / Orchestrator | gemini-2.5-pro (GaG native) |
| Cline | Tier-2 Coding Specialist | gemini-3.1-pro-preview (AI Studio) |
| Nexus | Comms Hub / Vortex Router | gemini-2.0-flash (GaG native) |

## Active Projects
| Project | Status | Location |
|:---|:---|:---|
| Sonic Reader V1 | Legacy / reference | `projects/Sonic_Reader/` |
| Sonic Reader V2 | IN_PROGRESS (Phase 3 pending) | `projects/Sonic_Reader_V2/` |
| Sonic Reader Landing Page | DONE | `projects/Sonic_Reader_Landing/index.html` |
| morgenrapport-triage | Active | `projects/morgenrapport-triage/` |
| Morning Report Dashboard | DONE | `workspace/skills/morning-report/` |

## Backlog (From Night Watch)
- `IN_PROGRESS` Auto-backup critical configs
- `QUEUED` Sonic Reader V2 Phase 3 (UI polish, settings, build config)
- `PARKED` Direct Sonic Reader V1 recovery

## Environments & Config
- **OS:** Windows 11
- **UTC Offset:** +60 min (Europe/Oslo)
- **Operational params:** See `workspace/identity.md` (single source of truth)

## Cost Sensitivity
- **Model strategy:** OAuth method preferred over raw API billing
- **Budget:** Conservative. Flag any operation expected to exceed normal token usage.

## Credentials
All credentials decoupled to `.env`. See root `.env` file for LLM providers, API keys, and fallback chain.
