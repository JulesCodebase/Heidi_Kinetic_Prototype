@echo off
TITLE Kinetic Network Launcher
echo ========================================================
echo   Setting up Kinetic Network Prototype...
echo   Please wait while we install necessary dependencies.
echo ========================================================
echo.

:: Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit
)

:: Install dependencies
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit
)

echo.
echo ========================================================
echo   Installation Complete! Starting Application...
echo   Your browser should open automatically.
echo ========================================================
echo.

:: Run the dev server
npm run dev
pause