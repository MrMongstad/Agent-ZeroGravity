/**
 * Empire HQ v4.0 — Main Controller
 * Drives: Live data fetching, sparklines, metric simulation, tab switching, animations.
 * Wires: /api/gitstatus, /api/files, /api/system, SSE /api/watch
 * Zero dependencies. Pure vanilla JS.
 */

// ══════════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════════

const $ = id => document.getElementById(id);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const walk = (v, step, lo, hi) => clamp(v + rand(-step, step), lo, hi);

function redactSensitiveData(text) {
  if (!text || typeof text !== 'string') return text;
  
  let redacted = text;
  
  // 1. Explicit Provider Patterns
  redacted = redacted.replace(/sk-[a-zA-Z0-9]{32,}/g, '[REDACTED_OPENAI_KEY]');
  redacted = redacted.replace(/sk-ant-api03-[a-zA-Z0-9\-_]{32,}/g, '[REDACTED_ANTHROPIC_KEY]');
  redacted = redacted.replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_GOOGLE_KEY]');
  redacted = redacted.replace(/github_pat_[a-zA-Z0-9]{82,}/g, '[REDACTED_GITHUB_PAT]');
  
  // 2. Assignment Patterns
  const labels = 'password|secret|token|apikey|api_key|auth|credential|sk|key|pat';
  const assignmentRegex = new RegExp(`\\b(${labels})\\b(\\s*[:=]\\s*)(["']?)([a-zA-Z0-9\\-_]{12,})\\3`, 'gi');
  
  redacted = redacted.replace(assignmentRegex, (match, label, separator, quote, value) => {
    return `${label}${separator}${quote}[REDACTED_SECRET]${quote}`;
  });

  // 3. Generic High-Entropy Strings (Hex/Base64/Supabase JWTs)
  redacted = redacted.replace(/\b([a-f0-9]{32,}|[A-Za-z0-9+/]{32,}={0,2}|eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)\b/g, (match) => {
    if (match.startsWith('eyJ')) return '[REDACTED_JWT_TOKEN]';
    if (match.length >= 32 && /[0-9]/.test(match) && /[a-zA-Z]/.test(match)) {
      return '[REDACTED_ENTROPY_STRING]';
    }
    return match;
  });

  return redacted;
}

// Detect if running via server or file://
const isServed = location.protocol !== 'file:';
const API_BASE = isServed ? '' : null; // null = no API available

// ══════════════════════════════════════════════
//  LIVE CLOCK
// ══════════════════════════════════════════════

function tickClock() {
  const now = new Date().toLocaleTimeString('en-GB', { hour12: false });
  const navClock = $('nav-clock');
  const footerClock = $('footer-clock');
  if (navClock) navClock.textContent = now;
  if (footerClock) footerClock.textContent = now;
}
tickClock();
setInterval(tickClock, 1000);

// Refresh countdown
let refreshCounter = 0;
setInterval(() => {
  refreshCounter = (refreshCounter + 1) % 30;
  const el = $('footer-refresh');
  if (el) el.textContent = `${refreshCounter}s`;
}, 1000);

// ══════════════════════════════════════════════
//  SPARKLINE ENGINE
// ══════════════════════════════════════════════

