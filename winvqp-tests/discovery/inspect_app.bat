@echo off
cd /d "%~dp0.."
echo ========================================
echo  WINVQP93 - UI Structure Inspector
echo ========================================
echo.
echo This will launch the app and dump all
echo window controls to discovery\app_structure.txt
echo.
echo Make sure no other WINVQP93 is running.
echo.
pause
python discovery\inspect_app.py
pause
