@echo off
cd /d "%~dp0"

echo ========================================
echo  WINVQP93 Regression Test Suite
echo ========================================
echo.

echo Before running, make sure:
echo  1. The app D:\winvqp93\WINVQP93.exe exists
echo  2. No other instance of WINVQP93 is running
echo  3. Run the discovery first: discovery\inspect_app.bat
echo.
echo ========================================
echo.

pytest tests/ --html=report.html --self-contained-html -v

echo.
echo Report generated: report.html
echo Screenshots: assets\screenshots\
pause
