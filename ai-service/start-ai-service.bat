@echo off
echo Starting AI Service (FastAPI)...
echo.

cd /d "D:\reviewalltech\huynhducanhportfolio\Portfolio\ai-service"

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Starting FastAPI AI Service...
echo Service will run on http://localhost:8000
echo.

uvicorn main:app --reload --port 8000

pause
