@echo off
echo ========================================
echo Configurador de pgpass para PostgreSQL
echo ========================================
echo.

REM Crear directorio si no existe
if not exist "%APPDATA%\postgresql" (
    mkdir "%APPDATA%\postgresql"
    echo Directorio creado: %APPDATA%\postgresql
)

echo.
echo IMPORTANTE: Necesitas tus credenciales de Render
echo Ve a: https://dashboard.render.com/
echo Click en PostgreSQL -^> Tu base de datos
echo.
echo Ingresa los siguientes datos:
echo.

set /p HOST="Hostname (ej: dpg-xxx-a.oregon-postgres.render.com): "
set /p PORT="Port (presiona Enter para 5432): "
if "%PORT%"=="" set PORT=5432
set /p DATABASE="Database name: "
set /p USERNAME="Username: "
set /p PASSWORD="Password: "

echo.
echo Creando archivo pgpass.conf...

REM Crear archivo pgpass.conf
echo %HOST%:%PORT%:%DATABASE%:%USERNAME%:%PASSWORD% > "%APPDATA%\postgresql\pgpass.conf"

echo.
echo ========================================
echo LISTO! Archivo creado exitosamente
echo ========================================
echo.
echo Ubicacion: %APPDATA%\postgresql\pgpass.conf
echo.
echo Ahora puedes:
echo 1. Abrir DBeaver
echo 2. Intentar conectar de nuevo
echo 3. Deberia funcionar sin problemas
echo.
echo Presiona cualquier tecla para salir...
pause >nul
