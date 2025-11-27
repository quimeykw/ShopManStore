# Design Document - ShopManStore Mejoras

## Overview

Este documento describe el diseño técnico para implementar dos mejoras principales en ShopManStore:

1. **Diseño Responsive Mejorado**: Optimización de la interfaz para dispositivos móviles y tablets mediante el uso de breakpoints CSS y layouts adaptativos.

2. **Sistema de Múltiples Imágenes**: Implementación de una galería de imágenes por producto que permita a los administradores subir múltiples fotos y a los clientes navegar entre ellas.

La solución se implementará utilizando:
- **Tailwind CSS** para estilos responsive con clases utilitarias
- **JavaScript vanilla** para la lógica de galería de imágenes
- **SQLite/PostgreSQL** para almacenamiento de imágenes como JSON serializado
- **Base64** para codificación de imágenes (manteniendo el enfoque actual)

## Architecture

### Componentes Principales

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (HTML/CSS/JS)                │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Responsive │  │    Image     │  │   Product    │  │
│  │     Grid     │  │   Gallery    │  │    Cards     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Header     │  │    Modal     │  │   Admin      │  │
│  │  Responsive  │  │   Zoom       │  │   Panel      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend (Express)                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Products   │  │    Image     │  │     API      │  │
│  │     API      │  │   Handler    │  │   Routes     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                Database (SQLite/PostgreSQL)              │
├─────────────────────────────────────────────────────────┤
│  products table:                                         │
│  - id, name, description, price                          │
│  - images (JSON array) ← MODIFICADO                      │
│  - sizes, stock, created_at                              │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Datos

**Carga de Productos:**
```
Cliente → GET /api/products → Server → Database → JSON con arrays de imágenes → Cliente → Renderizado con galería
```

**Subida de Múltiples Imágenes:**
```
Admin → Selecciona archivos → FileReader → Base64 → Array → POST/PUT /api/products → Server → JSON.stringify → Database
```

**Navegación de Galería:**
```
Cliente → Click/Swipe → JavaScript → Actualiza índice → Cambia src de imagen → Actualiza indicadores
```

## Components and Interfaces

### 1. Responsive Grid System

**Breakpoints:**
- **Mobile**: < 640px (1 columna)
- **Tablet**: 640px - 1024px (2 columnas)
- **Desktop**: > 1024px (3-4 columnas)

**Implementación con Tailwind:**
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <!-- Product cards -->
</div>
```

### 2. Responsive Header

**Estructura adaptativa:**
- **Desktop**: Logo | Botones horizontales
- **Tablet**: Logo | Botones compactos
- **Mobile**: Logo | Botones apilados o menú hamburguesa

**Clases Tailwind:**
```html
<header class="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 p-4">
  <h1 class="text-xl sm:text-2xl">ShopManStore</h1>
  <div class="flex flex-wrap gap-2 justify-center sm:justify-end">
    <!-- Botones con tamaño táctil mínimo -->
  </div>
</header>
```

### 3. Image Gallery Component

**Estructura de Datos:**
```javascript
// Producto con múltiples imágenes
{
  id: 1,
  name: "Producto",
  images: [
    "data:image/jpeg;base64,...",
    "data:image/jpeg;base64,...",
    "data:image/jpeg;base64,..."
  ],
  // ... otros campos
}
```

**Interfaz de Galería:**
```javascript
class ImageGallery {
  constructor(productId, images) {
    this.productId = productId;
    this.images = images;
    this.currentIndex = 0;
  }
  
  render() {
    // Renderiza imagen principal + miniaturas
  }
  
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateDisplay();
  }
  
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateDisplay();
  }
  
  goTo(index) {
    this.currentIndex = index;
    this.updateDisplay();
  }
  
  updateDisplay() {
    // Actualiza imagen principal e indicadores
  }
}
```

### 4. Admin Image Upload Interface

**Input múltiple:**
```html
<input type="file" 
       id="productImages" 
       accept="image/*" 
       multiple 
       class="w-full p-2 border rounded">
```

**Vista previa:**
```html
<div id="imagePreview" class="grid grid-cols-3 gap-2">
  <!-- Miniaturas con botón de eliminar -->
</div>
```

**Funciones:**
```javascript
async function handleMultipleImages(files) {
  const images = [];
  for (const file of files) {
    const base64 = await fileToBase64(file);
    images.push(base64);
  }
  return images;
}

