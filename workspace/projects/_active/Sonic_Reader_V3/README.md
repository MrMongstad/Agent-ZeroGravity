# Sonic Reader V3: Overlay

A next-generation successor to Sonic Reader V2. While V2 focused on a dedicated interface and high-fidelity Piper TTS models, **V3 (Overlay)** focuses on frictionless, deep injection into any web interface.

## Key Features
- **Auto-Scanner:** Dynamically identifies AI responses, articles, and long text blocks across any website.
- **Ghost Injection:** Automatically appends a minimalist "Read Aloud" button to detected text blocks.
- **Smart Mutation Monitoring:** Automatically detects new text as it appears (e.g., streaming chat responses).
- **Glassmorphism UI:** Non-intrusive, semi-transparent controls that appear only when needed.
- **Low Latency:** Uses native Web Speech synthesis for instant response.

## Architecture
- **Injected Overlay:** Built as a Chrome Extension for ubiquitous access.
- **Selector Engine:** Uses `selectors.json` to identify specific content regions on platforms like ChatGPT, Gemini, and Claude.
- **Native TTS:** Currently uses `window.speechSynthesis` for performance, with future hooks planned for the Sonic Reader V2 Piper API.

## Project Structure
- `manifest.json`: Extension entry point.
- `src/content.js`: The scanning and injection brain.
- `src/content.css`: Visuals for the injected buttons.
- `src/popup.html`: Settings (Speed, Pitch).
- `src/selectors.json`: Site-specific mapping for text detection.

---
*Created by Antigravity (Jarvis) for StephanM.*
