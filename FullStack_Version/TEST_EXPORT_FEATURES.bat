@echo off
echo ========================================
echo   Testing Export and Bulk Delete Features
echo ========================================
echo.
echo New Features Added:
echo.
echo ADMIN DASHBOARD:
echo   - Export Students List (CSV)
echo   - Export Faculty List (CSV)
echo   - Bulk Delete Students (with checkboxes)
echo   - Bulk Delete Faculty (with checkboxes)
echo.
echo FACULTY DASHBOARD:
echo   - Export Booking History (PDF)
echo   - Includes statistics and all appointments
echo.
echo STUDENT DASHBOARD:
echo   - Download Appointment Receipt (PDF)
echo   - Beautiful formatted receipt for each appointment
echo.
echo ========================================
echo   How to Test:
echo ========================================
echo.
echo 1. ADMIN (http://localhost:3000/admin/dashboard):
echo    - Click "Export CSV" button to download lists
echo    - Check checkboxes next to users
echo    - Click "Delete Selected" to bulk delete
echo.
echo 2. FACULTY (http://localhost:3000/faculty/dashboard):
echo    - Click "Export PDF" button
echo    - Downloads complete booking history with stats
echo.
echo 3. STUDENT (http://localhost:3000/student/dashboard):
echo    - Click download icon next to any appointment
echo    - Gets professional PDF receipt
echo.
echo ========================================
echo.
echo Starting server...
echo.
node server.js
