// Sonic Reader V2 — Clipboard Monitor
// ─────────────────────────────────────
// Background thread that polls the system clipboard for changes.
// When new text is detected, it auto-feeds into the TTS pipeline.
// This is the "Ctrl+C → auto-read" workflow for GaG integration.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::OnceLock;
use std::thread;
use std::time::Duration;
use arboard::Clipboard;
use tauri::{AppHandle, Emitter};

use crate::tts;
use crate::text_sanitizer;

// ──── State ────

static MONITOR_ACTIVE: AtomicBool = AtomicBool::new(false);
static MONITOR_ABORT: OnceLock<AtomicBool> = OnceLock::new();

/// Returns true if the clipboard monitor is currently running.
pub fn is_active() -> bool {
    MONITOR_ACTIVE.load(Ordering::SeqCst)
}

/// Start the clipboard monitor background thread.
/// It polls the clipboard every 250ms and triggers TTS when new text arrives.
pub fn start(app: AppHandle) -> Result<(), String> {
    if MONITOR_ACTIVE.load(Ordering::SeqCst) {
        return Err("Clipboard monitor is already running.".to_string());
    }

    // Reset abort flag
    let abort = MONITOR_ABORT.get_or_init(|| AtomicBool::new(false));
    abort.store(false, Ordering::SeqCst);
    MONITOR_ACTIVE.store(true, Ordering::SeqCst);

    println!("[ClipMon] Clipboard monitor started.");

    // Emit status to frontend
    let _ = app.emit("clipboard-monitor-status", true);

    let app_handle = app.clone();

    thread::spawn(move || {
        // Create clipboard instance inside the thread
        let mut clipboard = match Clipboard::new() {
            Ok(cb) => cb,
            Err(e) => {
                eprintln!("[ClipMon] Failed to init clipboard: {}", e);
                MONITOR_ACTIVE.store(false, Ordering::SeqCst);
                let _ = app_handle.emit("clipboard-monitor-status", false);
                return;
            }
        };

        // Grab the current clipboard content to establish a baseline
        // (we don't want to read whatever is already there on startup)
        let mut last_content = clipboard.get_text().unwrap_or_default();

        loop {
            let abort = MONITOR_ABORT.get_or_init(|| AtomicBool::new(false));
            if abort.load(Ordering::SeqCst) {
                break;
            }

            thread::sleep(Duration::from_millis(250));

            // Poll clipboard
            let current = match clipboard.get_text() {
                Ok(text) => text,
                Err(_) => continue, // Non-text content (images, etc.) — skip
            };

            // Check if content actually changed
            if current == last_content || current.trim().is_empty() {
                continue;
            }

            last_content = current.clone();

            // Sanitize and check if there's anything worth reading
            let clean = text_sanitizer::sanitize_for_tts(&current);
            if clean.trim().is_empty() {
                continue;
            }

            println!("[ClipMon] New clipboard text detected ({} chars). Feeding to TTS.", clean.len());

            // Emit event to frontend so it can update UI status
            let _ = app_handle.emit("clipboard-text-detected", clean.len());

            // Build a single chunk and feed to TTS
            let chunk = tts::TextChunk {
                text: current,
                rects: vec![], // No spatial data for clipboard text
            };

            if let Err(e) = tts::speak(vec![chunk], app_handle.clone()) {
                eprintln!("[ClipMon] TTS error: {}", e);
            }
        }

        MONITOR_ACTIVE.store(false, Ordering::SeqCst);
        let _ = app_handle.emit("clipboard-monitor-status", false);
        println!("[ClipMon] Clipboard monitor stopped.");
    });

    Ok(())
}

/// Stop the clipboard monitor.
pub fn stop() {
    if let Some(abort) = MONITOR_ABORT.get() {
        abort.store(true, Ordering::SeqCst);
    }
    MONITOR_ACTIVE.store(false, Ordering::SeqCst);
    println!("[ClipMon] Stop signal sent.");
}
