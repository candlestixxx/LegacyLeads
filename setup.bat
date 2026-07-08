@echo off
REM OmniLead Nexus — Setup Script
REM Version: 1.0.0 (Build 20260702.1)

echo ============================================
echo  OmniLead Nexus — Environment Setup
echo ============================================
echo.

REM Check prerequisites
echo [CHECK] Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] Node.js not found. Please install Node.js >= 18.x LTS.
    echo        Download from: https://nodejs.org/
)

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] Python not found. Python 3.11+ is recommended.
) else (
    python --version
)

where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Docker found.
) else (
    echo [INFO] Docker not found. Manual setup required.
)

echo.
echo [STEP 1/4] Setting up environment variables...
if not exist .env.local (
    if exist .env.example (
        copy .env.example .env.local
        echo [OK] Created .env.local from template. Please edit with your API keys.
    ) else (
        echo [INFO] No .env.example found. Create .env.local manually.
    )
)

echo [STEP 2/4] Installing frontend dependencies...
if exist frontend\ (
    cd frontend
    call npm install
    cd ..
    echo [OK] Frontend dependencies installed.
)

echo [STEP 3/4] Installing backend dependencies...
if exist backend\ (
    cd backend
    if exist requirements.txt (
        call pip install -r requirements.txt
        echo [OK] Backend dependencies installed.
    )
    cd ..
)

echo [STEP 4/4] Setting up database...
echo [INFO] Run 'docker compose up -d' or configure PostgreSQL manually.
echo        Then run: alembic upgrade head

echo.
echo ============================================
echo  Setup complete!
echo  Run 'start.bat' to launch development mode.
echo ============================================
pause
