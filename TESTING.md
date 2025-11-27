# Testing Guide - ShopManStore Mejoras

## Ejecutar Tests

### Instalar Dependencias
```bash
npm install
```

### Ejecutar Todos los Tests
```bash
npm test
```

### Ejecutar Tests en Modo Watch
```bash
npm run test:watch
```

## Tests Implementados

### 1. Migration Tests (`tests/migration.test.js`)
- ✅ Property 12: Migration converts single image to array
- Verifica que la migración de imagen única a array funcione correctamente
- 100 iteraciones de property-based testing

### 2. Image Persistence Tests (`tests/image-persistence.test.js`)
- ✅ Property 4: Image array persistence round-trip
- ✅ Property 13: Image array deserialization
- Verifica serialización/deserialización de arrays de imágenes
- 100 iteraciones por propiedad

### 3. Image Upload Tests (`tests/image-upload.test.js`)
- ✅ Property 3: Multiple image preview shows all selected images
- ✅ Property 5: Individual image deletion preserves others
- Verifica funcionalidad de upload múltiple y eliminación
- 100 iteraciones por propiedad

### 4. Image Reorder Tests (`tests/image-reorder.test.js`)
- ✅ Property 11: Image order persistence
- Verifica que el reordenamiento de imágenes persista correctamente
- 100 iteraciones

### 5. Image Gallery Tests (`tests/image-gallery.test.js`)
- ✅ Property 6: First image is always main display
- ✅ Property 7: Multiple images show navigation controls
- ✅ Property 8: Thumbnail click updates main image
- Verifica funcionalidad de la galería de imágenes
- 100 iteraciones por propiedad

### 6. Touch Gestures Tests (`tests/touch-gestures.test.js`)
- ✅ Property 9: Swipe gesture changes image
- ✅ Property 10: Image navigation shows current position indicator
- Verifica gestos táctiles y navegación en móvil
- 100 iteraciones por propiedad

### 7. Responsive Tests (`tests/responsive.test.js`)
- ✅ Property 1: Responsive grid adapts to viewport width
- ✅ Property 2: Touch targets meet minimum size in mobile
- Verifica diseño responsive y accesibilidad táctil
- 100 iteraciones por propiedad

### 8. Error Handling Tests (`tests/error-handling.test.js`)
- Verifica manejo de errores para imágenes corruptas
- Verifica validación de tamaño y cantidad de imágenes
- Verifica fallbacks y placeholders

## Testing Manual

### Responsive Design
Probar en las siguientes resoluciones:
- **320px** - Móvil pequeño (iPhone SE)
- **375px** - Móvil estándar (iPhone)
- **768px** - Tablet (iPad)
- **1024px** - Desktop pequeño
- **1920px** - Desktop grande

### Navegadores
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Funcionalidades a Probar

#### Admin Panel
1. Subir múltiples imágenes (máx 5)
2. Vista previa de todas las imágenes
3. Eliminar imágenes individuales
4. Reordenar imágenes con flechas
5. Guardar producto con múltiples imágenes

#### Cliente - Galería
1. Ver imagen principal
2. Ver miniaturas (si hay múltiples imágenes)
3. Click en miniatura cambia imagen principal
4. Navegación con flechas
5. Indicadores de posición (dots)

#### Modal de Zoom
1. Click en imagen abre modal
2. Navegación con botones prev/next
3. Navegación con teclado (flechas)
4. Contador de imágenes (1/5)
5. Dots indicadores
6. Cerrar con X o Escape

#### Gestos Táctiles (Móvil)
1. Swipe left para siguiente imagen
2. Swipe right para imagen anterior
3. Funciona en galería de producto
4. Funciona en modal de zoom

#### Responsive
1. Grid se adapta a viewport
2. Header se reorganiza en móvil
3. Botones tienen tamaño táctil mínimo (44px)
4. Carrito ocupa ancho completo en móvil
5. Modales se adaptan con márgenes

## Cobertura de Propiedades

Total de propiedades de corrección: **13**
- ✅ Property 1: Responsive grid
- ✅ Property 2: Touch targets
- ✅ Property 3: Multiple image preview
- ✅ Property 4: Image persistence
- ✅ Property 5: Individual deletion
- ✅ Property 6: First image main
- ✅ Property 7: Navigation controls
- ✅ Property 8: Thumbnail click
- ✅ Property 9: Swipe gesture
- ✅ Property 10: Position indicator
- ✅ Property 11: Image order
- ✅ Property 12: Migration
- ✅ Property 13: Deserialization

## Notas

- Todos los property-based tests ejecutan 100 iteraciones
- Los tests usan fast-check para generación de datos aleatorios
- La cobertura incluye casos edge y manejo de errores
- Los tests son independientes y pueden ejecutarse en cualquier orden
