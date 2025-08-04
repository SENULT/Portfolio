@echo off
echo ================================================
echo    Huynh Duc Anh Portfolio - Full Stack Setup
echo ================================================
echo.

echo Starting all services...
echo.

echo [1/3] Starting AI Service (FastAPI)...
start "AI Service" cmd /k "cd /d D:\reviewalltech\huynhducanhportfolio\Portfolio\ai-service && uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Backend (Node.js)...
start "Backend API" cmd /k "cd /d D:\reviewalltech\huynhducanhportfolio\Portfolio\backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend (React/HTML)...
start "Frontend" cmd /k "cd /d D:\reviewalltech\huynhducanhportfolio\Portfolio && start index.html"

echo.
echo ================================================
echo All services started successfully!
echo.
echo Services running on:
echo - Frontend: http://localhost:3000 (or open index.html)
echo - Backend API: http://localhost:5000  
echo - AI Service: http://localhost:8000
echo - API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit...
echo ================================================

pause
