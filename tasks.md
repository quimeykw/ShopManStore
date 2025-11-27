# Implementation Plan - ShopManStore Mejoras

- [ ] 1. Migrar base de datos para soportar múltiples imágenes
  - Crear script de migración que renombre la columna `image` a `images`
  - Convertir imágenes únicas existentes en arrays con un elemento
  - Actualizar init-db.js para crear nuevos productos con campo `images` (TEXT/JSON)
  - Ejecutar migración en SQLite y verificar compatibilidad con PostgreSQL
  - _Requirements: 7.1, 7.2_

- [ ] 1.1 Write property test for migration
  - **Property 12: Migration converts single image to array**
  - **Validates: Requirements 7.2**

- [ ] 2. Actualizar backend para manejar arrays de imágenes
  - Modificar POST /api/products para aceptar array de imágenes en lugar de imagen única
  - Modificar PUT /api/products/:id para actualizar arrays de imágenes
  - Implementar serialización JSON.stringify() al guardar en base de datos
  - Implementar deserialización JSON.parse() al leer de base de datos
  - Agregar validación de máximo 5 imágenes y 2MB por imagen
  - _Requirements: 3.3, 3.4, 7.3_

- [ ] 2.1 Write property test for image array persistence
  - **Property 4: Image array persistence round-trip**
  - **Validates: Requirements 3.3, 3.4**

- [ ] 2.2 Write property test for deserialization
  - **Property 13: Image array deserialization**
  - **Validates: Requirements 7.3**

- [ ] 3. Implementar upload múltiple en panel de admin
  - Agregar atributo `multiple` al input file en productModal
  - Crear función handleMultipleImages() para procesar múltiples archivos
  - Implementar vista previa con grid de miniaturas (3 columnas)
  - Agregar botón de eliminar en cada miniatura de la vista previa
  - Actualizar saveProduct() para enviar array de imágenes al backend
  - _Requirements: 3.1, 3.2, 3.5_

- [ ] 3.1 Write property test for multiple image preview
  - **Property 3: Multiple image preview shows all selected images**
  - **Validates: Requirements 3.2**

- [ ] 3.2 Write property test for individual image deletion
  - **Property 5: Individual image deletion preserves others**
  - **Validates: Requirements 3.5**

- [ ] 4. Implementar funcionalidad de reordenamiento de imágenes en admin
  - Agregar botones de arrastrar/reordenar en vista previa de imágenes
  - Implementar función reorderImages(fromIndex, toIndex)
  - Actualizar array de imágenes al reordenar
  - Persistir nuevo orden al guardar producto
  - _Requirements: 6.1, 6.2_

- [ ] 4.1 Write property test for image order persistence
  - **Property 11: Image order persistence**
  - **Validates: Requirements 6.1, 6.2**

- [ ] 5. Crear componente de galería de imágenes para productos
  - Crear clase ImageGallery con métodos next(), prev(), goTo()
  - Renderizar imagen principal (primera del array)
  - Renderizar miniaturas debajo de la imagen principal
  - Implementar click en miniatura para cambiar imagen principal
  - Agregar indicadores visuales (dots) de imagen actual
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5.1 Write property test for first image as main
  - **Property 6: First image is always main display**
  - **Validates: Requirements 4.1**

- [ ] 5.2 Write property test for navigation controls
  - **Property 7: Multiple images show navigation controls**
  - **Validates: Requirements 4.2, 4.5**

- [ ] 5.3 Write property test for thumbnail click
  - **Property 8: Thumbnail click updates main image**
  - **Validates: Requirements 4.3**

- [ ] 6. Actualizar renderizado de productos para usar galería
  - Modificar renderProducts() para usar product.images[0] como imagen principal
  - Agregar miniaturas si product.images.length > 1
  - Integrar ImageGallery en cada tarjeta de producto
  - Actualizar loadAdminProducts() para mostrar múltiples imágenes
  - _Requirements: 4.1, 4.2_

- [ ] 7. Mejorar modal de zoom con navegación entre imágenes
  - Agregar botones de navegación (prev/next) al modal de zoom
  - Implementar funciones prevImage() y nextImage()
  - Agregar indicadores de posición (dots o contador)
  - Actualizar zoomImage() para aceptar array de imágenes e índice inicial
  - Implementar navegación con teclado (flechas izquierda/derecha)
  - _Requirements: 4.4, 4.5_

