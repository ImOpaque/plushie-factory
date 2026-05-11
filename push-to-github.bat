@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo.
echo === Git status (edit/save files first if needed) ===
git status -sb
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$m = Read-Host 'Commit message (empty = cancel, no push)'; " ^
  "if ([string]::IsNullOrWhiteSpace($m)) { exit 2 }; " ^
  "$p = Join-Path $env:TEMP 'plushie_factory_commitmsg.txt'; " ^
  "[System.IO.File]::WriteAllText($p, $m.TrimEnd())"

if %ERRORLEVEL% equ 2 (
  echo Cancelled.
  pause
  exit /b 0
)
if %ERRORLEVEL% neq 0 (
  echo Could not read commit message.
  pause
  exit /b 1
)

set "MSGFILE=%TEMP%\plushie_factory_commitmsg.txt"

git add -A
git commit -F "%MSGFILE%"
set "COMMITERR=%ERRORLEVEL%"
del "%MSGFILE%" 2>nul

if not "%COMMITERR%"=="0" (
  echo.
  echo Commit did not complete ^(nothing new to commit, or another git error^).
  pause
  exit /b 1
)

echo.
git push
if not "%ERRORLEVEL%"=="0" (
  echo.
  echo Push failed. Check your network and GitHub login.
  pause
  exit /b 1
)

echo.
echo Done.
pause
