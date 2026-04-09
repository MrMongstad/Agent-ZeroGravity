import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import "./App.css";

// Human-friendly voice name mapping
const VOICE_LABELS: Record<string, string> = {
  "en_US-lessac-high.onnx": "Lessac (US · Premium)",
  "en_US-lessac-medium.onnx": "Lessac (US · Standard)",
  "en_US-amy-medium.onnx": "Amy (US · Warm)",
  "en_US-ryan-high.onnx": "Ryan (US · Deep)",
  "en_US-libritts_r-medium.onnx": "LibriTTS (US · Neutral)",
  "en_GB-alba-medium.onnx": "Alba (UK · Clear)",
  "en_GB-jenny_dioco-medium.onnx": "Jenny (UK · Smooth)",
};

function getVoiceLabel(filename: string): string {
  return VOICE_LABELS[filename] || filename.replace(".onnx", "").replace(/_/g, " ");
}

function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [scrapedText, setScrapedText] = useState("Ghost Protocol active. Use Ctrl+Alt+V to read globally, or test here.");
  const [isReading, setIsReading] = useState(false);

  // Settings state
  const [voiceModel, setVoiceModel] = useState("en_US-lessac-high.onnx");
  const [speed, setSpeed] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState<string[]>([]);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [usage, setUsage] = useState({ daily_usage: 0, daily_limit: 50000 });

  // Track reading state from highlight events
  useEffect(() => {
    const unlistenHighlight = listen<any[]>("highlight-word", (event) => {
      const rects = event.payload || [];
      setIsReading(rects.length > 0);
    });
    return () => { unlistenHighlight.then(f => f()); };
  }, []);

  useEffect(() => {
    const unlisten = listen("usage-update", (event: any) => {
      setUsage(event.payload);
    });
    return () => { unlisten.then(f => f()); };
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const voices: string[] = await invoke("get_available_voices");
        setAvailableVoices(voices);

        const currentSettings: { voice_model: string, speed: number } = await invoke("get_settings");
        setVoiceModel(currentSettings.voice_model);
        setSpeed(currentSettings.speed);

        const usageData: any = await invoke("get_usage");
        setUsage(usageData);
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
    loadSettings();
  }, []);

  async function saveSettings() {
    try {
      await invoke("set_settings", {
        newSettings: { voice_model: voiceModel, speed: speed }
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  }

  async function testScraping() {
    setScrapedText("Scraping in 3 seconds... Hover over target text!");
    setTimeout(async () => {
      try {
        const text = await invoke("read_text_under_cursor");
        setScrapedText(`Success: \n${text}`);
      } catch (e) {
        setScrapedText(`Error: ${e}`);
      }
    }, 3000);
  }

  return (
    <main className="container">
      <div className="tab-header">
        <h1 className="logo">SonicReader</h1>
        <div className="tabs">
          <button className={activeTab === "Home" ? "tab active" : "tab"} onClick={() => setActiveTab("Home")}>System</button>
          <button className={activeTab === "Settings" ? "tab active" : "tab"} onClick={() => setActiveTab("Settings")}>Config</button>
        </div>
      </div>

      {activeTab === "Home" && (
        <div className="view fade-in">
          <div className="status-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="status-text">
              <h2 className="ghost-title">Ghost Protocol</h2>
              <p>Core systems active. Tactical hotkeys online.</p>
            </div>
            <div className="badges-wrapper">
              <div className="status-badge lang" title="Current Neural Language">
                {voiceModel.substring(0, 2).toUpperCase()}
              </div>
              <div className={`status-badge ${isReading ? 'reading' : 'live'}`}>
                {isReading ? '◉ READING' : '● LIVE'}
              </div>
            </div>
          </div>

          <div className="hotkeys">
            <div className="hotkey-item"><strong>Ctrl+Alt+V</strong> <span>Read text under cursor</span></div>
            <div className="hotkey-item"><strong>Ctrl+Alt+S</strong> <span>Stop execution</span></div>
            <div className="hotkey-item"><strong>Ctrl+Alt+Space</strong> <span>Pause / Resume toggle</span></div>
          </div>

          <div className="usage-card">
            <div className="usage-header">
              <span>Daily Character Quota</span>
              <span className="usage-perc">{(usage.daily_usage / usage.daily_limit * 100).toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(100, (usage.daily_usage / usage.daily_limit * 100))}%` }}></div>
            </div>
            <div className="usage-footer">
              <span>{usage.daily_usage.toLocaleString()} / {usage.daily_limit.toLocaleString()} chars</span>
              {usage.daily_usage > usage.daily_limit && <span className="warning" style={{ color: "#ef4444", fontWeight: "bold" }}>Quota Exceeded</span>}
            </div>
          </div>

          <div className="action-row">
            <button
              onClick={testScraping}
              className="primary-btn"
              disabled={scrapedText.includes("Scraping")}
            >
              {scrapedText.includes("Scraping") ? "System Armed..." : "Test Neural Scrape"}
            </button>
          </div>

          <div className="console-box" style={{ borderLeft: "2px solid var(--theme-accent)" }}>
            <span style={{ color: "var(--theme-text-muted)", marginRight: "8px" }}>$</span>
            {scrapedText}
          </div>
        </div>
      )}

      {activeTab === "Settings" && (
        <div className="view fade-in">
          <h2 style={{ fontSize: "1.5rem" }}>Neural Calibration</h2>
          <p>Adjust the synthesized voice characteristics.</p>

          <div className="form-group">
            <label>Neural Model</label>
            <select value={voiceModel} onChange={e => setVoiceModel(e.target.value)} className="glass-input">
              {availableVoices.map(v => (
                <option key={v} value={v}>{getVoiceLabel(v)}</option>
              ))}
              {availableVoices.length === 0 && <option value={voiceModel}>{getVoiceLabel(voiceModel)}</option>}
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Transmission Speed</span>
              <span style={{ color: "var(--theme-accent)" }}>{speed.toFixed(2)}x</span>
            </label>
            <input
              type="range"
              min="0.5" max="2.0" step="0.1"
              value={speed}
              onChange={e => setSpeed(parseFloat(e.target.value))}
              className="slider"
            />
          </div>

          <button onClick={saveSettings} className="primary-btn save-btn" style={{ marginTop: "2rem" }}>
            {settingsSaved ? "Settings Calibrated" : "Apply Changes"}
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
