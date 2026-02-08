@echo off
echo ========================================
echo Restarting EduMeet Server
echo ========================================
echo.

cd /d "%~dp0"

echo Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul

echo.
echo Starting server...
echo.

node server.js

pause
