@echo off
echo ========================================
echo Opening Bulk Upload Page
echo ========================================
echo.
echo Opening browser to Bulk Upload...
start http://localhost:3000/admin/bulk-upload.html
echo.
echo If not logged in, use:
echo Email: admin@edumeet.com
echo Password: admin123
echo.
echo Sample CSV files available in:
echo - sample_students.csv
echo - sample_faculty.csv
echo.
pause
