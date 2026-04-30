/**
 * Empire HQ v4.0 — Server
 * Zero-dependency Node.js HTTP server (except dotenv)
 * Serves the brutalist dashboard + provides live data APIs.
 * Port: from .env or 3739
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { exec, execSync } from 'child_process';

// Load environment from workspace root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const envPath = path.join(WORKSPACE_ROOT, '.env');

// Minimal .env parser (no dependency needed)
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const eq = line.indexOf('=');
    if (eq > 0) {
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

const PORT = parseInt(process.env.PORT, 10) || 3739;

// ─── Configurable Paths ───────────────────────────────────────────────────────
const SCAN_DIRS = [
  path.join(WORKSPACE_ROOT, 'memory'),
  path.join(WORKSPACE_ROOT, 'reports'),
  path.join(WORKSPACE_ROOT, 'docs'),
];

const REPO_ROOTS = [
  { name: 'Agent-ZeroGravity', path: path.resolve(WORKSPACE_ROOT, '..') },
  { name: 'Empire HQ',         path: path.resolve(WORKSPACE_ROOT, 'projects/_active/Empire_HQ') },
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
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
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
    try {
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
    } catch { /* skip inaccessible dirs */ }
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

// ─── CPU Monitoring State ───
let lastCpuIdle = 0;
let lastCpuTotal = 0;

function getSystemInfo() {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  // CPU usage calculation
  const cpuIdle = cpus.reduce((sum, cpu) => sum + cpu.times.idle, 0);
  const cpuTotal = cpus.reduce((sum, cpu) => sum + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq, 0);
  
  const idleDiff = cpuIdle - lastCpuIdle;
  const totalDiff = cpuTotal - lastCpuTotal;
  const cpuUsage = totalDiff === 0 ? 0 : Math.round((1 - idleDiff / totalDiff) * 100);
  
  lastCpuIdle = cpuIdle;
  lastCpuTotal = cpuTotal;

  return {
    cpu: cpuUsage,
    ram: Math.round((usedMem / totalMem) * 100),
    ramUsedGB: (usedMem / 1073741824).toFixed(1),
    ramTotalGB: (totalMem / 1073741824).toFixed(1),
    uptime: Math.round(os.uptime()),
    platform: os.platform(),
    hostname: os.hostname(),
    cpuModel: cpus[0]?.model || 'unknown',
    cpuCores: cpus.length,
    nodeVersion: process.version,
  };
}

function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  if (!fs.existsSync(filePath)) {
    res.writeHead(404); res.end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
  fs.createReadStream(filePath).pipe(res);
}

function json(res, data, code = 200) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

// ─── Process Monitoring Cache ───
let cachedProcs = [];
let isFetchingProcs = false;
let lastProcFetch = 0;

