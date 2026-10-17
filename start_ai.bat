@echo off
echo Starting AI Career Copilot - Python AI Service on port 8000...
cd /d "%~dp0ai-service"
call .\venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
