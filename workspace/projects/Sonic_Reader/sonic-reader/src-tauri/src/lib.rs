pub mod text_scraper;
pub mod tts;
pub mod usage_tracker;
pub mod global_hook;
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn read_text_under_cursor(app: tauri::AppHandle) -> Result<String, String> {
    let chunks = text_scraper::scrape_text_around_cursor(app.clone()).await?;
    
    if chunks.is_empty() {
        return Err("No tactical text data found under cursor.".into());
    }

    let full_text = chunks.iter().map(|c| c.text.clone()).collect::<Vec<_>>().join("\n");
    
    // Pass control to the neural audio engine
    tts::speak(chunks, app)?;
    
    Ok(full_text)
}

#[tauri::command]
fn get_settings() -> tts::TtsSettings {
    match tts::get_settings_state().read() {
        Ok(guard) => guard.clone(),
        Err(poisoned) => poisoned.into_inner().clone(),
    }
}

#[tauri::command]
fn set_settings(new_settings: tts::TtsSettings) {
    if let Ok(mut lock) = tts::get_settings_state().write() {
        *lock = new_settings;
    }
}

#[tauri::command]
fn get_available_voices() -> Vec<String> {
    let mut voices = Vec::new();
    if let Ok(base_dir) = std::env::current_dir() {
        let models_dir = base_dir.join("assets").join("models");
        if let Ok(entries) = std::fs::read_dir(models_dir) {
            for entry in entries.flatten() {
                if let Some(name) = entry.file_name().to_str() {
                    if name.ends_with(".onnx") {
                        voices.push(name.to_string());
                    }
                }
            }
        }
    }
    voices
}

#[tauri::command]
fn get_usage(app: tauri::AppHandle) -> usage_tracker::UsageData {
    usage_tracker::load_usage(&app)
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    use tauri::menu::{Menu, MenuItem};
    use tauri::tray::{MouseButton, TrayIconBuilder, TrayIconEvent};
    use tauri::Manager;
    use tauri_plugin_global_shortcut::{Code, ShortcutState};

    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new()
            .with_handler(|app, shortcut, event| {
                if event.state() == ShortcutState::Pressed {
                    if shortcut.key == Code::KeyS {
                        println!("Hotkey -> STOP");
                        crate::tts::stop();
                    } else if shortcut.key == Code::Space {
                        println!("Hotkey -> PAUSE/RESUME");
                        crate::tts::toggle_pause();
                    }
                }
            })
            .build()
        )
        .setup(|app| {
            let app_handle = app.handle().clone();
            
            // Spawn the custom global rdev hook instead
            global_hook::spawn_global_hook(app_handle.clone());
            
            // Warm up audio hardware
            tts::init_audio_backend();

            // --- System Tray (Ghost Protocol) Setup ---
            let show_i = MenuItem::with_id(app, "show", "Show Dashboard", true, None::<&str>)?;
            let pause_i = MenuItem::with_id(app, "pause", "Pause / Resume", true, None::<&str>)?;
            let stop_i = MenuItem::with_id(app, "stop", "Stop Reading", true, None::<&str>)?;
            let separator = tauri::menu::PredefinedMenuItem::separator(app)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quit SonicReader", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &pause_i, &stop_i, &separator, &quit_i])?;

            let tray_builder = TrayIconBuilder::new()
                .tooltip("SonicReader")
                .menu(&menu);

            let tray_builder = if let Some(icon) = app.default_window_icon() {
                tray_builder.icon(icon.clone())
            } else {
                tray_builder
            };

            let _tray = tray_builder
                .on_menu_event(|app, event| {
                    match event.id().as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "pause" => tts::toggle_pause(),
                        "stop" => tts::stop(),
                        "quit" => app.exit(0),
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: tauri::tray::MouseButtonState::Up,
                        ..
                    } = event {
                        let app_handle = tray.app_handle();
                        if let Some(window) = app_handle.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            // --- Global Hotkey (Cleanup/Legacy) ---
            // Note: We no longer register global shortcuts via Tauri because it causes 
            // panics if zombie processes are still running.
            // Everything is now unified in src/global_hook.rs using rdev!
            
            // let ctrl_shift_s = Shortcut::new(Some(Modifiers::CONTROL | Modifiers::ALT), Code::KeyS);
            // let ctrl_shift_spc = Shortcut::new(Some(Modifiers::CONTROL | Modifiers::ALT), Code::Space);
            // let _ = app.global_shortcut().register(ctrl_shift_s);
            // let _ = app.global_shortcut().register(ctrl_shift_spc);
            
            // --- Highlighter Window Config ---
            if let Some(h_window) = app.get_webview_window("highlighter") {
                let _ = h_window.set_ignore_cursor_events(true);
                
                // Explicitly set to primary monitor size to ensure 1:1 coords
                if let Ok(Some(monitor)) = h_window.primary_monitor() {
                    let size = monitor.size();
                    let _ = h_window.set_size(tauri::Size::Physical(size.clone()));
                    let _ = h_window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x: 0, y: 0 }));
                } else {
                    let _ = h_window.maximize();
                }
                
                let _ = h_window.show();
            }

            println!("SonicReader Boot Sequence complete. Ghost Protocol activated.");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet, 
            read_text_under_cursor,
            get_settings,
            set_settings,
            get_available_voices,
            get_usage
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
