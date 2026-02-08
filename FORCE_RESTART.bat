@echo off
echo ========================================
echo   FORCE RESTART - Clearing All Caches
echo ========================================
echo.

echo [1] Killing all Python processes...
taskkill /F /IM python.exe /T 2>nul
taskkill /F /IM pythonw.exe /T 2>nul
timeout /t 2 /nobreak >nul
echo Done!

echo.
echo [2] Clearing Python cache files...
cd Source_Code
if exist __pycache__ rmdir /s /q __pycache__
if exist templates\__pycache__ rmdir /s /q templates\__pycache__
del /s /q *.pyc 2>nul
echo Done!

echo.
echo [3] Clearing Flask cache...
set FLASK_ENV=development
set TEMPLATES_AUTO_RELOAD=True
echo Done!

echo.
echo [4] Starting Flask server...
echo.
echo ========================================
echo   Server starting on http://localhost:5000
echo   Press Ctrl+C to stop
echo ========================================
echo.

python app.py
