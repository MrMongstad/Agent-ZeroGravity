Building self-running digital empires requires fast, clean, and clever architecture. Relying on external APIs introduces latency, recurring server costs, and network bottlenecks. Shifting the intelligence directly to the user's hardware via the Chrome Prompt API (Gemini Nano) strips out the middleman, giving your automation zero marginal cost and instant, privacy-first execution.

Before we write the code, we must correct a structural misconception: **Manifest V3 background service workers do not have a DOM.** The `window.ai.languageModel` object you referenced does not exist in the background script. Instead, we access the API through the worker's global scope using `self.ai` (or `self.navigator.ai`, depending on the Chrome version). 

Here are the blueprints to get this running.

---

### 1. Hardware Requirements & Current State

The Chrome Built-in AI feature is currently in the Early Preview/Origin Trial phase. It leverages a localized version of Gemini Nano (approx. 3B parameters). 

**Hardware Prerequisites:**
* **Storage:** The user must have at least **22 GB of free disk space** for Chrome to download and unpack the model (the model itself is ~2GB, but the allocation overhead is high). If storage drops below 10GB, Chrome aggressively deletes the model.
* **Memory & OS:** >4GB RAM. Windows 10/11, macOS 13+, or ChromeOS.
* **Browser Environment:** Chrome 128+ (Stable is rolling this out, but Canary/Dev are safest for development).

**Required Chrome Flags (for Local Testing):**
Unless you are using an approved Origin Trial token, your local machine must have these flags configured via `chrome://flags`:
1.  `#optimization-guide-on-device-model` -> Set to **Enabled BypassPerfRequirement**
2.  `#prompt-api-for-gemini-nano` -> Set to **Enabled**

---

### 2. Manifest V3 Architecture & Permissions

Chrome treats the Prompt API as an experimental web standard, not a restricted extension API. Therefore, **there is no explicit `"aiLanguageModel"` permission required in the manifest.** To deploy this without forcing users to manually flip flags, you must register for a Chrome Origin Trial and inject the token into your manifest.

```json
{
  "manifest_version": 3,
  "name": "Local Optimizer Hub",
  "version": "1.0.0",
  "description": "On-device prompt optimization engine.",
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "permissions": [
    "storage" 
  ],
  "trial_tokens": [
    "YOUR_ORIGIN_TRIAL_TOKEN_HERE"
  ]
}
```

---

### 3. Service Worker Blueprint (background.js)

This script initializes the Gemini Nano session, verifies the hardware capabilities, and establishes a long-lived connection port to stream tokens back to your popup or content script. 

```javascript
// background.js
// V8 Service Worker Environment

let aiSession = null;

/**
 * Step 1: Boot and Verify the AI Model
 * Call this eagerly when the extension loads to hide the cold-start latency.
 */
async function initializeModel() {
  // Use 'self' or 'navigator' instead of 'window' in a Service Worker
  const ai = self.ai || self.navigator?.ai; 
  
  if (!ai?.languageModel) {
    console.error("[SYS] Prompt API unavailable. Check Chrome flags or Origin Trial.");
    return false;
  }

  // Check hardware readiness
  const { available } = await ai.languageModel.capabilities();
  
  if (available === 'no') {
    console.error("[SYS] Hardware rejected. Device cannot run Gemini Nano.");
    return false;
  }

  // If 'after-download', Chrome handles the background fetch automatically.
  try {
    aiSession = await ai.languageModel.create({
      // System instructions must be crisp. Nano suffers from context drift if overloaded.
      systemPrompt: "You are a surgical prompt engineer. Analyze the user's raw input and output a highly optimized, machine-readable prompt. Return ONLY the optimized text. Zero conversational filler.",
      temperature: 0.2, // Low variance for deterministic, clean outputs
      topK: 40
    });
    console.log("[SYS] Gemini Nano session active and ready.");
    return true;
  } catch (err) {
    console.error("[SYS] Session initialization failed:", err);
    return false;
  }
}

/**
 * Step 2: Stream the Execution
 * We use promptStreaming to prevent UI freezing and return data instantly.
 */
async function optimizePromptStream(rawInput, port) {
  // Ensure the model is warm
  if (!aiSession) {
     const isReady = await initializeModel();
     if (!isReady) {
        port.postMessage({ error: "AI Engine failed to boot. Check storage space." });
        return;
     }
  }

  try {
    const stream = aiSession.promptStreaming(rawInput);
    
    // Iterate over the readable stream chunks
    for await (const chunk of stream) {
      port.postMessage({ type: "chunk", data: chunk });
    }
    
    port.postMessage({ type: "done" });
    
  } catch (err) {
    console.error("[SYS] Execution drifted or failed:", err);
    port.postMessage({ error: err.message });
  }
}

/**
 * Step 3: Lifecycle Hooks
 * Listen for connections from the extension popup or content scripts.
 */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "ai-optimizer-port") {
    port.onMessage.addListener(async (msg) => {
      if (msg.action === "optimize_prompt") {
        await optimizePromptStream(msg.payload, port);
      }
    });
  }
});

// Eager initialization on startup
chrome.runtime.onStartup.addListener(initializeModel);
chrome.runtime.onInstalled.addListener(initializeModel);
```

---

### 4. Limitations & Optimization Logic

When building local autonomous systems, treat Gemini Nano like a specialized micro-service, not an omniscient oracle. 

* **Token Limits:** Nano operates with a sliding context window of approximately **4096 tokens**, but limits output generation to roughly **1024 tokens per prompt**. Do not use this for bulk processing of massive datasets; chunk your data first.
* **System Prompt Constraints:** Keep the `systemPrompt` brief. The model's smaller parameter count means it is highly susceptible to "context drift." If you feed it a 500-word persona, it will likely forget the actual task instructions. 
* **Factuality Gap:** Nano is optimized for text manipulation (summarization, rewriting, formatting). It is notoriously bad at retrieving factual trivia or executing complex math. Provide the context it needs in the prompt rather than relying on its internal training weights.
* **State Management:** The `aiSession` object retains conversational memory by default. If you are using this as a stateless utility (like a prompt optimizer where each request is isolated), you should either call `aiSession.destroy()` and recreate it, or ensure your system prompt strictly commands it to ignore previous inputs. Keeping unused sessions active consumes ~0.8GB of memory.