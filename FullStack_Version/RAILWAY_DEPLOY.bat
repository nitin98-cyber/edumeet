@echo off
echo ========================================
echo Railway Deployment Setup
echo ========================================
echo.
echo Step 1: Install dependencies
call npm install
echo.
echo Step 2: Update .env with Railway credentials
echo.
echo Your Railway credentials are already in .env
echo.
echo Step 3: Deploy to Railway
echo.
echo Run these commands:
echo   1. git add .
echo   2. git commit -m "Deploy to Railway"
echo   3. git push
echo.
echo Railway will automatically:
echo   - Detect Node.js project
echo   - Install dependencies
echo   - Run: node server.js
echo.
echo ========================================
echo IMPORTANT: Set these in Railway Dashboard
echo ========================================
echo Go to: Railway Dashboard ^> Your Service ^> Variables
echo.
echo Add these variables:
echo   SESSION_SECRET=edumeet-railway-secret-2024
echo   NODE_ENV=production
echo.
echo Database variables (already from MySQL service):
echo   MYSQLHOST=mysql.railway.internal
echo   MYSQLUSER=root
echo   MYSQLPASSWORD=CLODVYkKYlXrPegsMYFQliFbkdeCJHJk
echo   MYSQLDATABASE=railway
echo   MYSQLPORT=3306
echo.
pause
