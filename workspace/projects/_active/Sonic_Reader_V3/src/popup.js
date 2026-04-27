/**
 * Sonic Reader V3 - Popup Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const speedInput = document.getElementById('speed');
  const pitchInput = document.getElementById('pitch');
  const speedVal = document.getElementById('speedVal');
  const pitchVal = document.getElementById('pitchVal');

  // Load saved settings
  chrome.storage.local.get(['speed', 'pitch'], (result) => {
    if (result.speed) {
      speedInput.value = result.speed;
      speedVal.innerText = `${result.speed}x`;
    }
    if (result.pitch) {
      pitchInput.value = result.pitch;
      pitchVal.innerText = result.pitch;
    }
  });

  // Save on change
  speedInput.oninput = () => {
    const val = speedInput.value;
    speedVal.innerText = `${val}x`;
    chrome.storage.local.set({ speed: parseFloat(val) });
  };

  pitchInput.oninput = () => {
    const val = pitchInput.value;
    pitchVal.innerText = val;
    chrome.storage.local.set({ pitch: parseFloat(val) });
  };
});
