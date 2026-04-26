/**
 * Prompt Magic - Content Script
 * Manages DOM interaction and UI injection for AI platforms.
 */

let platformSelectors = null;

console.log("Prompt Magic: Content script loaded.");

// Listen for messages from background script (e.g., Context Menu trigger)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "OPTIMIZE_TEXT") {
    console.log("Optimization triggered.");

    // If the user highlighted text, use that. Otherwise, try to extract from the active input.
    let textToOptimize = request.selection;
    if (!textToOptimize) {
      textToOptimize = extractTextFromActiveInput();
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
async function handleOptimization(originalText) {
  // 1. Show a minimalist "Processing" ghost UI near the cursor or input box
  // 2. Request optimization from background (Phase 3 logic)
  const response = await chrome.runtime.sendMessage({
    action: "CALL_AI_MODEL",
    payload: { text: originalText }
  });

  if (response.success) {
    console.log("Success! Optimized text:", response.optimized);
    injectTextIntoActiveInput(response.optimized);
  }
}

function extractTextFromActiveInput() {
  // TODO: Phase 2 - Read from the active DOM element based on platformSelectors
  const activeEl = document.activeElement;
  return activeEl ? (activeEl.value || activeEl.innerText) : null;
}

function injectTextIntoActiveInput(newText) {
  // TODO: Phase 2 - Inject text and trigger React/Next.js synthetic events
  const activeEl = document.activeElement;
  if (activeEl) {
    if (activeEl.value !== undefined) activeEl.value = newText;
    else activeEl.innerText = newText;
  }
}

async function loadSelectors() {
  try {
    const url = chrome.runtime.getURL('selectors.json');
    const response = await fetch(url);
    platformSelectors = await response.json();
    console.log("Prompt Magic: Selectors loaded.", platformSelectors);
  } catch (error) {
    console.error("Prompt Magic: Failed to load selectors.json", error);
  }
}

loadSelectors();
