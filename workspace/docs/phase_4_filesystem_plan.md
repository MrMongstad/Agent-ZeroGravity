# Phase 4: Filesystem Audit & Reorganization Plan

**Objective**: Eliminate "orphans," standardize the project hierarchy, and bring global cohesion to the `Antigravity` environment per the *Unified Workspace Model* mandate.

Currently, the workspace has disjointed projects (e.g., `projects/Sonic_Reader`, `Admin Panel v1`, `dashboard`) mixed with core engine logic (`mcp-bridge`, `workspace/`). We need a strictly deterministic folder layout.

| Phase | Milestone | Action Items |
| :--- | :--- | :--- |
| **4.1** | **Root Purge** | Move scattered top-level folders (`Admin Panel v1`, `dashboard`, `GAG terminal output`) into designated standard volumes. The root directory must contain **only**: `.env`, `.gitignore`, `package.json`, `mcp config.json`, and core infrastructure scripts. |
| **4.2** | **Project Portfolios** | Audit the `projects/` directory. Move actively managed tools (e.g., Sonic Reader, NorCast) into a new standard `workspace/sandbox/` or `workspace/products/` path so they are enclosed within the agent's safe zone. |
| **4.3** | **Deprecation Cleanup** | Identify and decommission legacy Agent Zero remnants (e.g., trailing `.agent` folders, `voice_bypass.py`). Move active protocols into `workspace/skills/`. |
| **4.4** | **Documentation Hub** | Centralize all AI plans, blueprints (`mcp_blueprint.md`), and markdown notes into `workspace/docs/`. |

## Expected Outcome
A deterministic structure:
```text
Root/
├── .env / .gitignore / config.json / package.json
└── workspace/
    ├── protocols/    (Agent Inspector, Heartbeats, Rules)
    ├── memory/       (Immutable logs, traces, state.json)
    ├── secrets/      (gag-vertex-key.json, mcp-credentials.json)
    ├── docs/         (Blueprints, Plans)
    └── products/     (Active Apps: Sonic_Reader, Dashboard)
```
This guarantees any Antigravity sub-agent immediately understands the physical boundaries of its sandbox.
