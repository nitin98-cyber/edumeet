@echo off
echo ========================================
echo EduMeet - Adding New Features
echo ========================================
echo.
echo This will add the following features:
echo   1. Rating System
echo   2. Favorite Faculty
echo   3. Advanced Search
echo   4. Appointment Notes
echo.
pause
echo.
echo Updating database...
node update_database_new_features.js
echo.
echo ========================================
echo Update Complete!
echo ========================================
pause
