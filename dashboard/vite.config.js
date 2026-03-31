import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, '..', 'workspace');

function workspaceProxy() {
  return {
    name: 'workspace-proxy',
    configureServer(server) {
      // Must run before Vite's own middleware (return function for "post" hook won't work here)
      server.middlewares.use((req, res, next) => {
        // --- POST: write to gag_bus.json ---
        if (req.url === '/api/write-bus' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk.toString());
          req.on('end', () => {
            try {
              const { task, sender } = JSON.parse(body);
              const busPath = path.join(workspaceRoot, 'gag_bus.json');
              const data = JSON.parse(fs.readFileSync(busPath, 'utf8'));
              data.telegram_to_jarvis.push({ sender, task, status: 'pending' });
              fs.writeFileSync(busPath, JSON.stringify(data, null, 2));
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return; // consumed
        }

        // --- GET: serve workspace files ---
        if (req.url.startsWith('/workspace/') && req.method === 'GET') {
          const decoded = decodeURIComponent(req.url.replace(/^\/workspace\//, ''));
          const targetPath = path.join(workspaceRoot, decoded);

          // Security: block path traversal
          if (!targetPath.startsWith(workspaceRoot)) {
            res.statusCode = 403;
            res.end('Forbidden');
            return;
          }

          if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
            const ext = path.extname(targetPath).toLowerCase();
            const mimeMap = { '.json': 'application/json', '.log': 'text/plain', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain' };
            res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
            fs.createReadStream(targetPath).pipe(res);
          } else {
            res.statusCode = 404;
            res.end('Not Found');
          }
          return; // consumed
        }

        next();
      });
    }
  };
}

export default defineConfig({
  root: './',
  base: './',
  plugins: [workspaceProxy()],
  server: {
    port: 3000,
    open: false
  }
});