// ─── Router ────────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' });
    res.end();
    return;
  }

  // SSE — live file watch
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

  // Library file list
  if (pathname === '/api/files') {
    return json(res, getAllMdFiles());
  }

  // Read markdown file
  if (pathname === '/api/read') {
    const rel = url.searchParams.get('path');
    if (!rel) { json(res, { error: 'Missing path' }, 400); return; }
    const abs = path.join(WORKSPACE_ROOT, rel);
    if (!abs.startsWith(WORKSPACE_ROOT)) { json(res, { error: 'Forbidden' }, 403); return; }
    if (!fs.existsSync(abs)) { json(res, { error: 'Not found' }, 404); return; }
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
    fs.createReadStream(abs).pipe(res);
    return;
  }

  // Git status — all repos
  if (pathname === '/api/gitstatus') {
    return json(res, getGitStatus());
  }

  // System info — OS-level metrics
  if (pathname === '/api/system') {
    return json(res, getSystemInfo());
  }

  // Top processes (Cached to prevent blocking server)
  if (pathname === '/api/processes') {
    const now = Date.now();
    if (now - lastProcFetch > 5000 && !isFetchingProcs) {
      isFetchingProcs = true;
      const isWin = os.platform() === 'win32';
      const cmd = isWin 
        ? 'powershell.exe -NoProfile -Command "Get-Process | Sort-Object -Property WS -Descending | Select-Object -First 15 Name, Id, WS, CPU | ConvertTo-Json"'
        : 'ps -eo comm,pid,rss,pcpu --sort=-rss | head -n 16';

      exec(cmd, (err, stdout) => {
        isFetchingProcs = false;
        if (!err && stdout) {
          try {
            if (isWin) {
              cachedProcs = JSON.parse(stdout).map(p => ({
                name: p.Name,
                pid: p.Id,
                memory: (p.WS / 1024 / 1024).toFixed(1) + ' MB',
                cpu: p.CPU ? p.CPU.toFixed(1) : '0.0'
              }));
            } else {
              const lines = stdout.trim().split('\n').slice(1);
              cachedProcs = lines.map(line => {
                const parts = line.trim().split(/\s+/);
                return {
                  name: parts.slice(0, -3).join(' '),
                  pid: parts[parts.length - 3],
                  memory: (parseInt(parts[parts.length - 2], 10) / 1024).toFixed(1) + ' MB',
                  cpu: parseFloat(parts[parts.length - 1]).toFixed(1)
                };
              });
            }
            lastProcFetch = Date.now();
          } catch(e) {
            console.error('Proc parse error:', e);
          }
        }
      });
    }
    return json(res, cachedProcs);
  }

  // API Credit budgets from .env and Antigravity if available
  if (pathname === '/api/credits') {
    // Attempt to read remaining quota from local file if set, or just use static values
    const credits = {
      openai:    { limit: parseFloat(process.env.CREDIT_OPENAI)    || 50,  provider: 'OPENAI' },
      anthropic: { limit: parseFloat(process.env.CREDIT_ANTHROPIC) || 100, provider: 'ANTHROPIC' },
      google:    { limit: parseFloat(process.env.CREDIT_GOOGLE)    || 300, provider: 'GEMINI' },
      replicate: { limit: parseFloat(process.env.CREDIT_REPLICATE) || 5,   provider: 'REPLICATE' },
    };
    return json(res, credits);
  }

  // Settings API
  if (pathname === '/api/settings') {
    if (req.method === 'GET') {
      const keys = {
        openai: (process.env.OPENAI_API_KEY || '').slice(0, 8) + '...',
        anthropic: (process.env.ANTHROPIC_KEY || '').slice(0, 8) + '...',
        google: (process.env.GEMINI_API_KEY || '').slice(0, 8) + '...',
      };
      return json(res, keys);
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const updates = JSON.parse(body);
          if (fs.existsSync(envPath)) {
            let envContent = fs.readFileSync(envPath, 'utf8');
            // Basic replacement for demo purposes (assumes keys exist)
            for (const [k, v] of Object.entries(updates)) {
              if (v && !v.includes('...')) {
                const regex = new RegExp(`^${k}=.*`, 'm');
                if (envContent.match(regex)) {
                  envContent = envContent.replace(regex, `${k}=${v}`);
                } else {
                  envContent += `\n${k}=${v}`;
                }
                process.env[k] = v;
              }
            }
            fs.writeFileSync(envPath, envContent);
          }
          json(res, { success: true });
        } catch(e) {
          json(res, { success: false, error: e.message }, 500);
        }
      });
      return;
    }
  }

  // Git pull (POST only)
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

  // Static files — serve from empire-hq dir
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  serveStatic(res, filePath);
});

server.listen(PORT, () => {
  console.log(`\n🏛️  Empire HQ v4.0 — Command Center Online`);
  console.log(`   → http://localhost:${PORT}`);
  console.log(`\n   Library dirs: ${SCAN_DIRS.map(d => path.basename(d)).join(', ')}`);
  console.log(`   Repos monitored: ${REPO_ROOTS.map(r => r.name).join(', ')}`);
  console.log(`   System: ${os.hostname()} | ${os.cpus().length} cores | ${(os.totalmem() / 1073741824).toFixed(1)}GB RAM`);
  console.log(`\n   Press Ctrl+C to shut down.\n`);
});
