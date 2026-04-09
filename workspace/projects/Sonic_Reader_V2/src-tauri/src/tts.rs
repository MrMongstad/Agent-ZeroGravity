use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex, OnceLock};
use std::thread;
use std::time::Duration;
use std::env;
use std::io::Write;
use std::process::{Command, Stdio};
use std::os::windows::process::CommandExt;
use std::path::PathBuf;
use rodio::{Decoder, OutputStream, OutputStreamHandle, Sink};
use std::io::Cursor;
use tempfile::NamedTempFile;
use tauri::{Manager, Emitter};

use crate::process_manager;
use crate::text_sanitizer;

// ──── Data Types ────

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Rect {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
}

#[derive(Clone, Debug)]
pub struct TextChunk {
    pub text: String,
    pub rects: Vec<Rect>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TtsSettings {
    pub voice_model: String,
    pub speed: f32,
}

impl Default for TtsSettings {
    fn default() -> Self {
        Self {
            voice_model: "en_US-lessac-high.onnx".to_string(),
            speed: 1.0,
        }
    }
}

// ──── Audio Singleton ────

lazy_static::lazy_static! {
    static ref GLOBAL_SINK: OnceLock<Arc<Mutex<Sink>>> = OnceLock::new();
    static ref ACTIVE_ABORT: OnceLock<Mutex<Option<Arc<AtomicBool>>>> = OnceLock::new();
    static ref SETTINGS_STATE: std::sync::RwLock<TtsSettings> = std::sync::RwLock::new(TtsSettings::default());
}

static mut STREAM: Option<OutputStream> = None;
static mut STREAM_HANDLE: Option<OutputStreamHandle> = None;

pub fn get_settings_state() -> &'static std::sync::RwLock<TtsSettings> {
    &SETTINGS_STATE
}

pub fn init_audio_backend() {
    if GLOBAL_SINK.get().is_some() {
        return;
    }
    thread::spawn(|| {
        if let Ok((stream, handle)) = OutputStream::try_default() {
            unsafe {
                STREAM = Some(stream);
                STREAM_HANDLE = Some(handle.clone());
            }
            if let Ok(sink) = Sink::try_new(&handle) {
                let _ = GLOBAL_SINK.set(Arc::new(Mutex::new(sink)));
                println!("[TTS] Audio hardware initialized.");
            }
        }
    });
    // Poll for initialization
    let mut retry = 0;
    while GLOBAL_SINK.get().is_none() && retry < 10 {
        thread::sleep(Duration::from_millis(50));
        retry += 1;
    }
}

// ──── Controls ────

pub fn stop() {
    // Signal abort
    if let Ok(mut lock) = ACTIVE_ABORT.get_or_init(|| Mutex::new(None)).lock() {
        if let Some(abort) = lock.take() {
            abort.store(true, Ordering::SeqCst);
        }
    }
    // Clear audio
    if let Some(arc_sink) = GLOBAL_SINK.get() {
        if let Ok(sink) = arc_sink.lock() {
            sink.stop();
        }
    }
    // Reap any dead child processes
    process_manager::reap_finished();
}

pub fn toggle_pause() {
    if let Some(arc_sink) = GLOBAL_SINK.get() {
        if let Ok(sink) = arc_sink.lock() {
            if sink.is_paused() { sink.play(); } else { sink.pause(); }
        }
    }
}

// ──── Highlight payload for UI ────

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct HighlightPayload {
    pub text: String,
    pub rects: Vec<Rect>,
}

// ──── Core TTS Pipeline ────

