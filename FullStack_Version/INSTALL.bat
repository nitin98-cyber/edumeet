@echo off
title EduMeet Full Stack - Installation
color 0A

echo.
echo ========================================
echo    EduMeet Full Stack Installation
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js is NOT installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and install it.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

echo [2/4] Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is NOT installed!
    pause
    exit /b 1
)

echo [OK] npm is installed
npm --version
echo.

echo [3/4] Installing dependencies...
echo This may take a few minutes...
echo.

call npm install

if errorlevel 1 (
    echo.
    echo [ERROR] Installation failed!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo [4/4] Verifying installation...
if exist "node_modules\" (
    echo [OK] Dependencies installed successfully!
) else (
    echo [ERROR] node_modules folder not found!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your MySQL password
echo 2. Make sure MySQL is running
echo 3. Database should already exist from Python version
echo 4. Run START_EDUMEET.bat to start the server
echo.
echo ========================================
echo.

pause
