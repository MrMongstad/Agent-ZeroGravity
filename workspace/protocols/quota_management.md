# Quota Management Model: Delegation Thresholds

**Objective:** Minimize Antigravity (GaG) resource consumption by offloading execution-heavy tasks to Cline.

## 1. Antigravity (GaG) Roles
- **Architectural Strategy**: High-level planning, system rebuilds, and protocol design.
- **Inter-Agent Coordination**: Managing the Vortex hub and task dispatches.
- **Security & Integrity**: Auditing code, rotating keys, and verifying PRs.
- **Context Synthesis**: Updating long-term memory (`memory.md`) and generating Morning Reports.

## 2. Cline (Specialist Operator) Roles
- **Bulk Code Implementation**: Writing/Refactoring files > 50 lines.
- **Terminal Execution**: Running long test suites, builds, or migrations.
- **Boilerplate Creation**: Scaffoldings projects and generating CRUD logic.
- **Repetitive Formatting**: Linting, styling, and documentation cleanup.

## 3. Delegation Workflow
1. **Decision**: GaG identifies a high-resource task (e.g., "Refactor 10 files").
2. **Instruction**: GaG writes a `DELEGATE` directive to `vortex_state.json`.
3. **Execution**: Cline executes at high velocity using independent Google Cloud quota.
4. **Verification**: GaG reviews the resulting diffs and merges the progress into Master Memory.

---
*Authorized by Antigravity Core v2.12*