- [ ] 8. Implementar gestos táctiles para navegación en móvil
  - Crear clase TouchHandler para detectar swipe horizontal
  - Integrar TouchHandler en galería de productos
  - Implementar onSwipeLeft para imagen siguiente
  - Implementar onSwipeRight para imagen anterior
  - Agregar TouchHandler al modal de zoom
  - _Requirements: 5.1, 5.3_

- [ ] 8.1 Write property test for swipe gesture
  - **Property 9: Swipe gesture changes image**
  - **Validates: Requirements 5.1, 5.3**

- [ ] 8.2 Write property test for position indicator
  - **Property 10: Image navigation shows current position indicator**
  - **Validates: Requirements 5.2**

- [ ] 9. Implementar diseño responsive para grid de productos
  - Actualizar productsGrid con clases Tailwind responsive
  - Usar `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
  - Ajustar gap y padding para diferentes breakpoints
  - Verificar que las tarjetas se adapten correctamente en móvil
  - _Requirements: 1.1, 1.2_

- [ ] 9.1 Write property test for responsive grid
  - **Property 1: Responsive grid adapts to viewport width**
  - **Validates: Requirements 1.1, 1.2**

- [ ] 10. Hacer responsive el header
  - Cambiar layout del header a flex-col en móvil, flex-row en desktop
  - Usar clases `flex flex-col sm:flex-row items-center`
  - Ajustar tamaño de fuente del logo: `text-xl sm:text-2xl`
  - Reorganizar botones con flex-wrap para adaptarse al espacio
  - Centrar botones en móvil, alinear a la derecha en desktop
  - _Requirements: 2.1, 2.2_

- [ ] 11. Asegurar tamaños táctiles mínimos en móvil
  - Agregar clases de padding a todos los botones: `px-4 py-2` mínimo
  - Verificar que botones tengan min-height de 44px en móvil
  - Ajustar botones del carrito y admin para cumplir con tamaño mínimo
  - Aumentar área táctil de miniaturas en galería móvil
  - _Requirements: 1.3, 2.3_

- [ ] 11.1 Write property test for touch target sizes
  - **Property 2: Touch targets meet minimum size in mobile**
  - **Validates: Requirements 1.3, 2.3**

- [ ] 12. Hacer responsive el carrito lateral
  - Agregar clase condicional para ancho completo en móvil
  - Usar `w-full sm:w-80` para el cartSidebar
  - Ajustar altura y overflow para móviles
  - Verificar que el botón de cerrar sea fácilmente accesible en móvil
  - _Requirements: 1.4_

- [ ] 13. Hacer responsive los modales
  - Actualizar loginModal y registerModal con `w-full sm:w-96`
  - Agregar márgenes laterales en móvil: `mx-4`
  - Ajustar productModal para ser responsive
  - Verificar que paymentModal y cardModal se adapten a móvil
  - Asegurar que todos los modales tengan scroll si el contenido es largo
  - _Requirements: 1.5_

- [ ] 14. Checkpoint - Verificar que todos los tests pasen
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Agregar manejo de errores para imágenes
  - Implementar función getProductImages() con try-catch para parsing
  - Agregar imagen placeholder para productos sin imágenes
  - Implementar validación de tamaño máximo (5 imágenes, 2MB cada una)
  - Mostrar mensajes de error apropiados al usuario
  - Agregar fallback para navegadores sin soporte de touch events
  - _Requirements: Todos (manejo de errores general)_

- [ ] 15.1 Write unit tests for error handling
  - Test parsing de imágenes corruptas
  - Test validación de límites de tamaño
  - Test fallback de placeholder
  - Test detección de capacidad táctil

- [ ] 16. Optimizaciones de performance
  - Implementar lazy loading para imágenes fuera del viewport
  - Agregar loading="lazy" a elementos img
  - Considerar compresión de imágenes antes de Base64
  - Optimizar renderizado de galería para productos con muchas imágenes
  - _Requirements: Todos (optimización general)_

- [ ] 17. Testing final y ajustes
  - Probar en Chrome, Firefox, Safari, Edge
  - Probar en dispositivos iOS y Android reales
  - Verificar responsive en resoluciones 320px, 768px, 1024px, 1920px
  - Ajustar estilos según sea necesario
  - Verificar accesibilidad (contraste, navegación por teclado)
  - _Requirements: Todos_

- [ ] 17.1 Write integration tests
  - Test flujo completo de admin: crear producto con múltiples imágenes
  - Test flujo completo de cliente: navegar galería y zoom
  - Test responsive en diferentes viewports
  - Test migración de datos existentes
