@echo off
echo ================================================
echo EduMeet Setup Script
echo ================================================
echo.

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo ================================================
echo Setup Complete!
echo ================================================
echo.
echo Next Steps:
echo 1. Setup MySQL database by running: mysql -u root -p ^< ../Database/edumeet_database.sql
echo 2. Update database credentials in config.py
echo 3. Run the application: python app.py
echo.
pause
