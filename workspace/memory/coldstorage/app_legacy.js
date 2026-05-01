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

// Dashboard UI
const dashFileTree     = $('dashFileTree');
const dashFileSearch   = $('dashFileSearch');
const dashDefaultView  = $('dashDefaultView');
const dashWelcomeStats = $('dashWelcomeStats');
const dashReader       = $('dashReader');
const dashBreadcrumb   = $('dashBreadcrumb');
const dashMdBody       = $('dashMdBody');
const btnDashCopy      = $('btnDashCopy');
const btnDashClose     = $('btnDashClose');

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
  const dirs = [...new Set(files.map(f => f.dir))];
  const html = dirs.map(dir => {
    const count = files.filter(f => f.dir === dir).length;
    return `<div class="stat-pill"><strong>${count}</strong> ${dir}</div>`;
  }).join('') + `<div class="stat-pill"><strong>${files.length}</strong> total</div>`;
  
  if (welcomeStats) welcomeStats.innerHTML = html;
  if (dashWelcomeStats) dashWelcomeStats.innerHTML = html;
}

function renderFileTree(files) {
  const q = state.searchQuery.toLowerCase();
  const filtered = q ? files.filter(f => f.name.toLowerCase().includes(q)) : files;

  const getHtml = (filteredFiles) => {
    if (!filteredFiles.length) return `<div class="loading-state">No documents found</div>`;
    const groups = {};
    filteredFiles.forEach(f => {
      if (!groups[f.dir]) groups[f.dir] = [];
      groups[f.dir].push(f);
    });
    const dirIcons = { memory: '🧠', reports: '📊', docs: '📁' };
    return Object.entries(groups).map(([dir, items]) => `
      <div class="file-group-label">${dirIcons[dir] || '📁'} ${dir}</div>
      ${items.map(f => `
        <div class="file-item ${state.activeFile?.rel === f.rel ? 'active' : ''}"
             data-rel="${f.rel}" title="${f.name}">
          <span class="file-item-icon">📄</span>
          <span class="file-item-name">${f.name.replace(/\.md$/, '')}</span>
        </div>
      `).join('')}
    `).join('');
  };

  const html = getHtml(filtered);
  if (fileTree) fileTree.innerHTML = html;
  if (dashFileTree) dashFileTree.innerHTML = html;

  document.querySelectorAll('.file-item').forEach(el => {
    el.addEventListener('click', () => {
      const file = state.files.find(f => f.rel === el.dataset.rel);
      if (file) loadDocument(file);
    });
  });
}

async function loadDocument(file) {
  state.activeFile = file;
  if (breadcrumb) breadcrumb.textContent = `${file.dir} / ${file.name}`;
  if (dashBreadcrumb) dashBreadcrumb.textContent = `${file.dir} / ${file.name}`;
  if (btnCopy) btnCopy.style.display = 'inline-block';
  
  if (dashDefaultView) dashDefaultView.classList.add('hidden');
  if (dashReader) dashReader.classList.remove('hidden');

  if (readingCanvas) readingCanvas.innerHTML = `<div class="loading-state">Loading…</div>`;
  if (dashMdBody) dashMdBody.innerHTML = `<div class="loading-state">Loading…</div>`;

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
    
    if (readingCanvas) {
      readingCanvas.innerHTML = `<div class="md-body">${html}</div>`;
      readingCanvas.scrollTop = 0;
    }
    if (dashMdBody) {
      dashMdBody.innerHTML = html;
      dashMdBody.parentElement.scrollTop = 0;
    }
  } catch (err) {
    if (readingCanvas) readingCanvas.innerHTML = `<div class="loading-state">⚠ Failed to load: ${err.message}</div>`;
    if (dashMdBody) dashMdBody.innerHTML = `<div class="loading-state">⚠ Failed to load: ${err.message}</div>`;
    toast(`Failed to load ${file.name}`, 'error');
  }
}

const handleSearch = e => {
  state.searchQuery = e.target.value;
  renderFileTree(state.files);
};
if (fileSearch) fileSearch.addEventListener('input', handleSearch);
if (dashFileSearch) dashFileSearch.addEventListener('input', handleSearch);

