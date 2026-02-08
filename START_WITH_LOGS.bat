@echo off
title EduMeet Server with Error Logging
color 0A

echo ========================================
echo   Starting EduMeet with Error Logging
echo ========================================
echo.

cd Source_Code

echo Starting server...
echo If you see errors, they will be shown below:
echo.

python app.py 2>&1

echo.
echo ========================================
echo Server stopped. Press any key to exit.
pause >nul
