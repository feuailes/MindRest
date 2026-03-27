@echo off
TITLE MindRest 2.0 - Setup
color 0A

REM ─── Reload PATH from registry (picks up XAMPP + Composer) ────
for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "SYSPATH=%%b"
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USERPATH=%%b"
set "PATH=%SYSPATH%;%USERPATH%"

echo.
echo =====================================================
echo   MindRest 2.0 - First-Time Setup
echo =====================================================
echo.

REM ─── Check PHP ─────────────────────────────────────────
php --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo [ERROR] PHP is not found in PATH.
    echo XAMPP PHP path: C:\xampp\php
    echo Please add C:\xampp\php to your system PATH, then re-run.
    pause
    exit /b 1
)

REM ─── Check Composer ────────────────────────────────────
composer --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo [ERROR] Composer is not found in PATH.
    echo Please install Composer from https://getcomposer.org/
    pause
    exit /b 1
)

echo [1/6] Installing Laravel backend dependencies...
cd /d "%~dp0backend"
composer install --no-interaction --prefer-dist

echo.
echo [2/6] Generating application key...
php artisan key:generate

echo.
echo [3/6] Creating SQLite database file...
if not exist "database\database.sqlite" (
    type nul > "database\database.sqlite"
    echo SQLite file created.
) else (
    echo SQLite file already exists.
)

echo.
echo [4/6] Running database migrations...
php artisan migrate --force

echo.
echo [5/6] Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install

echo.
echo [6/6] Setup complete!
echo.
echo =====================================================
echo   Run START_DEV.bat to launch both servers
echo =====================================================
echo.
pause
