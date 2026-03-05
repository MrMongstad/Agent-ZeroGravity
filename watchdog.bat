@echo off
title Agent Zero Watchdog
echo [Watchdog] Monitoring Agent Zero...

:loop
python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health', timeout=5)" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [%date% %time%] Agent Zero is DOWN. Restarting...
    cd /d "%~dp0agent_zero"
    start /min "" python run_ui.py
    timeout /t 15 /nobreak >nul
) else (
    echo [%date% %time%] Agent Zero: OK
)
timeout /t 60 /nobreak >nul
goto loop
