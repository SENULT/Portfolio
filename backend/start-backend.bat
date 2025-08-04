@echo off
echo Starting Portfolio Backend Services...
echo.

cd /d "D:\reviewalltech\huynhducanhportfolio\Portfolio\backend"

echo Installing Node.js dependencies...
call npm install

echo.
echo Starting Node.js Backend Server...
echo Server will run on http://localhost:5000
echo.

call npm run dev

pause
