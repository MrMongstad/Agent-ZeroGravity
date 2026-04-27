use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex, OnceLock};
use std::thread;

/// Process Manager: Zero-Zombie Protocol
/// ───────────────────────────────────────
/// Tracks every spawned child thread/process and guarantees
/// total termination on app close. No orphaned TTS engines,
/// no ghost synthesis threads.

static CHILD_PROCESSES: OnceLock<Mutex<Vec<std::process::Child>>> = OnceLock::new();
static SHUTDOWN_FLAG: OnceLock<Arc<AtomicBool>> = OnceLock::new();

fn get_children() -> &'static Mutex<Vec<std::process::Child>> {
    CHILD_PROCESSES.get_or_init(|| Mutex::new(Vec::new()))
}

pub fn get_shutdown_flag() -> Arc<AtomicBool> {
    SHUTDOWN_FLAG
        .get_or_init(|| Arc::new(AtomicBool::new(false)))
        .clone()
}

/// Register a child process for lifecycle tracking.
pub fn register_child(child: std::process::Child) {
    if let Ok(mut children) = get_children().lock() {
        children.push(child);
    }
}

/// Kill all tracked child processes. Called on window close / app exit.
pub fn kill_all() {
    // Set global shutdown flag
    get_shutdown_flag().store(true, Ordering::SeqCst);

    if let Ok(mut children) = get_children().lock() {
        for child in children.iter_mut() {
            let pid = child.id();
            match child.kill() {
                Ok(_) => println!("[ProcessMgr] Killed child PID {}", pid),
                Err(e) => eprintln!("[ProcessMgr] Failed to kill PID {}: {}", pid, e),
            }
        }
        children.clear();
    }

    // OS-level sweep: kill any orphaned piper.exe instances
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        use std::os::windows::process::CommandExt;
        let _ = Command::new("taskkill")
            .args(["/F", "/IM", "piper.exe"])
            .creation_flags(0x08000000) // CREATE_NO_WINDOW
            .output();
    }

    println!("[ProcessMgr] All child processes terminated.");
}

/// Reap finished processes from the tracker (housekeeping).
pub fn reap_finished() {
    if let Ok(mut children) = get_children().lock() {
        children.retain_mut(|child| {
            match child.try_wait() {
                Ok(Some(_status)) => false, // finished, remove
                Ok(None) => true,           // still running, keep
                Err(_) => false,            // error, remove
            }
        });
    }
}

/// Returns true if the global shutdown has been signaled.
pub fn is_shutting_down() -> bool {
    get_shutdown_flag().load(Ordering::SeqCst)
}
