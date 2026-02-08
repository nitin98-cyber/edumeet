@echo off
echo ========================================
echo Railway Database Setup
echo ========================================
echo.
echo This will initialize your Railway MySQL database
echo with all tables and sample data.
echo.
echo Make sure Railway CLI is installed:
echo   npm install -g @railway/cli
echo.
pause
echo.
echo Logging into Railway...
call railway login
echo.
echo Linking to project...
call railway link
echo.
echo Running database setup...
call railway run node setup-railway-db.js
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next: Deploy your app
echo   git add .
echo   git commit -m "Deploy"
echo   git push railway main
echo.
pause
