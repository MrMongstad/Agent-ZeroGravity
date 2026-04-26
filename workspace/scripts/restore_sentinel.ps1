# Jarvis Library Restore v1.0
# Objective: Restores the latest daily backup of the prompt library and system memory.

$backupDir = "C:\Users\steph\Backups\Jarvis_Library"
$baseWorkspace = "C:\Users\steph\Desktop\Antigravity and Agent 0\workspace"
$knowledgeDir = "C:\Users\steph\.gemini\antigravity\knowledge"

Write-Host "--- Jarvis Library Restore ---" -ForegroundColor Cyan

# 1. Find the latest backup
if (-not (Test-Path $backupDir)) {
    Write-Error "Backup directory not found: $backupDir"
    exit
}

$recentBackups = @(Get-ChildItem -Path $backupDir -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 5)

if ($recentBackups.Count -eq 0) {
    Write-Error "No snapshots found in $backupDir"
    exit
}

Write-Host "Recent snapshots available for restore:" -ForegroundColor Green
for ($i = 0; $i -lt $recentBackups.Count; $i++) {
    Write-Host "[$($i + 1)] $($recentBackups[$i].Name) ($($recentBackups[$i].LastWriteTime))"
}
Write-Host "[0] Cancel"

$selection = Read-Host "Select a snapshot to restore (0-$($recentBackups.Count))"
$choice = $selection -as [int]

if ($null -eq $choice -or $choice -lt 0 -or $choice -gt $recentBackups.Count) {
    Write-Warning "Invalid selection. Exiting."
    exit
}

if ($choice -eq 0) {
    Write-Host "Restore cancelled by user." -ForegroundColor Yellow
    exit
}

$selectedBackup = $recentBackups[$choice - 1]

# 2. Confirm restoration
$title = "Confirm Restore"
$message = "DESTRUCTIVE RESTORE: Are you sure you want to completely wipe and replace your current workspace folders with the snapshot from $($selectedBackup.LastWriteTime)? Any new files created since then will be completely lost. This cannot be undone."
$yes = New-Object System.Management.Automation.Host.ChoiceDescription "&Yes", "Restores the backup."
$no = New-Object System.Management.Automation.Host.ChoiceDescription "&No", "Cancels the operation."
$options = [System.Management.Automation.Host.ChoiceDescription[]]($yes, $no)
$result = $host.ui.PromptForChoice($title, $message, $options, 1)

if ($result -ne 0) {
    Write-Host "Restore cancelled by user." -ForegroundColor Yellow
    exit
}

Write-Host "Proceeding with restore..."

# 3. Extract to staging
$staging = Join-Path $env:TEMP "Jarvis_Restore_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $staging -Force | Out-Null

Write-Host "Extracting snapshot..."
Expand-Archive -Path $selectedBackup.FullName -DestinationPath $staging -Force

# 4. Map and Restore
$restoreMap = @{
    "memory"             = Join-Path $baseWorkspace "memory"
    "agents"             = Join-Path $baseWorkspace "agents"
    "protocols"          = Join-Path $baseWorkspace "protocols"
    "skills"             = Join-Path $baseWorkspace "skills"
    "WORKSPACE_INDEX.md" = Join-Path $baseWorkspace "WORKSPACE_INDEX.md"
    "knowledge"          = $knowledgeDir
}

foreach ($item in Get-ChildItem -Path $staging) {
    $itemName = $item.Name
    if ($restoreMap.ContainsKey($itemName)) {
        $destPath = $restoreMap[$itemName]
        Write-Host "Restoring $itemName -> $destPath"
        if (Test-Path $destPath) {
            Remove-Item -Path $destPath -Recurse -Force
        }
        Copy-Item -Path $item.FullName -Destination $destPath -Recurse -Force
    }
    else {
        Write-Warning "Unknown item in backup: $itemName. Skipping."
    }
}

# 5. Cleanup
Remove-Item -Path $staging -Recurse -Force
Write-Host "--- Restore Complete ---" -ForegroundColor Green