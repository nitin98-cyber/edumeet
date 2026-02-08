@echo off
echo ========================================
echo   EduMeet - Flask Server Restart
echo ========================================
echo.

echo [1/4] Stopping Flask server...
taskkill /F /IM python.exe 2>nul
if %errorlevel% == 0 (
    echo ✓ Server stopped
) else (
    echo ℹ No running server found
)
timeout /t 2 /nobreak >nul

echo.
echo [2/4] Clearing Python cache...
cd Source_Code
del /s /q __pycache__ 2>nul
del /s /q *.pyc 2>nul
echo ✓ Cache cleared

echo.
echo [3/4] Starting Flask server...
echo ✓ Server starting on http://localhost:5000
echo.
echo ========================================
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

python app.py
