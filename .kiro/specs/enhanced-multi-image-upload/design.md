# Design Document: Enhanced Multi-Image Upload

## Overview

Esta mejora expande la capacidad de gestión de imágenes de productos en ShopManStore, aumentando el límite de 5 a 10 imágenes por producto, implementando compresión automática para optimizar almacenamiento, y mejorando la UX con drag-and-drop, indicadores de progreso y lazy loading. El diseño mantiene compatibilidad con la arquitectura existente (SQLite + Base64) mientras optimiza rendimiento y usabilidad.

## Architecture

### Current Architecture
- **Backend**: Express.js con SQLite3
- **Storage**: Imágenes en Base64 almacenadas en campo JSON `images`
- **Frontend**: Vanilla JavaScript con manipulación DOM directa
- **Límite actual**: 5 imágenes, 2MB cada una (~2.74MB en Base64)

### Enhanced Architecture
- **Image Processing Pipeline**: Cliente procesa imágenes antes de enviar
  1. Validación de formato y cantidad
  2. Compresión con Canvas API
  3. Conversión a Base64
  4. Validación de tamaño post-compresión
- **Storage Optimization**: Compresión reduce tamaño promedio 60-70%
- **UI Enhancement**: Drag-and-drop con HTML5 Drag API
- **Performance**: Lazy loading con Intersection Observer API

## Components and Interfaces

### 1. ImageCompressor (Frontend)

Clase responsable de comprimir imágenes en el navegador.

```javascript
class ImageCompressor {
  constructor(options = {}) {
    this.maxWidth = options.maxWidth || 1200;
    this.maxHeight = options.maxHeight || 1200;
    this.quality = options.quality || 0.8;
    this.maxSizeKB = options.maxSizeKB || 1500;
  }
  
  async compress(file) {
    // Returns: { base64, sizeKB, width, height, compressed }
  }
  
  async compressMultiple(files, onProgress) {
    // Returns: Array of compressed images with metadata
  }
}
```

**Métodos:**
- `compress(file)`: Comprime una imagen individual
- `compressMultiple(files, onProgress)`: Comprime múltiples imágenes con callback de progreso
- `_resizeImage(img, canvas, ctx)`: Redimensiona manteniendo aspect ratio
- `_optimizeQuality(canvas, targetSize)`: Ajusta calidad para cumplir límite de tamaño

### 2. ImageUploadManager (Frontend)

Gestiona el estado y UI del upload de múltiples imágenes.

```javascript
class ImageUploadManager {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.maxImages = options.maxImages || 10;
    this.images = []; // Array of { base64, sizeKB, id }
    this.compressor = new ImageCompressor(options.compressor);
  }
  
  async addImages(files) {
    // Adds new images with compression and validation
  }
  
  removeImage(index) {
    // Removes image at index
  }
  
  replaceImage(index, file) {
    // Replaces specific image
  }
  
  reorderImages(fromIndex, toIndex) {
    // Reorders images (used by drag-and-drop)
  }
  
  getImages() {
    // Returns array of base64 strings
  }
  
  getTotalSize() {
    // Returns total size in KB
  }
  
  render() {
    // Renders preview grid with drag-and-drop
  }
}
```

### 3. DragDropHandler (Frontend)

Maneja la funcionalidad de drag-and-drop para reordenar imágenes.

```javascript
class DragDropHandler {
  constructor(manager) {
    this.manager = manager;
    this.draggedIndex = null;
  }
  
  attachToElement(element, index) {
    // Attaches drag event listeners
  }
  
  handleDragStart(e, index) {
    // Stores dragged index and adds visual feedback
  }
  
  handleDragOver(e, index) {
    // Shows drop target indicator
  }
  
  handleDrop(e, index) {
    // Reorders images and updates UI
  }
}
```

### 4. ProgressIndicator (Frontend)

Muestra progreso de procesamiento de imágenes.

```javascript
class ProgressIndicator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }
  
  show(total) {
    // Shows progress bar
  }
  
  update(current, total, message) {
    // Updates progress
  }
  
  hide() {
    // Hides progress bar
  }
  
  showError(message) {
    // Shows error state
  }
}
```

### 5. Backend API Updates

**Endpoint**: `POST /api/products` y `PUT /api/products/:id`

**Changes:**
- Aumentar límite de imágenes de 5 a 10
- Ajustar validación de tamaño a 1.5MB por imagen (post-compresión)
- Mantener compatibilidad con campo `image` (primera imagen)

```javascript
// Validation updates
const MAX_IMAGES = 10;
const MAX_SIZE_PER_IMAGE = 1.5 * 1024 * 1024 * 1.37; // 1.5MB in base64

// Validate image count
if (imageArray.length > MAX_IMAGES) {
  return res.status(400).json({ 
    error: `Máximo ${MAX_IMAGES} imágenes permitidas` 
  });
}

// Validate each image size
for (const img of imageArray) {
  if (img && img.length > MAX_SIZE_PER_IMAGE) {
    return res.status(400).json({ 
      error: 'Cada imagen debe ser menor a 1.5MB después de compresión' 
    });
  }
}
```

