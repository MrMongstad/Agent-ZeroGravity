// vite.config.js
import { defineConfig } from "file:///C:/Users/steph/Desktop/Antigravity%20and%20Agent%200/workspace/projects/_active/Prompt%20Magic/node_modules/vite/dist/node/index.js";
import { crx } from "file:///C:/Users/steph/Desktop/Antigravity%20and%20Agent%200/workspace/projects/_active/Prompt%20Magic/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// src/manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Prompt Magic",
  version: "0.1.0",
  description: "Minimalist, space-efficient prompt engineering extension.",
  icons: {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  permissions: [
    "sidePanel",
    "storage",
    "contextMenus",
    "scripting",
    "activeTab"
  ],
  host_permissions: [
    "https://chatgpt.com/*",
    "https://gemini.google.com/*",
    "https://claude.ai/*",
    "https://www.perplexity.ai/*"
  ],
  background: {
    service_worker: "background.js",
    type: "module"
  },
  content_scripts: [
    {
      matches: [
        "https://chatgpt.com/*",
        "https://gemini.google.com/*",
        "https://claude.ai/*",
        "https://www.perplexity.ai/*"
      ],
      js: [
        "content.js"
      ]
    }
  ],
  side_panel: {
    default_path: "sidepanel.html"
  },
  action: {
    default_title: "Open Prompt Magic"
  },
  web_accessible_resources: [
    {
      resources: [
        "selectors.json"
      ],
      matches: [
        "<all_urls>"
      ]
    }
  ]
};

