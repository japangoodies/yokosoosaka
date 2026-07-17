e:
cd \VQPBOS\update

@echo off

REM Step 1: Save duplicate dates to file
sqlcmd -S . -d VQPBOS -U%1 -P%2 -h-1 -W -i"dupdates.sql" -o"dupdates.res"
if errorlevel 1 pause

REM Step 2: Delete duplicates
sqlcmd -S . -d VQPBOS -U%1 -P%2 -i"ttimetrn_duplicates.sql" -o"ttimetrn_duplicates.res"
if errorlevel 1 pause

REM Step 3: Run hotext.exe for each date
cd E:\VQPBOS
echo --- dupdates.res contents ---
type E:\VQPBOS\update\dupdates.res
echo --- end of file ---
for /f "usebackq tokens=* delims=" %%a in ("E:\VQPBOS\update\dupdates.res") do (
    echo Line: [%%a]
    if not "%%a"=="" (
        echo Processing %%a - close hotext window when done...
        start /wait "" "hotext.exe" %%a
    )
)

del "E:\VQPBOS\update\dupdates.res"
echo Done.
pause
