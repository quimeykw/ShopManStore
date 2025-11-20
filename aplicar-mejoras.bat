@echo off
echo ========================================
echo Aplicando mejoras a ShopManStore
echo ========================================
echo.

echo [1/3] Instalando dependencias...
call npm install
echo.

echo [2/3] Creando backup de app.js...
copy public\app.js public\app.js.backup
echo.

echo [3/3] IMPORTANTE: Debes aplicar manualmente los cambios
echo.
echo Abre el archivo: public/app-updates.js
echo.
echo Sigue las instrucciones dentro del archivo para:
echo - Agregar funciones de zoom de imagen
echo - Actualizar renderProducts()
echo - Actualizar openProductModal()
echo - Actualizar saveProduct()
echo - Actualizar loadAdminProducts()
echo.
echo ========================================
echo Backup creado en: public\app.js.backup
echo ========================================
pause
