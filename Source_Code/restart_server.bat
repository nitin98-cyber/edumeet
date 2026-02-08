@echo off
echo Stopping Flask server...
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul

echo Clearing Python cache...
del /s /q __pycache__ 2>nul
del /s /q *.pyc 2>nul

echo Starting Flask server...
python app.py
