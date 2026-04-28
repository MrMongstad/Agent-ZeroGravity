/**
 * Empire HQ — App Controller
 * Wires Library + Status panels, SSE, and all interactions.
 */

// ─── State ─────────────────────────────────────────────────────────────────────
const state = {
  files: [],
  activeFile: null,
  activePanel: 'library',
  searchQuery: '',
  currentRaw: '',
};

// ─── DOM References ────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const fileTree      = $('fileTree');
const readingCanvas = $('readingCanvas');
const breadcrumb    = $('breadcrumb');
const fileSearch    = $('fileSearch');
const statusGrid    = $('statusGrid');
const globalDot     = $('globalStatusDot');
const welcomeStats  = $('welcomeStats');
const btnRefresh    = $('btnRefreshStatus');
const btnCopy       = $('btnCopy');
const footerTime    = $('footerTime');

// ─── Toast ─────────────────────────────────────────────────────────────────────
function toast(msg, type = 'info', ms = 3000) {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  $('toastContainer').appendChild(el);
  setTimeout(() => el.remove(), ms);
}

// ─── Clock ─────────────────────────────────────────────────────────────────────
function tickClock() {
  footerTime.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
}
tickClock();
setInterval(tickClock, 1000);

// ─── SSE Live Reload ───────────────────────────────────────────────────────────
let sse;
function connectSSE() {
  sse = new EventSource('/api/watch');
  sse.addEventListener('file-changed', e => {
    const { file } = JSON.parse(e.data);
    toast(`📄 ${file} changed`, 'info');
    loadFiles();
    // Auto-refresh if the current file changed
    if (state.activeFile && state.activeFile.name === file) {
      loadDocument(state.activeFile);
    }
  });
  sse.onerror = () => {
    $('liveIndicator').style.opacity = '0.3';
    setTimeout(connectSSE, 5000);
  };
  sse.onopen = () => {
    $('liveIndicator').style.opacity = '1';
  };
}
connectSSE();

// ─── Panel Switcher ────────────────────────────────────────────────────────────
document.getElementById('navTabs').addEventListener('click', e => {
  const tab = e.target.closest('.nav-tab');
  if (!tab) return;
  const panel = tab.dataset.panel;
  if (panel === state.activePanel) return;
  state.activePanel = panel;

  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');

  document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
  $(`panel${panel.charAt(0).toUpperCase() + panel.slice(1)}`).classList.remove('hidden');

  const fileTreeSection = $('fileTreeSection');
  if (panel === 'status') {
    fileTreeSection.style.display = 'none';
    loadGitStatus();
  } else {
    fileTreeSection.style.display = 'flex';
  }
});

// ─── Library Panel ─────────────────────────────────────────────────────────────
async function loadFiles() {
  try {
    const res = await fetch('/api/files');
    state.files = await res.json();
    renderFileTree(state.files);
    renderWelcomeStats(state.files);
  } catch (err) {
    fileTree.innerHTML = `<div class="loading-state">⚠ Cannot reach server</div>`;
  }
}

function renderWelcomeStats(files) {
  if (!welcomeStats) return;
  const dirs = [...new Set(files.map(f => f.dir))];
  welcomeStats.innerHTML = dirs.map(dir => {
    const count = files.filter(f => f.dir === dir).length;
    return `<div class="stat-pill"><strong>${count}</strong> ${dir}</div>`;
  }).join('') + `<div class="stat-pill"><strong>${files.length}</strong> total</div>`;
}

function renderFileTree(files) {
  const q = state.searchQuery.toLowerCase();
  const filtered = q ? files.filter(f => f.name.toLowerCase().includes(q)) : files;

  if (!filtered.length) {
    fileTree.innerHTML = `<div class="loading-state">No documents found</div>`;
    return;
  }

  // Group by dir
  const groups = {};
  filtered.forEach(f => {
    if (!groups[f.dir]) groups[f.dir] = [];
    groups[f.dir].push(f);
  });

  const dirIcons = { memory: '🧠', reports: '📊', docs: '📁' };

  fileTree.innerHTML = Object.entries(groups).map(([dir, items]) => `
    <div class="file-group-label">${dirIcons[dir] || '📁'} ${dir}</div>
    ${items.map(f => `
      <div class="file-item ${state.activeFile?.rel === f.rel ? 'active' : ''}"
           data-rel="${f.rel}" title="${f.name}">
        <span class="file-item-icon">📄</span>
        <span class="file-item-name">${f.name.replace(/\.md$/, '')}</span>
      </div>
    `).join('')}
  `).join('');

  fileTree.querySelectorAll('.file-item').forEach(el => {
    el.addEventListener('click', () => {
      const file = state.files.find(f => f.rel === el.dataset.rel);
      if (file) loadDocument(file);
    });
  });
}

