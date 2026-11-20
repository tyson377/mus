@echo off
cd /d "%~dp0"
echo ========================================================
echo   Starting Divya Memory Museum 3D Virtual Experience
echo ========================================================
echo Opening http://localhost:8080 in your browser...
start "" http://localhost:8080
node serve.js
pause
