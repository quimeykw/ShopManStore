# Plan de Implementación - Optimización de Imágenes

- [ ] 1. Configurar dependencias y estructura base
  - Instalar sharp para procesamiento de imágenes en Node.js
  - Crear directorio structure para imágenes optimizadas
  - Configurar variables de entorno para optimización
  - _Requisitos: 4.1, 4.2_

- [ ] 2. Implementar servicio de procesamiento de imágenes
- [ ] 2.1 Crear ImageOptimizationService con conversión de formatos
  - Implementar conversión a WebP y AVIF
  - Configurar niveles de calidad por formato
  - Añadir validación de formatos de entrada
  - _Requisitos: 1.1, 1.2, 1.3_

- [ ]* 2.2 Escribir prueba de propiedad para conversión automática a WebP
  - **Propiedad 1: Conversión automática a WebP**
  - **Valida: Requisitos 1.1**

- [ ]* 2.3 Escribir prueba de propiedad para fallback de formato
  - **Propiedad 2: Fallback de formato**
  - **Valida: Requisitos 1.2**

- [ ] 2.4 Implementar generación de múltiples tamaños responsivos
  - Crear función para generar tamaños estándar (320, 640, 1024, 1920px)
  - Implementar generación de densidades (1x, 2x, 3x)
  - Añadir metadatos de dimensiones
  - _Requisitos: 2.5, 3.4_

- [ ]* 2.5 Escribir prueba de propiedad para compresión con calidad
  - **Propiedad 3: Compresión con calidad**
  - **Valida: Requisitos 1.3**

- [ ] 3. Crear middleware de detección y servicio de imágenes
- [ ] 3.1 Implementar middleware de detección de formato del navegador
  - Detectar soporte WebP/AVIF desde headers Accept
  - Implementar lógica de selección de formato óptimo
  - Añadir detección de dispositivo móvil
  - _Requisitos: 1.1, 1.2, 3.1, 4.4_

- [ ] 3.2 Crear endpoint para servir imágenes optimizadas
  - Implementar ruta `/api/images/:filename` con negociación de contenido
  - Añadir headers de caché apropiados
  - Implementar fallback a imagen original si optimizada no existe
  - _Requisitos: 1.1, 1.2, 4.4_

- [ ]* 3.3 Escribir prueba de propiedad para selección automática de formato
  - **Propiedad 15: Selección automática de formato óptimo**
  - **Valida: Requisitos 4.4**

- [ ] 4. Optimizar el logo existente
- [ ] 4.1 Procesar logo actual con múltiples formatos y tamaños
  - Redimensionar logo a tamaños de visualización reales (53x80, 106x160, 159x240)
  - Generar versiones WebP y AVIF del logo
  - Comprimir para lograr reducción mínima del 80%
  - _Requisitos: 2.1, 2.2, 2.3, 2.5_

- [ ]* 4.2 Escribir prueba de propiedad para compresión mínima del 80%
  - **Propiedad 7: Compresión mínima del 80%**
  - **Valida: Requisitos 2.2**

- [ ] 4.3 Actualizar HTML para usar logo optimizado con srcset
  - Modificar elemento img del logo para usar srcset responsivo
  - Añadir atributos de carga prioritaria (fetchpriority="high")
  - Implementar fallback para navegadores sin soporte WebP
  - _Requisitos: 2.3, 2.4, 3.2_

- [ ]* 4.4 Escribir prueba de propiedad para atributos srcset responsivos
  - **Propiedad 10: Atributos srcset responsivos**
  - **Valida: Requisitos 3.2**

- [ ] 5. Implementar lazy loading para imágenes de productos
- [ ] 5.1 Crear componente LazyImageLoader en frontend
  - Implementar Intersection Observer para detección de viewport
  - Añadir placeholder y efectos de transición
  - Configurar offset de carga (100px antes de ser visible)
  - _Requisitos: 1.4, 3.5_

- [ ] 5.2 Integrar lazy loading en galería de productos
  - Modificar renderizado de productos para usar lazy loading
  - Añadir atributos loading="lazy" como fallback
  - Implementar carga progresiva en galerías
  - _Requisitos: 1.4, 3.5_

- [ ]* 5.3 Escribir prueba de propiedad para lazy loading fuera del viewport
  - **Propiedad 4: Lazy loading fuera del viewport**
  - **Valida: Requisitos 1.4**

- [ ] 6. Checkpoint - Verificar optimizaciones básicas
  - Asegurar que todas las pruebas pasen, preguntar al usuario si surgen dudas

- [ ] 7. Implementar procesamiento automático de uploads
- [ ] 7.1 Modificar endpoint de upload de productos para optimización automática
  - Integrar ImageOptimizationService en proceso de upload
  - Generar automáticamente todos los formatos y tamaños
  - Mantener imagen original como backup
  - _Requisitos: 4.1, 4.2, 4.3_

- [ ]* 7.2 Escribir prueba de propiedad para procesamiento automático de uploads
  - **Propiedad 12: Procesamiento automático de uploads**
  - **Valida: Requisitos 4.1**

- [ ]* 7.3 Escribir prueba de propiedad para preservación de originales
  - **Propiedad 13: Preservación de originales**
  - **Valida: Requisitos 4.2**

- [ ] 7.4 Crear sistema de metadatos de optimización
  - Añadir tabla image_metadata a la base de datos
  - Almacenar información de optimización (ratios, tamaños, formatos)
  - Implementar consultas de estadísticas
  - _Requisitos: 4.3_

- [ ]* 7.5 Escribir prueba de propiedad para generación de metadatos
  - **Propiedad 14: Generación de metadatos**
  - **Valida: Requisitos 4.3**

- [ ] 8. Optimizar imágenes existentes en background
- [ ] 8.1 Crear script de migración para imágenes existentes
  - Escanear directorio de imágenes existentes
  - Procesar imágenes no optimizadas en lotes
  - Implementar procesamiento en background sin bloquear servidor
  - _Requisitos: 4.5_

- [ ] 8.2 Implementar detección automática de imágenes no optimizadas
  - Añadir verificación en startup del servidor
  - Crear cola de procesamiento en background
  - Implementar logging de progreso
  - _Requisitos: 4.5_

- [ ]* 8.3 Escribir prueba de propiedad para generación automática de tamaños
  - **Propiedad 11: Generación automática de tamaños**
  - **Valida: Requisitos 3.4**

- [ ] 9. Implementar optimizaciones específicas para móviles
- [ ] 9.1 Configurar servicio de imágenes para dispositivos móviles
  - Implementar detección de dispositivo móvil mejorada
  - Configurar calidades de compresión específicas para móvil
  - Priorizar velocidad sobre calidad máxima en móviles
  - _Requisitos: 3.1, 3.3_

- [ ]* 9.2 Escribir prueba de propiedad para resolución móvil optimizada
  - **Propiedad 9: Resolución móvil optimizada**
  - **Valida: Requisitos 3.1**

- [ ] 9.3 Actualizar CSS y JavaScript para imágenes responsivas
  - Añadir media queries para diferentes tamaños de pantalla
  - Implementar selección de imagen basada en ancho de contenedor
  - Optimizar carga de imágenes críticas above-the-fold
  - _Requisitos: 1.5, 2.4_

- [ ]* 9.4 Escribir prueba de propiedad para dimensiones apropiadas
  - **Propiedad 5: Dimensiones apropiadas**
  - **Valida: Requisitos 1.5**

- [ ] 10. Checkpoint final - Verificar todas las optimizaciones
  - Asegurar que todas las pruebas pasen, preguntar al usuario si surgen dudas