import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest.json' with { type: 'json' };

export default defineConfig({
  // Treat src/ as the project root so CRXJS resolves background.js,
  // content.js, sidepanel.html, selectors.json all relative to src/
  root: 'src',

  build: {
    // Output dist/ at the project root (one level above src/)
    outDir: '../dist',
    emptyOutDir: true,
  },

  plugins: [
    crx({ manifest }),
  ],
});