class Sparkline {
  constructor(canvasId, color = '#4a9e8e', points = 20) {
    this.canvas = $(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.color = color;
    this.data = Array.from({ length: points }, () => rand(0.2, 0.8));
    this.w = this.canvas.width;
    this.h = this.canvas.height;
  }

  push(val) {
    if (!this.canvas) return;
    this.data.shift();
    this.data.push(clamp(val, 0, 1));
    this.draw();
  }

  draw() {
    if (!this.ctx) return;
    const { ctx, w, h, data, color } = this;
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + '40');
    grad.addColorStop(1, color + '05');

    const step = w / (data.length - 1);

    ctx.beginPath();
    ctx.moveTo(0, h);
    data.forEach((v, i) => ctx.lineTo(i * step, h - v * h));
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    data.forEach((v, i) => {
      const x = i * step;
      const y = h - v * h;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const lastX = (data.length - 1) * step;
    const lastY = h - data[data.length - 1] * h;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

// ══════════════════════════════════════════════
//  AREA CHART ENGINE
// ══════════════════════════════════════════════

class AreaChart {
  constructor(canvasId, color = '#4a9e8e', points = 40) {
    this.canvas = $(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.color = color;
    this.data = Array.from({ length: points }, () => rand(0.3, 0.7));
    this.w = this.canvas.width;
    this.h = this.canvas.height;
  }

  push(val) {
    if (!this.canvas) return;
    this.data.shift();
    this.data.push(clamp(val, 0, 1));
    this.draw();
  }

  draw() {
    if (!this.ctx) return;
    const { ctx, w, h, data, color } = this;
    ctx.clearRect(0, 0, w, h);

    const step = w / (data.length - 1);

    ctx.strokeStyle = '#1a2535';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 4; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + '30');
    grad.addColorStop(1, color + '03');

    ctx.beginPath();
    ctx.moveTo(0, h);
    data.forEach((v, i) => ctx.lineTo(i * step, h - v * h));
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    data.forEach((v, i) => {
      const x = i * step;
      const y = h - v * h;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
}

// ══════════════════════════════════════════════
//  METRICS STATE
// ══════════════════════════════════════════════

const metrics = {
  cpu: 38, ram: 62, disk_r: 1.2, disk_w: 9.4,
  gpu: 68, net_up: 1.2, net_down: 9.4,
  throughput: 680, errorRate: 0.08,
  jobs: 1452, errors: 28,
};

const sparks = {
  cpu:    new Sparkline('spark-cpu',    '#4a9e8e'),
  ram:    new Sparkline('spark-ram',    '#3fb950'),
  disk:   new Sparkline('spark-disk',   '#d29922'),
  gpu:    new Sparkline('spark-gpu',    '#c45a52'),
  net:    new Sparkline('spark-net',    '#4a9e8e'),
  burn:   new Sparkline('spark-burn',   '#d29922', 12),
  jobs:   new Sparkline('spark-jobs',   '#4a9e8e', 12),
  errors: new Sparkline('spark-errors', '#c45a52', 12),
  uptime: new Sparkline('spark-uptime', '#3fb950', 12),
};

const charts = {
  throughput: new AreaChart('chart-throughput', '#4a9e8e'),
  errors:     new AreaChart('chart-errors',     '#c45a52', 30),
};

// ══════════════════════════════════════════════
//  REAL DATA: SYSTEM METRICS
// ══════════════════════════════════════════════

async function fetchSystemMetrics() {
  if (!isServed) return;
  try {
    const res = await fetch('/api/system');
    const data = await res.json();
    // Overwrite simulated with real
    metrics.cpu = data.cpu;
    metrics.ram = data.ram;
    if (data.errorCount !== undefined) {
      metrics.errors = data.errorCount;
    }

    // Update RAM tile with real values
    const ramTile = $('metric-ram');
    if (ramTile) {
      ramTile.querySelector('.metric-value').innerHTML = `${data.ram}<small>%</small>`;
    }

    // Update Active Projects count if we know it
    const projBadge = $('panel-projects')?.querySelector('.panel-badge');
    // Keep it as-is unless we have real data
  } catch (e) {
    console.warn('[HQ] System metrics fetch failed:', e.message);
  }
}

// ══════════════════════════════════════════════
//  REAL DATA: GIT STATUS → NAV & STATUS TREE
// ══════════════════════════════════════════════

async function fetchGitStatus() {
  if (!isServed) return;
  try {
    const res = await fetch('/api/gitstatus');
    const repos = await res.json();
    renderGitStatusTree(repos);
    renderGitToProjectTable(repos);
    renderGitToActivityFeed(repos);
    renderCommitLog(repos);        // ← real activity log
    renderProjectsTab(repos);
  } catch (e) {
    console.warn('[HQ] Git status fetch failed:', e.message);
  }
}

function renderProjectsTab(repos) {
  const tbody = $('table-projects-tab')?.querySelector('tbody');
  if (!tbody) return;

  tbody.innerHTML = repos.filter(r => r.exists).map(repo => {
    const dirtyCount = repo.dirty?.length || 0;
    const isClean = repo.status === 'clean';
    const statusBadge = isClean
      ? '<span class="status-badge active">CLEAN</span>'
      : dirtyCount > 5
        ? '<span class="status-badge critical">DIRTY</span>'
        : '<span class="status-badge warning">MODIFIED</span>';
    
    return `<tr>
      <td class="cell-name">${repo.name}</td>
      <td>${repo.branch || '—'}</td>
      <td style="${repo.ahead > 0 ? 'color:var(--accent-amber)' : ''}">${repo.ahead > 0 ? '↑' + repo.ahead : '0'}</td>
      <td style="${dirtyCount > 0 ? 'color:var(--accent-amber)' : ''}">${dirtyCount} files</td>
      <td>${statusBadge}</td>
      <td><button class="btn-ghost" onclick="gitPullRepo('${repo.name}', this)">GIT PULL</button></td>
    </tr>`;
  }).join('');
}

window.gitPullRepo = async function(repoName, btn) {
  try {
    const oldText = btn.textContent;
    btn.textContent = 'PULLING...';
    btn.disabled = true;
    
    const res = await fetch('/api/gitpull?repo=' + encodeURIComponent(repoName), { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      btn.textContent = 'SUCCESS';
      btn.style.color = 'var(--accent-green)';
      setTimeout(() => fetchGitStatus(), 1500);
    } else {
      btn.textContent = 'FAILED';
      btn.style.color = 'var(--accent-red)';
      setTimeout(() => { btn.textContent = oldText; btn.disabled = false; btn.style.color = ''; }, 3000);
      showToast(`Git pull failed for ${repoName}: ${data.error || 'Unknown error'}`, 'error');
    }
  } catch(e) {
    console.error(e);
    btn.textContent = 'ERROR';
    btn.style.color = 'var(--accent-red)';
    setTimeout(() => { btn.textContent = 'GIT PULL'; btn.disabled = false; btn.style.color = ''; }, 3000);
    showToast(`Git pull failed for ${repoName}: ${e.message}`, 'error');
  }
}

function renderGitStatusTree(repos) {
  const tree = $('status-tree');
  if (!tree) return;

  const badge = $('panel-nav-status')?.querySelector('.panel-badge');
  if (badge) badge.textContent = `${repos.length} REPOS`;

  tree.innerHTML = repos.map(repo => {
    let dotClass = 'green';
    let statusText = 'CLEAN';

    if (!repo.exists) {
      dotClass = 'red';
      statusText = 'MISSING';
    } else if (repo.status === 'error') {
      dotClass = 'red';
      statusText = 'ERROR';
    } else if (repo.status === 'dirty') {
      dotClass = 'amber';
      statusText = `DIRTY (${repo.dirty.length})`;
    } else if (repo.ahead > 0) {
      dotClass = 'amber';
      statusText = `↑${repo.ahead} AHEAD`;
    }

    const branchTag = repo.branch ? ` <small style="color:#5a6a7c">[${repo.branch}]</small>` : '';

    return `<li class="tree-item">
      <span class="dot ${dotClass}"></span>
      <span class="tree-label">${repo.name.toUpperCase()}${branchTag}</span>
      <span class="tree-status">${statusText}</span>
    </li>`;
  }).join('');
}

function renderGitToProjectTable(repos) {
  const tbody = $('table-projects')?.querySelector('tbody');
  if (!tbody) return;

  const projBadge = $('panel-projects')?.querySelector('.panel-badge');
  if (projBadge) projBadge.textContent = `${repos.filter(r => r.exists).length} REPOS`;

  tbody.innerHTML = repos.filter(r => r.exists).map(repo => {
    const dirtyCount = repo.dirty?.length || 0;
    const isClean = repo.status === 'clean';
    const progress = isClean ? 100 : Math.max(10, 100 - dirtyCount * 10);
    const fillClass = isClean ? '' : dirtyCount > 5 ? 'red' : 'amber';
    const statusBadge = isClean
      ? '<span class="status-badge active">CLEAN</span>'
      : dirtyCount > 5
        ? '<span class="status-badge critical">DIRTY</span>'
        : '<span class="status-badge warning">MODIFIED</span>';
    const branch = repo.branch || '—';
    const lastCommit = repo.commits?.[0]?.split(' ').slice(1).join(' ') || '—';

    return `<tr>
      <td class="cell-name">${repo.name}</td>
      <td><div class="progress-bar"><div class="progress-fill ${fillClass}" style="width:${progress}%"></div></div><span class="progress-pct">${progress}%</span></td>
      <td>${branch}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${lastCommit}">${lastCommit}</td>
      <td>${statusBadge}</td>
    </tr>`;
  }).join('');

  // Update table headers
  const thead = $('table-projects')?.querySelector('thead tr');
  if (thead) {
    thead.innerHTML = '<th>REPO</th><th>HEALTH</th><th>BRANCH</th><th>LAST COMMIT</th><th>STATUS</th>';
  }
}

function renderGitToActivityFeed(repos) {
  const feed = $('activity-feed');
  if (!feed) return;

  const items = [];
  repos.forEach(repo => {
    if (!repo.commits) return;
    repo.commits.forEach((c, i) => {
      const [hash, ...rest] = c.split(' ');
      const msg = rest.join(' ');
      const actionType = msg.startsWith('Merge') ? 'merge' : msg.includes('deploy') ? 'deploy' : '';
      const actionLabel = msg.startsWith('Merge') ? 'MERGE' : msg.includes('deploy') ? 'DEPLOY' : 'PUSH';
      items.push({
        html: `<li class="feed-item">
          <span class="feed-action ${actionType}">${actionLabel}</span>
          <span class="feed-desc" title="${hash} ${msg}">${msg}</span>
          <span class="feed-time">${repo.name.split(' ')[0]}</span>
        </li>`,
      });
    });
  });

  // Take latest 8
  feed.innerHTML = items.slice(0, 8).map(i => i.html).join('');
}

// ══════════════════════════════════════════════
//  REAL DATA: COMMIT LOG → #table-log
// ══════════════════════════════════════════════

function renderCommitLog(repos) {
  const tbody = $('table-log')?.querySelector('tbody');
  const badge = $('panel-activity-log')?.querySelector('.panel-badge');
  if (!tbody) return;

  // Update thead columns to match real data
  const thead = $('table-log')?.querySelector('thead tr');
  if (thead && !thead.dataset.live) {
    thead.innerHTML = '<th>HASH</th><th>COMMIT MESSAGE</th><th>REPO</th><th>STATUS</th><th>BRANCH</th>';
    thead.dataset.live = 'true';
  }

  const rows = [];
  repos.forEach(repo => {
    if (!repo.exists || !repo.commits?.length) return;
    repo.commits.forEach(c => {
      const [hash, ...rest] = c.split(' ');
      const msg = rest.join(' ') || '(no message)';
      const actionType = msg.startsWith('Merge') ? 'MERGE'
        : msg.toLowerCase().includes('deploy') ? 'DEPLOY'
        : msg.toLowerCase().includes('fix') ? 'FIX'
        : msg.toLowerCase().includes('feat') ? 'FEAT'
        : 'PUSH';
      const badgeClass = actionType === 'MERGE' ? 'merge'
        : actionType === 'DEPLOY' ? 'deploy' : '';
      rows.push({ hash: hash.slice(0, 7), msg, repo: repo.name, branch: repo.branch || 'main', actionType, badgeClass });
    });
  });

  if (badge) badge.textContent = `${rows.length} COMMITS`;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">No commits found — ensure repos have git history</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map((r, i) => `
    <tr class="${i % 2 === 1 ? 'alt' : ''}">
      <td style="font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1px">${r.hash}</td>
      <td title="${r.msg}" style="max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
        <span class="feed-action ${r.badgeClass}" style="margin-right:6px;font-size:10px;padding:2px 6px">${r.actionType}</span>${r.msg}
      </td>
      <td class="cell-name">${r.repo}</td>
      <td><span class="status-badge active">PUSHED</span></td>
      <td style="color:var(--text-muted)">${r.branch}</td>
    </tr>`).join('');
}

// ══════════════════════════════════════════════
//  REAL DATA: LIBRARY FILES
// ══════════════════════════════════════════════

let libraryFiles = [];

async function fetchLibraryFiles() {
  if (!isServed) return;
  try {
    const res = await fetch('/api/files');
    libraryFiles = await res.json();

    // Update KPI — total docs as "JOBS" (repurpose)
    const kpiJobs = $('kpi-jobs');
    if (kpiJobs) {
      kpiJobs.querySelector('.kpi-label').textContent = 'DOCS';
      kpiJobs.querySelector('.kpi-value').textContent = libraryFiles.length;
    }

    // Update active alert with real file count
    // if (libraryFiles.length > 0) {
    //   const latest = libraryFiles.sort((a, b) => new Date(b.modified) - new Date(a.modified))[0];
    //   showHqAlert(`Latest doc update: <code>${latest.name}</code> in <code>${latest.dir}</code>`, 'info');
    // }
  } catch (e) {
    console.warn('[HQ] Library fetch failed:', e.message);
  }
}

// ══════════════════════════════════════════════
//  SSE LIVE RELOAD
// ══════════════════════════════════════════════

let sseConnection = null;

function connectSSE() {
  if (!isServed) return;
  sseConnection = new EventSource('/api/watch');

  sseConnection.addEventListener('file-changed', e => {
    const { file } = JSON.parse(e.data);
    console.log(`[HQ] File changed: ${file}`);
    // Re-fetch library and git status on change
    fetchLibraryFiles();
    fetchGitStatus();
    // Flash the alert banner briefly
    const banner = $('alert-banner');
    if (banner) {
      banner.style.borderColor = '#4a9e8e';
      setTimeout(() => { banner.style.borderColor = ''; }, 2000);
    }
  });

  sseConnection.onerror = () => {
    const footerDot = document.querySelector('#hq-footer .status-dot');
    if (footerDot) footerDot.classList.replace('live', 'error');
    sseConnection?.close();
    // Retry in 5s
    setTimeout(connectSSE, 5000);
  };

  sseConnection.onopen = () => {
    const footerDot = document.querySelector('#hq-footer .status-dot');
    if (footerDot) {
      footerDot.classList.remove('error');
      footerDot.classList.add('live');
    }
  };
}

// ══════════════════════════════════════════════
//  METRICS SIMULATION (with real OS data overlay)
// ══════════════════════════════════════════════

function updateMetrics() {
  // Random walk for simulated values
  metrics.cpu     = walk(metrics.cpu,     4, 8, 95);
  metrics.ram     = walk(metrics.ram,     2, 40, 88);
  metrics.disk_r  = walk(metrics.disk_r,  0.8, 0.1, 8);
  metrics.disk_w  = walk(metrics.disk_w,  1.5, 0.5, 15);
  metrics.gpu     = walk(metrics.gpu,     1.5, 42, 88);
  metrics.net_up  = walk(metrics.net_up,  0.4, 0.1, 5);
  metrics.net_down = walk(metrics.net_down, 1, 1, 25);
  metrics.throughput = walk(metrics.throughput, 30, 400, 900);
  metrics.errorRate = walk(metrics.errorRate, 0.02, 0.01, 0.5);

  // Update DOM
  const metricCpu = $('metric-cpu');
  const metricRam = $('metric-ram');
  const metricDisk = $('metric-disk');
  const metricGpu = $('metric-gpu');
  const metricNet = $('metric-network');

  if (metricCpu) metricCpu.querySelector('.metric-value').innerHTML = `${Math.round(metrics.cpu)}<small>%</small>`;
  if (metricRam) metricRam.querySelector('.metric-value').innerHTML = `${Math.round(metrics.ram)}<small>%</small>`;
  if (metricDisk) metricDisk.querySelector('.metric-value').innerHTML = `R:${metrics.disk_r.toFixed(1)} <small>W:${metrics.disk_w.toFixed(1)}</small>`;
  if (metricGpu) metricGpu.querySelector('.metric-value').innerHTML = `${Math.round(metrics.gpu)}<small>°C</small>`;
  if (metricNet) metricNet.querySelector('.metric-value').innerHTML = `↑${metrics.net_up.toFixed(1)} <small>↓${metrics.net_down.toFixed(1)}</small>`;

  // Push sparklines
  sparks.cpu.push(metrics.cpu / 100);
  sparks.ram.push(metrics.ram / 100);
  sparks.disk.push(metrics.disk_w / 15);
  sparks.gpu.push((metrics.gpu - 40) / 50);
  sparks.net.push(metrics.net_down / 25);
  sparks.burn.push(rand(0.3, 0.8));
  sparks.jobs.push(rand(0.5, 0.9));
  sparks.errors.push(rand(0.05, 0.35));
  sparks.uptime.push(rand(0.9, 1.0));

  // Push area charts
  charts.throughput.push(metrics.throughput / 1000);
  charts.errors.push(metrics.errorRate);

  // Ingestion values
  const throughputVal = document.querySelector('#panel-ingestion .ingestion-value');
  const errorVal = document.querySelector('#panel-ingestion .ingestion-value.green');
  if (throughputVal) throughputVal.innerHTML = `${Math.round(metrics.throughput)} <small>Mbps</small>`;
  if (errorVal) errorVal.innerHTML = `${metrics.errorRate.toFixed(2)}<small>%</small>`;

  // KPI cards
  const kpiErrors = $('kpi-errors');
  if (kpiErrors) kpiErrors.querySelector('.kpi-value').textContent = Math.round(metrics.errors);

  // GPU temperature color coding
  if (metricGpu) {
    metricGpu.style.borderColor = metrics.gpu > 80 ? '#c45a52' : metrics.gpu > 70 ? '#d29922' : '';
  }
}

// ══════════════════════════════════════════════
//  LIGHTWEIGHT MARKDOWN → HTML
// ══════════════════════════════════════════════

function mdToHtml(md) {
  if (typeof marked !== 'undefined') {
    return marked.parse(md);
  }
  return md;
}

// ══════════════════════════════════════════════
//  TAB SWITCHING (Real content swap)
// ══════════════════════════════════════════════

const TAB_IDS = ['dashboard', 'library', 'projects', 'processes', 'settings'];

function createTabViews() {
  // Dashboard tab = the existing main content
  const dashMain = $('dashboard-main');
  if (!dashMain) return;

  // Create library view
  const libraryView = document.createElement('div');
  libraryView.id = 'library-view';
  libraryView.className = 'tab-view';
  libraryView.style.display = 'none';
  libraryView.innerHTML = `
    <section class="row">
      <div class="panel full-width" id="panel-library-browser">
        <div class="panel-header">
          <span class="panel-title">LIBRARY BROWSER</span>
          <span class="panel-badge" id="library-count">0 FILES</span>
          <input type="text" class="library-search" id="library-search" placeholder="FILTER FILES..." autocomplete="off">
        </div>
        <div class="panel-body library-split">
          <div class="library-file-list" id="library-file-list">
            <div class="library-loading">Loading file index...</div>
          </div>
          <div class="library-reader" id="library-reader">
            <div class="reader-empty">
              <span class="reader-icon">◆</span>
              <span class="reader-hint">SELECT A FILE TO VIEW</span>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  dashMain.parentElement.insertBefore(libraryView, dashMain.nextSibling);

  // Create views for other tabs
  const projectsView = document.createElement('div');
  projectsView.id = 'projects-view';
  projectsView.className = 'tab-view';
  projectsView.style.display = 'none';
  projectsView.innerHTML = `
    <section class="row">
      <div class="panel full-width">
        <div class="panel-header">
          <span class="panel-title">MONITORED PROJECTS</span>
          <button class="btn-ghost" onclick="fetchGitStatus()">REFRESH</button>
        </div>
        <div class="panel-body">
          <table class="data-table" id="table-projects-tab">
            <thead>
              <tr>
                <th>REPO</th>
                <th>BRANCH</th>
                <th>AHEAD</th>
                <th>MODIFIED</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colspan="6" style="text-align:center">Loading projects...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
  dashMain.parentElement.insertBefore(projectsView, libraryView.nextSibling);

  const processesView = document.createElement('div');
  processesView.id = 'processes-view';
  processesView.className = 'tab-view';
  processesView.style.display = 'none';
  processesView.innerHTML = `
    <section class="row">
      <div class="panel full-width">
        <div class="panel-header">
          <span class="panel-title">TOP PROCESSES (MEMORY)</span>
          <button class="btn-ghost" onclick="fetchProcesses()">REFRESH</button>
        </div>
        <div class="panel-body">
          <table class="data-table" id="table-processes">
            <thead>
              <tr>
                <th>PROCESS NAME</th>
                <th>PID</th>
                <th>CPU (%)</th>
                <th>MEMORY (MB)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colspan="4" style="text-align:center">Loading processes...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
  dashMain.parentElement.insertBefore(processesView, projectsView.nextSibling);

  const settingsView = document.createElement('div');
  settingsView.id = 'settings-view';
  settingsView.className = 'tab-view';
  settingsView.style.display = 'none';
  settingsView.innerHTML = `
    <section class="row">
      <div class="panel full-width">
        <div class="panel-header">
          <span class="panel-title">SYSTEM CONFIGURATION</span>
        </div>
        <div class="panel-body" style="padding: 24px;">
          <div style="display:flex; flex-direction:column; gap:24px; max-width:600px;">
            <div>
              <h3 style="margin:0 0 12px 0; color:var(--text-bright); font-size:18px; letter-spacing:1px;">API CREDENTIALS</h3>
              <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
                <span style="width:140px; color:var(--text-muted)">OPENAI_API_KEY</span>
                <input type="password" id="cfg-openai" placeholder="Enter new key to update" style="background:var(--bg-dark); border:1px solid var(--border-light); color:var(--text-bright); padding:8px 12px; flex:1; font-family:var(--font-mono);">
              </div>
              <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
                <span style="width:140px; color:var(--text-muted)">ANTHROPIC_KEY</span>
                <input type="password" id="cfg-anthropic" placeholder="Enter new key to update" style="background:var(--bg-dark); border:1px solid var(--border-light); color:var(--text-bright); padding:8px 12px; flex:1; font-family:var(--font-mono);">
              </div>
              <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                <span style="width:140px; color:var(--text-muted)">GEMINI_API_KEY</span>
                <input type="password" id="cfg-google" placeholder="Enter new key to update" style="background:var(--bg-dark); border:1px solid var(--border-light); color:var(--text-bright); padding:8px 12px; flex:1; font-family:var(--font-mono);">
              </div>
              <button class="btn-ghost" id="btn-save-settings" style="color:var(--accent-teal); border-color:var(--accent-teal); padding:8px 16px;">SAVE SETTINGS</button>
            </div>
            <div style="height:1px; background:var(--border-light);"></div>
            <div>
               <button class="btn-ghost" style="color:var(--accent-red); border-color:var(--accent-red); padding:8px 16px;">FACTORY RESET</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
  dashMain.parentElement.insertBefore(settingsView, processesView.nextSibling);

  // Bind settings save
  setTimeout(() => {
    const saveBtn = document.getElementById('btn-save-settings');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const payload = {};
        const openai = document.getElementById('cfg-openai').value;
        const anthropic = document.getElementById('cfg-anthropic').value;
        const google = document.getElementById('cfg-google').value;
        
        const isPlaceHolder = (val) => !val || val.includes('...') || val === 'CONFIGURED' || val === 'MISSING';
        
        if (!isPlaceHolder(openai)) payload.OPENAI_API_KEY = openai;
        if (!isPlaceHolder(anthropic)) payload.ANTHROPIC_KEY = anthropic;
        if (!isPlaceHolder(google)) payload.GEMINI_API_KEY = google;
        
        if (Object.keys(payload).length === 0) return showToast('No valid keys to update.', 'error');
        
        saveBtn.textContent = 'SAVING...';
        try {
          const res = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            saveBtn.textContent = 'SAVED ✓';
            saveBtn.style.color = 'var(--accent-green)';
            showToast(`Settings saved (${data.updated} key${data.updated !== 1 ? 's' : ''} updated)`, 'success');
            setTimeout(() => { saveBtn.textContent = 'SAVE SETTINGS'; saveBtn.style.color = 'var(--accent-teal)'; }, 2500);
          } else {
            showToast(`Save failed: ${data.error || 'Unknown error'}`, 'error');
            saveBtn.textContent = 'SAVE SETTINGS';
          }
        } catch(e) {
          showToast(e.message, 'error');
          saveBtn.textContent = 'SAVE SETTINGS';
        }
      });
    }
  }, 100);
}

// ══════════════════════════════════════════════
//  NOTIFICATIONS
// ══════════════════════════════════════════════

function showToast(message, type = 'info') {
  let container = $('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:40px;right:40px;display:flex;flex-direction:column;gap:10px;z-index:9999;';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  const color = type === 'error' ? 'var(--accent-red)' : type === 'success' ? 'var(--accent-green)' : 'var(--accent-teal)';
  toast.style.cssText = `background:var(--bg-dark);border:1px solid ${color};color:var(--text-bright);padding:12px 20px;font-family:var(--font-mono);font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,0.5);opacity:0;transform:translateX(20px);transition:all 0.3s;`;
  toast.innerHTML = `<strong style="color:${color}">${type.toUpperCase()}:</strong> ${message}`;
  
  container.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function switchTab(tabId) {
  // Update nav
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const activeTab = $(`tab-${tabId}`);
  if (activeTab) activeTab.classList.add('active');

  // Show/hide views
  const dashMain = $('dashboard-main');
  if (dashMain) dashMain.style.display = tabId === 'dashboard' ? '' : 'none';

  TAB_IDS.filter(id => id !== 'dashboard').forEach(id => {
    const view = $(`${id}-view`);
    if (view) view.style.display = id === tabId ? '' : 'none';
  });

  // If switching to library, render the file list
  if (tabId === 'library') renderLibraryList();
  if (tabId === 'processes') fetchProcesses();
  if (tabId === 'settings') fetchSettingsConfig();
}

window.fetchSettingsConfig = async function() {
  if (!isServed) return;
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    const openai = document.getElementById('cfg-openai');
    const anthropic = document.getElementById('cfg-anthropic');
    const google = document.getElementById('cfg-google');
    
    if (openai && data.openai) openai.value = data.openai;
    if (anthropic && data.anthropic) anthropic.value = data.anthropic;
    if (google && data.google) google.value = data.google;
  } catch(e) {
    console.warn('[HQ] Failed to load settings:', e.message);
  }
}

window.fetchProcesses = async function() {
  if (!isServed) return;
  const tbody = $('table-processes')?.querySelector('tbody');
  if (!tbody) return;
  
  try {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Fetching processes...</td></tr>';
    const res = await fetch('/api/processes');
    const procs = await res.json();
    
    if (!procs.length) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">No processes found</td></tr>';
      return;
    }

    tbody.innerHTML = procs.map(p => `
      <tr>
        <td class="cell-name">${p.name}</td>
        <td style="color:var(--text-muted)">${p.pid}</td>
        <td>${p.cpu}</td>
        <td>${p.memory}</td>
      </tr>
    `).join('');
  } catch(e) {
    console.warn('[HQ] Process fetch failed:', e);
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--accent-red)">Error fetching processes</td></tr>';
  }
}

document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabId = tab.id.replace('tab-', '');
    switchTab(tabId);
  });
});

// ══════════════════════════════════════════════
//  LIBRARY FILE BROWSER
// ══════════════════════════════════════════════

let selectedLibraryFile = null;

function renderLibraryList(filter = '') {
  const listEl = $('library-file-list');
  const countEl = $('library-count');
  if (!listEl) return;

  const filtered = filter
    ? libraryFiles.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()) || f.dir.toLowerCase().includes(filter.toLowerCase()))
    : libraryFiles;

  if (countEl) countEl.textContent = `${filtered.length} FILES`;

  if (!filtered.length) {
    listEl.innerHTML = '<div class="library-loading">No files found</div>';
    return;
  }

  // Group by directory
  const groups = {};
  filtered.forEach(f => {
    if (!groups[f.dir]) groups[f.dir] = [];
    groups[f.dir].push(f);
  });

  listEl.innerHTML = Object.entries(groups).map(([dir, files]) => `
    <div class="lib-group">
      <div class="lib-group-label">▸ ${dir.toUpperCase()} <small>(${files.length})</small></div>
      ${files.map(f => `
        <div class="lib-file-item ${selectedLibraryFile === f.rel ? 'selected' : ''}" data-path="${f.rel}" title="${f.name}">
          <span class="lib-file-icon">◇</span>
          <span class="lib-file-name">${f.name.replace('.md', '')}</span>
          <span class="lib-file-time">${new Date(f.modified).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
        </div>
      `).join('')}
    </div>
  `).join('');

  // Bind click handlers
  listEl.querySelectorAll('.lib-file-item').forEach(item => {
    item.addEventListener('click', () => {
      const filepath = item.getAttribute('data-path');
      selectedLibraryFile = filepath;
      // Update selection visual
      listEl.querySelectorAll('.lib-file-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      // Load the file
      loadLibraryFile(filepath);
    });
  });
}

let speechUtterances = [];
let isSpeaking = false;

function toggleReadAloud(text, btn) {
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    btn.textContent = 'READ ALOUD';
    btn.style.color = '';
    return;
  }
  
  // Clean up basic markdown characters for better reading
  const cleanText = text.replace(/[#*_\[\]`]/g, '').replace(/https?:\/\/[^\s]+/g, 'link');
  
  // Split into chunks (paragraphs/lines) to prevent long-text silent failures
  const chunks = cleanText.split(/\n+/).filter(c => c.trim().length > 0);
  if (chunks.length === 0) return;
  
  // Ensure cancel is called before starting new sequence
  window.speechSynthesis.cancel();
  
  // Keep references globally to prevent garbage collection bugs in Chrome
  speechUtterances = chunks.map((chunk, index) => {
    const utterance = new SpeechSynthesisUtterance(chunk.trim());
    utterance.rate = 1.0;
    
    // Only reset button on the very last chunk
    if (index === chunks.length - 1) {
      utterance.onend = () => {
        isSpeaking = false;
        if (document.body.contains(btn)) {
          btn.textContent = 'READ ALOUD';
          btn.style.color = '';
        }
      };
    }
    return utterance;
  });
  
  // Queue all chunks
  speechUtterances.forEach(u => window.speechSynthesis.speak(u));
  
  isSpeaking = true;
  btn.textContent = 'STOP READING';
  btn.style.color = 'var(--accent-amber)';
}

async function loadLibraryFile(relPath) {
  const readerEl = $('library-reader');
  if (!readerEl) return;

  // Stop any active speech when loading a new file
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
  }

  readerEl.innerHTML = '<div class="library-loading">Loading...</div>';

  try {
    const res = await fetch(`/api/read?path=${encodeURIComponent(relPath)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rawContent = await res.text();
    const md = redactSensitiveData(rawContent);
    const filename = relPath.split('/').pop();
    readerEl.innerHTML = `
      <div class="reader-toolbar" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span class="reader-filename">${filename}</span>
          <span class="reader-path">${relPath}</span>
        </div>
        <button id="btn-read-aloud" class="btn-ghost" style="padding:4px 8px; font-size:11px;">READ ALOUD</button>
      </div>
      <div class="reader-content">${mdToHtml(md)}</div>
    `;
    
    const readBtn = $('btn-read-aloud');
    if (readBtn) {
      readBtn.addEventListener('click', () => toggleReadAloud(md, readBtn));
    }
  } catch (e) {
    readerEl.innerHTML = `<div class="library-loading" style="color:var(--red);">Error: ${e.message}</div>`;
  }
}

// Library search
document.addEventListener('input', e => {
  if (e.target?.id === 'library-search') {
    renderLibraryList(e.target.value);
  }
});

// ══════════════════════════════════════════════
//  API CREDITS — LIVE CONFIG FROM SERVER
// ══════════════════════════════════════════════

async function fetchCreditConfig() {
  if (!isServed) return;
  try {
    const res = await fetch('/api/credits');
    const data = await res.json();
    updateCreditBars(data);
  } catch (e) {
    console.warn('[HQ] Credits fetch failed:', e.message);
  }
}

function updateCreditBars(credits) {
  // HONEST MODE: No billing API available → show configured budget caps, $0 tracked usage.
  // Future: POST usage to /api/credits when AI calls are made from within HQ.
  const map = {
    openai:    'credit-openai',
    anthropic: 'credit-anthropic',
    google:    'credit-google',
    replicate: 'credit-replicate',
  };

  Object.entries(map).forEach(([key, elId]) => {
    const cell = $(elId);
    const credit = credits[key];
    if (!cell || !credit) return;

    const providerEl = cell.querySelector('.credit-provider');
    if (providerEl) providerEl.textContent = credit.provider;

    // Show real cap from .env, honest $0 used
    const usageEl = cell.querySelector('.credit-usage');
    if (usageEl) usageEl.textContent = `$0 / $${credit.limit} cap`;

    // Bar at 0% — no false data
    const pctEl  = cell.querySelector('.credit-pct');
    const barFill = cell.querySelector('.credit-bar-fill');
    if (pctEl)  { pctEl.textContent = '0%'; pctEl.classList.remove('warning'); }
    if (barFill) barFill.style.width = '0%';
    cell.querySelector('.credit-bar')?.classList.remove('accent-red', 'accent-amber');
  });

  // Daily burn: not tracked yet
  const burnVal = document.querySelector('#credit-daily-burn .burn-value');
  if (burnVal) burnVal.innerHTML = `N/A<small> /day</small>`;
}

// ══════════════════════════════════════════════
//  ALERT BANNER DISMISS
// ══════════════════════════════════════════════

function showHqAlert(message, type = 'critical') {
  const banner = $('alert-banner');
  if (!banner) return;
  
  const alertText = banner.querySelector('.alert-text');
  if (alertText) {
    alertText.innerHTML = message;
  }
  
  // Update styling based on type
  banner.className = 'row ' + (type === 'critical' ? 'alert-critical' : 'alert-info');
  banner.classList.add('visible');
  banner.style.display = 'flex';
}

const alertDismiss = $('alert-dismiss');
if (alertDismiss) {
  alertDismiss.addEventListener('click', () => {
    const banner = $('alert-banner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(() => {
        if (!banner.classList.contains('visible')) {
          banner.style.display = 'none';
        }
      }, 300);
    }
  });
}

// ══════════════════════════════════════════════
//  PANEL HOVER
// ══════════════════════════════════════════════

document.querySelectorAll('.panel').forEach(panel => {
  panel.addEventListener('mouseenter', () => { panel.style.borderColor = '#3a4a5c'; });
  panel.addEventListener('mouseleave', () => { panel.style.borderColor = ''; });
});

// ══════════════════════════════════════════════
//  PROGRESS BAR ANIMATION
// ══════════════════════════════════════════════

function animateProgressBars() {
  document.querySelectorAll('.progress-fill, .credit-bar-fill, .metric-bar-fill').forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { bar.style.width = targetWidth; });
    });
  });
}

// ══════════════════════════════════════════════
//  ACTIVITY LOG TIMESTAMPS
// ══════════════════════════════════════════════

// updateLogTimestamps retired — #table-log now shows real git commits via renderCommitLog()
function updateLogTimestamps() { /* no-op: real data from renderCommitLog */ }

// ══════════════════════════════════════════════
//  PIPELINE STAGE CYCLING
// ══════════════════════════════════════════════

let pipelinePhase = 3;
function cyclePipeline() {
  const stages = document.querySelectorAll('.pipeline-stage');
  if (stages.length < 4) return;
  pipelinePhase = (pipelinePhase + 1) % 4;
  stages.forEach((stage, i) => {
    stage.classList.remove('active-stage', 'complete');
    const icon = stage.querySelector('.stage-icon');
    icon.classList.remove('pulse');
    if (i < pipelinePhase) {
      stage.classList.add('complete');
      icon.textContent = '✓';
    } else if (i === pipelinePhase) {
      stage.classList.add('active-stage');
      icon.textContent = '●';
      icon.classList.add('pulse');
    } else {
      icon.textContent = '○';
    }
  });
}

// ══════════════════════════════════════════════
//  NANO AI STATUS INDICATOR
// ══════════════════════════════════════════════

async function checkNanoStatus() {
  if (!isServed) return;
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    const nanoIcon = document.querySelector('#nano-indicator .nano-icon');
    const nanoText = document.querySelector('#nano-indicator .nano-text');
    const nanoInd = document.getElementById('nano-indicator');
    if (!nanoIcon || !nanoText || !nanoInd) return;

    const hasGoogle    = data.google    === 'CONFIGURED';
    const hasAnthropic = data.anthropic === 'CONFIGURED';
    const hasOpenAI    = data.openai    === 'CONFIGURED';

    if (hasGoogle) {
      nanoIcon.style.color = 'var(--accent-teal)';
      nanoText.style.color = 'var(--text-bright)';
      nanoText.textContent = 'GEMINI';
      nanoInd.title = 'Nano AI: GEMINI Active';
    } else if (hasOpenAI || hasAnthropic) {
      nanoIcon.style.color = 'var(--accent-amber)';
      nanoText.style.color = 'var(--text-bright)';
      nanoText.textContent = hasAnthropic ? 'OPUS' : 'GPT';
      nanoInd.title = `Nano AI: ${nanoText.textContent} Active`;
    } else {
      nanoIcon.style.color = 'var(--accent-red)';
      nanoText.style.color = 'var(--accent-red)';
      nanoText.textContent = 'OFFLINE';
      nanoInd.title = 'Nano AI Status: Offline (No Keys Configured)';
    }
  } catch (e) {
    console.warn('[HQ] Nano status check failed:', e);
  }
}

// ══════════════════════════════════════════════
//  CONNECTION STATUS INDICATOR
// ══════════════════════════════════════════════

function updateConnectionStatus() {
  const navDot = document.querySelector('#top-nav .status-dot');
  if (!navDot) return;
  if (isServed) {
    navDot.classList.add('live');
    navDot.title = 'Connected to Empire HQ Server';
  } else {
    navDot.classList.remove('live');
    navDot.classList.add('error');
    navDot.title = 'Static mode — start server for live data';
  }
}

// ══════════════════════════════════════════════
//  BOOT SEQUENCE
// ══════════════════════════════════════════════

async function boot() {
  const mode = isServed ? 'SERVER MODE' : 'STATIC MODE';
  console.log(`%c[EMPIRE HQ] v4.0 — ${mode}`, 'color: #4a9e8e; font-weight: bold; font-size: 14px;');

  // Create tab views (Library, etc.)
  createTabViews();

  // Draw initial sparklines
  Object.values(sparks).forEach(s => s.draw());
  Object.values(charts).forEach(c => c.draw());

  // Animate progress bars
  animateProgressBars();

  // Update log timestamps
  updateLogTimestamps();

  // Update connection indicator
  updateConnectionStatus();

  // Start metric simulation
  setInterval(updateMetrics, 2000);
  setInterval(cyclePipeline, 8000);
  setTimeout(updateMetrics, 500);

  if (isServed) {
    // ── Live data fetch cycle ──
    // Initial fetch
    await Promise.all([
      fetchGitStatus(),
      fetchLibraryFiles(),
      fetchSystemMetrics(),
      fetchCreditConfig(),
      checkNanoStatus(),
    ]);

    // Connect SSE for real-time updates
    connectSSE();

    // Periodic refresh: git + system every 30s, library every 60s
    setInterval(fetchGitStatus, 30000);
    setInterval(fetchSystemMetrics, 10000);
    setInterval(fetchLibraryFiles, 60000);
    setInterval(checkNanoStatus, 60000);

    // Setup UI interactions
    setupAlerts();

    console.log('[HQ] Live data streams active.');
  } else {
    // Even in static mode, allow dismissing the demo alert
    setupAlerts();
    console.log('[HQ] Run `node server.js` for live data.');
  }
}

function setupAlerts() {
  const dismissBtn = $('alert-dismiss');
  const banner = $('alert-banner');
  if (dismissBtn && banner) {
    dismissBtn.addEventListener('click', () => {
      banner.style.display = 'none';
      console.log('[HQ] Alert banner dismissed.');
    });
  }
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
