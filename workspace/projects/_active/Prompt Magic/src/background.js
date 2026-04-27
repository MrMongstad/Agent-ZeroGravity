// V8 Service Worker Environment for Manifest V3

let aiSession = null;

/**
 * Ultra-Dense Meta-Prompt for Gemini Nano (3B Parameters).
 * Compressed from the "Master Prompt Structure" to prevent context drift
 * while enforcing the strict architectural pillars (Role, Task, Context, Constraints, Format).
 */
const NANO_SYSTEM_PROMPT = `You are a world-class Prompt Architect. 
Transform the user's raw, vague input into a highly structured, definitive execution blueprint.
Output MUST strictly follow this structure:
**[ROLE & IDENTITY]** (Define the expert persona)
**[TASK & OBJECTIVE]** (Clear, actionable objective)
**[CONTEXT]** (Background info and assumed variables)
**[CONSTRAINTS & RULES]** (3-5 strict negative boundaries)
**[OUTPUT FORMAT]** (Exact structural requirement)

Zero conversational filler. Output ONLY the optimized prompt.`;

/**
 * Step 1: Boot and Verify the Local AI Model
 * Called eagerly on extension load to hide cold-start latency.
 */
async function initializeModel() {
  // MV3 Background workers lack a DOM, so we use self/navigator
  const ai = self.ai || self.navigator?.ai;

  if (!ai?.languageModel) {
    console.warn("[SYS] Prompt API unavailable. Check Chrome flags or Origin Trial token.");
    return false;
  }

  const { available } = await ai.languageModel.capabilities();
  if (available === 'no') {
    console.warn("[SYS] Hardware rejected. Device cannot run local Gemini Nano.");
    return false;
  }

  try {
    // Memory management: destroy lingering unused sessions before creating a new one
    if (aiSession) {
      aiSession.destroy();
    }

    aiSession = await ai.languageModel.create({
      systemPrompt: NANO_SYSTEM_PROMPT,
      temperature: 0.2, // Low variance for clean, deterministic structural outputs
      topK: 40
    });
    console.log("[SYS] Local Gemini Nano session warm and ready.");
    return true;
  } catch (err) {
    console.error("[SYS] Session initialization failed:", err);
    return false;
  }
}

/**
 * Step 2: The Router - Decide between Cloud BYOK and Local Nano
 */
async function optimizePromptStream(rawInput, port) {
  console.log("[SYS] optimizePromptStream initiated. Payload length:", rawInput.length);
  const storage = await chrome.storage.local.get("settings");
  const settings = storage.settings || {};
  const apiKey = settings.apiKey;
  
  console.log("[SYS] Extracted settings:", JSON.stringify(settings));

  if (apiKey) {
    // Auto-detect Google key by prefix (AIzaSy...) or provider name
    const isGoogle = apiKey.startsWith('AIzaSy') ||
                     (settings.provider && settings.provider.toLowerCase().includes('gemini'));
    if (isGoogle) {
      console.log("[SYS] Routing to Gemini Cloud API. Provider:", settings.provider);
      await routeToGemini(rawInput, apiKey, settings.provider, port);
    } else {
      console.log("[SYS] Routing to Cloud API (OpenAI/Anthropic). Provider:", settings.provider);
      await routeToCloud(rawInput, apiKey, settings.provider, port);
    }
  } else {
    // Free Local Tier Route
    console.log("[SYS] Routing to Local Model (Gemini Nano).");
    await routeToLocal(rawInput, port);
  }
}

async function routeToLocal(rawInput, port) {
  if (!aiSession) {
    const isReady = await initializeModel();
    if (!isReady) {
      port.postMessage({ error: "AI Engine failed to boot. Check storage space or add an API key in settings." });
      return;
    }
  }

  try {
    const stream = aiSession.promptStreaming(rawInput);
    for await (const chunk of stream) {
      port.postMessage({ type: "chunk", data: chunk });
    }
    port.postMessage({ type: "done" });
  } catch (err) {
    console.error("[SYS] Execution drifted or failed:", err);
    port.postMessage({ error: "Local AI Error: " + err.message });
  }
}

async function routeToGemini(rawInput, apiKey, provider, port) {
  // Use non-streaming generateContent — verified working
  const model = (provider && provider.toLowerCase().includes('gemini'))
    ? provider
    : 'gemini-2.5-flash';

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  console.log('[SYS] Gemini endpoint:', endpoint);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: NANO_SYSTEM_PROMPT }]
        },
        contents: [{
          role: 'user',
          parts: [{ text: rawInput }]
        }],
        generationConfig: { temperature: 0.2 }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('[SYS] Gemini raw response:', JSON.stringify(data).slice(0, 200));

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      port.postMessage({ type: 'chunk', data: text });
    } else {
      throw new Error('No text in Gemini response: ' + JSON.stringify(data).slice(0, 300));
    }

    port.postMessage({ type: 'done' });
  } catch (err) {
    console.error('[SYS] Gemini Route Failed:', err);
    port.postMessage({ error: 'Gemini API Error: ' + err.message });
  }
}

async function routeToCloud(rawInput, apiKey, provider, port) {
  const isClaude = provider && provider.toLowerCase().includes("claude");

  try {
    let endpoint, headers, body;

    if (isClaude) {
      endpoint = "https://api.anthropic.com/v1/messages";
      headers = {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerously-allow-browser": "true"
      };
      body = JSON.stringify({
        model: provider,
        system: NANO_SYSTEM_PROMPT,
        messages: [{ role: "user", content: rawInput }],
        stream: true,
        temperature: 0.2,
        max_tokens: 2048
      });
    } else {
      endpoint = "https://api.openai.com/v1/chat/completions";
      headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      };
      body = JSON.stringify({
        model: provider || "gpt-4o",
        messages: [
          { role: "system", content: NANO_SYSTEM_PROMPT },
          { role: "user", content: rawInput }
        ],
        stream: true,
        temperature: 0.2 // Low variance for structural output
      });
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloud API Error (${response.status}): ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    // Parse Server-Sent Events (SSE)
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // Keep the last incomplete line in the buffer in case a chunk was split
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;

        const data = trimmed.replace("data: ", "");
        if (data === "[DONE]") {
          port.postMessage({ type: "done" });
          return;
        }

        try {
          const parsed = JSON.parse(data);

          let content = "";
          if (isClaude) {
            if (parsed.type === "content_block_delta") {
              content = parsed.delta?.text;
            } else if (parsed.type === "message_stop") {
              port.postMessage({ type: "done" });
              return;
            }
          } else {
            content = parsed.choices[0]?.delta?.content;
          }

          if (content) {
            port.postMessage({ type: "chunk", data: content });
          }
        } catch (e) {
          console.warn("[SYS] Failed to parse stream chunk:", data);
        }
      }
    }

    port.postMessage({ type: "done" });
  } catch (err) {
    console.error("[SYS] Cloud Execution Failed:", err);
    port.postMessage({ error: "Cloud AI Error: " + err.message });
  }
}

/**
 * Step 3: Lifecycle Hooks
 * Listen for persistent connections from the Ghost UI content script.
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

// Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "prompt-magic-optimize" && tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: "OPTIMIZE_TEXT",
      selection: info.selectionText
    }).catch(err => console.warn("[SYS] Content script not active in this tab.", err));
  }
});

// Eager initialization
chrome.runtime.onStartup.addListener(initializeModel);
chrome.runtime.onInstalled.addListener(() => {
  initializeModel();
  chrome.contextMenus.create({
    id: "prompt-magic-optimize",
    title: "✨ Optimize with Prompt Magic",
    contexts: ["selection", "editable"]
  });
});

if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
}