---
name: Summarize and Reset
alias: summarize-reset
version: "1.0"
author: Jarvis (Antigravity v2.13)
tags: [handover, documentation, reset, project-management, architect]
trigger_keywords: [summarize and reset, 15 point handover, project handover, phase completion]
status: active
last_updated: "2026-04-27"
---

# Skill: 15-Point "Summarize and Reset" Protocol

## Activation
Load this skill when:
- A major project phase is completed.
- Handing over context to a human or another agent (e.g., Cline).
- Performing a "Blank Slate" reset of the local execution state.
- The user explicitly requests a "15-point handover" or "summary and reset".

---

## The 15-Point Framework

Each handover must address the following 15 sections to ensure zero context leakage:

1.  **ExecSum (Executive Summary):** High-level "What, Why, and Result" in 3 sentences.
2.  **Scope:** Precise boundaries of what was (and wasn't) addressed.
3.  **Phases:** Progression map (Completed vs. Pending).
4.  **Artifacts:** List of all created/modified files with URIs.
5.  **Findings:** Key technical discoveries or "Gotchas" (e.g., React injection bypass).
6.  **LogicFlow:** Visual or text description of the operational pipeline.
7.  **DecisionRationale:** Why specific technical paths were chosen over others.
8.  **Profile:** Current status of the agent persona and relationship to the task.
9.  **DataEvidence:** Quantitative metrics (Performance, line counts, test results).
10. **RiskAnalysis:** Potential failure modes or security considerations for the next phase.
11. **EmpireOpps (Empire Opportunities):** How this work scales or synergizes with other projects.
12. **ActionItems:** Immediate next steps for the successor.
13. **Gaps:** Unsolved problems or missing context.
14. **ReusableModels:** Code patterns or logic blocks that can be extracted for global use.
15. **RefInfo (Reference Information):** Links to external docs, research, or specific commit SHAs.

---

## Execution Protocol

1.  **Gather Context:** Scan `mailbox.json`, `state.json`, and recent session logs.
2.  **Draft:** Generate a high-density, markdown-formatted report following the 15 points.
3.  **Validate:** Ensure all file links are absolute and active.
4.  **Save:** Store the report in `workspace/reports/HANDOVER_#N_YYYY-MM-DD.md`.
5.  **Prune:** Suggest archival of temporary branches or scratch files once the handover is verified.

---

## Output Standards
- **Zero Fluff:** No "I hope this helps".
- **Physical Mechanics:** Focus on files, bits, and logic, not feelings.
- **Visual Hierarchy:** Use bold anchors and tables for scannability.
- **Copy-Ready:** The output should be a standalone artifact ready for long-term storage.