async function loadDocument(file) {
  state.activeFile = file;
  breadcrumb.textContent = `${file.dir} / ${file.name}`;
  btnCopy.style.display = 'inline-block';
  readingCanvas.innerHTML = `<div class="loading-state">Loading…</div>`;

  // Update active state in file tree
  document.querySelectorAll('.file-item').forEach(el => {
    el.classList.toggle('active', el.dataset.rel === file.rel);
  });

  try {
    const res = await fetch(`/api/read?path=${encodeURIComponent(file.rel)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.text();
    state.currentRaw = raw;
    const html = marked.parse(raw);
    readingCanvas.innerHTML = `<div class="md-body">${html}</div>`;
    readingCanvas.scrollTop = 0;
  } catch (err) {
    readingCanvas.innerHTML = `<div class="loading-state">⚠ Failed to load: ${err.message}</div>`;
    toast(`Failed to load ${file.name}`, 'error');
  }
}

fileSearch.addEventListener('input', e => {
  state.searchQuery = e.target.value;
  renderFileTree(state.files);
});

btnCopy.addEventListener('click', () => {
  navigator.clipboard.writeText(state.currentRaw);
  toast('Markdown copied to clipboard', 'success');
});

// ─── Status Panel ──────────────────────────────────────────────────────────────
async function loadGitStatus() {
  statusGrid.innerHTML = `<div class="loading-state">Fetching repository states…</div>`;
  try {
    const res = await fetch('/api/gitstatus');
    const repos = await res.json();
    renderStatusGrid(repos);
    updateGlobalDot(repos);
  } catch (err) {
    statusGrid.innerHTML = `<div class="loading-state">⚠ Cannot reach server</div>`;
  }
}

function renderStatusGrid(repos) {
  statusGrid.innerHTML = repos.map(repo => {
    if (!repo.exists) {
      return `
        <div class="repo-card status-missing">
          <div class="repo-card-header">
            <div class="repo-name">📁 ${repo.name}</div>
            <span class="repo-status-badge badge-missing">NOT FOUND</span>
          </div>
          <div class="repo-branch" style="color: var(--text-muted)">
            Path not on disk
          </div>
        </div>`;
    }

    if (repo.status === 'error') {
      return `
        <div class="repo-card status-error">
          <div class="repo-card-header">
            <div class="repo-name">⚠ ${repo.name}</div>
            <span class="repo-status-badge badge-error">ERROR</span>
          </div>
          <div class="repo-branch" style="color: var(--accent-red); font-size:11px; font-family: monospace">
            ${repo.error || 'Unknown error'}
          </div>
        </div>`;
    }

    const dirtyHtml = repo.dirty.length
      ? `<ul class="repo-dirty-list">${repo.dirty.slice(0, 5).map(d => `<li>${d}</li>`).join('')}${repo.dirty.length > 5 ? `<li>… +${repo.dirty.length - 5} more</li>` : ''}</ul>`
      : '';

    const commitsHtml = repo.commits.length
      ? `<div class="repo-commits">${repo.commits.map(c => {
          const [hash, ...rest] = c.split(' ');
          return `<div class="commit-item"><span class="commit-hash">${hash}</span>${rest.join(' ')}</div>`;
        }).join('')}</div>`
      : '';

    const aheadBadge = repo.ahead > 0
      ? `<span style="font-size:11px; color: var(--accent-cyan); margin-left:6px">↑${repo.ahead}</span>` : '';

    return `
      <div class="repo-card status-${repo.status}">
        <div class="repo-card-header">
          <div class="repo-name">🗂 ${repo.name}</div>
          <span class="repo-status-badge badge-${repo.status}">
            ${repo.status.toUpperCase()}
          </span>
        </div>
        <div class="repo-branch">
          <span class="branch-icon">⎇</span>
          ${repo.branch}${aheadBadge}
        </div>
        ${dirtyHtml}
        ${commitsHtml}
        <div class="repo-actions">
          <button class="repo-btn pull-btn" data-repo="${repo.name}">↓ Pull</button>
          <button class="repo-btn" onclick="navigator.clipboard.writeText('${repo.path.replace(/\\/g,'/')}')">Copy Path</button>
        </div>
      </div>`;
  }).join('');

  // Wire pull buttons
  statusGrid.querySelectorAll('.pull-btn').forEach(btn => {
    btn.addEventListener('click', () => gitPull(btn.dataset.repo, btn));
  });
}

function updateGlobalDot(repos) {
  const hasError = repos.some(r => r.status === 'error');
  const hasDirty = repos.some(r => r.status === 'dirty');
  globalDot.className = 'status-dot ' + (hasError ? 'error' : hasDirty ? 'dirty' : 'clean');
}

async function gitPull(repoName, btn) {
  btn.textContent = '⏳';
  btn.disabled = true;
  try {
    const res = await fetch(`/api/gitpull?repo=${encodeURIComponent(repoName)}`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      toast(`✅ Pulled ${repoName}`, 'success');
      loadGitStatus();
    } else {
      toast(`⚠ Pull failed: ${data.error}`, 'error', 6000);
    }
  } catch (err) {
    toast(`⚠ Network error`, 'error');
  } finally {
    btn.textContent = '↓ Pull';
    btn.disabled = false;
  }
}

btnRefresh.addEventListener('click', loadGitStatus);

// ─── Boot ──────────────────────────────────────────────────────────────────────
loadFiles();
