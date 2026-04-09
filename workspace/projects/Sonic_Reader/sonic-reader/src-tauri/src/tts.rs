use serde::{Deserialize, Serialize};
use std::env;
use std::io::Write;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::sync::{Arc, Mutex, OnceLock, RwLock};
use std::sync::atomic::{AtomicBool, Ordering};
use std::thread;
use std::time::Duration;
use rodio::{Decoder, OutputStream, OutputStreamHandle, Sink};
use std::io::Cursor;
use tempfile::NamedTempFile;
use tauri::{Manager, Emitter};
use crate::usage_tracker;
use std::os::windows::process::CommandExt;

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
    pub daily_limit: usize,
}

impl Default for TtsSettings {
    fn default() -> Self {
        Self {
            voice_model: "en_US-lessac-high.onnx".to_string(),
            speed: 1.0,
            daily_limit: 50000,
        }
    }
}

lazy_static::lazy_static! {
    static ref GLOBAL_SINK: OnceLock<Arc<Mutex<Sink>>> = OnceLock::new();
    static ref ACTIVE_ABORT: OnceLock<Mutex<Option<Arc<AtomicBool>>>> = OnceLock::new();
    static ref ACTIVE_PROCESS: OnceLock<Mutex<Option<std::process::Child>>> = OnceLock::new();
    static ref SETTINGS_STATE: RwLock<TtsSettings> = RwLock::new(TtsSettings::default());
}

static mut STREAM: Option<OutputStream> = None;
static mut STREAM_HANDLE: Option<OutputStreamHandle> = None;

pub fn get_settings_state() -> &'static RwLock<TtsSettings> {
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
                println!("[TTS] Audio hardware initialized successfully.");
            }
        }
    });

    let mut retry = 0;
    while GLOBAL_SINK.get().is_none() && retry < 10 {
        thread::sleep(Duration::from_millis(50));
        retry += 1;
    }
}

pub fn stop() {
    // 1. Signal any running generator loop to abort immediately
    if let Ok(mut lock) = ACTIVE_ABORT.get_or_init(|| Mutex::new(None)).lock() {
        if let Some(abort) = lock.take() {
            abort.store(true, Ordering::SeqCst);
        }
    }

    // 2. Kill the active synthesis process immediately
    if let Ok(mut lock) = ACTIVE_PROCESS.get_or_init(|| Mutex::new(None)).lock() {
        if let Some(mut child) = lock.take() {
            let _ = child.kill();
        }
    }

    // 3. Clear audio sink
    if let Some(arc_sink) = GLOBAL_SINK.get() {
        if let Ok(sink) = arc_sink.lock() {
            sink.stop();
        }
    }
}

