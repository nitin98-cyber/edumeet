@echo off
cls
echo.
echo  ========================================
echo   EDUMEET - RAILWAY DEPLOYMENT
echo  ========================================
echo.
echo  Your Railway MySQL credentials are configured!
echo.
echo  ========================================
echo   STEP 1: Install Railway CLI
echo  ========================================
echo.
echo  Run: npm install -g @railway/cli
echo.
pause
cls
echo.
echo  ========================================
echo   STEP 2: Setup Database
echo  ========================================
echo.
echo  Logging into Railway...
call railway login
echo.
echo  Linking to your project...
call railway link
echo.
echo  Setting up database...
call railway run node setup-railway-db.js
echo.
echo  ========================================
echo   Database Setup Complete!
echo  ========================================
echo.
pause
cls
echo.
echo  ========================================
echo   STEP 3: Deploy Application
echo  ========================================
echo.
echo  Initializing git...
git init
echo.
echo  Adding files...
git add .
echo.
echo  Committing...
git commit -m "Deploy EduMeet to Railway"
echo.
echo  Deploying to Railway...
call railway up
echo.
echo  ========================================
echo   DEPLOYMENT COMPLETE!
echo  ========================================
echo.
echo  Opening your app...
call railway open
echo.
echo  Login Credentials:
echo  ------------------
echo  Admin: admin@edumeet.com / admin123
echo  Faculty: priya.sharma@college.edu / admin123
echo  Student: rahul.kumar@student.edu / admin123
echo.
echo  ========================================
pause
