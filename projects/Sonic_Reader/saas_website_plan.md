# ⚔️ Battle Plan: SonicReader SaaS Platform

## 🎯 Objective
> Build a high-converting, premium SaaS landing page and user dashboard to monetize the SonicReader desktop app. The goal is to create an "Executive" web presence that facilitates tiered subscriptions and seamless application delivery.

## 💰 Business Value (ROI)
- **Monetization**: Transition from a local utility to a recurring revenue stream (MRR).
- **Automation**: Self-service user onboarding, license management, and automated Stripe billing.
- **Brand Authority**: A premium website builds trust for high-value users (executives, researchers).

## 🛠️ Technical Blueprint
- **Framework**: **Next.js 15 (App Router)** - For SEO, speed, and modern developer experience.
- **Styling**: **Tailwind CSS + Framer Motion** - Precision aesthetics and high-status animations (Glassmorphism).
- **Authentication**: **Supabase Auth** - Native integration with the database and easy social login (Google/GitHub).
- **Backend/DB**: **Supabase (PostgreSQL)** - Tracking character usage, subscription status, and user settings.
- **Payments**: **Stripe** - Specifically using Stripe Checkout and Customer Portal for zero-friction monetization.
- **Complexity**: 6/10 (Requires careful integration of character usage sync between Desktop App -> API -> DB).

## 📋 Execution Roadmap

### Phase 1: High-Conversion Landing Page (Antigravity)
- [ ] **Hero Section**: Implement a "Soundwave-into-Text" particle animation using Three.js or high-perf CSS.
- [ ] **Interactive Demo**: Create a browser-based "mini-highlighter" that demonstrates the USP (Universal Text Capture).
- [ ] **Pricing Tiers**:
  - **Free (The Enthusiast)**: 50k chars/day, Local Voices, Global Hotkeys.
  - **Pro (The Executive)**: 500k chars/day, Premium Cloud Voices (ElevenLabs Integration), OCR Support, Infinite Read.
  - **Elite (Digital Empire)**: Unlimited Local, Massive Cloud Pool, Custom Voice Cloning, 24/7 Priority Support.

### Phase 2: User Dashboard & License Key Engine (Antigravity)
- [ ] **Auth Portal**: Glassmorphism login/signup page.
- [ ] **Usage Tracker**: Circular progress bars showing "Daily Character Burn" (Live sync with Supabase).
- [ ] **Download Hub**: Secure download links for the latest stable `.exe` builds.

### Phase 3: Tauri-to-Cloud Bridge (Antigravity)
- [ ] **Rust Internal API**: Implement a secure telemetry module in the Tauri app to report character usage to the Supabase backend.
- [ ] **Feature Gating**: Hardware-level license verification to unlock "Pro" features in the desktop app.

---
## 🧠 Brain vs 💪 Muscle
*   **Muscle**: I'll architect the Next.js site, build the Stripe webhooks, and handle the Supabase RLS (Row Level Security) policies.
*   **Brain**: I need your final word on the "Pro" pricing ($19/mo?) and the exact copy for the Hero headline to make it "punch" hard.

