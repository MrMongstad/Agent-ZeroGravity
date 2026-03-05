# Sonic Reader V2: The Night Watch Execution Plan

> **Protocol**: PR-First Workflow
> **Architecture**: Distributed Multi-Agent (Hive Mind)
> **Goal**: Complete rewrite of Sonic Reader featuring Vite/React frontend and a hardened Rust backend with native "Legacy Window" fixes.

---

## 🏗️ Delegation Architecture

| Agent | Role | Domain |
| :--- | :--- | :--- |
| **Agent 0 (Antigravity)** | High-Level Architect | Orchestration, Integration, PR Staging, Code Review. |
| **`backend_arch`** | Rust/Tauri Specialist | Core engine rewrite, OS hooks, Text Scraper bug fixes. |
| **`frontend_dev`** | UI/UX Specialist | Vite + React scaffolding, DOM Isolation layer, Premium Styling. |
| **Agent Zero (External)** | System Auditor | Background stress testing, Scraper benchmarking, compilation verification via `dispatch.py`. |

---

## 🚀 Phase 1: Distributed Scaffolding & Core Architecture
*Objective: Establish the foundation with zero legacy baggage.*

1. **Agent 0**: Create isolated branch `feature/sonic-v2-foundation`.
2. **`frontend_dev`**:
    - [NEW] Initialize Vite + React + TypeScript project in `projects/Sonic_Reader_V2`.
    - [NEW] Implement basic Layout with **Strict DOM Isolation** protocol (ensuring UI components do not interfere with screen-scraper focus).
3. **`backend_arch`**:
    - [NEW] Initialize `src-tauri` with Tauri 2.0.
    - [NEW] Implement `process_manager.rs` for rigorous thread cleanup.
    - [NEW] Scaffold `text_scraper.rs` with native "Chrome Legacy Window" filters.

---

## 🛠️ Phase 2: The Scraper Engine (The "Legacy Fix")
*Objective: Solve the core technical blocker.*

1. **`backend_arch`**: 
    - Implement the "Look Above" heuristic in `scraper.rs`. If `Chrome_RenderWidgetHostHWND` or `Chrome Legacy Window` is hit, it must recurse upward effectively to find the browser's Accessibility object.
    - Use `uiautomation` to bypass the legacy facade.
2. **Agent Zero (External)**:
    - Execute `dispatch.py` to run a standalone Rust benchmark script across multiple browser windows (Chrome, Edge, Brave) to verify the fix.

---

## 🎨 Phase 3: Premium UI & Overlay Isolation
*Objective: Visual excellence and functional safety.*

1. **`frontend_dev`**:
    - Build the **Premium Hover Controller**.
    - Implement the **Ghost Overlay**: A transparent, full-screen canvas that catches user input but is "invisible" to UI Automation (using `aria-hidden` and specific OS window flags in Rust).
    - Design System: Dark-mode by default, sleek glassmorphism, Inter font.

---

## 📡 Phase 4: Integration & Morning Report
*Objective: Final assembly and staging.*

1. **Agent 0**: 
    - Integrate the subagent outputs into a unified Pull Request.
    - Verify IPC (Inter-Process Communication) between React and Rust.
    - Create the **Morning Report** for Stephan.

---

## 📝 Active Task List for The Night Watch

- [ ] **Task 274.1**: Initialize `projects/Sonic_Reader_V2` branch and folders.
- [ ] **Task 274.2**: Delegate Scaffolding to `frontend_dev` and `backend_arch`.
- [ ] **Task 274.3**: Implement the Chrome Legacy Scraper Fix.
- [ ] **Task 274.4**: Build the Ghost Overlay and DOM Isolation layer.
- [ ] **Task 274.5**: Package all diffs into `PR_STAGED_AWAITING_REVIEW`.

---

**Protocol Active. Awaiting "Execute" to begin Task 274.1.**
