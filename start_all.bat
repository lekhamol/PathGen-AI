@echo off
echo ==========================================================
echo        Starting AI Career Copilot Ecosystem
echo ==========================================================
echo.
echo 1. Launching Python AI Service (Port 8000)...
start "AI Service [Port 8000]" cmd /k "%~dp0start_ai.bat"

echo 2. Launching Spring Boot Backend (Port 8080)...
start "Spring Boot Backend [Port 8080]" cmd /k "%~dp0start_backend.bat"

echo 3. Launching React Frontend (Port 3000)...
start "React Frontend [Port 3000]" cmd /k "%~dp0start_frontend.bat"

echo.
echo All services have been launched in separate windows!
echo Once ready, access the UI at: http://localhost:3000
echo.
pause
