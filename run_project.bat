@echo off
title MindRest Project Starter
echo ==========================================
echo       Starting MindRest Project
echo ==========================================

echo [1/2] Starting Backend (Flask)...
start "MindRest Backend" cmd /k "cd backend && python app.py"

echo [2/2] Starting Frontend (Vite)...
start "MindRest Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo  Servers are starting in separate windows.
echo  Backend: http://127.0.0.1:5000
echo  Frontend: http://localhost:5173
echo ==========================================
echo.
pause
