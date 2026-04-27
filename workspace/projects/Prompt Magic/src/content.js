/**
 * Prompt Magic - Content Script
 * Manages DOM interaction and UI injection for AI platforms.
 */

let platformConfig = null;
let lastActiveElement = null;

console.log("Prompt Magic: Content script loaded.");

// Listen for messages from background script (e.g., Context Menu trigger)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "OPTIMIZE_TEXT") {
    console.log("Prompt Magic: Optimization triggered via Context Menu.");

    // If the user highlighted text, use that. Otherwise, try to extract from the active input.
    let textToOptimize = request.selection;
    if (!textToOptimize) {
      lastActiveElement = document.activeElement;
      textToOptimize = lastActiveElement.value || lastActiveElement.innerText;
    }

    if (textToOptimize) {
      handleOptimization(textToOptimize);
    } else {
      console.warn("Prompt Magic: Could not find text to optimize.");
    }
  }
});

/**
 * Main logic for processing and re-inserting optimized text
 */
function handleOptimization(originalText) {
  const btn = document.getElementById('prompt-magic-btn');
  if (btn) btn.innerText = '⏳';

  // 2. Open a persistent port for streaming response from the background
  const port = chrome.runtime.connect({ name: "ai-optimizer-port" });
  port.postMessage({
    action: "optimize_prompt",
    payload: originalText
  });

  let accumulatedText = "";
  let isFirstChunk = true;

  port.onMessage.addListener((msg) => {
    if (msg.error) {
      console.error("Prompt Magic Error:", msg.error);
      if (btn) btn.innerText = '⚠️';
      port.disconnect();
      return;
    }

    if (msg.type === "chunk") {
      accumulatedText += msg.data;
      streamText(accumulatedText, msg.data, isFirstChunk);
      isFirstChunk = false;
    } else if (msg.type === "done") {
      console.log("Prompt Magic: Stream complete.");
      if (btn) btn.innerText = '✨';
      port.disconnect();
    }
  });
}

function streamText(fullText, chunk, isFirst) {
  // Use the element we saved from the click/context menu, or fallback to the active element
  const el = lastActiveElement || document.activeElement;
  if (!el) {
    console.error("Prompt Magic: No target element found for injection.");
    return;
  }

  const isTextarea = el.tagName.toLowerCase() === 'textarea';

  // STEP 3: The "React Bypass" Injection
  if (isTextarea) {
    // Bypass React's synthetic events for <textarea> (e.g., ChatGPT)
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    nativeInputValueSetter.call(el, fullText);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    // Bypass for contenteditable divs (e.g., Claude, Gemini)
    // execCommand is the safest way to inject into ProseMirror/Draft.js without breaking their internal state tree
    el.focus();
    if (isFirst) {
      document.execCommand('selectAll', false, null);
    }
    document.execCommand('insertText', false, chunk);
  }
}

// STEP 4: The "Ghost" UI Trigger
function initGhostUI() {
  if (!platformConfig || !platformConfig.input) return;

  // Watch the DOM for the chat box to appear (fixes SPA navigation issues)
  const observer = new MutationObserver(() => {
    const inputEl = document.querySelector(platformConfig.input);
    if (inputEl && !document.getElementById('prompt-magic-btn')) {
      injectGhostButton(inputEl);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function injectGhostButton(inputEl) {
  const btn = document.createElement('button');
  btn.id = 'prompt-magic-btn';
  btn.innerText = '✨';
  btn.title = 'Optimize Prompt (Prompt Magic)';
  btn.style.cssText = `
    position: absolute;
    right: 15px;
    bottom: 15px;
    z-index: 9999;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    transition: transform 0.2s;
  `;

  btn.onmouseover = () => btn.style.transform = 'scale(1.2)';
  btn.onmouseout = () => btn.style.transform = 'scale(1)';

  // Ensure parent can anchor the absolute positioned button
  const parent = inputEl.parentElement;
  if (window.getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }
  parent.appendChild(btn);

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    lastActiveElement = inputEl; // Save target for injection
    const text = inputEl.value || inputEl.innerText;
    if (text) {
      handleOptimization(text);
    }
  });
}

// STEP 1 & 2: Load Selectors and identify platform
async function loadSelectors() {
  try {
    const url = chrome.runtime.getURL('selectors.json');
    const response = await fetch(url);
    const allSelectors = await response.json();

    // Match current hostname (handles both 'chatgpt.com' and 'www.chatgpt.com')
    const hostname = window.location.hostname.replace('www.', '');
    platformConfig = allSelectors[hostname];

    console.log("Prompt Magic: Platform config loaded:", platformConfig);

    if (platformConfig) {
      initGhostUI();
    }
  } catch (error) {
    console.error("Prompt Magic: Failed to load selectors.json", error);
  }
}

loadSelectors();
