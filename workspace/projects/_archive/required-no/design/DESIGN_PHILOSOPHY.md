# Required.no — Design Philosophy & The "Humanize" Protocol

> **Directive:** Every project shipped by Required.no must **Humanize** the digital experience. It must look fiercely human-crafted, opinionated, and organic — never AI-generated.
> **Status:** DECISION PENDING — framework selection  
> **Created:** 2026-04-18

---

## The "Humanize" Imperative

AI-generated websites converge on the same statistical mean:
- Purple/indigo gradients
- Standard sans-serif (Inter, Roboto)
- Symmetrical hero → 3-column features → CTA → footer
- Soft rounded cards, generic shadows
- Stock-photo-adjacent imagery
- "Clean and modern" = forgettable

**Seen one, seen them all.** This is the exact trap Required.no must avoid. To break the AI aesthetic, we don't just prompt for "better design" — we prompt to **Humanize**.

### What it means to "Humanize" a design:
- **Organic Imperfection:** Breaking the grid intentionally. Layouts that feel optically balanced rather than mathematically centered.
- **Opinionated Personality:** Bold, polarizing choices that carry a distinct voice, rather than safe choices designed to offend no one.
- **Tactile Resonance:** Textures, noise, and motion that mimic real-world physics, craft, and materials.
- **Emotional Typography:** Typefaces that carry historical, cultural, or artistic weight.

---

## Two Frameworks Worth Considering

### Framework A: "Extraction Workflow" (Reference-Driven)

**Philosophy:** Don't ask AI to "design something beautiful." Instead, curate real sites you love, extract their design DNA, and use those constraints as the AI's operating parameters.

**How it works:**
1. **Curate** — Find 5-10 websites with genuine personality you admire
2. **Extract** — Upload screenshots to an LLM, ask it to reverse-engineer a JSON design system (colors, spacing, typography, component patterns)
3. **Constrain** — Feed that extracted system as hard rules when generating code
4. **Inject** — Human pass: rewrite copy, adjust weights, add custom interactions

**Strengths:**
| ✅ | Detail |
|:---|:---|
| Grounded in reality | Based on proven, shipped designs you've already validated with your own taste |
| Reproducible | The extracted design-system JSON becomes a reusable asset |
| Fast iteration | Change the reference sites → change the entire output aesthetic |
| Taste-driven | Your curation IS the creative direction |

**Weaknesses:**
| ⚠️ | Detail |
|:---|:---|
| Risk of imitation | If not careful, output can feel like a derivative of the reference |
| Requires taste upfront | You need to actually find and curate those reference sites |
| No organic spontaneity | Everything is derived from existing work — no "happy accidents" |

---

### Framework B: "4-Layer Constraint Prompting" (System-Driven)

**Philosophy:** Structure every design prompt with explicit constraints across 4 layers to force the AI away from its statistical defaults and inject the **Humanize** protocol.

**The 4 Layers:**
1. **Context & Persona** — Define the vibe, audience mindset, and cultural context (not just "a website for X")
2. **Structural Blueprint** — Specify layout topology explicitly (organic asymmetry, brutalist, overlapping containers — not "hero + 3 columns")
3. **Aesthetic Constraints (The Human Layer)** — Explicit design tokens: emotional font pairings, real-world color palettes, tactile textures, physics-based motion
4. **Execution Rules** — Tech stack, anti-patterns to avoid, specific component behaviors

**Strengths:**
| ✅ | Detail |
|:---|:---|
| Maximum control | You define every axis the AI can move on |
| Unique by construction | Explicit constraints mathematically push output away from the mean |
| Scalable | The 4-layer template works for any project, not just one |
| Educational | Forces you to articulate WHY a design choice exists |

**Weaknesses:**
| ⚠️ | Detail |
|:---|:---|
| High prompt overhead | Each page/component needs a well-crafted 4-layer prompt |
| Requires design vocabulary | You need to know terms like "asymmetrical balance," "monochromatic palette" |
| Can feel over-engineered | Risk of over-constraining the AI into rigid output |

---

## My Recommendation: Hybrid (A + B)

Use **Framework A** to establish the initial taste direction (reference-driven design DNA), then apply **Framework B's 4-layer constraints** for each component/page during execution. This gives you:

- **A** provides the "what it should feel like" (extracted from real sites you love)
- **B** provides the "how to execute it" (structured prompts that prevent regression to AI-mean)

The hybrid avoids A's imitation risk (B forces structural uniqueness) and B's vocabulary barrier (A gives you concrete visual references to point at instead of describing).

---

## Universal Humanization Rules (Apply Regardless of Framework)

To successfully **Humanize** a design, these rules must be baked into every prompt for Required.no projects:

### Typography (The Voice)
- [ ] Never use Inter, Roboto, or Open Sans as primary fonts
- [ ] Mix a distinctive serif or display font with a clean body font
- [ ] Use at least one unexpected typographic choice (condensed, monospaced UI labels, etc.)

### Color (The Emotion)
- [ ] No purple/indigo gradient defaults
- [ ] Define palette from a real-world reference (aurora, fjord, concrete, rusted steel, etc.)
- [ ] Use high-contrast accent colors sparingly, not as backgrounds

### Layout (The Skeleton)
- [ ] No standard hero → 3-col → CTA → footer pattern
- [ ] Break the grid intentionally somewhere on every page to create organic flow
- [ ] Use asymmetry, overlap, or negative space as deliberate design elements

### Motion (The Physics)
- [ ] No generic fade-in animations
- [ ] Micro-interactions must feel physical and purposeful (hover-tilt, staggered reveals, scroll-triggered resistance)
- [ ] Motion should reinforce brand personality, not decorate

### Content
- [ ] No AI-generated filler text in production — ever
- [ ] Copy should sound like a human with opinions, not a corporate textbook
- [ ] Real photography or custom illustrations only (no stock)

### Process
- [ ] Build section-by-section, never generate full pages in one shot
- [ ] Human review pass on every component before integration
- [ ] The AI builds the 70% (structure); StephanM applies the 30% (taste)

---

## Decision Queue

> When ready to begin Phase 1 of Required.no website build, we'll need to:
> 1. **Curate reference sites** — Pick 5-10 sites that represent the "Required.no vibe"
> 2. **Select framework** — Confirm Hybrid (A+B) or pick one
> 3. **Extract design DNA** — Build the constraint system from references
> 4. **Define banned patterns** — Explicit list of "never do this" for AI prompts

This document will be the source of truth for all Required.no design decisions.
