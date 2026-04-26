document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const providerInput = document.getElementById('provider');
    const saveBtn = document.getElementById('saveBtn');
    const statusDiv = document.getElementById('status');

    // Hydrate UI from Chrome Local Storage
    chrome.storage.local.get(['pm_api_key', 'pm_model'], (result) => {
        if (result.pm_api_key) apiKeyInput.value = result.pm_api_key;
        if (result.pm_model) providerInput.value = result.pm_model;
    });

    // Save Configuration securely
    saveBtn.addEventListener('click', () => {
        chrome.storage.local.set({
            pm_api_key: apiKeyInput.value.trim(),
            pm_model: providerInput.value.trim() || 'gpt-4o'
        }, () => {
            statusDiv.textContent = 'Configuration secured.';
            saveBtn.textContent = 'Saved!';
            setTimeout(() => { statusDiv.textContent = ''; saveBtn.textContent = 'Save Configuration'; }, 2000);
        });
    });
});