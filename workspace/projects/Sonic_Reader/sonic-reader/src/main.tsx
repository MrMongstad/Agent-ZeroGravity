import React from "react";
import { createRoot } from "react-dom/client";
import { getCurrentWindow } from "@tauri-apps/api/window";
import App from "./App";
import Highlighter from "./Highlighter";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  const label = getCurrentWindow().label;

  // Inject window label as class for CSS scoping
  document.documentElement.classList.add(`${label}-window`);

  // Fail-safe: Force root background to transparent for the highlighter
  if (label === "highlighter") {
    document.documentElement.style.backgroundColor = "transparent";
    document.body.style.backgroundColor = "transparent";
  }

  root.render(
    <React.StrictMode>
      {label === "highlighter" ? <Highlighter /> : <App />}
    </React.StrictMode>
  );
}