function removeImage(index) {
  currentImages.splice(index, 1);
  updatePreview();
}

function reorderImages(fromIndex, toIndex) {
  const [removed] = currentImages.splice(fromIndex, 1);
  currentImages.splice(toIndex, 0, removed);
  updatePreview();
}
```

### 5. Modal de Zoom con Navegación

**Estructura:**
```html
<div id="imageZoomModal" class="fixed inset-0 bg-black bg-opacity-90 z-50">
  <button class="absolute left-4 top-1/2" onclick="prevImage()">
    <i class="fas fa-chevron-left"></i>
  </button>
  
  <div class="flex items-center justify-center h-full">
    <img id="zoomedImage" class="max-w-full max-h-screen object-contain">
  </div>
  
  <button class="absolute right-4 top-1/2" onclick="nextImage()">
    <i class="fas fa-chevron-right"></i>
  </button>
  
  <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
    <div id="imageIndicators" class="flex gap-2">
      <!-- Dots indicadores -->
    </div>
  </div>
  
  <button class="absolute top-4 right-4" onclick="closeZoom()">
    <i class="fas fa-times"></i>
  </button>
</div>
```

### 6. Touch Gestures para Móvil

**Implementación de swipe:**
```javascript
class TouchHandler {
  constructor(element, onSwipeLeft, onSwipeRight) {
    this.element = element;
    this.onSwipeLeft = onSwipeLeft;
    this.onSwipeRight = onSwipeRight;
    this.startX = 0;
    this.startY = 0;
    
    element.addEventListener('touchstart', this.handleStart.bind(this));
    element.addEventListener('touchend', this.handleEnd.bind(this));
  }
  
  handleStart(e) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  }
  
  handleEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = this.startX - endX;
    const diffY = this.startY - endY;
    
    // Detectar swipe horizontal
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        this.onSwipeLeft();
      } else {
        this.onSwipeRight();
      }
    }
  }
}
```

## Data Models

### Producto (Actualizado)

```javascript
{
  id: Integer,
  name: String,
  description: String,
  price: Float,
  images: Array<String>,  // ← CAMBIO: de 'image' a 'images' (array)
  sizes: String,          // CSV de talles
  stock: Integer,
  created_at: Timestamp
}
```

### Migración de Base de Datos

**SQLite:**
```sql
-- Renombrar columna existente
ALTER TABLE products RENAME COLUMN image TO images;

-- Actualizar productos existentes para convertir imagen única en array
UPDATE products 
SET images = json_array(images) 
WHERE images NOT LIKE '[%';
```

**PostgreSQL:**
```sql
-- Renombrar columna
ALTER TABLE products RENAME COLUMN image TO images;

-- Cambiar tipo si es necesario
ALTER TABLE products ALTER COLUMN images TYPE TEXT;

-- Actualizar productos existentes
UPDATE products 
SET images = json_build_array(images)::text
WHERE images NOT LIKE '[%';
```

### Serialización/Deserialización

**Backend (server.js):**
```javascript
// Al guardar
const imagesJson = JSON.stringify(images);
db.run('INSERT INTO products (..., images) VALUES (..., ?)', [..., imagesJson]);

// Al leer
db.all('SELECT * FROM products', (err, rows) => {
  const products = rows.map(row => ({
    ...row,
    images: JSON.parse(row.images || '[]')
  }));
  res.json(products);
});
```

**Frontend (app.js):**
```javascript
// Los productos ya vienen con images como array
products.forEach(product => {
  const mainImage = product.images[0] || 'placeholder.jpg';
  const hasMultiple = product.images.length > 1;
  // Renderizar galería
});
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Responsive grid adapts to viewport width
*For any* viewport width, the product grid should display the correct number of columns: 1 column for widths < 640px, 2 columns for 640px-1024px, and 3-4 columns for widths > 1024px.
**Validates: Requirements 1.1, 1.2**

### Property 2: Touch targets meet minimum size in mobile
*For any* interactive element (button, link) on a mobile viewport (< 640px), the element should have a minimum touch target area of 44x44 pixels.
**Validates: Requirements 1.3, 2.3**

### Property 3: Multiple image preview shows all selected images
*For any* set of N images selected in the admin panel, the preview area should display exactly N thumbnail previews.
**Validates: Requirements 3.2**

