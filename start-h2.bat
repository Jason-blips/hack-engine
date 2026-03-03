@echo off
title Hack Engine - Backend (H2, no MySQL)
echo.
echo  Starting backend with H2 in-memory DB (no MySQL required).
echo  Data is lost when you close this window.
echo  Backend: http://localhost:8080
echo.
cd /d "%~dp0"
mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
pause
