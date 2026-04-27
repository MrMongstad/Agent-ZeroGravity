/**
 * Prompt Magic - Side Panel Logic
 * Manages the prompt library and history.
 */

document.addEventListener('DOMContentLoaded', () => {
    const promptListEl = document.getElementById('promptList');
    const newPromptText = document.getElementById('newPromptText');
    const addPromptBtn = document.getElementById('addPromptBtn');

    // Load the library array from storage (defaulting to empty array)
    function loadLibrary() {
        chrome.storage.local.get({ promptLibrary: [] }, (result) => {
            renderLibrary(result.promptLibrary);
        });
    }

    // Render prompts dynamically into the DOM
    function renderLibrary(library) {
        promptListEl.innerHTML = '';
        
        if (library.length === 0) {
            promptListEl.innerHTML = '<div class="empty-state">Your library is empty.<br>Paste a prompt above to save it.</div>';
            return;
        }

        library.forEach((prompt, index) => {
            const item = document.createElement('div');
            item.className = 'prompt-item';

            const text = document.createElement('div');
            text.className = 'prompt-text';
            text.textContent = prompt;

            const actions = document.createElement('div');
            actions.className = 'actions';

            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn-copy';
            copyBtn.textContent = 'Copy';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(prompt);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => copyBtn.textContent = 'Copy', 2000);
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => {
                library.splice(index, 1);
                chrome.storage.local.set({ promptLibrary: library }, () => renderLibrary(library));
            };

            actions.append(copyBtn, deleteBtn);
            item.append(text, actions);
            promptListEl.appendChild(item);
        });
    }

    // Add a new prompt to the top of the list
    addPromptBtn.addEventListener('click', () => {
        const text = newPromptText.value.trim();
        if (!text) return;

        chrome.storage.local.get({ promptLibrary: [] }, (result) => {
            const library = result.promptLibrary;
            library.unshift(text);
            chrome.storage.local.set({ promptLibrary: library }, () => {
                newPromptText.value = '';
                renderLibrary(library);
            });
        });
    });

    // Initialize
    loadLibrary();
});
