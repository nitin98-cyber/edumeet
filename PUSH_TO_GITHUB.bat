@echo off
echo ========================================
echo Pushing EduMeet to GitHub
echo ========================================
echo.

cd /d C:\xampp\htdocs\EduMeet
git add .
git commit -m "Fix Railway deployment - inline database schema"
git push

echo.
echo ========================================
echo Done! Check Railway for new deployment
echo ========================================
pause
