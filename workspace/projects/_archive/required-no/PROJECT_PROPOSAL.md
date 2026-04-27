# Required.no — Project Proposal & Strategic Brainstorm

> **Owner:** StephanM  
> **Domain:** required.no  
> **Status:** INITIALIZING  
> **Created:** 2026-04-18  
> **Inspired by:** [required.com](https://required.com) (Swiss digital agency)

---

## 1. The Concept

**Required.no** is a Norwegian digital agency specializing in **strategy, design, web development, and AI-powered business automation**. 

The model mirrors [required.com](https://required.com) — a premium Swiss digital partner offering strategy, UX design, and custom web development — but with a critical differentiator: **autonomous agentic systems** as a first-class service offering. This isn't just another web shop. This is industrial-grade digital infrastructure for Norwegian businesses.

### Core Positioning
> *"We build what's required."*

- **Premium partner**, not a gig marketplace
- **Long-term relationships** over one-off projects  
- **Sustainable technology** — future-proof solutions that don't accrue technical debt
- **Norwegian market** with international capability

---

## 2. Service Pillars

Modeled after required.com's service matrix, adapted for your strengths:

### Pillar 1: Strategy & Consulting
| Service | Description |
|:---|:---|
| Digital Strategy | Market positioning, technology roadmaps, digital transformation planning |
| AI Consulting | Identifying automation opportunities, agentic system architecture |
| Coaching & Training | Upskilling client teams on modern workflows and AI-assisted tools |

### Pillar 2: Design & UX
| Service | Description |
|:---|:---|
| Interaction Design | User flows, wireframes, prototyping |
| Visual Design | Brand identity, UI kits, design systems |
| Responsive Design | Mobile-first, cross-device optimization |
| User Testing | Usability audits, A/B testing frameworks |

### Pillar 3: Development
| Service | Description |
|:---|:---|
| Custom Web Development | SPAs, Progressive Web Apps, APIs |
| Desktop Applications | Electron/Tauri-based offline-capable tools |
| CMS Solutions | WordPress, headless CMS, content migrations |
| E-commerce | WooCommerce, custom storefronts |

### Pillar 4: AI & Automation ⚡ *(The Differentiator)*
| Service | Description |
|:---|:---|
| Agentic Systems | Multi-agent autonomous workflows (what you've already built with Jarvis/Cline) |
| Process Automation | Replacing manual bottlenecks with self-running pipelines |
| AI Integration | LLM-powered features embedded into client products |
| Monitoring & Reporting | Autonomous reporting dashboards, Morning Reports as a service |

> **IMPORTANT: This fourth pillar is the moat.** Required.com doesn't offer this. No Norwegian agency of this caliber is shipping autonomous agentic infrastructure as a service. You have a working prototype (this entire workspace). Productize it.

---

## 3. Target Market

### Primary (Norway)
- **Industrial / Engineering firms** — Companies like Hertwich Engineering / NorCast that have legacy tech debt and need modernization
- **SMBs needing digital transformation** — Norwegian companies that know they need a web presence but don't have in-house capability
- **Startups** — Technical foundations, MVPs, and rapid prototyping

### Secondary (Nordic / International)
- **Remote-friendly international clients** — The `.no` domain signals Nordic trust and quality
- **Open-source community** — Building reputation through contributions (similar to required.com's WordPress community involvement)

---

## 4. Website Architecture

Inspired by required.com's structure, adapted for Required.no:

```
required.no/
├── / (Home)               — Hero, value prop, featured work, client logos
├── /tjenester (Services)  — Service pillars with detailed breakdowns
├── /portefolje (Portfolio) — Case studies with technical depth
├── /om-oss (About)        — Team, culture, methodology, values
├── /blogg (Blog)          — Technical insights, case studies, transparent yearly reviews
├── /kontakt (Contact)     — Contact form, booking, location
└── /karriere (Careers)    — Future: when scaling the team
```

### Key Pages — Design Notes

#### Homepage
- **Hero:** Full-bleed dark gradient with animated mesh/wave (similar to required.com's neon gradients)
- **Value Proposition:** One punchy line — *"Vi bygger det som kreves."* / *"We build what's required."*
- **Service Cards:** 4 pillars with glassmorphism cards, hover animations
- **Featured Work:** 2-3 highlighted case studies with screenshots
- **Client Logos:** Scrolling marquee of client/partner logos
- **CTA:** Clear contact-us path

#### Portfolio / Case Studies
Each case study should include:
- Client name and industry
- Challenge description
- Solution architecture
- Technology stack used
- Measurable results
- Screenshots / video walkthrough

> **TIP: Existing portfolio candidates:** NorCast Seminar page, NorCast Planner (Electron app), Sonic Reader — these are real, shipped products. Package them as case studies immediately.

---

## 5. Design Direction

> **⚠️ CRITICAL CONSTRAINT:** All design work must follow the anti-AI-aesthetic mandate.  
> Full framework: [DESIGN_PHILOSOPHY.md](file:///c:/Users/steph/Desktop/Antigravity%20and%20Agent%200/workspace/projects/required-no/design/DESIGN_PHILOSOPHY.md)  
> **TL;DR:** No generic AI look. Human-crafted feel. Reference-driven design DNA + 4-layer constraint prompting.

### Visual Language (inspired by required.com, tuned for Norway)

| Element | Direction |
|:---|:---|
| **Mode** | Dark-first (premium feel), with light-mode toggle |
| **Colors** | Deep navy/charcoal base, aurora-inspired accents (Nordic green, electric blue, soft violet) |
| **Typography** | Distinctive serif/display headers + refined sans-serif body (**no** Inter/Roboto/Open Sans defaults) |
| **Layout** | Break the grid intentionally — asymmetry, overlap, negative space as design tools |
| **Effects** | Purposeful micro-interactions, staggered reveals, scroll-triggered — no generic fade-ins |
| **Icons** | Minimal, custom line icons |
| **Logo** | Clean, abstract "R" mark — Scandinavian minimalism |

### Design Mood

```
Required.com aesthetic     →  dark, vibrant neon gradients, bold serif + sans-serif
Required.no adaptation     →  dark, nordic aurora palette, same typographic contrast
                              Colder tones. More structural. Less playful, more engineered.
                              MUST feel hand-crafted, not template-generated.
```

> The Norwegian brand should feel like a precision instrument. Swiss clean meets Nordic cold.

---

## 6. Technology Stack

| Layer | Technology | Rationale |
|:---|:---|:---|
| **Framework** | Next.js (App Router) or Astro | SSR/SSG for SEO, fast loads, modern DX |
| **Styling** | Vanilla CSS + CSS custom properties | Zero-dependency, maximum control per user preference |
| **CMS** | Headless (Sanity.io or Strapi) | Structured content for blog/portfolio, Norwegian-friendly |
| **Hosting** | Vercel or Cloudflare Pages | Edge deployment, .no domain support |
| **Analytics** | Plausible or Umami | Privacy-first, GDPR-compliant, no cookie banners needed |
| **Contact** | Formspree or custom API | Lightweight, no backend required initially |
| **Email** | Resend or Postmark | Transactional emails for contact form |

> Per the Weightless Mandate — no bloated CMS backends. Start static, add headless CMS when content volume justifies it.

---

## 7. Competitive Advantages

| Advantage | Why It Matters |
|:---|:---|
| **Domain: required.no** | Memorable, professional, trust-signaling `.no` TLD |
| **AI-native services** | No Norwegian agency is shipping agentic automation as a core offering |
| **Existing portfolio** | NorCast Planner, NorCast Seminar, Sonic Reader — real shipped products |
| **Full-stack capability** | Strategy → Design → Dev → Deployment → Automation, all in-house |
| **Scandinavian trust** | Norwegian business registration, GDPR-native, Nordic work ethic |
| **Lean operation** | AI-augmented one-person agency → high margins, fast execution |

---

## 8. Revenue Model

### Phase 1: Project-Based
- Fixed-price website builds (50k–250k NOK)
- Landing pages and MVPs (15k–75k NOK)
- Design sprints and audits (25k–50k NOK)

### Phase 2: Retainer / Subscription
- Monthly maintenance & hosting packages (5k–15k NOK/mo)
- AI automation monitoring & optimization retainers
- Ongoing design/dev support

### Phase 3: Productized Services
- **"Morning Report" as a Service** — Autonomous daily business intelligence for clients
- **Agentic Workflow Packages** — Pre-built automation templates
- **White-label AI tools** — Custom-branded dashboards using the Jarvis/Cline architecture

---

## 9. Phased Roadmap

### Phase 0: Foundation *(Now)*
- [x] Secure domain (required.no)
- [x] Create project folder and proposal ← **you are here**
- [ ] Register business entity (Enkeltpersonforetak or AS)
- [ ] Set up professional email (kontakt@required.no)

### Phase 1: MVP Website *(Target: 2-3 weeks)*
- [ ] Design system: colors, typography, layout tokens
- [ ] Homepage with hero, services, portfolio teaser
- [ ] Services page with 4 pillars
- [ ] Portfolio page with 2-3 case studies (NorCast, Sonic Reader)
- [ ] Contact page with form
- [ ] Deploy to required.no

### Phase 2: Content & SEO *(Target: Month 2)*
- [ ] Blog setup with first 3 articles
- [ ] Full case studies with screenshots and metrics
- [ ] SEO optimization (Norwegian + English)
- [ ] Google Business Profile (if applicable)

### Phase 3: Client Acquisition *(Target: Month 3+)*
- [ ] LinkedIn company page + personal branding campaign
- [ ] Local Norwegian business directories
- [ ] Direct outreach to Vestland region businesses
- [ ] Referral program from existing contacts (Hertwich/NorCast network)

### Phase 4: Scale *(Target: Month 6+)*
- [ ] Productized service offerings
- [ ] Potentially hire contractors for overflow
- [ ] Conference talks / community presence
- [ ] Open-source contributions for brand building

---

## 10. Open Questions

> **These decisions will shape the entire project. Flag your preferences when ready.**

1. **Business entity**: Enkeltpersonforetak (sole proprietorship) or AS (limited company)?
2. **Language**: Norwegian-first, English-first, or bilingual from day one?
3. **Brand name**: "Required" as-is, or a Norwegian tagline/subtitle? (e.g., *"Required — Digital Byrå"*)
4. **First client target**: Cold outreach, or leverage existing NorCast/Hertwich network first?
5. **Hosting preference**: Vercel, Cloudflare, or self-hosted on a VPS?
6. **Timeline pressure**: Is there a hard deadline (e.g., a meeting, a pitch) driving Phase 1?

---

## Project Folder Structure

```
projects/required-no/
├── PROJECT_PROPOSAL.md    ← This file
├── docs/                  ← Business plans, legal, strategy docs
├── design/                ← Design system, mockups, brand assets
├── src/                   ← Website source code (when ready)
└── assets/                ← Logo, images, icons, media
```

---

*"The domain was free. The empire won't be."*
