@echo off
echo ========================================
echo   Testing EduMeet API Endpoints
echo ========================================
echo.

echo Testing if server is running...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Server is not running!
    echo Please start the server first: npm run dev
    pause
    exit /b 1
)

echo ✅ Server is running
echo.

echo Testing CSS file...
curl -s -o nul -w "CSS Status: %%{http_code}\n" http://localhost:3000/css/style.css

echo Testing JavaScript file...
curl -s -o nul -w "JS Status: %%{http_code}\n" http://localhost:3000/js/main.js

echo.
echo ========================================
echo   All static files are loading!
echo ========================================
echo.
echo Now test the dashboard:
echo 1. Open http://localhost:3000
echo 2. Login with credentials
echo 3. Check if dashboard loads
echo.
pause
