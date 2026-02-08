@echo off
echo ========================================
echo Push Database Setup Route to Railway
echo ========================================
echo.
echo Adding files...
git add .
echo.
echo Committing...
git commit -m "Add database setup route"
echo.
echo Pushing to Railway...
git push
echo.
echo ========================================
echo Update Pushed!
echo ========================================
echo.
echo Wait 1-2 minutes for Railway to redeploy
echo.
echo Then visit: YOUR_APP_URL/setup-database
echo.
echo This will create all tables automatically!
echo.
pause
