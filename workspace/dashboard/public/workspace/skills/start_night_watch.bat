@echo off
title Night Watch Heartbeat Service
echo [Night Watch] Starting heartbeat service...
echo Monitoring workspace\protocols\night_watch.md for QUEUED tasks.
python "%~dp0night_watch_heartbeat.py"
