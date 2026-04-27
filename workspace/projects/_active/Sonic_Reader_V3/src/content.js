/**
 * Sonic Reader V3 - Overlay Content Script
 * Auto-scans the DOM for speakable content and injects controls.
 */

let config = null;

// Initialize
async function init() {
  await loadConfig();
  if (config) {
    setupObserver();
    scanAndInject();
  }
}

async function loadConfig() {
  try {
    const url = chrome.runtime.getURL('src/selectors.json');
    const response = await fetch(url);
    const allSelectors = await response.json();
    const hostname = window.location.hostname.replace('www.', '');
    config = allSelectors[hostname] || allSelectors['default'];
    console.log("Sonic V3: Config loaded for", hostname);
  } catch (err) {
    console.error("Sonic V3: Failed to load selectors", err);
  }
}

function setupObserver() {
  const observer = new MutationObserver((mutations) => {
    // Debounce scanning to avoid performance hits on rapid typing
    clearTimeout(window.sonicScanTimeout);
    window.sonicScanTimeout = setTimeout(scanAndInject, 500);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function scanAndInject() {
  if (!config) return;

  const targets = document.querySelectorAll(config.output);
  targets.forEach(target => {
    // Only inject if it has significant text and doesn't have a speaker yet
    const text = target.innerText.trim();
    if (text.length < (config.min_chars || 20)) return;
    if (target.querySelector('.sonic-speaker-btn')) return;

    injectSpeaker(target);
  });
}

function injectSpeaker(element) {
  const container = document.createElement('div');
  container.className = 'sonic-speaker-btn';
  container.innerHTML = `
    <button title="Read Aloud" class="sonic-play-btn">🔊</button>
    <div class="sonic-controls">
      <button title="Stop" class="sonic-stop-btn">⏹️</button>
    </div>
  `;

  // Prevent parent clicks if the target is clickable
  container.onclick = (e) => e.stopPropagation();

  const playBtn = container.querySelector('.sonic-play-btn');
  const stopBtn = container.querySelector('.sonic-stop-btn');

  playBtn.onclick = () => {
    speakText(element.innerText);
    container.classList.add('is-playing');
  };

  stopBtn.onclick = () => {
    window.speechSynthesis.cancel();
    container.classList.remove('is-playing');
  };

  // Ensure relative positioning for correct anchoring
  if (window.getComputedStyle(element).position === 'static') {
    element.style.position = 'relative';
  }

  element.appendChild(container);
}

function speakText(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Load user settings (speed, pitch, voice)
  chrome.storage.local.get(['speed', 'pitch', 'voice'], (settings) => {
    utterance.rate = settings.speed || 1.0;
    utterance.pitch = settings.pitch || 1.0;
    
    // We could add voice selection here
    window.speechSynthesis.speak(utterance);
  });

  utterance.onend = () => {
    document.querySelectorAll('.sonic-speaker-btn').forEach(btn => {
      btn.classList.remove('is-playing');
    });
  };
}

init();
