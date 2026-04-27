# Research Prompts for AI Extension Development

Copy and paste the following prompts into external AI tools (like ChatGPT, Claude, or Kimi) to gather highly specific, actionable technical data for building the *Prompt Magic* extension.

---

### Prompt 1: Mastering the Chrome Prompt API (Gemini Nano)
**Use this to gather information on how to implement the free local AI tier.**

```text
You are an expert Chrome Extension developer specializing in Manifest V3 and the latest experimental web APIs. 

I am building a browser extension that optimizes user prompts locally without relying on costly external servers. I want to use the built-in Chrome Prompt API (window.ai.languageModel) which leverages Gemini Nano directly on the user's hardware.

Please provide a comprehensive technical brief that covers:
1. The current state, availability, and hardware requirements for the Chrome Prompt API.
2. The exact steps and permissions required in `manifest.json` to enable it.
3. A robust code example showing how to initialize the model, check its readiness (`ai.languageModel.capabilities()`), and send a streaming prompt request from a background service worker.
4. Known limitations, token limits, and best practices for structuring system instructions for this specific local model.

Output the response in clean Markdown with well-commented code blocks.
```

---

### Prompt 2: Resilient DOM Injection for Modern Web Apps
**Use this to learn how to inject your code into complex, constantly changing platforms like ChatGPT and Claude.**

```text
You are a Senior Frontend Engineer with deep expertise in reverse-engineering React, Next.js, and complex Single Page Applications (SPAs). 

I am building a Manifest V3 Chrome extension that needs to read and write text to the chat input boxes of major AI platforms (specifically ChatGPT, Claude, and Google Gemini). Because these platforms use virtual DOMs (like React) and frequently obfuscate their CSS classes, standard `document.querySelector` and `element.value = "text"` approaches often fail or don't trigger the site's internal state updates.

Please provide a strategic guide on how to build a highly resilient content script. Include:
1. How to effectively use a `MutationObserver` to wait for the chat input box to render without causing performance bottlenecks.
2. The best methods for identifying input boxes when class names are obfuscated or frequently change (e.g., using ARIA attributes, data-test-ids, or structural heuristics).
3. A bulletproof code example showing how to programmatically insert text into a React-controlled `<textarea>` or `contenteditable` div and properly dispatch the necessary `Input` or `Change` events so the SPA recognizes the new text.
4. How to structure a `selectors.json` configuration file so I can easily update selectors via a remote fetch without pushing a new extension update to the Chrome Web Store.
```

---

### Prompt 3: Deep Dive into "System Prompts" for Prompt Optimization
**Use this to gather specific instructions to power your actual LLM.**

```text
You are a world-class Prompt Engineer and AI Researcher. I am building a tool that takes a user's rough, poorly-written AI prompt and rewrites it into a highly structured, professional prompt. 

I need you to design the ultimate "Meta-Prompt" (the system prompt that instructs my AI on how to improve the user's prompt). 

Please break down the anatomy of a perfect prompt (e.g., Identity, Context, Constraints, Few-Shot examples, Output format). Then, provide the exact wording for a comprehensive System Prompt that I can feed into my application's backend. The goal is for my AI to take an input like "write a blog about space" and output a highly detailed, constrained, and multi-layered prompt that yields professional-grade results.
```