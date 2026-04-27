document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const providerInput = document.getElementById('provider');
    const saveBtn = document.getElementById('saveBtn');
    const statusDiv = document.getElementById('status');

    // Hydrate UI from Chrome Local Storage
    chrome.storage.local.get("settings", (result) => {
        const settings = result.settings || {};
        if (settings.apiKey) apiKeyInput.value = settings.apiKey;
        if (settings.provider) providerInput.value = settings.provider;
    });

    // Save Configuration securely
    saveBtn.addEventListener('click', () => {
        chrome.storage.local.set({
            settings: {
                apiKey: apiKeyInput.value.trim(),
                provider: providerInput.value.trim() || 'gpt-4o'
            }
        }, () => {
            statusDiv.textContent = 'Configuration secured.';
            saveBtn.textContent = 'Saved!';
            setTimeout(() => { statusDiv.textContent = ''; saveBtn.textContent = 'Save Configuration'; }, 2000);
        });
    });
});