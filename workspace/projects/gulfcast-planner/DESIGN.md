# NorCast Planner Design System

## Tone & Purpose
Premium tech conference planning tool. Glassmorphic dark interface with vibrant accent colors per milestone type. Sophisticated, polished, ready-to-demo aesthetic.

## Color Palette

| Token | Light | Dark | OKLCH |
|-------|-------|------|-------|
| **Background** | Off-white | Deep navy #080b12 | 0.07 0.01 260 |
| **Foreground** | Near-black | Near-white | 0.92 0.02 240 |
| **Card Surface** | White | Frosted glass #11172a | 0.10 0.03 250 |
| **Primary** | Purple-blue gradient | Purple-blue #a78bfaâ†’#60a5fa | 0.72 0.30 265 |
| **Accent Red** | â€” | Milestone red #ef4444 | 0.62 0.30 25 |
| **Accent Blue** | â€” | Milestone blue #3b82f6 | 0.65 0.35 265 |
| **Accent Yellow** | â€” | Milestone yellow #eab308 | 0.80 0.28 96 |
| **Accent Indigo** | â€” | Milestone indigo #4f6fd4 | 0.60 0.28 276 |
| **Border** | Light gray | Subtle blue #1a2a50 | 0.15 0.04 250 |

## Typography
| Layer | Font | Weight | Size | Use |
|-------|------|--------|------|-----|
| Display | Space Grotesk | 900 | 2remâ€“3.5rem | Animated gradient headings, page titles |
| Body | Inter | 400â€“600 | 0.875remâ€“1.125rem | UI text, descriptions, milestones |
| Mono | Geist Mono | 400 | 0.875rem | Timestamps, step numbers, code |

## Elevation & Depth
- **Glassmorphism**: All cards use `backdrop-blur(20px)` + `rgba(17,23,42,0.72)` + `border rgba(255,255,255,0.1)`
- **Ambient glow**: Fixed radial gradients (purple 5% 10%, blue 95% 10%, green 50% 100%) beneath all content
- **No shadows**: Depth via transparency and glow only
- **Dot grid**: Subtle radial pattern `rgba(255,255,255,0.08)` at 24px spacing

## Structural Zones

| Zone | Background | Border | Notes |
|------|------------|--------|-------|
| **Sidebar (desktop 240px)** | Glass card | Border rgba(255,255,255,0.1) | Fixed, contains nav + theme toggle |
| **Mobile nav (bottom)** | Glass card | Border rgba(255,255,255,0.1) | 4 icon buttons, sticky |
| **Dashboard main** | Background + dot-grid | â€” | Scrollable, glow ambient behind |
| **Stats cards** | Glass card | Border rgba(255,255,255,0.1) | 3 cards in row (responsive: 1 on mobile) |
| **Progress section** | Glass card + accent stripe | Colored top border (3px) | Left: animated count-up + badges, Right: SVG ring |
| **Milestone stepper** | Glass card per item | Colored top strip (accent) | Step badge (48Ã—48px) + connector line + title/desc/edit |
| **Modals** | Glass card | Border rgba(255,255,255,0.1) | Center overlay, scale+fade transition |

## Spacing & Rhythm
- **Base unit**: 8px
- **Card padding**: 20pxâ€“32px
- **Section gap**: 24pxâ€“32px
- **Milestone spacing**: 16px vertical between items
- **Border radius**: 14px cards, 20px panels, 99px pills/badges

## Component Patterns
1. **Glass cards**: All surfaces use glass-card utility (backdrop blur + border + bg)
2. **Gradient text**: App title animates via `gradient-shift` keyframe (6s cycle purpleâ†’blueâ†’pink)
3. **Step badges**: 48Ã—48px rounded square, accent color border + tint background + glow shadow
4. **Status pills**: 99px border-radius, colored background (accent-red-bg, accent-blue-bg, etc.)
5. **Edit buttons**: Pencil icon, appears on card hover, minimal styling
6. **3D tilt on hover**: Cards transform via mouse position (rotateX/rotateY), JavaScript-driven

## Motion & Interaction
| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page load | Fade-in-up stagger | 500ms | ease-out |
| Progress ring | Stroke-dashoffset fill | 1800ms | ease-out â†’ pulse-glow if 100% |
| Count-up number | Opacity fade | 500ms | ease-out |
| Card hover | 3D magnetic tilt | 0ms (immediate follow) | linear |
| Badge hover | Scale 1.08 + glow | 200ms | ease-out |
| Modal open/close | Scale + fade | 200ms | ease-out |
| Theme toggle | All tokens fade | 350ms | ease |
| Confetti burst | Particle fall + fade | 3200ms | gravity simulation |

## Constraints
- **No raw hex colors**: All colors via CSS variables (OKLCH functions)
- **No bouncy animations**: Smooth easing only (cubic-bezier(0.4, 0, 0.2, 1))
- **Keyboard nav**: Escape closes modal, D toggles theme, N opens add milestone
- **Accessibility**: Semantic HTML, aria-labels, focus visible on all interactive elements
- **Print ready**: Reports page has print stylesheet (black text, white bg, no nav/glow)
- **Responsive**: Desktop 1024px sidebar / Tablet 768â€“1023px collapsed / Mobile <768px bottom nav

## Signature Detail
**Animated gradient app title**: The app title "NorCast Planner" uses `gradient-text` utility with 6s background-position shift cycling through purple (#a78bfa) â†’ blue (#60a5fa) â†’ pink â†’ back to purple. Creates a premium, premium "breathing" effect on load and throughout the dashboard.
