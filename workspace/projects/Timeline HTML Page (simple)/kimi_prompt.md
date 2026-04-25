# Kimi App Builder Prompt — GulfCast Planning Tracker

---

## PASTE THIS INTO KIMI:

---

Build me a **fully functional, production-quality web app** called **GulfCast Planner** — a conference milestone tracker. I need a working prototype I can demo to my boss today. It must look premium, feel snappy, and work end-to-end without placeholder states.

---

## TECH STACK

- **Framework**: React (with Vite) or Next.js — your choice, whichever produces a cleaner output
- **Styling**: Tailwind CSS with a custom dark/light theme
- **State**: React useState + useContext (no Redux, keep it lean)
- **Data persistence**: localStorage (no backend needed for prototype)
- **Icons**: Lucide React
- **Fonts**: Inter from Google Fonts

---

## VISUAL DESIGN SYSTEM

### Color Tokens
```
Dark background:   #080b12
Card surface:      rgba(17, 23, 42, 0.72) with backdrop-blur glassmorphism
Card border:       rgba(255, 255, 255, 0.1)
Text primary:      #e8ecf7
Text secondary:    #5b6c94
Primary gradient:  #a78bfa to #60a5fa (purple to blue)
```

### Accent Colors (per milestone type)
```
Red:        #ef4444  — opening events, closing events
Blue:       #3b82f6  — communications, invitations
Yellow:     #eab308  — decisions, approvals
Indigo:     #4f6fd4  — deadlines
```

### Design Language
- **Glassmorphism**: All cards use backdrop-filter blur(20px) + semi-transparent background
- **Ambient glow**: Soft radial gradients (purple top-left, blue top-right, green bottom-center) as fixed background layer
- **Typography**: Inter 900 for headings (gradient text clip), Inter 500-600 for UI
- **Border radius**: 14px cards, 20px dashboard panels, 99px pills/badges
- **Animated headline**: The app title uses a slow background-position shift animation cycling purple to blue to pink
- **Dot grid**: Subtle radial dot pattern on body background
- **Dark mode default**, with a toggle that persists to localStorage

---

## SCREENS / PAGES

### 1. Dashboard (main screen)
**Left panel (sidebar on desktop, bottom nav on mobile):**
- App logo: "GC" brand mark (gradient rounded square) + "GulfCast Planner" text
- Nav items: Dashboard, Milestones, Reports, Settings
- Theme toggle button at bottom of sidebar

**Main content area:**

**Stats row (3 cards):**
- Total Milestones count
- Completed count (green)
- Remaining count (amber)

**Progress dashboard card (glassmorphism):**
- Left: big animated count-up number + "X of Y milestones complete" + colored stat chips (Completed / In Progress / Upcoming)
- Right: Circular SVG progress ring (gradient green stroke, r=60, thin stroke-width 8, pulse glow animation when at 100%)

