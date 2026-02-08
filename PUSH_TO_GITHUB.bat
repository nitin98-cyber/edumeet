@echo off
echo ========================================
echo   Push EduMeet to GitHub
echo ========================================
echo.
echo Repository: https://github.com/nitin9917/Edumeet
echo.
echo IMPORTANT: You need a Personal Access Token to push
echo.
echo If you don't have one:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Check "repo" permission
echo 4. Copy the token
echo.
echo When prompted:
echo   Username: nitin9917
echo   Password: [paste your token]
echo.
pause
echo.
echo Pushing to GitHub...
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo ========================================
    echo   SUCCESS! Your code is on GitHub!
    echo   Visit: https://github.com/nitin9917/Edumeet
    echo ========================================
) else (
    echo ========================================
    echo   Push failed. Check the error above.
    echo ========================================
)
echo.
pause
