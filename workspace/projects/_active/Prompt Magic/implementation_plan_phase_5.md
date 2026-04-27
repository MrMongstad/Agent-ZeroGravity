This is an impressive body of work. You have successfully navigated some of the most notoriously difficult aspects of Chrome Extension development—MV3 service worker lifecycle constraints, streaming Server-Sent Events (SSE) without a DOM, and injecting stateful text into obfuscated React/ProseMirror text areas.

Here is my full technical audit of the codebase up to this point, followed by the comprehensive implementation plan for Phase 5: Testing & Deployment.

🏗️ Codebase Audit & Debug Review
The Good:

The Router (background.js): Your fallback logic between Gemini Nano and the BYOK (Bring Your Own Key) Cloud API is flawless. Handling the SSE streams manually via ReadableStreamDefaultReader prevents the UI from locking up while waiting for API responses.
The Injector (content.js): Using Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set bypasses React's synthetic event pool perfectly.
The State Bus (sidepanel.js & options.js): Keeping settings wrapped in a settings object within chrome.storage.local is clean and future-proofs the app for when we add more configuration options.
The Vulnerabilities (Debug & Fixes Needed):

Ghost UI Duplication (content.js): Currently, your MutationObserver watches the document.body for the chat box to appear. If React or Next.js re-renders the parent container, the observer might fire multiple times, potentially injecting multiple "✨" buttons. Fix: We need to tag the input element with a dataset attribute (e.g., data-pm-injected="true") once the button is added to ensure idempotency.
Asset Reachability (content.js): You are fetching chrome.runtime.getURL('selectors.json'). For this to work, selectors.json must be explicitly declared in the manifest.json under "web_accessible_resources". Otherwise, Chrome will block the fetch request with a CORS/Security error.
Missing Bundler: Currently, the extension is plain HTML/JS. To deploy to the Chrome Web Store, we need a build step to minify the code, strip comments, and bundle assets.
🚀 Phase 5: Implementation Plan (Testing & Deployment)
Phase 5 is all about packaging your raw code into a commercial-grade product. We will transition from a "working script" to a "shippable product."

Step 1: The Build Pipeline (Vite + CRXJS)
Instead of manually zipping files, we will implement Vite paired with the @crxjs/vite-plugin.

Why? It provides instant Hot Module Replacement (HMR) during development (no more manually clicking "Reload" in chrome://extensions) and automatically compiles, minifies, and zips a perfect dist folder for the Chrome Web Store.
Step 2: The "Anti-Fragile" Fallback Engine
AI chat interfaces (ChatGPT, Claude, Gemini) update their DOM structures frequently. If they change their input box class name, our selectors.json will break.

Action: We will update content.js to include a generic fallback. If selectors.json fails to find a match, the script will automatically search for the largest textarea or [contenteditable="true"] element on the page.
Step 3: Manifest V3 Finalization
We need to finalize the manifest.json for production:

Declare web_accessible_resources.
Finalize strict "host_permissions" (restricting them to only OpenAI and Anthropic APIs to satisfy Chrome Web Store privacy reviewers).
Add the 16x16, 48x48, and 128x128 extension icons.
Step 4: Web Store Compliance & Marketing Assets
Privacy Policy: Because you are reading DOM data (the user's text) and storing an API key, the Chrome Web Store will reject the extension unless you link to a valid Privacy Policy. (I can generate a standard, compliant template for you).
Promo Materials: We need a 1280x800 Promo Marquee, 440x280 small promo, and high-res screenshots emphasizing the "Free Local AI" and "BYOK" features.
Let's execute Step 1 & the Debug Fixes right now.
Here is the diff to fix the Ghost UI duplication bug in content.js:

content.js
-0
+3
 Show full code block 
}

function injectGhostButton(inputEl) {
  if (inputEl.dataset.pmInjected) return; // Prevent duplicate injections
  inputEl.dataset.pmInjected = "true";

  const btn = document.createElement('button');
  btn.id = 'prompt-magic-btn';
  btn.innerText = '✨';
And here is the initial setup for our modern build pipeline. Create these two files in the root of your project:

New file: package.json
+14
 Show full code block 
{
  "name": "prompt-magic",
  "version": "1.0.0",
  "description": "AI Prompt Optimizer using Gemini Nano and BYOK",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "devDependencies": {
    "@crxjs/vite-plugin": "^2.0.0-beta.23",
    "vite": "^5.2.0"
  }
}
New file: vite.config.js
+9
 Show full code block 
import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json' assert { type: 'json' };

export default defineConfig({
  plugins: [
    crx({ manifest }),
  ],
});
To run this, simply execute npm install followed by npm run build. Vite will read your manifest.json, trace all the HTML and JS files, bundle them together, and output a highly optimized dist folder ready for uploading.

How would you like to proceed?