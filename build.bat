@echo off
REM OmniLead Nexus — Production Build Script
REM Version: 1.0.0 (Build 20260702.1)

echo ============================================
echo  OmniLead Nexus — Building for Production
echo ============================================
echo.

REM Build frontend
if exist frontend\ (
    echo [STEP 1/3] Building frontend...
    cd frontend
    call npm install
    call npm run build
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Frontend build failed!
        exit /b 1
    )
    cd ..
    echo [OK] Frontend built successfully.
) else (
    echo [SKIP] No frontend directory found.
)

REM Build backend
if exist backend\ (
    echo [STEP 2/3] Building backend...
    cd backend
    if exist requirements.txt (
        call pip install -r requirements.txt
    )
    cd ..
    echo [OK] Backend ready.
) else (
    echo [SKIP] No backend directory found.
)

REM Docker production build
echo [STEP 3/3] Building Docker images...
if exist docker-compose.prod.yml (
    docker compose -f docker-compose.prod.yml build
    echo [OK] Docker images built.
) else (
    echo [SKIP] No production Docker compose file found.
)

echo.
echo ============================================
echo  Build complete.
echo  Version: 1.0.0 (Build 20260702.1)
echo ============================================
pause
