@echo off
echo ========================================
echo Railway Database Setup
echo ========================================
echo.
echo Step 1: Login to Railway
echo (Browser will open - login with your Railway account)
echo.
call railway login
echo.
echo Step 2: Link to your project
echo (Select your EduMeet project from the list)
echo.
call railway link
echo.
echo Step 3: Setup database
echo (This will create all tables and add sample data)
echo.
call railway run node setup-railway-db.js
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Now refresh your app and login with:
echo   Email: admin@edumeet.com
echo   Password: admin123
echo.
pause
