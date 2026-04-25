# NorCast Planner → Standalone Windows Executable

> **📦 BUILD PLAN** — This document is the implementation plan for packaging NorCast Planner as a standalone `.exe` installer. Reference this file when ready to execute the Electron build pipeline.

Convert the existing React/Vite web app into an installable Windows `.exe` using Electron + electron-builder.

## Current Architecture Snapshot

| Layer | Tech | Status |
|-------|------|--------|
| **UI** | React 19 + Vite 5 + TailwindCSS 3 | ✅ Fully functional |
| **State** | Zustand `persist` → localStorage | ✅ Works offline already |
| **Backend** | Motoko canister on ICP | ⚠️ Must decouple |
| **Electron shell** | `electron/main.cjs` | ⚠️ Exists, no build scripts |
| **Dependencies** | `electron` + `electron-builder` in devDeps | ✅ Already installed |
| **Icons** | `pwa-512x512.png` (512×512) | ✅ Reusable |

## Key Decisions Required

> [!IMPORTANT]
> **ICP Backend Decoupling** — The app currently wraps in `InternetIdentityProvider` and has a full ICP actor client (`backend.ts`). However, the Zustand store **already persists all milestones to localStorage independently**. The plan is to **bypass** the ICP layer entirely for the Electron build (no canister calls, no auth). All data lives in localStorage on the user's machine. This means the `.exe` is fully offline-capable but **does not sync** with any ICP canister.

> [!WARNING]
> **Data portability** — localStorage is per-Electron profile. If the user uninstalls and reinstalls, data resets to the 8 default milestones. Phase 3 adds an optional JSON export/import to address this. Let me know if you want a more permanent storage solution (e.g., SQLite via `electron-store`).

---

## Proposed Changes

### Phase 1: Decouple from ICP Backend

The app entry point (`main.tsx`) currently requires `InternetIdentityProvider`. The Electron build needs to run without any ICP network.

#### [MODIFY] `src/frontend/src/main.tsx`
- Remove `InternetIdentityProvider` wrapper (or make it conditional on `window.electronAPI` / env check)
- Keep `QueryClientProvider` — harmless and used by some components
- Result: app boots clean without network

#### [MODIFY] `src/frontend/vite.config.js`
- Add `base: './'` so all asset paths are relative (required for `file://` protocol in Electron)
- Remove ICP-specific proxy config and environment injections (`CANISTER_`, `DFX_`, `II_URL`, `STORAGE_GATEWAY_URL`) for the production build
- Keep PWA plugin disabled or stripped for Electron (service workers don't apply)

---

### Phase 2: Configure Electron Build Pipeline

#### [MODIFY] `src/frontend/electron/main.cjs`
- Enable `contextIsolation: true` (security best practice for distribution)
- Add `preload` script path for future IPC if needed
- Set proper `icon` path that resolves in both dev and packaged modes
- Add auto-updater stub (optional, for future use)

#### [MODIFY] `src/frontend/package.json`
Add Electron build scripts and `electron-builder` configuration:

```jsonc
{
  "main": "electron/main.cjs",
  "scripts": {
    // ... existing scripts ...
    "electron:dev": "concurrently \"vite\" \"wait-on http://localhost:5173 && cross-env NODE_ENV=development electron .\"",
    "electron:build": "vite build && electron-builder --win",
    "electron:preview": "vite build && cross-env NODE_ENV=production electron ."
  },
  "build": {
    "appId": "com.norcast.planner",
    "productName": "NorCast Planner",
    "directories": {
      "output": "installer"
    },
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "public/pwa-512x512.png"
    },
    "nsis": {
      "oneClick": false,
      "perMachine": true,
      "allowToChangeInstallationDirectory": true,
      "installerIcon": "public/pwa-512x512.png",
      "uninstallerIcon": "public/pwa-512x512.png",
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "NorCast Planner"
    }
  }
}
```

#### [NEW] `public/icon.ico`
- Convert existing `pwa-512x512.png` to `.ico` format (multi-size: 16, 32, 48, 256px)
- Windows requires `.ico` for native taskbar/installer icons

> [!NOTE]
> `electron-builder` can use PNG directly on some platforms, but `.ico` is the reliable standard for Windows NSIS installers.

---

### Phase 3: Polish Desktop Experience

#### [MODIFY] `src/frontend/electron/main.cjs`
- Add native window title bar customization (or keep `autoHideMenuBar: true` as-is)
- Add `app.setAppUserModelId('com.norcast.planner')` for proper Windows taskbar grouping
- Add graceful error handling for `loadFile` failures

#### [MODIFY] `src/frontend/index.html`
- Add `<meta http-equiv="Content-Security-Policy">` for Electron security
- Remove external Google Fonts CDN links → bundle fonts locally (offline requirement)

#### [NEW] `public/fonts/` directory
- Download and bundle Inter + Space Grotesk font files locally
- Update `index.css` to use `@font-face` declarations instead of Google Fonts CDN

---

### Phase 4: Build & Test

1. **Dev mode**: `pnpm electron:dev` — verify hot-reload works
2. **Preview**: `pnpm electron:preview` — verify production bundle loads in Electron
3. **Build installer**: `pnpm electron:build` — produce `installer/NorCast Planner Setup.exe`
4. **Install test**: Run the `.exe` on a clean path, verify:
   - App launches with all 8 default milestones
   - Add/edit/delete milestones persists across app restart
   - Theme toggle works
   - Print/Reports page works
   - No network errors in console

---

## File Impact Summary

| File | Action | Risk |
|------|--------|------|
| `src/frontend/src/main.tsx` | MODIFY — remove ICP wrapper | 🟢 Low |
| `src/frontend/vite.config.js` | MODIFY — add `base: './'`, strip ICP env | 🟡 Medium |
| `src/frontend/electron/main.cjs` | MODIFY — security + icon fixes | 🟢 Low |
| `src/frontend/package.json` | MODIFY — add build scripts + config | 🟢 Low |
| `src/frontend/index.html` | MODIFY — CSP + local fonts | 🟢 Low |
| `src/frontend/src/index.css` | MODIFY — `@font-face` for bundled fonts | 🟢 Low |
| `public/icon.ico` | NEW — Windows icon | 🟢 Low |
| `public/fonts/*` | NEW — bundled font files | 🟢 Low |

**Blast radius**: 6 modified files, 2 new directories. All changes are additive or conditional — the web/Vite dev mode continues to work unchanged.

---

## Open Questions (Answer Before Executing)

1. **Do you want the ICP backend code left in place** (just bypassed) so you can re-enable cloud sync later? Or strip it entirely for a cleaner package?

2. **JSON export/import** for milestone data — want this in v1, or later?

3. **Auto-updater** — do you want Squirrel/electron-updater wired up for future OTA updates, or is manual reinstall fine?

---

## Verification Plan

### Automated Tests
```powershell
# 1. Build the Vite bundle
cd src/frontend && pnpm build

# 2. Verify dist/index.html exists and has relative paths
Select-String -Path dist/index.html -Pattern 'src="./' 

# 3. Build the installer
pnpm electron:build

# 4. Verify installer was created
Test-Path installer/*.exe
```

### Manual Verification
- Launch the generated `.exe` installer
- Install to a custom directory
- Verify app opens with all UI intact (glassmorphism, animations, theme toggle)
- Add a milestone → close app → reopen → confirm persistence
- Verify no network error toasts or console errors
- Test on a second PC (copy the installer)
