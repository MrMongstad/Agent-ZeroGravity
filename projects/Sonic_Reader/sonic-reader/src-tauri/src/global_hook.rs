use lazy_static::lazy_static;
use rdev::{listen, Event, EventType, Key};
use std::sync::Mutex;
use std::time::{Duration, Instant};
use tauri::AppHandle;

lazy_static! {
    static ref LAST_SHIFT_PRESS: Mutex<Option<Instant>> = Mutex::new(None);
    static ref SHIFT_DOUBLE_TAPPED: Mutex<bool> = Mutex::new(false);
    static ref LAST_ESC_PRESS: Mutex<Option<Instant>> = Mutex::new(None);
    static ref LAST_SPACE_PRESS: Mutex<Option<Instant>> = Mutex::new(None);
}

const DOUBLE_TAP_TIMEOUT: Duration = Duration::from_millis(400);

pub fn spawn_global_hook(app_handle: AppHandle) {
    std::thread::spawn(move || {
        if let Err(error) = listen(move |event| callback(event, app_handle.clone())) {
            println!("Error listening to global events: {:?}", error);
        }
    });
}

fn callback(event: Event, app_handle: AppHandle) {
    match event.event_type {
        EventType::KeyPress(key) => {
            let now = Instant::now();
            
            // Check for Shift Double-Tap (Scrape Trigger)
            if key == Key::ShiftLeft || key == Key::ShiftRight {
                let mut last_press = LAST_SHIFT_PRESS.lock().unwrap();
                if let Some(last) = *last_press {
                    if now.duration_since(last) < DOUBLE_TAP_TIMEOUT {
                        let mut double_tapped = SHIFT_DOUBLE_TAPPED.lock().unwrap();
                        *double_tapped = true;
                        println!("Shift Double-Tapped. Waiting for click...");
                        *last_press = None;
                        return;
                    }
                }
                *last_press = Some(now);
            } 
            // Check for ESC Double-Tap (STOP)
            else if key == Key::Escape {
                let mut last_press = LAST_ESC_PRESS.lock().unwrap();
                if let Some(last) = *last_press {
                    if now.duration_since(last) < DOUBLE_TAP_TIMEOUT {
                        println!("ESC Double-Tapped -> STOP.");
                        crate::tts::stop();
                        *last_press = None;
                        return;
                    }
                }
                *last_press = Some(now);
                
                // Also reset shift state on escape
                if let Ok(mut double_tapped) = SHIFT_DOUBLE_TAPPED.lock() {
                    *double_tapped = false;
                }
            }
            // 3. Space Double-Tap (Pause/Resume)
            // Note: This only works if space is tapped twice quickly. 
            // Regular space typing is preserved.
            else if key == Key::Space {
                let mut last_press = LAST_SPACE_PRESS.lock().unwrap();
                if let Some(last) = *last_press {
                    if now.duration_since(last) < DOUBLE_TAP_TIMEOUT {
                        println!("Space Double-Tapped -> PAUSE/RESUME.");
                        crate::tts::toggle_pause();
                        *last_press = None;
                        return;
                    }
                }
                *last_press = Some(now);
            }
            else {
                // If they press any other key, cancel the double tap state
                if let Ok(mut double_tapped) = SHIFT_DOUBLE_TAPPED.lock() {
                    *double_tapped = false;
                }
            }
        }
        EventType::ButtonPress(rdev::Button::Left) => {
            let mut double_tapped = SHIFT_DOUBLE_TAPPED.lock().unwrap();
            if *double_tapped {
                println!("Shift(x2) + Left Click Triggered -> Scraping Text...");
                *double_tapped = false; // Consume the trigger

                let app = app_handle.clone();
                tauri::async_runtime::spawn(async move {
                    trigger_scrape(app).await;
                });
            }
        }
        _ => {}
    }
}

async fn trigger_scrape(app_handle: AppHandle) {
    use crate::text_scraper;
    use crate::tts;
    use tauri::Manager;
    use tauri_plugin_notification::NotificationExt;

    // 1. Move highlighter window to the active monitor before reading
    if let Some(h_window) = app_handle.get_webview_window("highlighter") {
        let mut pt = windows::Win32::Foundation::POINT { x: 0, y: 0 };
        unsafe {
            let _ = windows::Win32::UI::WindowsAndMessaging::GetCursorPos(&mut pt);
        }
        
        if let Ok(monitors) = h_window.available_monitors() {
            for monitor in monitors {
                let pos = monitor.position();
                let size = monitor.size();
                let l = pos.x;
                let t = pos.y;
                let r = l + size.width as i32;
                let b = t + size.height as i32;
                
                if pt.x >= l && pt.x <= r && pt.y >= t && pt.y <= b {
                    let _ = h_window.set_position(tauri::Position::Physical(pos.clone()));
                    let _ = h_window.set_size(tauri::Size::Physical(size.clone()));
                    let _ = h_window.show();
                    break;
                }
            }
        }
    }

    let _ = app_handle.notification()
        .builder()
        .title("SonicReader")
        .body("Scraping Text...")
        .show();
        
    match text_scraper::scrape_text_around_cursor(app_handle.clone()).await {
        Ok(chunks) => {
            println!("Hook Target Text: {} chunk(s)", chunks.len());
            let _ = tts::speak(chunks, app_handle);
        }
        Err(e) => println!("Hook UIA Error: {}", e),
    }
}
