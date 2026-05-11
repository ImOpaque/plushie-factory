@echo off
setlocal
title Plushie Factory - Dev Server
cd /d "%~dp0"

if not exist "package.json" (
  echo Error: package.json not found. Keep this file in the Plushie Factory project folder.
  pause
  exit /b 1
)

echo.
echo  Plushie Factory - local dev server
echo  Keep this window OPEN while you play in the browser.
echo  Close this window or press Ctrl+C to STOP the server.
echo.

if not exist "node_modules\" (
  echo First run: installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
  echo.
)

REM Open the default browser after a short delay (Vite default port is 5173)
start "" cmd /c "timeout /t 2 /nobreak >nul && start "" http://localhost:5173/"

call npm run dev

echo.
if errorlevel 1 (
  echo Server stopped with an error.
  pause
)

endlocal
