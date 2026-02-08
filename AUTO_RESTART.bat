@echo off
title Auto Restart EduMeet Server
color 0C

echo.
echo ╔════════════════════════════════════════╗
echo ║     AUTO RESTART - EduMeet Server      ║
echo ╚════════════════════════════════════════╝
echo.

echo [1/3] Killing all Python processes...
taskkill /F /IM python.exe /T >nul 2>&1
taskkill /F /IM pythonw.exe /T >nul 2>&1
echo       ✓ All Python processes stopped

timeout /t 2 /nobreak >nul

echo.
echo [2/3] Clearing cache...
cd Source_Code
if exist __pycache__ rmdir /s /q __pycache__ >nul 2>&1
del /s /q *.pyc >nul 2>&1
echo       ✓ Cache cleared

echo.
echo [3/3] Starting server...
echo.
echo ════════════════════════════════════════
echo   Server URL: http://localhost:5000
echo   Notification system is ACTIVE
echo   Press Ctrl+C to stop
echo ════════════════════════════════════════
echo.

color 0A
python app.py
