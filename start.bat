@echo off
REM OmniLead Nexus — Development Start Script
REM Version: 1.0.0 (Build 20260702.1)

echo ============================================
echo  OmniLead Nexus — Starting Development Mode
echo ============================================
echo.

REM Check for Docker
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Docker detected. Starting with Docker Compose...
    docker compose up -d
    echo [INFO] Services started. Access frontend at http://localhost:3000
    echo [INFO] Access API at http://localhost:8000
    goto :end
)

REM Fallback: Manual start
echo [INFO] Starting services manually...

REM Start backend
if exist backend\ (
    echo [INFO] Starting backend...
    cd backend
    start "" cmd /c "uvicorn main:app --reload --port 8000"
    cd ..
)

REM Start frontend
if exist frontend\ (
    echo [INFO] Starting frontend...
    cd frontend
    start "" cmd /c "npm run dev"
    cd ..
)

echo [INFO] Frontend: http://localhost:3000
echo [INFO] API:      http://localhost:8000

:end
echo.
echo ============================================
echo  Development environment is starting up...
echo ============================================
pause
