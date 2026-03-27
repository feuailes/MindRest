@echo off
TITLE MindRest 2.0 - Dev Servers
color 0B
echo.
echo =====================================================
echo   MindRest 2.0 - Starting Development Servers
echo =====================================================
echo.

REM Start Laravel backend in a new window
echo Starting Laravel backend on http://localhost:8000 ...
start "Laravel Backend" cmd /k "cd /d "%~dp0backend" && C:\xampp\php\php.exe artisan serve"

REM Wait 2 seconds then start Vite frontend
timeout /t 2 /nobreak >nul

echo Starting React frontend on http://localhost:5173 ...
start "React Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are starting!
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo.
echo Press any key to exit this window (servers keep running)
pause >nul
