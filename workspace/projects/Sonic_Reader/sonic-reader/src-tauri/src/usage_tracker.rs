use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use chrono::{Datelike, Local};
use tauri::{AppHandle, Manager};

#[derive(Serialize, Deserialize, Default, Clone)]
pub struct UsageData {
    pub daily_limit: usize,
    pub daily_usage: usize,
    pub last_date: String, // YYYY-MM-DD
}

pub fn get_usage_file_path(app: &AppHandle) -> PathBuf {
    // Better to use AppData directory, so it works in production
    let mut path = app.path().app_data_dir().unwrap_or_else(|_| std::env::current_dir().unwrap_or_default());
    
    // Ensure the directory exists
    if !path.exists() {
        let _ = fs::create_dir_all(&path);
    }
    
    path.push("usage_stats.json");
    path
}

pub fn load_usage(app: &AppHandle) -> UsageData {
    let path = get_usage_file_path(app);
    if let Ok(content) = fs::read_to_string(&path) {
        if let Ok(mut data) = serde_json::from_str::<UsageData>(&content) {
            let today = today_string();
            if data.last_date != today {
                // Reset daily usage on new day
                data.daily_usage = 0;
                data.last_date = today;
                let _ = save_usage(app, &data);
            }
            return data;
        }
    }
    
    // Default fallback
    let data = UsageData {
        daily_limit: 50000,
        daily_usage: 0,
        last_date: today_string(),
    };
    
    // Create the file so the tracker is physically persisted immediately
    let _ = save_usage(app, &data);
    data
}

pub fn save_usage(app: &AppHandle, data: &UsageData) -> Result<(), String> {
    let path = get_usage_file_path(app);
    let content = serde_json::to_string_pretty(data).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}

fn today_string() -> String {
    let now = Local::now();
    format!("{}-{:02}-{:02}", now.year(), now.month(), now.day())
}

pub fn increment_usage(app: &AppHandle, chars: usize) -> UsageData {
    let mut data = load_usage(app);
    data.daily_usage += chars;
    let _ = save_usage(app, &data);
    data
}