**Milestone stepper list (below the dashboard card):**
Each milestone is a row:
- Left: Numbered step badge (48x48px rounded square, accent color border + background tint + glow) with number 01-08
- Thin vertical connector line between badges (hidden on last item)
- Right: Glassmorphism card with:
  - Date pill (top left) + Status badge (top right): Completed / In Progress / Upcoming
  - Milestone title (bold)
  - Short description (muted text)
  - On hover: 3D magnetic tilt effect (perspective rotateX/rotateY following mouse position)
  - Top accent strip (3px bar in the milestone's accent color)
  - Edit button (pencil icon, appears on hover)

**Confetti**: On first load when all milestones are Completed, fire a 70-particle canvas confetti burst (purple, blue, green, amber, red particles, 3.2s duration, auto-cleans canvas element).

---

### 2. Milestones Page (CRUD)
Full list view of all milestones with:
- **Add Milestone** button (top right, gradient pill button)
- Filter bar: All / Completed / In Progress / Upcoming
- Sort: By date (ascending/descending)
- Each milestone card shows: step number, date, title, description, status badge, accent color dot, edit and delete icons

**Add / Edit Milestone Modal:**
Fields:
- Title (text input)
- Description (textarea)
- Date (date picker)
- Status (select: Completed / In Progress / Upcoming)
- Accent Color (4 color swatches: Red / Blue / Yellow / Indigo)
- Save / Cancel buttons

All changes persist to localStorage immediately.

---

### 3. Reports Page
- **Overall progress bar** (horizontal, gradient fill, animated on mount)
- **Timeline visualization**: same stepper list but read-only, print-optimized
- **Print / Export PDF button** (calls window.print(), page has a clean print stylesheet)
- **Stats grid**: Total, Completed %, Average days between milestones, Days since kickoff, Days to last milestone

---

### 4. Settings Page
- **Project name** (editable inline, defaults to "GulfCast 2024")
- **Theme toggle** (dark / light — synced with sidebar toggle)
- **Reset data** button (with confirmation dialog) — resets to default dataset
- **Keyboard shortcuts** info panel: D = toggle theme, N = new milestone, Esc = close modal

---

## DEFAULT DATA (pre-load into localStorage on first run)

```json
[
  { "id": 1, "step": "01", "date": "2023-09-01", "title": "First Meeting at ALBA", "desc": "Initial stakeholder alignment. Defined conference scope, goals, and preliminary budget envelope.", "status": "completed", "color": "red" },
  { "id": 2, "step": "02", "date": "2023-10-15", "title": "Finalizing the List of Invitees", "desc": "Speaker roster confirmed. Keynote participants and delegate eligibility criteria locked in.", "status": "completed", "color": "blue" },
  { "id": 3, "step": "03", "date": "2023-10-23", "title": "Finalize Program and Conference Fee Decision", "desc": "Schedule locked. Registration fee structure approved after steering committee review.", "status": "completed", "color": "yellow" },
  { "id": 4, "step": "04", "date": "2023-10-30", "title": "Send Invitations", "desc": "Formal invitations dispatched with registration portal link and accommodation guidance.", "status": "completed", "color": "blue" },
  { "id": 5, "step": "05", "date": "2023-12-15", "title": "Registration Deadline", "desc": "All delegate registrations closed and confirmed. Final headcount submitted to venue.", "status": "completed", "color": "indigo" },
  { "id": 6, "step": "06", "date": "2024-02-10", "title": "Deadline for Presentations", "desc": "All speaker decks received, reviewed, and formatted for the main stage AV system.", "status": "completed", "color": "indigo" },
  { "id": 7, "step": "07", "date": "2024-03-01", "title": "GulfCast Conference", "desc": "Main event executed. Panels, keynotes, and networking sessions delivered across two days.", "status": "completed", "color": "red" },
  { "id": 8, "step": "08", "date": "2024-04-01", "title": "Post-Conference Work", "desc": "Thank-you communications dispatched. Proceedings compiled and distributed to all delegates.", "status": "completed", "color": "red" }
]
```

---

## INTERACTIONS AND ANIMATIONS

| Interaction | Behaviour |
|---|---|
| Page load | Cards animate in with staggered translateY fade using IntersectionObserver |
| Progress ring | Animates stroke-dashoffset from full to filled over 1.8s, then pulses green glow if 100% |
| Count-up | Dashboard count animates from 0 to total over 500ms |
| Card hover | 3D magnetic tilt (mouse-position rotateX/rotateY), reset on mouseleave |
| Badge hover | Step badge scales 1.08 + intensified glow |
| Button click | Ripple effect (radial gradient flash on active state) |
| Modal open/close | Scale + fade transition 200ms |
| Theme switch | All tokens transition with 350ms ease |
| D key | Toggle dark/light mode |
| N key | Open Add Milestone modal |
| Esc key | Close any open modal |

---

## LAYOUT — RESPONSIVE RULES

| Breakpoint | Layout |
|---|---|
| Desktop 1024px and above | Fixed sidebar 240px wide + scrollable main content area |
| Tablet 768px to 1023px | Collapsed icon-only sidebar + main content |
| Mobile below 768px | No sidebar, bottom navigation bar with 4 icons |

---

## QUALITY REQUIREMENTS

1. **No placeholder content** — all data real, all buttons functional
2. **No broken states** — empty state on Milestones page if no data: friendly prompt + "Add your first milestone" button
3. **Accessible** — all interactive elements have aria-label, semantic HTML, keyboard navigable
4. **Print stylesheet** — Reports page prints cleanly: no nav, no sidebar, black text on white
5. **Fast** — no heavy dependencies, no unnecessary re-renders
6. **Polished** — every hover state defined, every transition smooth, zero layout shifts on load

---

## WHAT SUCCESS LOOKS LIKE

When I open this app and demo it:
1. Dark glassmorphism dashboard loads with confetti burst
2. Animated progress ring fills to 100% with a green pulse glow
3. 8 milestone cards cascade in with stagger animation
4. Hovering a card tilts it in 3D following my mouse
5. I click Edit on a card, change status from Completed to In Progress, save — dashboard stats update instantly without refresh
6. I add a brand-new milestone via the modal — it appears in the list with the correct step number and accent color
7. The Reports page shows a print-ready clean view
8. Pressing D smoothly transitions the whole app to light mode
9. The app works perfectly on mobile

**This is a boss demo. Make it look and feel like a real shipped product.**

---

*Project: GulfCast 2024 Planning Tracker | Version: 1.0 Prototype | Context: Internal conference management tool*
