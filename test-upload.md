# Guía de Prueba - Sistema de Múltiples Imágenes

## Pasos para Probar

### 1. Refrescar el Navegador
**IMPORTANTE**: Presiona `Ctrl + F5` (Windows) o `Cmd + Shift + R` (Mac) para limpiar la caché del navegador.

### 2. Abrir la Consola del Navegador
- Presiona `F12` para abrir las herramientas de desarrollo
- Ve a la pestaña "Console"

### 3. Iniciar Sesión
- Usuario: `admin`
- Contraseña: `admin123`

### 4. Abrir Panel de Admin
- Haz clic en el botón "Admin"

### 5. Crear un Producto Nuevo

#### Paso a paso:
1. Haz clic en "Agregar Producto"
2. Completa los campos:
   - **Nombre**: Ej. "Remera Test"
   - **Descripción**: Ej. "Producto de prueba"
   - **Precio**: Ej. 1500
   - **Talles**: Ej. "S, M, L, XL"
   - **Stock**: Ej. 10

3. **Subir Imágenes**:
   - Haz clic en "Elegir archivos"
   - Selecciona entre 1 y 10 imágenes
   - Deberías ver:
     - ✅ Barra de progreso mientras se procesan
     - ✅ Miniaturas de las imágenes
     - ✅ Número de posición en cada imagen
     - ✅ Tamaño de cada imagen (KB o MB)
     - ✅ Tamaño total al final

4. **Probar Funcionalidades**:
   - **Reordenar**: Arrastra una imagen y suéltala en otra posición
   - **Reemplazar**: Haz clic en el botón 🔄 (azul) para reemplazar una imagen
   - **Eliminar**: Haz clic en la ✕ (roja) para eliminar una imagen

5. Haz clic en "Guardar"

### 6. Verificar en la Consola

Deberías ver estos mensajes:
```
saveProduct called
Product data: {id: "", name: "Remera Test", ...}
Images to save: X images
ImageManager exists: true
```

### 7. Verificar el Resultado

- El producto debería aparecer en la lista de productos
- Debería mostrar el número de imágenes (si tiene más de 1)
- Al hacer clic en la imagen, debería abrir el zoom con todas las imágenes

## Problemas Comunes

### "No me toma el guardado"

**Solución 1**: Limpiar caché
- Presiona `Ctrl + F5` para refrescar sin caché

**Solución 2**: Verificar la consola
- Abre la consola (F12)
- Busca errores en rojo
- Comparte el error si lo hay

**Solución 3**: Verificar que los campos estén completos
- Nombre, descripción y precio son obligatorios
- Debe haber al menos 1 imagen

### "Las imágenes no se suben"

**Verificar**:
- Tamaño de cada imagen < 10MB antes de compresión
- Formato de imagen válido (JPG, PNG, WebP, etc.)
- Máximo 10 imágenes

### "El drag and drop no funciona"

**Verificar**:
- Que hayas refrescado el navegador (Ctrl + F5)
- Que estés arrastrando desde el centro de la imagen
- Que el navegador soporte drag and drop (Chrome, Firefox, Edge)

## Logs Útiles

En la consola del navegador, busca:
- `saveProduct called` - Confirma que se llamó la función
- `Images to save: X images` - Muestra cuántas imágenes se van a guardar
- `ImageManager exists: true` - Confirma que el manager está inicializado

Si ves errores, cópialos y compártelos para ayudarte mejor.
