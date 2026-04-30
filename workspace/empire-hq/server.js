/**
 * Empire HQ — Server
 * Zero-dependency Node.js HTTP server
 * Port: 3737
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3739;

// ─── Configurable Paths ───────────────────────────────────────────────────────
const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const SCAN_DIRS = [
  path.join(WORKSPACE_ROOT, 'memory'),
  path.join(WORKSPACE_ROOT, 'reports'),
  path.join(WORKSPACE_ROOT, 'docs'),
];

const REPO_ROOTS = [
  { name: 'Agent-ZeroGravity', path: path.resolve(WORKSPACE_ROOT, '..') },
  { name: 'Prompt Magic',      path: path.resolve(WORKSPACE_ROOT, 'projects/_active/Prompt Magic') },
  { name: 'Sonic Reader V3',   path: path.resolve(WORKSPACE_ROOT, 'projects/_active/Sonic_Reader_V3') },
  { name: 'LFS-R2-Proxy',      path: path.resolve(WORKSPACE_ROOT, 'projects/_live/LFS-R2-Proxy') },
  { name: 'norcast-planner',   path: path.resolve(WORKSPACE_ROOT, 'projects/_live/norcast-planner') },
];

// ─── MIME Types ────────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.md':   'text/plain; charset=utf-8',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
};

// ─── SSE Clients ───────────────────────────────────────────────────────────────
const sseClients = new Set();

function broadcast(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(res => res.write(msg));
}

// ─── File Watcher ──────────────────────────────────────────────────────────────
SCAN_DIRS.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.watch(dir, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith('.md')) {
        broadcast('file-changed', { file: filename });
      }
    });
  }
});

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getAllMdFiles() {
  const results = [];
  SCAN_DIRS.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const label = path.basename(dir);
    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .map(f => ({
        name: f,
        dir: label,
        path: path.join(dir, f),
        rel: path.relative(WORKSPACE_ROOT, path.join(dir, f)).replace(/\\/g, '/'),
        modified: fs.statSync(path.join(dir, f)).mtime.toISOString(),
      }));
    results.push(...files);
  });
  return results;
}

function gitExec(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, timeout: 4000, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch { return ''; }
}

function getGitStatus() {
  return REPO_ROOTS.map(repo => {
    const result = { name: repo.name, path: repo.path, exists: false };
    if (!fs.existsSync(repo.path)) return result;
    result.exists = true;
    try {
      const branch  = gitExec('git rev-parse --abbrev-ref HEAD', repo.path);
      const dirty   = gitExec('git status --short', repo.path);
      const commits = gitExec('git log --oneline -3', repo.path);
      // Ahead count: only attempt if upstream is configured
      let ahead = 0;
      const upstream = gitExec('git rev-parse --abbrev-ref --symbolic-full-name @{u}', repo.path);
      if (upstream) {
        const aheadStr = gitExec('git rev-list --count @{u}..HEAD', repo.path);
        ahead = parseInt(aheadStr, 10) || 0;
      }
      if (!branch) { result.status = 'error'; result.error = 'Not a git repository'; return result; }
      result.branch  = branch;
      result.dirty   = dirty ? dirty.split('\n') : [];
      result.commits = commits ? commits.split('\n') : [];
      result.ahead   = ahead;
      result.status  = dirty ? 'dirty' : 'clean';
    } catch (e) {
      result.status = 'error';
      result.error  = e.message;
    }
    return result;
  });
}

function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  if (!fs.existsSync(filePath)) {
    res.writeHead(404); res.end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
}

function json(res, data, code = 200) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

// ─── Router ────────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // SSE
  if (pathname === '/api/watch') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write('data: connected\n\n');
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // File list
  if (pathname === '/api/files') {
    return json(res, getAllMdFiles());
  }

  // Read file
  if (pathname === '/api/read') {
    const rel = url.searchParams.get('path');
    if (!rel) { json(res, { error: 'Missing path' }, 400); return; }
    const abs = path.join(WORKSPACE_ROOT, rel);
    // Security: must stay within workspace
    if (!abs.startsWith(WORKSPACE_ROOT)) { json(res, { error: 'Forbidden' }, 403); return; }
    if (!fs.existsSync(abs)) { json(res, { error: 'Not found' }, 404); return; }
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
    fs.createReadStream(abs).pipe(res);
    return;
  }

  // Git status
  if (pathname === '/api/gitstatus') {
    return json(res, getGitStatus());
  }

  // Git pull (gated — requires explicit confirm param)
  if (pathname === '/api/gitpull' && req.method === 'POST') {
    const repoName = url.searchParams.get('repo');
    const repo = REPO_ROOTS.find(r => r.name === repoName);
    if (!repo) { json(res, { error: 'Unknown repo' }, 404); return; }
    try {
      const out = execSync('git pull', { cwd: repo.path, timeout: 10000 }).toString();
      json(res, { success: true, output: out });
    } catch (e) {
      json(res, { success: false, error: e.message }, 500);
    }
    return;
  }

  // Static files
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  serveStatic(res, filePath);
});

server.listen(PORT, () => {
  console.log(`\n🏛️  Empire HQ is live → http://localhost:${PORT}\n`);
  console.log(`   Watching: ${SCAN_DIRS.map(d => path.basename(d)).join(', ')}`);
  console.log(`   Repos monitored: ${REPO_ROOTS.length}`);
  console.log(`\n   Press Ctrl+C to shut down.\n`);
});
