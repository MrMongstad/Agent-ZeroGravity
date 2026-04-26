# Jarvis Library Sentinel v1.0
# Objective: Daily backup of prompt library and system memory.
# Frequency: Daily at 23:59 (recommended)

$timestamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$backupDir = "C:\Users\steph\Backups\Jarvis_Library"
$snapshotName = "Library_Snapshot_$timestamp.zip"
$snapshotPath = Join-Path $backupDir $snapshotName
$logFile = "C:\Users\steph\Backups\sentinel_log.txt"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$time] [$Level] $Message"
    
    if ($Level -eq "ERROR") { Write-Error $Message }
    elseif ($Level -eq "WARN") { Write-Warning $Message }
    else { Write-Host $Message }
    
    $logMessage | Out-File -FilePath $logFile -Append
}

# Sources
$sources = @(
    "C:\Users\steph\Desktop\Antigravity and Agent 0\workspace\memory",
    "C:\Users\steph\Desktop\Antigravity and Agent 0\workspace\agents",
    "C:\Users\steph\Desktop\Antigravity and Agent 0\workspace\protocols",
    "C:\Users\steph\Desktop\Antigravity and Agent 0\workspace\skills",
    "C:\Users\steph\Desktop\Antigravity and Agent 0\workspace\WORKSPACE_INDEX.md",
    "C:\Users\steph\.gemini\antigravity\knowledge"
)

Write-Log "--- Jarvis Library Sentinel ---"
Write-Log "Snapshot initiated at $timestamp"

# Create temporary staging area to avoid open file locks
$staging = Join-Path $env:TEMP "Jarvis_Staging_$timestamp"
New-Item -ItemType Directory -Path $staging -Force | Out-Null

foreach ($source in $sources) {
    if (Test-Path $source) {
        $dest = Join-Path $staging (Split-Path $source -Leaf)
        Copy-Item -Path $source -Destination $dest -Recurse -Force -ErrorAction SilentlyContinue
        Write-Log "[OK] Staged: $(Split-Path $source -Leaf)"
    }
    else {
        Write-Log "[MISSING] Source not found: $source" -Level "WARN"
    }
}

# Create Zip Image
if (@(Get-ChildItem $staging).Count -gt 0) {
    if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir -Force | Out-Null }
    Compress-Archive -Path "$staging\*" -DestinationPath $snapshotPath -Force
    Write-Log "[SUCCESS] Image created: $snapshotName"
    
    # Retention: Keep last 14 days
    $oldBackups = Get-ChildItem $backupDir -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -Skip 14
    if ($oldBackups) {
        $oldBackups | Remove-Item -Force
    }
    Write-Log "[CLEANUP] Retention policy enforced (14 days)."
}
else {
    Write-Log "No data found to back up." -Level "ERROR"
}

# Cleanup staging
Remove-Item -Path $staging -Recurse -Force

# Git Snapshot (Local)
Set-Location "C:\Users\steph\Desktop\Antigravity and Agent 0"
if (Test-Path .git) {
    git add .
    git commit -m "Sentinel Snapshot: $timestamp" --allow-empty
    # Tagging might fail if same minute, but that's okay
    git tag -a "snapshot-$timestamp" -m "Daily Sentinel Snapshot" -f
    Write-Log "[GIT] Local snapshot committed and tagged."
}

Write-Log "--- Sentinel Mission Complete ---"
