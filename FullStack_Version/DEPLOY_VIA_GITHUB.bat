@echo off
cls
echo.
echo  ========================================
echo   DEPLOY EDUMEET VIA GITHUB
echo  ========================================
echo.
echo  This will prepare your code for GitHub deployment
echo.
pause
cls

cd /d "%~dp0"

echo.
echo  Step 1: Initialize Git Repository
echo  ========================================
git init
echo.

echo  Step 2: Add all files
echo  ========================================
git add .
echo.

echo  Step 3: Create initial commit
echo  ========================================
git commit -m "EduMeet - Ready for Railway deployment"
echo.

cls
echo.
echo  ========================================
echo   GIT REPOSITORY READY!
echo  ========================================
echo.
echo  NEXT STEPS:
echo.
echo  1. Create a new repository on GitHub
echo     Go to: https://github.com/new
echo.
echo  2. Copy the repository URL
echo.
echo  3. Run these commands:
echo.
echo     git remote add origin YOUR_GITHUB_URL
echo     git branch -M main
echo     git push -u origin main
echo.
echo  4. Connect Railway to GitHub:
echo     - Go to Railway Dashboard
echo     - Click "New Project"
echo     - Select "Deploy from GitHub repo"
echo     - Choose your repository
echo.
echo  5. Setup Database:
echo     - Go to Railway MySQL service
echo     - Click "Query" tab
echo     - Copy content from railway_setup.sql
echo     - Paste and execute
echo.
echo  6. Add Environment Variables in Railway:
echo     SESSION_SECRET=edumeet-railway-secret-2024
echo     NODE_ENV=production
echo.
echo  ========================================
echo.
pause