const handleCopy = () => {
  navigator.clipboard.writeText(state.currentRaw);
  toast('Markdown copied to clipboard', 'success');
};
if (btnCopy) btnCopy.addEventListener('click', handleCopy);
if (btnDashCopy) btnDashCopy.addEventListener('click', handleCopy);

if (btnDashClose) {
  btnDashClose.addEventListener('click', () => {
    if (dashReader) dashReader.classList.add('hidden');
    if (dashDefaultView) dashDefaultView.classList.remove('hidden');
    state.activeFile = null;
    document.querySelectorAll('.file-item').forEach(el => el.classList.remove('active'));
  });
}

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
          <button class="repo-btn" onclick="navigator.clipboard.writeText('${repo.path.replace(/\\\\/g,'/')}')">Copy Path</button>
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

// ─── Live Metrics Simulator ────────────────────────────────────────────────────
// Connects the static UI elements to dynamic fluctuating data to simulate a live
// high-fidelity command center environment.

function initMetricsSimulator() {
  const tiles = document.querySelectorAll('.metric-tile');
  if (tiles.length < 4) return;
  
  const cpuVal = tiles[0].querySelector('.metric-value');
  const ramVal = tiles[1].querySelector('.metric-value');
  const diskVal = tiles[2].querySelector('.metric-value');
  const tempVal = tiles[3].querySelector('.metric-value');

  const gauges = document.querySelectorAll('.gauge');
  let cpuGauge, cpuGaugeText, ramGauge, ramGaugeText, tempGauge, tempGaugeText;
  
  if (gauges.length >= 3) {
    cpuGauge = gauges[0].querySelector('.gauge-fill');
    cpuGaugeText = gauges[0].querySelector('.gauge-val-text');
    ramGauge = gauges[1].querySelector('.gauge-fill');
    ramGaugeText = gauges[1].querySelector('.gauge-val-text');
    tempGauge = gauges[2].querySelector('.gauge-fill');
    tempGaugeText = gauges[2].querySelector('.gauge-val-text');
  }

  // Generate smooth random walks for metrics
  let cpu = 38;
  let ram = 62;
  let temp = 68;

  setInterval(() => {
    // Random walk calculation
    cpu = Math.max(5, Math.min(95, cpu + (Math.random() * 10 - 5)));
    ram = Math.max(40, Math.min(85, ram + (Math.random() * 4 - 2)));
    temp = Math.max(45, Math.min(85, temp + (Math.random() * 2 - 1)));

    const cpuStr = Math.round(cpu) + '%';
    const ramStr = Math.round(ram) + '%';
    const tempStr = Math.round(temp) + '°C';

    // Update Strip Values
    if (cpuVal) cpuVal.textContent = cpuStr;
    if (ramVal) ramVal.textContent = ramStr;
    if (tempVal) tempVal.textContent = tempStr;

    // Update Gauges
    // Gauge stroke-dasharray is 220. Offset = 220 - (value / 100) * 220
    if (cpuGauge) {
      cpuGauge.style.strokeDashoffset = 220 - (cpu / 100) * 220;
      cpuGaugeText.textContent = cpuStr;
    }
    if (ramGauge) {
      ramGauge.style.strokeDashoffset = 220 - (ram / 100) * 220;
      ramGaugeText.textContent = ramStr;
    }
    if (tempGauge) {
      // Map temp 40-100 to 0-100%
      const tempPercent = Math.max(0, Math.min(100, (temp - 40) / 60 * 100));
      tempGauge.style.strokeDashoffset = 220 - (tempPercent / 100) * 220;
      tempGaugeText.textContent = tempStr;
    }
    
    // Simulate disk I/O fluctuation
    if (diskVal) {
      const read = (Math.random() * 5).toFixed(1);
      const write = (Math.random() * 12).toFixed(1);
      diskVal.textContent = `R:${read} W:${write} MB/s`;
    }
  }, 2000);
}

// ─── Boot ──────────────────────────────────────────────────────────────────────
loadFiles();
initMetricsSimulator();
