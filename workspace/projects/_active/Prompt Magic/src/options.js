document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const modelSelect = document.getElementById('model');
    const saveBtn = document.getElementById('saveBtn');
    const statusDiv = document.getElementById('status');
    const keyHint = document.getElementById('keyHint');

    // Provider hints: model prefix → { placeholder, link text, url }
    const hints = {
        gemini: {
            placeholder: 'AIzaSy...',
            text: 'Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio →</a>'
        },
        claude: {
            placeholder: 'sk-ant-api03-...',
            text: 'Get a key at <a href="https://console.anthropic.com/settings/keys" target="_blank">Anthropic Console →</a>'
        },
        gpt: {
            placeholder: 'sk-proj-...',
            text: 'Get a key at <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform →</a>'
        },
        o3: {
            placeholder: 'sk-proj-...',
            text: 'Get a key at <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform →</a>'
        }
    };

    function updateHint() {
        const val = modelSelect.value.toLowerCase();
        const match = Object.keys(hints).find(k => val.startsWith(k));
        if (match) {
            apiKeyInput.placeholder = hints[match].placeholder;
            keyHint.innerHTML = hints[match].text;
        }
    }

    modelSelect.addEventListener('change', updateHint);

    // Hydrate UI from Chrome Local Storage
    chrome.storage.local.get("settings", (result) => {
        const settings = result.settings || {};
        if (settings.apiKey) apiKeyInput.value = settings.apiKey;
        if (settings.provider) {
            // Try to match stored provider to a dropdown option
            const opts = Array.from(modelSelect.options);
            const match = opts.find(o => o.value === settings.provider);
            if (match) {
                modelSelect.value = settings.provider;
            }
        }
        updateHint();
    });

    // Save Configuration
    saveBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        const model = modelSelect.value;

        if (!key) {
            statusDiv.textContent = '⚠️ API key is required.';
            statusDiv.style.color = '#f87171';
            setTimeout(() => { statusDiv.textContent = ''; statusDiv.style.color = '#a3e635'; }, 2500);
            return;
        }

        chrome.storage.local.set({
            settings: {
                apiKey: key,
                provider: model
            }
        }, () => {
            statusDiv.textContent = '✅ Locked and loaded.';
            saveBtn.textContent = '✓ Saved';
            setTimeout(() => {
                statusDiv.textContent = '';
                saveBtn.textContent = 'Save Configuration';
            }, 2000);
        });
    });
});