# bridge_watchdog.ps1 — Reliability Sentinel
# Created: 2026-03-30
# Purpose: Ensures the A2A Bridge remains active even after failures or manual stops.

$STATE_FILE = "workspace/state.json"
$BRIDGE_SCRIPT = "workspace/skills/bridge_executor.py"
$CHECK_INTERVAL = 30 # seconds
$MAX_RESTARTS = 10
$restart_count = 0

Write-Host "──────────────────────────────────────────────────────────" -ForegroundColor Cyan
Write-Host "  ANTIGRAVITY BRIDGE WATCHDOG : ACTIVATED                " -ForegroundColor Cyan
Write-Host "──────────────────────────────────────────────────────────" -ForegroundColor Cyan

function Get-Heartbeat {
    if (Test-Path $STATE_FILE) {
        $state = Get-Content $STATE_FILE | ConvertFrom-Json
        return $state.heartbeat_count
    }
    return 0
}

$last_heartbeat = Get-Heartbeat

while ($true) {
    $current_heartbeat = Get-Heartbeat
    
    # If heartbeat hasn't moved, or process is not found
    $bridge_proc = Get-Process | Where-Object { $_.CommandLine -like "*$BRIDGE_SCRIPT*" }
    
    if (-not $bridge_proc -or ($current_heartbeat -eq $last_heartbeat)) {
        if ($restart_count -lt $MAX_RESTARTS) {
            Write-Host "[!] Restarting Stalled Bridge (Attempt $($restart_count + 1))..." -ForegroundColor Yellow
            if ($bridge_proc) { Stop-Process -Id $bridge_proc.Id -Force }
            
            # Start the bridge in the background
            Start-Process python -ArgumentList $BRIDGE_SCRIPT -NoNewWindow
            $restart_count++
            # Reset heartbeat tracking to give it time to start
            Start-Sleep -Seconds 10
            $last_heartbeat = Get-Heartbeat
        } else {
            Write-Host "[FATAL] Max restart attempts reached. Manual intervention required." -ForegroundColor Red
            break
        }
    } else {
        # Bridge is healthy
        if ($restart_count -gt 0) { $restart_count = 0 } # Reset counter on healthy streak
        Write-Host "[+] Bridge Sentinel: Healthy (Heartbeat: $current_heartbeat)" -ForegroundColor Green
        $last_heartbeat = $current_heartbeat
    }
    
    Start-Sleep -Seconds $CHECK_INTERVAL
}
