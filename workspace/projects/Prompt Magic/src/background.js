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
    // Send message to content script to handle the optimization.
    // We pass selectionText if they highlighted something, otherwise the content script will find the active input.
    chrome.tabs.sendMessage(tab.id, {
      action: "OPTIMIZE_TEXT",
      selection: info.selectionText || null
    });
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
    const { pm_api_key, pm_model } = await chrome.storage.local.get(['pm_api_key', 'pm_model']);
    const userText = payload.text || "";

    // Optimization Meta-Prompt (The Decalogue)
    const systemPrompt = `You are a world-class prompt engineer. Your challenge is to transform the following raw user intent into a high-fidelity, machine-executable instruction.
    
    1. EXPERT IDENTITY: Assign a high-prestige role.
    2. OBJECTIVE CLARITY: Distill the goal into an actionable sentence.
    3. CONTEXTUAL GROUNDING: Add necessary Who/What/Why.
    4. CONSTRAINTS: Define boundaries and style.
    5. FORMAT: Explicitly define the target structure (e.g., Markdown).
    
    RAW USER INPUT: "${userText}"
    
    OUTPUT ONLY THE OPTIMIZED PROMPT. DO NOT ADD PREAMBLE.`;

    // Attempt 1: Chrome Prompt API (Gemini Nano) - ZERO COST
    if (typeof ai !== 'undefined' && ai.languageModel) {
      console.log("Prompt Magic: Using Local Gemini Nano...");
      try {
        const capabilities = await ai.languageModel.capabilities();
        if (capabilities.available !== 'no') {
          const session = await ai.languageModel.create({
            systemPrompt: "You are a prompt engineer."
          });
          const result = await session.prompt(systemPrompt);
          sendResponse({ success: true, optimized: result.trim() });
          return;
        }
      } catch (e) {
        console.warn("Local Gemini Nano failed, falling back to Cloud/Placeholder...", e);
      }
    }

    // Attempt 2: BYOK (OpenAI/Anthropic) - USER KEY
    if (pm_api_key && pm_model) {
      console.log(`Prompt Magic: Using Cloud Provider (${pm_model})...`);

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${pm_api_key}`
          },
          body: JSON.stringify({
            model: pm_model,
            messages: [{ role: "user", content: systemPrompt }],
            temperature: 0.2
          })
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (data.choices && data.choices[0]) {
          sendResponse({ success: true, optimized: data.choices[0].message.content.trim() });
          return;
        }
      } catch (cloudError) {
        console.warn(`Prompt Magic: Cloud Provider fallback failed (${pm_model}):`, cloudError.message);
      }
    }

    // Attempt 3: Placeholder / Heuristic Fallback
    console.log("Prompt Magic: Using Heuristic Fallback...");
    const fallbackText = `### [Optimized Task]
**Role:** Expert Analyst
**Task:** ${userText}
**Constraints:** Be concise, use professional tone, and format in Markdown.
**Context:** Generated via Prompt Magic Offline Mode.`;

    sendResponse({ success: true, optimized: fallbackText });

  } catch (error) {
    console.error("AI processing failed:", error);
    sendResponse({ success: false, error: error.message });
  }
}
