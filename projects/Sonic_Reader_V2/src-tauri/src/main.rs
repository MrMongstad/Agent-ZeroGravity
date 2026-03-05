// Sonic Reader V2 — Main Entry Point
// Binds all IPC commands and assembles the Tauri runtime.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod scraper;
mod text_sanitizer;
mod process_manager;
mod tts;

use tauri::Manager;

// ──── IPC Commands ────

#[tauri::command]
async fn trigger_scrape(app: tauri::AppHandle) -> Result<Vec<tts::TextChunk>, String> {
    // Delegate to the scraper engine
    let automation = uiautomation::UIAutomation::new()
        .map_err(|e| format!("UIA init error: {:?}", e))?;
    
    let mut pt = windows::Win32::Foundation::POINT { x: 0, y: 0 };
    unsafe {
        windows::Win32::UI::WindowsAndMessaging::GetCursorPos(&mut pt)
            .map_err(|e| format!("Cursor error: {:?}", e))?;
    }
    let search_point = uiautomation::types::Point::new(pt.x, pt.y);

    // Use V2 scraper with Chrome Legacy bypass
    let element = scraper::find_content_container(&automation, search_point)?;

    // Extract text from the resolved element
    use uiautomation::patterns::UITextPattern;
    if let Ok(pattern) = element.get_pattern::<UITextPattern>() {
        if let Ok(doc_range) = pattern.get_document_range() {
            if let Ok(text) = doc_range.get_text(-1) {
                if !text.trim().is_empty() {
                    let rect = element.get_bounding_rectangle()
                        .map(|r| tts::Rect {
                            x: r.get_left() as f64,
                            y: r.get_top() as f64,
                            width: r.get_width() as f64,
                            height: r.get_height() as f64,
                        })
                        .unwrap_or(tts::Rect { x: 0.0, y: 0.0, width: 100.0, height: 20.0 });

                    return Ok(vec![tts::TextChunk {
                        text,
                        rects: vec![rect],
                    }]);
                }
            }
        }
    }

    Err("No readable text found at cursor position.".to_string())
}

#[tauri::command]
fn start_reading(chunks: Vec<tts::TextChunk>, app: tauri::AppHandle) -> Result<(), String> {
    tts::speak(chunks, app)
}

#[tauri::command]
fn stop_reading() {
    tts::stop();
}

#[tauri::command]
fn toggle_pause() {
    tts::toggle_pause();
}

#[tauri::command]
fn sanitize_text(raw: String) -> String {
    text_sanitizer::sanitize_for_tts(&raw)
}

// ──── App Entry ────

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Initialize audio backend early
            tts::init_audio_backend();

            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }

            // Register window close handler for process cleanup
            let main_window = app.get_webview_window("main").unwrap();
            main_window.on_window_event(move |event| {
                if let tauri::WindowEvent::CloseRequested { .. } = event {
                    println!("[SonicV2] Window close detected. Killing all children.");
                    process_manager::kill_all();
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            trigger_scrape,
            start_reading,
            stop_reading,
            toggle_pause,
            sanitize_text,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Sonic Reader V2");
}
