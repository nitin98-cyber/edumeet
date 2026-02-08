@echo off
echo ========================================
echo   DELETE ALL DEMO DATA
echo ========================================
echo.
echo WARNING: This will delete:
echo - All appointments
echo - All time slots
echo - All notifications
echo - All demo students and faculty
echo.
echo Admin account will be preserved:
echo   Email: admin@edumeet.com
echo   Password: admin123
echo.
echo ========================================
echo.
set /p confirm="Are you sure? Type YES to continue: "

if /i "%confirm%" NEQ "YES" (
    echo.
    echo Cancelled. No data was deleted.
    pause
    exit /b
)

echo.
echo Deleting demo data...
echo.

cd /d "%~dp0"
node delete_demo_data.js

echo.
echo ========================================
echo   Done!
echo ========================================
echo.
echo You can now:
echo 1. Login as admin
echo 2. Add real students and faculty
echo 3. Start using the system
echo.
pause