### Property 4: Image array persistence round-trip
*For any* product saved with N images, when retrieved from the database, the product should have exactly N images in the same order.
**Validates: Requirements 3.3, 3.4**

### Property 5: Individual image deletion preserves others
*For any* product with N images, removing image at index i should result in a product with N-1 images, where all images except the one at index i are preserved in their relative order.
**Validates: Requirements 3.5**

### Property 6: First image is always main display
*For any* product with at least one image, the displayed main image should always be the first element of the images array (index 0).
**Validates: Requirements 4.1, 6.3**

### Property 7: Multiple images show navigation controls
*For any* product with more than one image, the gallery interface should display navigation controls (thumbnails, arrows, or indicators).
**Validates: Requirements 4.2, 4.5**

### Property 8: Thumbnail click updates main image
*For any* thumbnail clicked at index i, the main image display should update to show the image at index i.
**Validates: Requirements 4.3**

### Property 9: Swipe gesture changes image
*For any* horizontal swipe gesture on a mobile device (< 640px) with a product having multiple images, the displayed image should change to the next (swipe left) or previous (swipe right) image.
**Validates: Requirements 5.1, 5.3**

### Property 10: Image navigation shows current position indicator
*For any* image being displayed in a multi-image product, there should be a visual indicator showing which image is currently active (e.g., highlighted dot, counter).
**Validates: Requirements 5.2**

### Property 11: Image order persistence
*For any* product with images reordered in the admin panel, after saving and reloading, the images should appear in the new order.
**Validates: Requirements 6.1, 6.2**

### Property 12: Migration converts single image to array
*For any* existing product with a single image string before migration, after migration the product should have an images array containing that single image as its only element.
**Validates: Requirements 7.2**

### Property 13: Image array deserialization
*For any* product retrieved from the database, the images field should deserialize to a valid JavaScript array.
**Validates: Requirements 7.3**

## Error Handling

### 1. Imágenes Faltantes o Corruptas

**Problema**: Producto sin imágenes o con imágenes inválidas.

**Solución**:
```javascript
function getProductImages(product) {
  try {
    const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
    return images.length > 0 ? images : ['/placeholder.jpg'];
  } catch (e) {
    console.error('Error parsing images:', e);
    return ['/placeholder.jpg'];
  }
}
```

### 2. Límite de Tamaño de Imágenes

**Problema**: Múltiples imágenes grandes pueden exceder límites de almacenamiento.

**Solución**:
```javascript
const MAX_IMAGES = 5;
const MAX_SIZE_MB = 2;

function validateImages(files) {
  if (files.length > MAX_IMAGES) {
    throw new Error(`Máximo ${MAX_IMAGES} imágenes permitidas`);
  }
  
  for (const file of files) {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`Imagen ${file.name} excede ${MAX_SIZE_MB}MB`);
    }
  }
}
```

### 3. Migración de Datos Existentes

**Problema**: Productos existentes tienen campo `image` (singular) en lugar de `images` (array).

**Solución**: Script de migración que se ejecuta al iniciar:
```javascript
function migrateProductImages(db) {
  db.all('SELECT id, images FROM products', (err, rows) => {
    rows.forEach(row => {
      try {
        // Verificar si ya es un array
        JSON.parse(row.images);
      } catch (e) {
        // No es JSON válido, convertir a array
        const imageArray = JSON.stringify([row.images]);
        db.run('UPDATE products SET images = ? WHERE id = ?', [imageArray, row.id]);
      }
    });
  });
}
```

### 4. Responsive Breakpoints en Navegadores Antiguos

**Problema**: Navegadores antiguos pueden no soportar todas las características de Tailwind.

**Solución**: Tailwind incluye autoprefixer y genera CSS compatible. Para mayor compatibilidad:
```html
<!-- Fallback para navegadores sin soporte de grid -->
<style>
  @supports not (display: grid) {
    .grid {
      display: flex;
      flex-wrap: wrap;
    }
  }
</style>
```

### 5. Touch Events en Dispositivos sin Soporte

**Problema**: Algunos dispositivos no soportan touch events.

