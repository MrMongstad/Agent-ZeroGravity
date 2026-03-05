@echo off
title Agent Zero Launcher
echo ============================================
echo   Agent Zero - Autonomous Overnight System
echo ============================================
echo.

:: Check Docker
echo [1/4] Checking Docker...
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] Docker not running. Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo     Waiting 30s for Docker to initialize...
    timeout /t 30 /nobreak >nul
    docker info >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [X] Docker failed to start. Please start it manually.
        pause
        exit /b 1
    )
)
echo     Docker OK.

:: Check Python deps
echo [2/4] Checking Python dependencies...
cd /d "%~dp0agent_zero"
pip show litellm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo     Installing dependencies...
    pip install -r requirements.txt
)
echo     Dependencies OK.

:: Create reports directory
echo [3/4] Ensuring reports directory...
if not exist "usr\reports" mkdir "usr\reports"
echo     Reports directory OK.

:: Launch Agent Zero
echo [4/4] Launching Agent Zero...
echo.
echo   Web UI: http://localhost:5000
echo   Reports: %~dp0agent_zero\usr\reports\
echo   Wishlist: %~dp0WISHLIST.md
echo.
echo   Agent Zero is running. Close this window to stop.
echo ============================================

python run_ui.py
