@echo off
title Night Watch Heartbeat Service
echo [Night Watch] Starting heartbeat service...
echo Monitoring THE_NIGHT_WATCH.md for QUEUED tasks.
python "%~dp0workspace\skills\night_watch_heartbeat.py"
