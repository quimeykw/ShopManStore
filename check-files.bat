@echo off
echo ========================================
echo   Verificando archivos necesarios
echo ========================================
echo.

echo Verificando estructura de carpetas...
echo.

if exist "public" (
    echo [OK] Carpeta public existe
) else (
    echo [ERROR] Carpeta public NO existe
)

if exist "public\index.html" (
    echo [OK] public\index.html existe
) else (
    echo [ERROR] public\index.html NO existe
)

if exist "public\app.js" (
    echo [OK] public\app.js existe
) else (
    echo [ERROR] public\app.js NO existe
)

if exist "server.js" (
    echo [OK] server.js existe
) else (
    echo [ERROR] server.js NO existe
)

if exist "package.json" (
    echo [OK] package.json existe
) else (
    echo [ERROR] package.json NO existe
)

echo.
echo ========================================
echo   Listando archivos en public/
echo ========================================
dir public
echo.

echo ========================================
echo   Verificacion completa
echo ========================================
pause