pub fn speak(chunks: Vec<TextChunk>, app: tauri::AppHandle) -> Result<(), String> {
    if chunks.is_empty() { return Ok(()); }

    init_audio_backend();
    let sink = GLOBAL_SINK.get().ok_or("Audio not initialized.")?;

    stop();

    // New abort flag for this session
    let abort_flag = Arc::new(AtomicBool::new(false));
    if let Ok(mut lock) = ACTIVE_ABORT.get_or_init(|| Mutex::new(None)).lock() {
        *lock = Some(abort_flag.clone());
    }

    let settings = match get_settings_state().read() {
        Ok(g) => g.clone(),
        Err(p) => p.into_inner().clone(),
    };

    let base_dir = env::current_dir().map_err(|e| format!("cwd error: {}", e))?;
    let total = chunks.len();
    println!("\n[SonicV2] Pipeline engaged: {} chunk(s).", total);

    use std::sync::mpsc;
    let (tx, rx) = mpsc::sync_channel(2);

    // ── Producer: Synthesize ──
    let abort_syn = abort_flag.clone();
    let settings_syn = settings.clone();
    let base_syn = base_dir.clone();

    thread::spawn(move || {
        let piper = base_syn.join("piper_tts").join("piper.exe");
        let model = base_syn.join("assets").join("models").join(&settings_syn.voice_model);

        for (i, chunk) in chunks.into_iter().enumerate() {
            if abort_syn.load(Ordering::SeqCst) || process_manager::is_shutting_down() { break; }

            // V2: Run through the text sanitizer pipeline
            let clean = text_sanitizer::sanitize_for_tts(&chunk.text);
            if clean.trim().is_empty() { continue; }

            match synthesize_piper(&piper, &model, &clean, settings_syn.speed) {
                Ok(data) => {
                    if tx.send((data, chunk.text, chunk.rects, i)).is_err() { break; }
                }
                Err(e) => eprintln!("[SonicV2] Synthesis failed chunk {}: {}", i, e),
            }
        }
    });

    // ── Consumer: Play + Highlight ──
    let abort_play = abort_flag.clone();
    let sink_play = sink.clone();

    thread::spawn(move || {
        while let Ok((audio_data, text, rects, idx)) = rx.recv() {
            if abort_play.load(Ordering::SeqCst) || process_manager::is_shutting_down() { break; }

            // Wait for previous segment to finish
            loop {
                if abort_play.load(Ordering::SeqCst) { break; }
                let len = match sink_play.lock() {
                    Ok(s) => s.len(),
                    Err(_) => 0,
                };
                if len == 0 { break; }
                thread::sleep(Duration::from_millis(10));
            }
            if abort_play.load(Ordering::SeqCst) { break; }

            println!("[SonicV2] Playing chunk {}.", idx + 1);

            // Emit highlight to UI
            if let Some(h_win) = app.get_webview_window("highlighter") {
                let _ = h_win.emit("highlight-word", HighlightPayload {
                    text: text.clone(),
                    rects: rects.clone(),
                });
            }

            // Feed audio
            if let Ok(source) = Decoder::new(Cursor::new(audio_data)) {
                if let Ok(s) = sink_play.lock() {
                    s.append(source);
                    s.set_speed(1.0);
                }
            }
        }
        // Clear highlight on finish
        if let Some(h_win) = app.get_webview_window("highlighter") {
            let _ = h_win.emit("highlight-word", HighlightPayload { text: "".into(), rects: vec![] });
        }
        println!("[SonicV2] Transmission complete.");
    });

    Ok(())
}

fn synthesize_piper(exe: &PathBuf, model: &PathBuf, text: &str, speed: f32) -> Result<Vec<u8>, String> {
    let temp = NamedTempFile::new().map_err(|e| format!("Temp file error: {}", e))?;
    let temp_path = temp.path().to_owned();

    let mut child = Command::new(exe)
        .args(["--model", &model.to_string_lossy()])
        .args(["--length_scale", &(1.0 / speed).to_string()])
        .args(["--output_file", &temp_path.to_string_lossy()])
        .stdin(Stdio::piped())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .creation_flags(0x08000000)
        .spawn()
        .map_err(|e| format!("Piper spawn error: {}", e))?;

    // Feed text to stdin
    {
        let mut stdin = child.stdin.take().ok_or("stdin error")?;
        stdin.write_all(text.as_bytes()).map_err(|e| e.to_string())?;
    }

    // Register with process manager for cleanup tracking
    let pid = child.id();
    let status = child.wait().map_err(|e| e.to_string())?;

    if !status.success() {
        return Err(format!("Piper PID {} exited with error", pid));
    }

    std::fs::read(&temp_path).map_err(|e| format!("WAV read error: {}", e))
}