// vite.config.js
var vite_config_default = defineConfig({
  // Treat src/ as the project root so CRXJS resolves background.js,
  // content.js, sidepanel.html, selectors.json all relative to src/
  root: "src",
  build: {
    // Output dist/ at the project root (one level above src/)
    outDir: "../dist",
    emptyOutDir: true
  },
  plugins: [
    crx({ manifest: manifest_default })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAic3JjL21hbmlmZXN0Lmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzdGVwaFxcXFxEZXNrdG9wXFxcXEFudGlncmF2aXR5IGFuZCBBZ2VudCAwXFxcXHdvcmtzcGFjZVxcXFxwcm9qZWN0c1xcXFxfYWN0aXZlXFxcXFByb21wdCBNYWdpY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcc3RlcGhcXFxcRGVza3RvcFxcXFxBbnRpZ3Jhdml0eSBhbmQgQWdlbnQgMFxcXFx3b3Jrc3BhY2VcXFxccHJvamVjdHNcXFxcX2FjdGl2ZVxcXFxQcm9tcHQgTWFnaWNcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3N0ZXBoL0Rlc2t0b3AvQW50aWdyYXZpdHklMjBhbmQlMjBBZ2VudCUyMDAvd29ya3NwYWNlL3Byb2plY3RzL19hY3RpdmUvUHJvbXB0JTIwTWFnaWMvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGNyeCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbic7XG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9zcmMvbWFuaWZlc3QuanNvbicgd2l0aCB7IHR5cGU6ICdqc29uJyB9O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAvLyBUcmVhdCBzcmMvIGFzIHRoZSBwcm9qZWN0IHJvb3Qgc28gQ1JYSlMgcmVzb2x2ZXMgYmFja2dyb3VuZC5qcyxcbiAgLy8gY29udGVudC5qcywgc2lkZXBhbmVsLmh0bWwsIHNlbGVjdG9ycy5qc29uIGFsbCByZWxhdGl2ZSB0byBzcmMvXG4gIHJvb3Q6ICdzcmMnLFxuXG4gIGJ1aWxkOiB7XG4gICAgLy8gT3V0cHV0IGRpc3QvIGF0IHRoZSBwcm9qZWN0IHJvb3QgKG9uZSBsZXZlbCBhYm92ZSBzcmMvKVxuICAgIG91dERpcjogJy4uL2Rpc3QnLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICB9LFxuXG4gIHBsdWdpbnM6IFtcbiAgICBjcngoeyBtYW5pZmVzdCB9KSxcbiAgXSxcbn0pO1xuIiwgIntcclxuICBcIm1hbmlmZXN0X3ZlcnNpb25cIjogMyxcclxuICBcIm5hbWVcIjogXCJQcm9tcHQgTWFnaWNcIixcclxuICBcInZlcnNpb25cIjogXCIwLjEuMFwiLFxyXG4gIFwiZGVzY3JpcHRpb25cIjogXCJNaW5pbWFsaXN0LCBzcGFjZS1lZmZpY2llbnQgcHJvbXB0IGVuZ2luZWVyaW5nIGV4dGVuc2lvbi5cIixcclxuICBcImljb25zXCI6IHtcclxuICAgIFwiMTZcIjogXCJpY29ucy9pY29uMTYucG5nXCIsXHJcbiAgICBcIjQ4XCI6IFwiaWNvbnMvaWNvbjQ4LnBuZ1wiLFxyXG4gICAgXCIxMjhcIjogXCJpY29ucy9pY29uMTI4LnBuZ1wiXHJcbiAgfSxcclxuICBcInBlcm1pc3Npb25zXCI6IFtcclxuICAgIFwic2lkZVBhbmVsXCIsXHJcbiAgICBcInN0b3JhZ2VcIixcclxuICAgIFwiY29udGV4dE1lbnVzXCIsXHJcbiAgICBcInNjcmlwdGluZ1wiLFxyXG4gICAgXCJhY3RpdmVUYWJcIlxyXG4gIF0sXHJcbiAgXCJob3N0X3Blcm1pc3Npb25zXCI6IFtcclxuICAgIFwiaHR0cHM6Ly9jaGF0Z3B0LmNvbS8qXCIsXHJcbiAgICBcImh0dHBzOi8vZ2VtaW5pLmdvb2dsZS5jb20vKlwiLFxyXG4gICAgXCJodHRwczovL2NsYXVkZS5haS8qXCIsXHJcbiAgICBcImh0dHBzOi8vd3d3LnBlcnBsZXhpdHkuYWkvKlwiXHJcbiAgXSxcclxuICBcImJhY2tncm91bmRcIjoge1xyXG4gICAgXCJzZXJ2aWNlX3dvcmtlclwiOiBcImJhY2tncm91bmQuanNcIixcclxuICAgIFwidHlwZVwiOiBcIm1vZHVsZVwiXHJcbiAgfSxcclxuICBcImNvbnRlbnRfc2NyaXB0c1wiOiBbXHJcbiAgICB7XHJcbiAgICAgIFwibWF0Y2hlc1wiOiBbXHJcbiAgICAgICAgXCJodHRwczovL2NoYXRncHQuY29tLypcIixcclxuICAgICAgICBcImh0dHBzOi8vZ2VtaW5pLmdvb2dsZS5jb20vKlwiLFxyXG4gICAgICAgIFwiaHR0cHM6Ly9jbGF1ZGUuYWkvKlwiLFxyXG4gICAgICAgIFwiaHR0cHM6Ly93d3cucGVycGxleGl0eS5haS8qXCJcclxuICAgICAgXSxcclxuICAgICAgXCJqc1wiOiBbXHJcbiAgICAgICAgXCJjb250ZW50LmpzXCJcclxuICAgICAgXVxyXG4gICAgfVxyXG4gIF0sXHJcbiAgXCJzaWRlX3BhbmVsXCI6IHtcclxuICAgIFwiZGVmYXVsdF9wYXRoXCI6IFwic2lkZXBhbmVsLmh0bWxcIlxyXG4gIH0sXHJcbiAgXCJhY3Rpb25cIjoge1xyXG4gICAgXCJkZWZhdWx0X3RpdGxlXCI6IFwiT3BlbiBQcm9tcHQgTWFnaWNcIlxyXG4gIH0sXHJcbiAgXCJ3ZWJfYWNjZXNzaWJsZV9yZXNvdXJjZXNcIjogW1xyXG4gICAge1xyXG4gICAgICBcInJlc291cmNlc1wiOiBbXHJcbiAgICAgICAgXCJzZWxlY3RvcnMuanNvblwiXHJcbiAgICAgIF0sXHJcbiAgICAgIFwibWF0Y2hlc1wiOiBbXHJcbiAgICAgICAgXCI8YWxsX3VybHM+XCJcclxuICAgICAgXVxyXG4gICAgfVxyXG4gIF1cclxufSJdLAogICJtYXBwaW5ncyI6ICI7QUFBOGMsU0FBUyxvQkFBb0I7QUFDM2UsU0FBUyxXQUFXOzs7QUNEcEI7QUFBQSxFQUNFLGtCQUFvQjtBQUFBLEVBQ3BCLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxFQUNYLGFBQWU7QUFBQSxFQUNmLE9BQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxhQUFlO0FBQUEsSUFDYjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxrQkFBb0I7QUFBQSxJQUNsQjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFlBQWM7QUFBQSxJQUNaLGdCQUFrQjtBQUFBLElBQ2xCLE1BQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxpQkFBbUI7QUFBQSxJQUNqQjtBQUFBLE1BQ0UsU0FBVztBQUFBLFFBQ1Q7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxJQUFNO0FBQUEsUUFDSjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsWUFBYztBQUFBLElBQ1osY0FBZ0I7QUFBQSxFQUNsQjtBQUFBLEVBQ0EsUUFBVTtBQUFBLElBQ1IsZUFBaUI7QUFBQSxFQUNuQjtBQUFBLEVBQ0EsMEJBQTRCO0FBQUEsSUFDMUI7QUFBQSxNQUNFLFdBQWE7QUFBQSxRQUNYO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBVztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjs7O0FEcERBLElBQU8sc0JBQVEsYUFBYTtBQUFBO0FBQUE7QUFBQSxFQUcxQixNQUFNO0FBQUEsRUFFTixPQUFPO0FBQUE7QUFBQSxJQUVMLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDUCxJQUFJLEVBQUUsMkJBQVMsQ0FBQztBQUFBLEVBQ2xCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
