@echo off
echo ========================================
echo   EduMeet - Database Setup
echo ========================================
echo.

echo [1/4] Stopping MySQL if running...
taskkill /F /IM mysqld.exe >nul 2>&1
timeout /t 2 >nul

echo [2/4] Starting MySQL...
start "" "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini"
timeout /t 10

echo [3/4] Creating database and importing data...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "DROP DATABASE IF EXISTS edumeet_db; CREATE DATABASE edumeet_db;"
"C:\xampp\mysql\bin\mysql.exe" -u root edumeet_db < "..\Database\edumeet_database.sql"

echo [4/4] Database setup complete!
echo.
echo ========================================
echo   Database: edumeet_db
echo   Status: Ready
echo ========================================
echo.
echo Now run: npm start
echo.
pause