**Solución**: Detectar capacidad táctil y usar mouse events como fallback:
```javascript
const isTouchDevice = 'ontouchstart' in window;

if (isTouchDevice) {
  element.addEventListener('touchstart', handleTouch);
} else {
  element.addEventListener('mousedown', handleMouse);
}
```

## Testing Strategy

### Unit Testing

Se utilizará **Jest** o testing nativo del navegador para pruebas unitarias:

**Casos de prueba específicos:**

1. **Conversión de imagen única a array**:
   - Input: Producto con `image: "data:image/..."`
   - Output: Producto con `images: ["data:image/..."]`

2. **Serialización/Deserialización de arrays**:
   - Input: Array de 3 imágenes
   - Output: JSON string → Parse → Array de 3 imágenes

3. **Eliminación de imagen específica**:
   - Input: Array [img1, img2, img3], eliminar índice 1
   - Output: Array [img1, img3]

4. **Navegación circular de galería**:
   - Input: 3 imágenes, índice actual 2, acción "next"
   - Output: Índice actual 0

5. **Detección de swipe**:
   - Input: touchstart en X=100, touchend en X=50
   - Output: Evento "swipe left" disparado

### Property-Based Testing

Se utilizará **fast-check** (JavaScript) para property-based testing:

**Configuración:**
```javascript
const fc = require('fast-check');

// Generador de productos con imágenes
const productArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  name: fc.string({ minLength: 1 }),
  images: fc.array(fc.string(), { minLength: 1, maxLength: 5 })
});
```

**Propiedades a testear:**

1. **Property 1-2**: Responsive grid y touch targets
   - Generador: Anchos de viewport aleatorios
   - Verificación: Número de columnas y tamaños de elementos

2. **Property 3-5**: Manejo de múltiples imágenes
   - Generador: Arrays de imágenes de longitud variable
   - Verificación: Persistencia, eliminación, orden

3. **Property 6-8**: Galería de imágenes
   - Generador: Productos con múltiples imágenes e índices aleatorios
   - Verificación: Imagen principal, navegación, thumbnails

4. **Property 9-10**: Gestos táctiles
   - Generador: Coordenadas de touch events
   - Verificación: Detección de swipe y actualización de UI

5. **Property 11-13**: Persistencia y migración
   - Generador: Productos con diferentes formatos de imagen
   - Verificación: Round-trip, migración, deserialización

**Configuración de iteraciones:**
Cada property-based test ejecutará un mínimo de 100 iteraciones para asegurar cobertura adecuada.

**Etiquetado de tests:**
Cada test incluirá un comentario con el formato:
```javascript
// **Feature: shopmanstore-mejoras, Property 4: Image array persistence round-trip**
test('product images persist correctly through save/load cycle', () => {
  fc.assert(
    fc.property(productArbitrary, (product) => {
      // Test implementation
    }),
    { numRuns: 100 }
  );
});
```

### Integration Testing

1. **Flujo completo de admin**:
   - Login como admin → Crear producto → Subir 3 imágenes → Guardar → Verificar en lista

2. **Flujo completo de cliente**:
   - Ver producto → Navegar galería → Abrir zoom → Cambiar imagen → Cerrar

3. **Responsive en diferentes dispositivos**:
   - Cargar página en móvil → Verificar layout → Cargar en desktop → Verificar layout

4. **Migración de datos**:
   - Base de datos con productos antiguos → Ejecutar migración → Verificar formato nuevo

## Implementation Notes

### Orden de Implementación Recomendado

1. **Migración de base de datos** (crítico primero)
2. **Backend: API para múltiples imágenes**
3. **Admin: Upload múltiple y preview**
4. **Frontend: Galería básica**
5. **Frontend: Responsive grid**
6. **Frontend: Responsive header**
7. **Frontend: Modal de zoom con navegación**
8. **Frontend: Touch gestures**
9. **Admin: Reordenamiento de imágenes**
10. **Testing y refinamiento**

### Consideraciones de Performance

- **Lazy loading**: Cargar imágenes solo cuando sean visibles
- **Compresión**: Considerar comprimir imágenes antes de convertir a Base64
- **Límites**: Máximo 5 imágenes por producto, 2MB por imagen
- **Caché**: Aprovechar caché del navegador para imágenes ya cargadas

### Compatibilidad

- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos**: iOS 13+, Android 8+
- **Resoluciones**: 320px (móvil pequeño) hasta 2560px (desktop grande)
