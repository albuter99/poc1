@echo off
setlocal
cd /d "%~dp0"
echo.
echo =============================================
echo       POC1 - Modelo de datos multilingue
echo =============================================
echo.
if not exist "relations.html" (
    echo ERROR: No se encuentra relations.html.
    echo Extrae primero TODO el ZIP en una carpeta.
    pause
    exit /b 1
)
where py >nul 2>&1
if not errorlevel 1 (
    py -3 -c "import sys; sys.exit(0)" >nul 2>&1
    if not errorlevel 1 (
        set "PYTHON=py -3"
        goto start_server
    )
)
where python >nul 2>&1
if not errorlevel 1 (
    python -c "import sys; sys.exit(0)" >nul 2>&1
    if not errorlevel 1 (
        set "PYTHON=python"
        goto start_server
    )
)
echo ERROR: No se ha encontrado Python 3 en este ordenador.
echo Instala Python 3 y vuelve a abrir INICIAR_POC.bat.
echo https://www.python.org/downloads/windows/
pause
exit /b 1

:start_server
echo Abriendo el POC en el navegador...
start "" "http://127.0.0.1:8765/relations.html"
echo.
echo El servidor se mantendra activo mientras esta ventana este abierta.
echo Para cerrarlo, usa DETENER_POC.bat.
echo.
%PYTHON% "scripts\local_server.py"
if errorlevel 1 (
    echo.
    echo El servidor no ha podido iniciarse. Comprueba que el puerto 8765 no este ocupado.
    pause
)
endlocal
