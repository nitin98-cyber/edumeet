@echo off
title EduMeet Flask Server
color 0A
echo ========================================
echo   EduMeet - Starting Flask Server
echo ========================================
echo.
echo Server will start on: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd Source_Code
python app.py

pause
