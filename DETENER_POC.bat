@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if not errorlevel 1 (
    py -3 -c "import sys; sys.exit(0)" >nul 2>&1
    if not errorlevel 1 (
        py -3 "scripts\local_server.py" --stop
        goto done
    )
)
where python >nul 2>&1
if not errorlevel 1 (
    python "scripts\local_server.py" --stop
    goto done
)
echo Python 3 no esta disponible.
:done
echo.
pause
endlocal
