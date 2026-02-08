@echo off
echo ========================================
echo   Adding Sample Data to EduMeet
echo ========================================
echo.

cd /d "%~dp0"

echo This will add:
echo - 21 time slots (7 days x 3 slots)
echo - 5 sample appointments
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo Adding sample data...
node add_sample_data.js

echo.
echo ========================================
echo   Done!
echo ========================================
echo.
echo Now login and see your populated dashboard:
echo http://localhost:3000
echo.
pause
