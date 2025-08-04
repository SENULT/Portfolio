@echo off
setlocal enabledelayedexpansion

:: Colors for output (Windows CMD doesn't support colors directly, but we can use echo)
echo.
echo ====================================================
echo          🚀 Starting Portfolio Application
echo ====================================================
echo.

:: Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

:: Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found. Creating from template...
    copy .env.example .env >nul
    echo 📝 Please edit .env file with your configuration before running again.
    pause
    exit /b 1
)

:: Build and start services
echo 🔨 Building and starting services...
docker-compose up --build -d

:: Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 15 /nobreak >nul

:: Check service health
echo 🔍 Checking service health...

:: Check frontend
curl -f http://localhost:3000 >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ Frontend is healthy
) else (
    echo ❌ Frontend is not responding
)

:: Check backend
curl -f http://localhost:5000/api/health >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ Backend is healthy
) else (
    echo ❌ Backend is not responding
)

:: Check AI service
curl -f http://localhost:8000/health >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ AI Service is healthy
) else (
    echo ❌ AI Service is not responding
)

echo.
echo ====================================================
echo          🎉 Portfolio application is running!
echo ====================================================
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo 🤖 AI Service: http://localhost:8000
echo.
echo To stop the application, run: docker-compose down
echo To view logs, run: docker-compose logs -f
echo.
pause
