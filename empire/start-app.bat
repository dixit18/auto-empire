@echo off
REM Empire OS - one-click live view + never-stop runner
cd /d "%~dp0"
echo Starting orchestrator (auto, keeps working)...
start "Empire Runner" cmd /k python runner\orchestrator.py --auto
echo Starting app server on http://localhost:8080/app/
start "" http://localhost:8080/app/
python -m http.server 8080
