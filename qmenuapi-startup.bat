@echo off
setlocal
set "EXEC_HELPER_ENABLE_LEGACY_PIPE=false"
set "EXEC_HELPER_ENABLE_TCP=true"
set "EXEC_HELPER_ENABLE_PIPE=false"
set "QMENU_SESSIONNAME=%SESSIONNAME%"
if not defined QMENU_SESSIONNAME set "QMENU_SESSIONNAME=console"
set "REPO_DIR=%~dp0.."
for %%I in ("%REPO_DIR%") do set "REPO_DIR=%%~fI"

cd /d "%REPO_DIR%"

echo Closing existing processes...
taskkill /f /im chrome.exe >nul 2>&1
taskkill /f /im firefox.exe >nul 2>&1
taskkill /f /im msedge.exe >nul 2>&1
taskkill /f /im opera.exe >nul 2>&1
taskkill /f /im brave.exe >nul 2>&1
taskkill /f /im iexplore.exe >nul 2>&1
wmic process where "commandline like '%%exeAPI.js%%'" call terminate >nul 2>&1
timeout /t 2 /nobreak >nul
echo Done.

set "EXEC_HELPER_ID=%COMPUTERNAME%_%USERNAME%"
set "EXEC_HELPER_ID=%EXEC_HELPER_ID: =_%"
set "EXEC_HELPER_ID=%EXEC_HELPER_ID:\=_%"
set "EXEC_HELPER_ID=%EXEC_HELPER_ID:/=_%"
set "EXEC_HELPER_ID=%EXEC_HELPER_ID::=_%"
set "EXEC_HELPER_ID=%EXEC_HELPER_ID:#=_%"
set "EXEC_HELPER_ID=%EXEC_HELPER_ID:(=_%"
set "EXEC_HELPER_ID=%EXEC_HELPER_ID:)=_%"
set "EXEC_HELPER_TCP_USER=%USERNAME%"
set "EXEC_HELPER_TRANSPORT=tcp"
set "EXEC_HELPER_ALLOWLIST="
set "EXEC_HELPER_REGISTRY_URL=http://192.168.100.96:8082/qmenuapi/api/helper/"
set "EXEC_HELPER_FRONTEND_URL=http://192.168.100.96:8082/qmenu/"
set "EXEC_HELPER_AUTO_OPEN_FRONTEND=true"
start /b  node d:\webapis\qmenuapi\helper\exeAPI.js 

endlocal
