import promptLibrary from './data/library.json';

const searchInput = document.getElementById('searchInput');
const promptList = document.getElementById('promptList');

/**
 * Renders the array of prompts into the DOM.
 */
function renderPrompts(prompts) {
  promptList.innerHTML = '';
  
  if (prompts.length === 0) {
    promptList.innerHTML = '<div class="empty-state">No prompts found matching your search.</div>';
    return;
  }

  prompts.forEach(item => {
    const card = document.createElement('div');
    card.className = 'prompt-card';
    
    // Build the card HTML
    card.innerHTML = `
      <span class="category-badge">${item.category}</span>
      <h3>${item.title}</h3>
      <p>${item.prompt}</p>
    `;

    // When a card is clicked, send the prompt text to the active tab
    card.addEventListener('click', () => {
      injectPromptToActiveTab(item.prompt);
    });

    promptList.appendChild(card);
  });
}

/**
 * Sends a message to the content script in the active tab to inject the text.
 */
function injectPromptToActiveTab(text) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: "insert_prompt", 
        text: text 
      });
    }
  });
}

// Real-time Search Filtering
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  
  const filteredPrompts = promptLibrary.filter(item => 
    item.title.toLowerCase().includes(searchTerm) || 
    item.prompt.toLowerCase().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm)
  );
  
  renderPrompts(filteredPrompts);
});

// Initial Render on load
renderPrompts(promptLibrary);