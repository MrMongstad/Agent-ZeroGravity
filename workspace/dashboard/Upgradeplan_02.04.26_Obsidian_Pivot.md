# EmpireHQ Design Vortex: Obsidian & Holographic Pivot

The current interface is "safe." This pivot injects **Aesthetic Brilliance** and **Executive Command** into the Dashboard. We are moving from "Standard Dark Mode" to a **"Digital Obsidian"** aesthetic with holographic accents and micro-pulsing neural architecture.

---

## 🎨 Visual Strategy: "The Obsidian Command Deck"

### 1. Aesthetic Foundation
- **Base Background**: `#020205` (Deep Space Obsidian).
- **Core Material**: "Hyper-Glass" — `backdrop-filter: blur(25px)` with a sub-pixel border gradient (`linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)`).
- **Primary Color**: **Holographic Blue** (`#00f2ff`) for active signals.
- **Secondary Color**: **Cyber Purple** (`#bc13fe`) for background mesh.
- **Critical Color**: **Neon Crimson** (`#ff0055`) for system alerts/errors.

### 2. Typography & Motion
- **Font**: `Outfit` (Headings) and `JetBrains Mono` (Data points).
- **Transitions**: `700ms cubic-bezier(0.22, 1, 0.36, 1)` for all layout shifts.
- **Neural Pulse**: A constant, subtle CSS-shadow pulse on the main "Intelligence" module.

---

## 🧠 Functional Hierarchy (Component Pivot)

### **A. [NEW] The "Nexus Core" (Visual Alpha)**
- **Role**: A floating, rotating SVG "Neural Ring" in the center of the Morning Report. 
- **Visual**: Glows based on agent activity level (Slow pulse = Idle, rapid spin = Task Processing).

### **B. [NEW] The "Spectral Burn" Graph**
- **Role**: High-fidelity, area-shaded line charts for API cost traversal.
- **Visual**: Glassmorphism charts with glowing "Neon Wire" line paths.

### **C. [NEW] Holographic Bento Grid**
- **Role**: Re-organizing the dashboard into a tightly packed, staggered grid.
- **Interaction**: Card borders "ignite" with a blue/purple gradient border on hover.

### **D. [NEW] Floating terminal (Mercury 2.0)**
- **Role**: Move the terminal from a static bottom bar to a draggable, frosted-glass "Floating Window" that persists across views.

---

## 🛰️ Required MCP Server Activations

To fuel this dashboard with real-time intelligence, the following servers MUST be active and synced:

1. **`chrome-devtools`**: **MANDATORY**. For live JS/CSS debugging and layout verification.
2. **`sequential-thinking`**: **MANDATORY**. To stream the internal "Chain of Thought" (CoT) directly to the Neural Bus.
3. **`memory`**: To retrieve and display "Episodic Knowledge" (recent wins/losses) in the Morning Report.
4. **`github`**: To pull live PR statuses and commit history into the "Mission Log."
5. **`fetch`**: To verify external API health and network latency metrics.

---

## 🧱 Implementation Roadmap (Phased)

### Phase 1: Material & Depth
- [MODIFY] `globals.css`: Replace flat glass with **Holographic Mesh** backgrounds.
- [NEW] `src/components/NexusCore.tsx`: The central SVG neural engine.

### Phase 2: Data Fidelity
- [NEW] `src/components/SpectralGraph.tsx`: Vector-based burn rate analytics.
- [MODIFY] `api/state/route.ts`: Expose CoT (Chain of Thought) data from `sequential-thinking`.

### Phase 3: Spatial UX
- [NEW] `src/components/FloatingTerminal.tsx`: The Mercury 2.0 draggable overlay.
- [MODIFY] `src/app/page.tsx`: Re-layout to the **Obsidian Bento** configuration.

---

## 📝 Verification Standard
- **Wow Factor**: Does the dashboard look like a $1,000/mo SaaS platform?
- **Responsiveness**: Zero layout shift during data polling (8000ms).
- **Accessibility**: High-contrast text on premium obsidian surfaces.

---
**Status**: STAGED (Waiting for Architect Signal to Ignite).
