@echo off
title EduMeet - Complete Setup
color 0A

echo.
echo ========================================
echo    EduMeet Full Stack - Complete Setup
echo ========================================
echo.

cd /d "%~dp0"

echo [Step 1/5] Installing Node.js dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo [Step 2/5] Stopping any running MySQL...
taskkill /F /IM mysqld.exe >nul 2>&1
timeout /t 2 >nul

echo [Step 3/5] Starting MySQL...
start "" "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini"
echo Waiting for MySQL to start...
timeout /t 10 >nul

echo [Step 4/5] Creating database...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "DROP DATABASE IF EXISTS edumeet_db; CREATE DATABASE edumeet_db;"
if errorlevel 1 (
    echo WARNING: Could not create database. MySQL might not be running.
    echo Please start MySQL manually from XAMPP Control Panel
    pause
)

echo [Step 5/5] Importing database...
"C:\xampp\mysql\bin\mysql.exe" -u root edumeet_db < "..\Database\edumeet_database.sql"
if errorlevel 1 (
    echo WARNING: Could not import database.
    pause
)

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Starting EduMeet server...
echo Open browser: http://localhost:3000
echo.
echo Login credentials:
echo   Admin: admin@edumeet.com / admin123
echo   Faculty: priya.sharma@college.edu / faculty123
echo   Student: rahul.kumar@student.edu / student123
echo.
echo ========================================
echo.

npm start
