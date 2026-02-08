@echo off
title EduMeet Server
color 0A
cls

echo.
echo  ╔════════════════════════════════════════╗
echo  ║         EduMeet Server Starter         ║
echo  ╚════════════════════════════════════════╝
echo.

REM Kill any existing Python processes
echo [1/3] Stopping any running servers...
taskkill /F /IM python.exe /T >nul 2>&1
timeout /t 1 /nobreak >nul
echo       ✓ Done

REM Navigate to Source_Code directory
echo.
echo [2/3] Preparing environment...
cd /d "%~dp0Source_Code"
if not exist app.py (
    echo       ✗ ERROR: app.py not found!
    echo       Make sure you're in the correct directory.
    pause
    exit /b 1
)
echo       ✓ Done

REM Start the server
echo.
echo [3/3] Starting Flask server...
echo.
echo  ════════════════════════════════════════
echo   Server URL: http://localhost:5000
echo   Press Ctrl+C to stop the server
echo  ════════════════════════════════════════
echo.

python app.py

REM If server stops, show message
echo.
echo  ════════════════════════════════════════
echo   Server stopped
echo  ════════════════════════════════════════
echo.
pause
