# Requirements Document

## Introduction

Este documento define los requisitos para mejorar la capacidad de subir múltiples imágenes por producto en ShopManStore. Actualmente el sistema permite hasta 5 imágenes por producto con un límite de 2MB por imagen. Esta mejora busca aumentar la capacidad, optimizar el almacenamiento mediante compresión automática, y mejorar la experiencia de usuario al gestionar múltiples imágenes.

## Glossary

- **Sistema**: La aplicación ShopManStore (backend y frontend)
- **Administrador**: Usuario con rol 'admin' que puede gestionar productos
- **Producto**: Item del catálogo con nombre, descripción, precio, stock, talles e imágenes
- **Galería de Imágenes**: Colección de imágenes asociadas a un producto
- **Compresión de Imagen**: Proceso de reducir el tamaño del archivo de imagen manteniendo calidad visual aceptable
- **Base64**: Formato de codificación de imágenes usado para almacenamiento en SQLite
- **Miniatura**: Versión reducida de una imagen para preview rápido

## Requirements

### Requirement 1

**User Story:** Como administrador, quiero poder subir hasta 10 imágenes por producto, para que pueda mostrar más detalles y ángulos de cada artículo.

#### Acceptance Criteria

1. WHEN un administrador selecciona imágenes para un producto THEN el sistema SHALL permitir seleccionar hasta 10 archivos de imagen
2. WHEN un administrador intenta subir más de 10 imágenes THEN el sistema SHALL mostrar un mensaje de error indicando el límite máximo
3. WHEN un administrador sube imágenes válidas THEN el sistema SHALL almacenar todas las imágenes en el campo images del producto
4. WHEN se carga un producto con múltiples imágenes THEN el sistema SHALL deserializar correctamente el array de imágenes desde JSON
5. WHEN se muestra un producto en el catálogo THEN el sistema SHALL mostrar la primera imagen como principal con indicadores de imágenes adicionales

### Requirement 2

**User Story:** Como administrador, quiero que las imágenes se compriman automáticamente al subirlas, para que no ocupen demasiado espacio en la base de datos y carguen más rápido.

#### Acceptance Criteria

1. WHEN un administrador sube una imagen THEN el sistema SHALL comprimir automáticamente la imagen antes de convertirla a Base64
2. WHEN se comprime una imagen THEN el sistema SHALL mantener una calidad visual aceptable (calidad 0.8 o superior)
3. WHEN se comprime una imagen THEN el sistema SHALL redimensionar imágenes grandes a un ancho máximo de 1200px manteniendo la proporción
4. WHEN la compresión está completa THEN el sistema SHALL validar que cada imagen comprimida no exceda 1.5MB en Base64
5. WHEN una imagen ya es menor al límite THEN el sistema SHALL aplicar compresión ligera para optimizar almacenamiento

### Requirement 3

**User Story:** Como administrador, quiero ver un indicador de progreso al subir múltiples imágenes, para que sepa cuántas imágenes se han procesado.

#### Acceptance Criteria

1. WHEN un administrador selecciona múltiples imágenes THEN el sistema SHALL mostrar un indicador de progreso
2. WHILE se procesan las imágenes THEN el sistema SHALL actualizar el indicador mostrando el número de imágenes procesadas
3. WHEN todas las imágenes están procesadas THEN el sistema SHALL ocultar el indicador de progreso
4. WHEN ocurre un error al procesar una imagen THEN el sistema SHALL mostrar qué imagen falló y continuar con las demás
5. WHEN el procesamiento está completo THEN el sistema SHALL mostrar un resumen de imágenes exitosas y fallidas

### Requirement 4

**User Story:** Como administrador, quiero poder reordenar las imágenes fácilmente mediante drag and drop, para que pueda controlar el orden de visualización sin usar flechas.

#### Acceptance Criteria

1. WHEN un administrador visualiza el preview de imágenes THEN el sistema SHALL permitir arrastrar y soltar imágenes para reordenarlas
2. WHEN un administrador arrastra una imagen THEN el sistema SHALL mostrar feedback visual indicando la posición de destino
3. WHEN un administrador suelta una imagen en nueva posición THEN el sistema SHALL actualizar el orden en el array de imágenes
4. WHEN se reordena una imagen THEN el sistema SHALL actualizar los números de posición de todas las imágenes
5. WHEN se guarda el producto THEN el sistema SHALL persistir el orden de las imágenes tal como fueron organizadas

### Requirement 5

**User Story:** Como administrador, quiero poder agregar más imágenes a un producto existente sin perder las que ya tiene, para que pueda actualizar el catálogo incrementalmente.

#### Acceptance Criteria

1. WHEN un administrador edita un producto existente THEN el sistema SHALL cargar y mostrar todas las imágenes actuales
2. WHEN un administrador selecciona nuevas imágenes THEN el sistema SHALL agregar las nuevas imágenes al final de las existentes
3. WHEN se agregan nuevas imágenes THEN el sistema SHALL validar que el total no exceda 10 imágenes
4. IF el total de imágenes excedería 10 THEN el sistema SHALL mostrar un mensaje indicando cuántas imágenes más se pueden agregar
5. WHEN se guarda el producto THEN el sistema SHALL persistir tanto las imágenes existentes como las nuevas

### Requirement 6

**User Story:** Como cliente, quiero que las imágenes del catálogo carguen rápidamente, para que pueda navegar los productos sin esperas.

#### Acceptance Criteria

1. WHEN se carga el catálogo de productos THEN el sistema SHALL usar lazy loading para las imágenes
2. WHEN una imagen entra en el viewport THEN el sistema SHALL cargar la imagen con prioridad
3. WHEN se muestra la galería de un producto THEN el sistema SHALL precargar solo la primera imagen
4. WHEN un usuario navega entre imágenes THEN el sistema SHALL precargar la siguiente imagen en segundo plano
5. WHEN las imágenes están comprimidas THEN el sistema SHALL reducir el tiempo de carga inicial en al menos 40%

### Requirement 7

**User Story:** Como administrador, quiero ver el tamaño estimado de cada imagen antes de guardar, para que pueda decidir si necesito optimizar más.

#### Acceptance Criteria

1. WHEN se procesa una imagen THEN el sistema SHALL calcular y mostrar el tamaño en KB o MB
2. WHEN se muestra el preview de imágenes THEN el sistema SHALL mostrar el tamaño debajo de cada miniatura
3. WHEN el tamaño total excede 10MB THEN el sistema SHALL mostrar una advertencia
4. WHEN se muestra el tamaño THEN el sistema SHALL usar formato legible (KB para < 1MB, MB para >= 1MB)
5. WHEN todas las imágenes están cargadas THEN el sistema SHALL mostrar el tamaño total de todas las imágenes

### Requirement 8

**User Story:** Como administrador, quiero poder reemplazar una imagen específica sin afectar las demás, para que pueda corregir errores fácilmente.

#### Acceptance Criteria

1. WHEN un administrador hace clic en una imagen del preview THEN el sistema SHALL mostrar opciones para reemplazar o eliminar
2. WHEN un administrador selecciona reemplazar THEN el sistema SHALL abrir un selector de archivo para esa posición específica
3. WHEN se selecciona una nueva imagen THEN el sistema SHALL reemplazar solo la imagen en esa posición
4. WHEN se reemplaza una imagen THEN el sistema SHALL mantener la misma posición en el orden
5. WHEN se completa el reemplazo THEN el sistema SHALL actualizar el preview inmediatamente
