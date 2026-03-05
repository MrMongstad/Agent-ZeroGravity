# ⚔️ Battle Plan: Project "SonicReader" (Global TTS)

## 🎯 Objective
> Build a lightweight, high-performance Windows application that reads selected text aloud using premium AI voices (Piper/Local-First) via a global hotkey.

## 💰 Business Value (ROI)
- **Time Saved**: Transform physical reading time into passive listening (multitasking). Perfect for catching up on long documentation or emails while working on other tasks.
- **Money Made**: Potential as a standalone SaaS or a premium utility tool for the high-performance professional.
- **Competitive Edge**: Most current TTS tools are either clunky, web-only, or sound like robots. SonicReader will feel native and sound human.

## 🛠️ Technical Blueprint
- **Framework**: **Tauri (Rust + React/Vite)**. 
- **TTS Engine**: **Piper TTS** (ONNX-based Neural TTS). 100% Offline, ultra-fast.
- **The "Smart-Select" Engine**: 
  - **Windows UI Automation (UIA) API**: Core "Brain" for text capture.
  - **Infinite Read Logic**: Climbs the UI tree to the Document root, enabling seamless reading of large containers from the cursor position to the end.
- **Ghost Protocol**: 
  - Stabilized background daemon that runs without a visible taskbar presence.
  - System Tray integration for control (Pause/Stop/Exit).
  - **Audio Singleton**: Hardened audio architecture to prevent WASAPI hardware race conditions and crashes.

## 📋 Execution Roadmap

### Phase 1: Research & Discovery
- [x] Compare Local vs Cloud TTS quality.
- [x] Prototype Rust bridge for `UIAutomationClient` (via `uiautomation` crate).
- [ ] Research transparent window "Overlay" performance in Tauri to ensure zero-lag tracking of text highlights.
- [x] Test coordinate accuracy for `TextPattern.GetBoundingRectangles` in Chrome and PDFs.

### Phase 2: Implementation (Current)
- [x] Initialize Tauri project with Rust backend.
- [x] Build the `TextScraper` module:
  - [x] Logic to find `AutomationElement` at `(x, y)`.
  - [x] Logic to extract `TextPattern.RangeFromPoint`.
  - [x] "Infinite Read" document-root climbing logic.
- [x] Integrate Piper as a sidecar for the audio engine.
- [x] Implement the "Ghost Protocol" (Hardened Background Operation).
- [x] Implement Global Hotkeys:
  - `Ctrl + Shift + R`: Scrape & Read.
  - `Ctrl + Shift + S`: Stop.
  - `Ctrl + Shift + Space`: Pause/Resume.
- [ ] Develop the "Overlay Highlighter":
  - A click-through, transparent window that renders the "Active Reading" indicator.
- [ ] Implement the "Reading Progress" sync between the UI and the Audio buffer.

### Phase 3: Review & Deployment
- [x] Test "Start from middle" accuracy on various websites/PDFs. (Verified for Chromium/Electron).
- [ ] Final Build & Optimization.

---
## 🧠 Brain vs 💪 Muscle
*   **Muscle**: I've built the UIA text scraper, the hardened audio singleton, and the Ghost Protocol infrastructure.
*   **Brain**: We need to decide if the "Overlay Highlighter" is the next priority or if we should move toward "Visual Polish" (Glassmorphism UI) and "Voice Switching" UX first.
