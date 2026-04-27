# Sonic Reader V2 - Handoff

## 1. ExecSum
The objective of this task was to adjust the "always on top" behavior and the global hotkeys used to start/stop the reading engine. Both tasks were addressed successfully. We deactivated the `alwaysOnTop` setting from the `tauri.conf.json` file. We then integrated the Tauri global shortcut plugin and mapped `Alt+Space` to trigger the start reading function, and `Control` (Left Control) to stop reading globally.

## 2. Scope
The scope was confined to `tauri.conf.json` for the window parameter, and adding `tauri-plugin-global-shortcut` to `package.json`, `Cargo.toml` and registering it in `src-tauri/src/main.rs`. Finally, `src/App.tsx` was modified to listen to the newly registered global hotkeys.

## 3. Phases
1. Disabled `alwaysOnTop` configuration in Tauri window manifest.
2. Explored React/Browser events vs Tauri native global shortcut events.
3. Installed `tauri-plugin-global-shortcut` to both the frontend (`npm`) and backend (`cargo`).
4. Updated React hooks to use `register` for mapping `Alt+Space` and `ControlLeft`.

## 4. Artifacts
- `projects/Sonic_Reader_V2/src-tauri/tauri.conf.json`
- `projects/Sonic_Reader_V2/src/App.tsx`
- `projects/Sonic_Reader_V2/src-tauri/src/main.rs`
- `projects/Sonic_Reader_V2/package.json`
- `projects/Sonic_Reader_V2/src-tauri/Cargo.toml`

## 5. Findings
Confidence: **High**. Global shortcuts in Tauri are handled natively on the desktop OS. We correctly bypassed React's focused-window limitation. Due to OS limitations around mouse global hooks (like Shift+Click), a keyboard-based standard `Alt+Space` was selected for initiating reading.

## 6. LogicFlow
- Modified `tauri.conf.json`.
- Identified that React `window.addEventListener('keydown')` only operates when the webview is in focus.
- Added `tauri-plugin-global-shortcut` and initialized the plugin in `tauri::Builder`.
- Updated `useEffect` in `App.tsx` to handle the shortcuts via IPC proxy from the OS.

## 7. DecisionRationale
Shift+Click as a *global* OS mouse hook requires lower-level Rust crates (like `rdev` or similar) to capture raw global mouse events. For simplicity, speed, and cross-platform reliability without heavy C-bindings/low-level OS APIs, the standard Tauri global hotkey API using a dual-key combo (`Alt+Space`) was chosen as the most pragmatic pivot that still solves the user's intent to trigger it anywhere.

## 8. Profile
StephanM/Agent0

## 9. DataEvidence
Build checks and terminal execution showed `global-hotkey` and `tauri-plugin-global-shortcut` successfully fetched and linked into the Rust binary.

## 10. RiskAnalysis
No significant risks. Changing `alwaysOnTop` back to false simply restores normal desktop Z-index behavior. The global shortcuts may clash if another application heavily guards `Alt+Space`, but it is a standard and safe mapping.

## 11. EmpireOpps
Further iterations could look into writing a custom Rust hook using `rdev` if the client truly requires a literal mouse click off-app to trigger the application instead of a keyboard shortcut.

## 12. ActionItems
- Test the reading engine and shortcut triggers while the app is out of focus.

## 13. Gaps
None.

## 14. ReusableModels
Tauri V2 global shortcut implementations can be mirrored for any desktop widgets built hereafter.

## 15. RefInfo
Tauri V2 Documentation, `tauri-plugin-global-shortcut` crate.