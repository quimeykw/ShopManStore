@echo off
echo ========================================
echo   Subiendo cambios a GitHub
echo ========================================
echo.

git add .
git commit -m "Fix: Rutas corregidas para Render"
git push

echo.
echo ========================================
echo   Cambios subidos exitosamente!
echo   Render redesplegara automaticamente
echo ========================================
pause