pub fn toggle_pause() {
    if let Some(arc_sink) = GLOBAL_SINK.get() {
        if let Ok(sink) = arc_sink.lock() {
            if sink.is_paused() {
                sink.play();
            } else {
                sink.pause();
            }
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct HighlightPayload {
    pub text: String,
    pub rects: Vec<Rect>,
}

pub fn speak(chunks: Vec<TextChunk>, app: tauri::AppHandle) -> Result<(), String> {
    if chunks.is_empty() {
        return Ok(());
    }

    let total_chars: usize = chunks.iter().map(|c| c.text.len()).sum();
    let usage = usage_tracker::increment_usage(&app, total_chars);
    println!("[Usage] Burned {} chars. Today: {}/{}", total_chars, usage.daily_usage, usage.daily_limit);
    let _ = app.emit("usage-update", usage);


    // Ensure audio singleton is running
    init_audio_backend();
    let sink = GLOBAL_SINK.get().ok_or("Audio hardware not initialized.")?;

    // 1. Clear state
    stop();

    // 2. Register new abort flag
    let abort_flag = Arc::new(AtomicBool::new(false));
    if let Ok(mut lock) = ACTIVE_ABORT.get_or_init(|| Mutex::new(None)).lock() {
        *lock = Some(abort_flag.clone());
    }

    let settings = match get_settings_state().read() {
        Ok(guard) => guard.clone(),
        Err(poisoned) => poisoned.into_inner().clone(),
    };
    
    let base_dir = env::current_dir().map_err(|e| format!("Get current dir failed: {}", e))?;
    
    let total_chunks = chunks.len();
    println!("\n[Sonic Reader] Conveyor Belt engaged: {} chunk(s).", total_chunks);

    // Use a channel to communicate between the synthesizer and the player
    use std::sync::mpsc;
    // Channel carries (audio_data, literal_text, rects, sequence_index)
    let (tx, rx) = mpsc::sync_channel(2); 

    // 4. Synthesizer Thread (Producer)
    let abort_syn = abort_flag.clone();
    let settings_syn = settings.clone();
    let base_dir_syn = base_dir.clone();
    
    thread::spawn(move || {
        let piper_path = base_dir_syn.join("piper_tts").join("piper.exe");
        let model_path = base_dir_syn.join("assets").join("models").join(&settings_syn.voice_model);

        for (i, chunk) in chunks.into_iter().enumerate() {
            if abort_syn.load(Ordering::SeqCst) { break; }

            let sentence = chunk.text.clone();
            
            // Piper TTS crashes on unsupported glyphs, underscores, and raw code symbols.
            // We sanitize the phonetic payload while leaving the UI highlight text ('sentence') intact.
            let phonetic_payload = sentence
                .replace("_", " ")
                .chars()
                .filter(|c| c.is_ascii_alphanumeric() || c.is_whitespace() || ".?!,'\"-".contains(*c))
                .collect::<String>();
            
            if phonetic_payload.trim().is_empty() {
                continue;
            }

            let audio_data = match synthesize_piper(&piper_path, &model_path, &phonetic_payload, settings_syn.speed) {
                Ok(data) => data,
                Err(e) => {
                    eprintln!("[Sonic Reader] Piper synthesis failed: {}", e);
                    continue;
                }
            };

            // Send synthesized data + text + rects to the player
            if tx.send((audio_data, sentence, chunk.rects, i)).is_err() {
                break;
            }
        }
    });

    // 5. Player Thread (Consumer)
    let abort_play = abort_flag.clone();
    let sink_play = sink.clone();
    
    thread::spawn(move || {
        while let Ok((audio_data, text, rects, index)) = rx.recv() {
            if abort_play.load(Ordering::SeqCst) { break; }

            // Timing Sync: wait for sink to be empty (ready for next segment)
            loop {
                if abort_play.load(Ordering::SeqCst) { break; }
                let len = match sink_play.lock() {
                    Ok(s) => s.len(),
                    Err(_) => 0,
                };
                
                if len == 0 {
                    break;
                } else {
                    // Small sleep while waiting for audio segment to finish
                    thread::sleep(Duration::from_millis(10));
                }
            }
            
            if abort_play.load(Ordering::SeqCst) { break; }

            println!("[Sync] Playing sequence {}.", index + 1);
            
            // Update UI highlighter explicitly to the highlighter window
            if let Some(h_window) = app.get_webview_window("highlighter") {
                let text_clone = text.clone();
                let rects_clone = rects.clone();
                println!("[Sync] Emitting payload: text='{}', rects={:?}", text_clone, rects_clone);
                let _ = h_window.emit("highlight-word", HighlightPayload {
                    text: text_clone,
                    rects: rects_clone
                });
            }

            // Feed audio data to the sink
            if let Ok(source) = Decoder::new(Cursor::new(audio_data)) {
                if let Ok(s) = sink_play.lock() {
                    s.append(source);
                    s.set_speed(1.0);
                }
            }
        }
        
        // Final event to clear highlight
        if let Some(h_window) = app.get_webview_window("highlighter") {
            let _ = h_window.emit("highlight-word", HighlightPayload { text: "".into(), rects: vec![] });
        }
        println!("[Sonic Reader] Transmission complete.");
    });

    Ok(())
}

fn synthesize_piper(exe_path: &PathBuf, model_path: &PathBuf, text: &str, speed: f32) -> Result<Vec<u8>, String> {
    let temp_file = NamedTempFile::new().map_err(|e| format!("Failed to create temp file: {}", e))?;
    let temp_path = temp_file.path().to_owned();

    let mut child = Command::new(exe_path)
        .arg("--model")
        .arg(model_path)
        .arg("--length_scale")
        .arg((1.0 / speed).to_string())
        .arg("--output_file")
        .arg(&temp_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        // Avoid flashing command window on Windows
        .creation_flags(0x08000000) // CREATE_NO_WINDOW
        .spawn()
        .map_err(|e| format!("Failed to spawn Piper: {}", e))?;

    {
        let mut stdin = child.stdin.take().ok_or("Failed to open stdin")?;
        stdin.write_all(text.as_bytes()).map_err(|e| e.to_string())?;
    } // stdin goes out of scope and is closed here, signaling EOF to Piper

    // Store handle for potential kill signal
    if let Ok(mut lock) = ACTIVE_PROCESS.get_or_init(|| Mutex::new(None)).lock() {
        *lock = Some(child);
    }

    // Wait for the process to finish
    let child_handle_opt = {
        let mut lock = ACTIVE_PROCESS.get_or_init(|| Mutex::new(None)).lock().unwrap();
        lock.take()
    };
    
    if let Some(mut child_handle) = child_handle_opt {
        let status = child_handle.wait().map_err(|e| e.to_string())?;
        
        if !status.success() {
            return Err("Piper exited with error".into());
        }

        // Read the perfectly formatted WAV file
        let audio_data = std::fs::read(&temp_path).map_err(|e| format!("Failed to read temp WAV: {}", e))?;
        Ok(audio_data)
    } else {
        // Process was killed before we took it back
        Err("Process killed".into())
    }
}

