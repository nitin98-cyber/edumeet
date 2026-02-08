@echo off
title EduMeet Full Stack - Startup
color 0A

echo.
echo ========================================
echo    EduMeet Full Stack JavaScript
echo    Starting Server...
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!

echo.
echo [2/3] Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed!
)

echo.
echo [3/3] Starting EduMeet server...
echo.
echo ========================================
echo    Server will start on port 3000
echo    Open: http://localhost:3000
echo ========================================
echo.

npm start

pause