## Data Models

### Product Model (Existing - No Changes)

```javascript
{
  id: INTEGER PRIMARY KEY,
  name: TEXT,
  description: TEXT,
  price: REAL,
  image: TEXT,        // Primera imagen (compatibilidad)
  images: TEXT,       // JSON array de todas las imágenes
  sizes: TEXT,        // Comma-separated
  stock: INTEGER
}
```

### Image Metadata (Frontend Only)

```javascript
{
  id: String,         // Unique identifier (UUID)
  base64: String,     // Base64 encoded image
  sizeKB: Number,     // Size in kilobytes
  width: Number,      // Original width
  height: Number,     // Original height
  compressed: Boolean, // Whether compression was applied
  filename: String    // Original filename
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Image count constraint
*For any* product submission with images, the total number of images should never exceed 10, and any attempt to add images beyond this limit should be rejected.
**Validates: Requirements 1.1, 1.2, 5.3**

### Property 2: Compressed image size constraint
*For any* image after compression, the Base64 size should not exceed 1.5MB.
**Validates: Requirements 2.4**

### Property 3: Compression quality threshold
*For any* compressed image, the quality parameter should be between 0.7 and 0.9 to maintain visual acceptability.
**Validates: Requirements 2.2**

### Property 4: Aspect ratio preservation during resize
*For any* image that is resized during compression, the aspect ratio (width/height) should remain constant before and after resizing.
**Validates: Requirements 2.3**

### Property 5: Serialization round-trip
*For any* array of images serialized to JSON and stored in the database, deserializing should produce an equivalent array with the same images in the same order.
**Validates: Requirements 1.4, 4.5, 5.5**

### Property 6: Image array integrity on addition
*For any* product with N existing images, after adding M new images where N + M ≤ 10, the product should have exactly N + M images with the first N images unchanged in content and order.
**Validates: Requirements 5.1, 5.2, 5.3**

### Property 7: Reorder operation correctness
*For any* drag-and-drop operation from index A to index B in an array of images, the image originally at index A should end up at index B, and all images should remain present (no duplicates or losses).
**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 8: Image replacement isolation
*For any* product with N images, replacing the image at index I should result in N images where only the image at index I is different and all other images remain unchanged.
**Validates: Requirements 8.1, 8.3, 8.4, 8.5**

### Property 9: Progress indicator accuracy
*For any* batch of M images being processed, after processing K images, the progress indicator should show exactly K/M progress.
**Validates: Requirements 3.1, 3.2, 3.4**

### Property 10: Total size calculation
*For any* set of images with individual sizes S1, S2, ..., Sn, the displayed total size should equal S1 + S2 + ... + Sn.
**Validates: Requirements 7.1, 7.2, 7.5**

### Property 11: Size format consistency
*For any* displayed image size, if the size is less than 1024 KB it should be formatted in KB, otherwise it should be formatted in MB.
**Validates: Requirements 7.4**

### Property 12: Lazy loading behavior
*For any* image in the product catalog, the image should not be loaded until it enters or is within a threshold distance of the viewport.
**Validates: Requirements 6.1, 6.2**

### Property 13: Gallery preload strategy
*For any* product gallery being viewed, only the currently displayed image and the next image in sequence should be loaded, not all images.
**Validates: Requirements 6.3, 6.4**

### Property 14: First image as primary
*For any* product with multiple images, the first image in the array should always be displayed as the primary image in the catalog view.
**Validates: Requirements 1.5**

### Property 15: Compression application universality
*For any* image uploaded by an administrator, the compression algorithm should be applied before Base64 conversion, regardless of the original image size.
**Validates: Requirements 2.1**

## Error Handling

### Client-Side Errors

1. **Too Many Images**
   - Trigger: User selects > 10 images
   - Response: Show alert with current count and maximum allowed
   - Recovery: Allow user to deselect images

2. **Image Too Large (Pre-compression)**
   - Trigger: Image file > 10MB
   - Response: Skip image and show warning
   - Recovery: Continue processing other images

3. **Compression Failure**
   - Trigger: Canvas API error or unsupported format
   - Response: Log error, skip image, notify user
   - Recovery: Continue with remaining images

4. **Invalid File Type**
   - Trigger: Non-image file selected
   - Response: Filter out invalid files, show warning
   - Recovery: Process only valid images

5. **Network Error During Save**
   - Trigger: API request fails
   - Response: Show error message, preserve form data
   - Recovery: Allow retry without re-uploading images

### Server-Side Errors

1. **Payload Too Large**
   - Trigger: Total request size > 50MB
   - Response: 413 status with descriptive error
   - Recovery: Client should compress more aggressively

2. **Invalid Image Data**
   - Trigger: Malformed Base64 or non-image data
   - Response: 400 status with validation error
   - Recovery: Client re-validates before retry

3. **Database Error**
   - Trigger: SQLite write failure
   - Response: 500 status with generic error
   - Recovery: Log error, suggest retry

## Testing Strategy

### Unit Tests

**ImageCompressor Tests:**
- Test compression reduces file size
- Test aspect ratio preservation
- Test quality parameter effects
- Test max dimension constraints
- Test handling of already-small images

**ImageUploadManager Tests:**
- Test adding images within limit
- Test rejecting excess images
- Test removing images
- Test reordering images
- Test replacing specific image
- Test total size calculation

**DragDropHandler Tests:**
- Test drag start sets correct state
- Test drop reorders correctly
- Test drag over shows feedback
- Test drag end cleans up state

### Property-Based Tests

Tests will use a property-based testing library appropriate for JavaScript (e.g., fast-check, jsverify). Each test should run minimum 100 iterations.

**Test 1: Image count never exceeds maximum**
- Generate: Random arrays of 1-20 image files
- Action: Call `addImages()`
- Assert: Resulting array length ≤ 10

**Test 2: Compression always meets size constraint**
- Generate: Random image files of various sizes
- Action: Compress each image
- Assert: Base64 size ≤ 1.5MB

**Test 3: Reorder operations preserve all images**
- Generate: Random array of images and random reorder operations
- Action: Apply all reorder operations
- Assert: Final array contains same images (different order)

**Test 4: Adding to existing preserves original images**
- Generate: Random existing images (1-8) and new images (1-5)
- Action: Add new images to existing
- Assert: First N images unchanged, total ≤ 10

**Test 5: Replace operation affects only target index**
- Generate: Random array of images and random target index
- Action: Replace image at index
- Assert: All other indices unchanged

### Integration Tests

1. **Full Upload Flow**
   - Select 10 images
   - Verify compression
   - Verify preview rendering
   - Submit to API
   - Verify database storage

2. **Edit Existing Product**
   - Load product with 5 images
   - Add 3 more images
   - Reorder images
   - Save and verify

3. **Lazy Loading**
   - Load catalog with 20 products
   - Verify only visible images load
   - Scroll and verify new images load

4. **Drag and Drop**
   - Load product with 8 images
   - Drag image from position 2 to 6
   - Verify order in preview
   - Save and verify persisted order

## Performance Considerations

### Compression Performance
- **Target**: Process 10 images in < 5 seconds on average hardware
- **Strategy**: Use Web Workers for parallel compression (future enhancement)
- **Fallback**: Sequential processing with progress indicator

### Memory Management
- **Issue**: Multiple large images in memory
- **Solution**: Process and compress immediately, discard original File objects
- **Monitoring**: Track total memory usage, warn if > 100MB

### Network Optimization
- **Current**: Single request with all images
- **Consideration**: For future, consider chunked upload for > 5 images
- **Benefit**: Better progress tracking, resume capability

### Database Performance
- **Current**: SQLite handles Base64 strings well up to ~10MB per row
- **Monitoring**: Track query performance with multiple products
- **Future**: Consider migration to blob storage if performance degrades

## UI/UX Enhancements

### Image Preview Grid
```
[1] [2] [3] [4] [5]
[6] [7] [8] [9] [10]

