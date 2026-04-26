/**
 * Prompt Magic - Background Service Worker
 * Handles context menus, API calls, and Side Panel management.
 */

// Initialize Context Menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "optimize-prompt",
    title: "Optimize Prompt ✨",
    contexts: ["selection", "editable"]
  });

  console.log("Prompt Magic: Background service worker initialized.");
});

// Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "optimize-prompt") {
    // Send message to content script to grab the text and show optimization UI
    chrome.tabs.sendMessage(tab.id, { action: "OPTIMIZE_TEXT", text: info.selectionText });
  }
});

// Message Listener for API handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "CALL_AI_MODEL") {
    handleAIRequest(request.payload, sendResponse);
    return true; // Keep message channel open for async response
  }
});

/**
 * Handle optimization requests using local Gemini Nano or BYOK API
 */
async function handleAIRequest(payload, sendResponse) {
  try {
    // Placeholder for Phase 3: AI Integration
    // Logic will switch between Chrome Prompt API (Gemini Nano) and External APIs
    console.log("AI request received:", payload);
    
    // Simulate processing delay
    setTimeout(() => {
      sendResponse({ success: true, optimized: `[Optimized] ${payload.text}` });
    }, 1000);
  } catch (error) {
    console.error("AI processing failed:", error);
    sendResponse({ success: false, error: error.message });
  }
}
