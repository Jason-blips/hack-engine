@echo off
title Hack Engine - Launcher
echo.
echo  [Hack Engine] Starting backend and frontend...
echo  Backend:  http://localhost:8080
echo  Frontend: http://localhost:3000
echo  Close each window to stop its service.
echo.

start "Hack Engine - Backend" cmd /k "cd /d ""%~dp0"" && mvnw.cmd spring-boot:run"
timeout /t 3 /nobreak >nul
start "Hack Engine - Frontend" cmd /k "cd /d ""%~dp0hack-engine-web"" && npm start"

echo.
echo  Two windows opened. Wait for backend to start, then open http://localhost:3000
echo.
pause
