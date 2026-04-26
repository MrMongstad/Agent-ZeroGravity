# Prompt Magic: Execution Plan & Developer Thoughts

## 🧠 Thoughts on the Idea
This project is exceptionally well-timed and strategically sound. You are capitalizing on a known market vacuum (the sunsetting of *Prompt Perfect* in Sept 2026) while actively solving the two biggest pain points users had with the original tool: **UI Bloat** and **Subscription Costs**. 

By leveraging the experimental **Chrome Prompt API (Gemini Nano)** for a free tier, you completely eliminate server-side LLM inference costs for yourself. The **Bring Your Own Key (BYOK)** model for power users is also a proven winner in the current AI developer ecosystem. Moving the UI out of the main chat window and into **Context Menus** and the **Side Panel API** is a massive UX upgrade.

This isn't just a clone; it's a structural evolution. 

---

## 🚀 Execution Roadmap

### Phase 1: Foundation & Scaffolding (Days 1-2)
**Goal:** Set up the basic Chrome Extension (Manifest V3) and establish the communication pipeline.
- [x] Initialize the project repository (`manifest.json`, `background.js`, `content.js`).
- [ ] Set up the build pipeline (Webpack/Vite) to handle bundling and hot-reloading for extension development.
- [ ] Implement basic message passing between `content.js` (the web page) and `background.js` (the service worker).
- [x] Create the `selectors.json` mapping file to decouple target DOM elements from the core logic.

### Phase 2: The "Ghost" UI & DOM Injection (Days 3-5)
**Goal:** Read text from the chat inputs and provide a minimalist way to trigger the optimization.
- [ ] Implement `MutationObserver` in `content.js` to detect when a chat box (e.g., ChatGPT, Claude) loads.
- [ ] Build the Context Menu integration ("Right-click -> Optimize Prompt").
- [ ] (Optional) Add slash command listener (e.g., typing `/perfect` in the text area triggers the script).
- [ ] Ensure the script safely reads and writes to complex React/Next.js controlled textareas.

### Phase 3: AI Integration & The "Brain" (Days 6-8)
**Goal:** Connect the optimization logic to the LLMs.
- [ ] Implement the local **Chrome Prompt API (Gemini Nano)** integration for the free tier.
- [ ] Build the settings page (`options.html`) to accept and securely store BYOK API keys (OpenAI/Anthropic) using Chrome's `storage.local`.
- [ ] Translate the "Decalogue of Prompt Optimization" from `PM_Research.md` into the definitive System Prompt that processes user inputs.
- [ ] Write the asynchronous fetch logic in `background.js` to handle API calls without blocking the browser.

### Phase 4: Library Management & Side Panel (Days 9-11)
**Goal:** Allow users to save, manage, and reuse prompts without cluttering the host webpage.
- [ ] Enable the `sidePanel` permission in `manifest.json`.
- [ ] Build a clean, minimalist UI for the Side Panel to list saved prompts.
- [ ] Implement a SQLite or IndexedDB storage solution for prompt history and favorites.
- [ ] Build the "Import from Prompt Perfect" utility to capture the migrating user base.

### Phase 5: Testing & Deployment (Days 12-14)
**Goal:** Ensure cross-platform resilience and publish.
- [ ] Test DOM selectors thoroughly against ChatGPT, Claude, Gemini, and Perplexity.
- [ ] Implement fallback logic for when these platforms update their DOM structures.
- [ ] Package the extension and run it through the Chrome Web Store validation tests.
- [ ] Draft the launch marketing materials focusing on the "Lightweight, Free, BYOK" value propositions.