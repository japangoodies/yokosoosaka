@echo off
title JapanGoodies FB Scraper - Installer
echo ==========================================
echo JapanGoodies Facebook Scraper Installer
echo ==========================================
echo.

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Python not found. Please install Python from https://www.python.org/downloads/
    echo        Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)
echo [OK] Python found
python --version

:: Install playwright
echo.
echo Installing Playwright...
pip install playwright
if %errorlevel% neq 0 (
    echo [FAIL] Failed to install Playwright.
    pause
    exit /b 1
)
echo [OK] Playwright installed

:: Install Chromium browser
echo.
echo Downloading Chromium browser for scraping...
python -m playwright install chromium
if %errorlevel% neq 0 (
    echo [FAIL] Failed to install Chromium.
    pause
    exit /b 1
)
echo [OK] Chromium installed

:: Create desktop shortcut
set SCRIPT_DIR=%~dp0
set SHORTCUT_PATH=%USERPROFILE%\Desktop\FB Scraper Server.lnk
set PS_CMD=New-Object -ComObject WScript.Shell; $s=$_.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath='cmd.exe'; $s.Arguments='/k "cd /d %SCRIPT_DIR% && python fb-server.py"'; $s.WindowStyle=7; $s.Description='JapanGoodies Facebook Scraper Server'; $s.Save()
powershell -Command "%PS_CMD%" >nul 2>&1
if exist "%SHORTCUT_PATH%" (
    echo [OK] Desktop shortcut created
) else (
    echo [..] Could not create shortcut (run as admin if needed)
)

echo.
echo ==========================================
echo Installation complete!
echo ==========================================
echo.
echo To start scraping:
echo   1. Double-click the "FB Scraper Server" shortcut on your desktop
echo   2. Open your admin panel at https://japangoodies.pages.dev
echo   3. Go to Smart Import tab
echo   4. Paste a Facebook post URL and click Scrape
echo.
echo Or run manually: python fb-server.py
echo.
pause
