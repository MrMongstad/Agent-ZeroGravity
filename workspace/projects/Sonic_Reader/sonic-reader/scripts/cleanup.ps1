$ErrorActionPreference = "SilentlyContinue"

# Kill anything on the TTS port
Get-NetTCPConnection -LocalPort 1425 | ForEach-Object { 
    Write-Host "Cleaning up process on port 1425 (PID: $($_.OwningProcess))"
    Stop-Process -Id $_.OwningProcess -Force 
}

# Kill any ghost instances of the app
Get-Process -Name "sonic-reader" | ForEach-Object {
    Write-Host "Terminating ghost instance: $($_.ProcessName)"
    Stop-Process -Id $_.Id -Force
}

exit 0
