/**
 * Prompt Magic - Content Script
 * Manages DOM interaction and UI injection for AI platforms.
 */

console.log("Prompt Magic: Content script loaded.");

// Listen for messages from background script (e.g., Context Menu trigger)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "OPTIMIZE_TEXT") {
    console.log("Optimization triggered for text:", request.text);
    handleOptimization(request.text);
  }
});

/**
 * Main logic for processing and re-inserting optimized text
 */
async function handleOptimization(originalText) {
  // 1. Show a minimalist "Processing" ghost UI near the cursor or input box
  // 2. Request optimization from background (Phase 3 logic)
  const response = await chrome.runtime.sendMessage({ 
    action: "CALL_AI_MODEL", 
    payload: { text: originalText } 
  });

  if (response.success) {
    console.log("Success! Optimized text:", response.optimized);
    // 3. Inject optimized text back into the active input element
    // TODO: Phase 2 logic for React/Next.js controlled textareas
  }
}

/**
 * Phase 2 Placeholder: MutationObserver to detect chat inputs
 */
function initInputObserver() {
  // This will use selectors.json to find target inputs on ChatGPT, Gemini, etc.
}

initInputObserver();
