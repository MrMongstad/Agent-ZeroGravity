# Implementation Plan: EmpireHQ Command Center (Architecture Pivot)

Building "EmpireHQ"—a premium, high-fidelity command center. This implementation follows the **Architecture Pivot** requirements for executive intelligence, prioritizing signal over noise.

## User Review Required

> [!IMPORTANT]
> **Data Strategy**: Following your verdict, we are **sticking to the `.gag_state` / `vortex_state.json` bus**. Supabase is sidelined to minimize state-sync friction.

> [!TIP]
> **Heartbeat Tuning**: UI will poll the state every **8000ms** using SWR/setInterval to balance responsiveness with memory efficiency.

## Proposed Dashboard Hierarchy (Visual Pivot)

### 1. Top Row: The "Morning Report" Hub (Span 12)
- **Visual Priority**: Dominates the viewport.
- **Content**: Summary of recent automation logs, strategic insights, and mission status.
- **Actions**: Immediate "Approve/Reject PRs" or "Execute Mission" buttons.

### 2. Middle Row: Pulse & Intelligence (Split 4/4/4)
- **Module A: System Pulse**: Traffic lights for MCP servers.
- **Module B: Neural Bus Monitor**: Live stream of agent thoughts/tasks (high-level).
- **Module C: Financials**: Burn rate progress bars for Anthropic/Google/OpenAI.

### 3. Bottom Row: Mercury Terminal (Span 12, Collapsible)
- **Role**: Debugging and granular log tracking.
- **Default State**: Collapsed accordion to keep the "Executive" view clean.

### 4. Header Bar (High Signal)
- **KPIs**: "Tasks Completed (24h)" and "API Cost (24h)" featured prominently.

---

## Technical Stack & Design System

### Styling (Aesthetic Excellence)
- **Theme**: Ultra-Dark Mode with **Glassmorphism** (backdrop-blur `12px`).
- **Icons**: Lucide-React.
- **Alerts**: UI Toasts via `sonner` (no browser notifications).
- **Accents**: Neon Blue (`#3b82f6`) for activity, Emerald (`#10b981`) for health.

### Frontend
- **Framework**: Next.js (App Router).
- **Data Fetching**: SWR for the 8s heartbeat.

---

## Implementation Phases

### Phase 1: Structural Pivot
- [MODIFY] `src/app/page.tsx` - Implement the 12-column grid and collapsible terminal.
- [NEW] `src/components/MorningReportCard.tsx` - High-priority executive summary.

### Phase 2: Data & KPIs
- [NEW] `src/lib/heartbeat.ts` - 8000ms polling logic for `vortex_state.json`.
- [MODIFY] `src/components/Header.tsx` - Add the 24h Task/Cost KPIs.

### Phase 3: Polish & PR
- [MODIFY] `src/app/globals.css` - Refine glassmorphism and accordion animations.
- [ACTION] Prepare PR for review (Local branch only).

---

## Open Questions Resolution

1. **Metrics**: Tasks Completed (24h) and API Cost (24h) are now core header metrics.
2. **Alerts**: Switched to UI Toasts (Sonner/Radix).
3. **Tools**: Quick-link navbar in footer/sidebar only.

## Verification Plan

### Automated Tests
- `npm run lint` & `npm run build`.
- Validate JSON polling delay using Chrome DevTools Network tab.

### Manual Verification
- Test "Mercury Terminal" toggle functionality.
- Verify toast notifications appear on simulated system errors.

