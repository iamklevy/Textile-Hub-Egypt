@echo off
title Textile Hub - dev server
cd /d "%~dp0"
where npm >nul 2>nul || (echo Node.js is not installed. Download it from https://nodejs.org then run this file again. & pause & exit /b 1)
if not exist node_modules (echo Installing packages, this takes a minute... & call npm install)
echo.
echo Starting the site at http://localhost:3000  - keep this window open, close it to stop.
call npm run dev
pause
