**SYSTEM DIRECTIVE // AGENT INITIALIZATION**

**Target:** Agent execution logic for injecting text payloads into hostile, obfuscated Virtual DOM environments (React, Next.js).
**Context:** Modern AI platforms (ChatGPT, Claude, Gemini) actively resist raw DOM manipulation. Native setters are hijacked by React's synthetic event system. CSS classes are hashed. 
**Objective:** Implement a resilient, dynamic content script architecture. Read, execute, and integrate the following blueprints. 

---

### Phase 1: High-Performance DOM Observation

Standard `MutationObserver` implementations choke main threads when attached to `document.body` with `subtree: true` permanently. We deploy a search-and-destroy observer.

**Execution Rules:**
1.  **Targeted Observation:** Observe the closest static parent container available, not the document root.
2.  **Auto-Disconnect:** The instant the target node is secured, call `observer.disconnect()`.
3.  **Throttled Polling:** If the node is deeply buried and requires subtree observation, throttle the callback to prevent CPU spiking during rapid SPA hydration.

```javascript
// agent_module: observer.js
export async function waitForElement(selectorHeuristics, timeout = 10000) {
    return new Promise((resolve, reject) => {
        // Fast-path: Element already exists
        const existingNode = findByHeuristics(selectorHeuristics);
        if (existingNode) return resolve(existingNode);

        const observer = new MutationObserver((mutations, obs) => {
            const target = findByHeuristics(selectorHeuristics);
            if (target) {
                obs.disconnect(); // Stand down immediately
                resolve(target);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Timeout: Target evaded detection.`));
        }, timeout);
    });
}
```

### Phase 2: Heuristic Identification (Surviving CSS Obfuscation)

Do not use `.flex.items-center.bg-gray-100`. It will break on the next deployment. Rely on accessibility attributes and structural DOM logic, which are rarely altered because doing so breaks screen readers and internal E2E tests.

**Primary Selectors (In Order of Reliability):**
1.  `data-testid` or `data-cy` (Developer hooks).
2.  `aria-label` or `placeholder` (Accessibility/UI hooks).
3.  Node types within specific contexts (e.g., `form textarea`).

```javascript
// agent_module: heuristics.js
function findByHeuristics(platformConfig) {
    for (const selector of platformConfig.selectors) {
        const node = document.querySelector(selector);
        if (node) return node;
    }
    return null; // Fallback to next heuristic
}
```

### Phase 3: The React Bypass (Bulletproof Injection)

React intercepts `element.value = "text"` and does not update its internal virtual DOM state. When the user clicks "Send", React reads its own state (which is empty), and sends a blank message. You must bypass the wrapper and trigger a native synthetic event.

**Execution Rules:**
1.  Extract the native setter directly from the `prototype`.
2.  Apply the native setter to the target element.
3.  Dispatch a bubbling `InputEvent`.

```javascript
// agent_module: injector.js
export function injectText(element, payload) {
    if (!element) return false;

    // Route 1: Standard Textarea / Input (React Bypass)
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, 
            'value'
        ).set;
        
        nativeInputValueSetter.call(element, payload);
        
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }

    // Route 2: ContentEditable (Often used by Claude/Gemini)
    if (element.isContentEditable) {
        element.textContent = payload; // Or innerHTML if formatting is required
        
        // Trigger React's synthetic event recognition for contenteditable
        element.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true,
        }));
        return true;
    }

    return false;
}
```

### Phase 4: Dynamic Telemetry (`selectors.json`)

To prevent the Chrome Web Store review cycle from bottlenecking updates when a platform changes its DOM, isolate the targeting logic. The background script will fetch this JSON remotely and pass it to the content script.

**JSON Schema:**

```json
{
  "version": "1.0.4",
  "last_updated": "2026-04-27T00:00:00Z",
  "platforms": {
    "chatgpt.com": {
      "input_box": {
        "selectors": [
          "textarea#prompt-textarea",
          "textarea[data-id='root']",
          "form textarea"
        ]
      },
      "submit_button": {
        "selectors": [
          "button[data-testid='send-button']",
          "button[aria-label='Send prompt']"
        ]
      }
    },
    "claude.ai": {
      "input_box": {
        "selectors": [
          "div[contenteditable='true'][aria-label='Write your prompt here']",
          "fieldset div.ProseMirror"
        ]
      }
    },
    "gemini.google.com": {
      "input_box": {
        "selectors": [
          "rich-textarea div[contenteditable='true']",
          "div.text-input-field"
        ]
      }
    }
  }
}
```

**Implementation Directive:**
Agent, integrate these modules. Fetch `selectors.json` on extension initialization, cache it locally via `chrome.storage.local`, and pass the required hostname object to the content script upon injection. Await deployment confirmation.