# Sonic Reader V2: Implementation Plan

## Objective
Build a ground-up, production-grade rewrite of Sonic Reader (V2). This will decouple the architecture into a high-velocity Vite + React/TS frontend and a hardened Rust backend. The primary goals are to natively resolve the "Chrome Legacy Window" fallback bug, establish strict DOM isolation, enforce rigorous process lifecycle management, integrate local Speech-to-Text (STT) capabilities, and explicitly maintain a visible, standard-sized application window (disabling tray-minimization).

## Phase 1: Scaffolding & Environment Setup
- **[NEW] `projects/Sonic_Reader_V2/`**: Initialize a completely fresh directory to ensure pristine architecture without V1 baggage.
- **[NEW] `projects/Sonic_Reader_V2/package.json`**: Scaffold Vite + React + TypeScript via `create-tauri-app`.
- **[NEW] `projects/Sonic_Reader_V2/src-tauri/tauri.conf.json`**: Configure the main window to be persistently visible at a standard resolution. We explicitly disable any code that forces tray minimization or aggressive window shrinking.
- **[NEW] `projects/Sonic_Reader_V2/src-tauri/Cargo.toml`**: Configure lean dependencies focusing solely on `uiautomation`, `tts`, `tauri`, and local STT libraries.

## Phase 2: Frontend & DOM Isolation Layer
- **[NEW] `projects/Sonic_Reader_V2/src/main.tsx`**: Boot the React lifecycle.
- **[NEW] `projects/Sonic_Reader_V2/src/App.tsx`**: Rebuild the UI triggers (Play/Stop/Settings) using strict, componentized state.
- **[NEW] `projects/Sonic_Reader_V2/src/components/Overlay.tsx`**: The critical DOM isolation layer. This transparent overlay will capture triggers but actively reject screen-reader focus, guaranteeing the engine never accidentally parses its own UI.

## Phase 3: Rust Backend Hardening (The Engine)
- **[NEW] `projects/Sonic_Reader_V2/src-tauri/src/process_manager.rs`**: Built-in OS-level hooks to aggressively terminate all child threads (like the TTS engine) upon window close. Zero zombies.
- **[NEW] `projects/Sonic_Reader_V2/src-tauri/src/text_sanitizer.rs`**: A pre-processing pipeline that strips unsupported symbols, normalizes code blocks, and cleans raw DOM text *before* handing it to the voice engine.
- **[NEW] `projects/Sonic_Reader_V2/src-tauri/src/scraper.rs`**: The rebuilt extraction logic. 
    - **Logic Shift**: It will explicitly recognize and ban parent containers like `"Chrome Legacy Window"` or generalized Desktop pane names. If a raw text node cannot be found, it will fail gracefully instead of reading the system window's metadata. 
- **[NEW] `projects/Sonic_Reader_V2/src-tauri/src/tts.rs`**: The decoupled voice engine runner, listening strictly to sanitized inputs.
- **[NEW] `projects/Sonic_Reader_V2/src-tauri/src/stt.rs`**: Built-in OS-level speech-to-text integration module to allow seamless voice dictation within the app natively.
- **[NEW] `projects/Sonic_Reader_V2/src-tauri/src/main.rs`**: Bind the IPC commands (`trigger_scrape`, `kill_tts`, `start_dictation`) and assemble the final binary.

## Phase 4: Delivery
- PR-First branch creation (`feature/sonic-v2-architecture`).
- Batch execution of all `[NEW]` files.
- Deliver staged diffs for Stephan's technical review.
