# Log Maintenance & Rotation (PowerShell)
# Automates rotation of error logs and archiving of stale JSONL sentinel traces.

$BaseDir = "c:\Users\steph\Desktop\Antigravity and Agent 0"
$LogsDir = Join-Path $BaseDir "workspace\memory\logs"
$VaultDir = Join-Path $LogsDir "vault"
$ArchiveDir = Join-Path $VaultDir "archive"

# Ensure archive exists
if (-not (Test-Path $ArchiveDir)) { New-Item -ItemType Directory -Path $ArchiveDir -Force }

function Rotate-Log($FilePath, $MaxEntries = 5) {
    if (Test-Path $FilePath) {
        $Size = (Get-Item $FilePath).Length
        if ($Size -gt 1MB) { # Rotate if larger than 1MB
            $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
            $BackupPath = "$FilePath.$Timestamp.bak"
            Move-Item -Path $FilePath -Destination $BackupPath -Force
            # Keep only the last $MaxEntries backups
            $Backups = Get-ChildItem "$FilePath.*.bak" | Sort-Object LastWriteTime -Descending
            if ($Backups.Count -gt $MaxEntries) {
                $Backups | Select-Object -Skip $MaxEntries | Remove-Item -Force
            }
            Write-Host "Rotated log: $FilePath"
        }
    }
}

# 1. Rotate standard logs
Rotate-Log (Join-Path $BaseDir "error_utf8.log")
Rotate-Log (Join-Path $LogsDir "error.log")
Rotate-Log (Join-Path $LogsDir "night_watch.log")

# 2. Archive sentinel logs older than 7 days
if (Test-Path $VaultDir) {
    $OldSentinels = Get-ChildItem -Path $VaultDir -Filter "sentinel_*.jsonl" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }
    foreach ($File in $OldSentinels) {
        Move-Item -Path $File.FullName -Destination (Join-Path $ArchiveDir $File.Name) -Force
        Write-Host "Archived stale sentinel: $($File.Name)"
    }
}

Write-Output "Log maintenance complete."