Each cell shows:
- Thumbnail
- Position number
- Size (KB/MB)
- Remove button (X)
- Replace button (↻)
- Drag handle (⋮⋮)
```

### Progress Indicator
```
Procesando imágenes... 3/7
[████████░░░░░░░░] 43%
```

### Size Warning
```
⚠️ Tamaño total: 12.4 MB
Recomendado: < 10 MB para mejor rendimiento
```

### Drag Feedback
```
[Dragging]
  ↓
[Drop Zone - highlighted]
```

## Migration Strategy

### Phase 1: Backend Updates
1. Update validation limits (5 → 10 images, 2MB → 1.5MB)
2. Deploy backend changes
3. Verify backward compatibility with existing products

### Phase 2: Frontend Core
1. Implement ImageCompressor class
2. Update image upload handling
3. Test compression with various image types

### Phase 3: UI Enhancements
1. Implement ImageUploadManager
2. Add progress indicators
3. Add size display

### Phase 4: Advanced Features
1. Implement drag-and-drop
2. Add replace functionality
3. Implement lazy loading

### Phase 5: Testing & Optimization
1. Run full test suite
2. Performance testing with real data
3. User acceptance testing

## Backward Compatibility

- Existing products with ≤ 5 images work unchanged
- `image` field maintained for compatibility
- Frontend gracefully handles products with old format
- No database migration required
