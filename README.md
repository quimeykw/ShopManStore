# ShopManStore

Tienda de ropa online con panel de administración.

## Características

- **Autenticación**: Login y registro de usuarios
- **Roles**: Administrador y Cliente
- **Productos**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
  - **Múltiples imágenes**: Hasta 10 imágenes por producto
  - **Compresión automática**: Las imágenes se comprimen automáticamente al subirlas
  - **Drag & Drop**: Reordena imágenes arrastrando y soltando
  - **Gestión avanzada**: Reemplaza o elimina imágenes individuales
  - **Indicador de progreso**: Visualiza el progreso al subir múltiples imágenes
- **Carrito de compras**: Agregar productos y gestionar cantidades
- **Métodos de pago**:
  - Tarjeta de crédito
  - Mercado Pago (configurable)
  - WhatsApp (5491122549995)
- **Panel Admin**:
  - Gestión de productos con galería de imágenes
  - Gestión de usuarios
  - Logs del sistema

## Instalación

```bash
npm install
```

## Iniciar servidor

```bash
npm start
```

El servidor estará disponible en: http://localhost:3001

## Credenciales por defecto

- **Usuario**: admin
- **Contraseña**: admin123

## Configurar Mercado Pago (opcional)

Para habilitar Mercado Pago, configura tu token de acceso:

```bash
set MP_TOKEN=tu_token_aqui
npm start
```

## Estructura

```
shopmanstore/
├── public/
│   ├── index.html    # Frontend
│   └── app.js        # Lógica del cliente
├── server.js         # Backend API
├── store.db          # Base de datos SQLite (se crea automáticamente)
└── package.json
```

## Tecnologías

- **Backend**: Node.js, Express, SQLite
- **Frontend**: HTML, JavaScript, Tailwind CSS
- **Autenticación**: JWT, bcrypt
- **Pagos**: Mercado Pago SDK
- **Procesamiento de imágenes**: Canvas API para compresión en el navegador

## Gestión de Imágenes

### Características de Imágenes

- **Límite**: Hasta 10 imágenes por producto
- **Compresión automática**: 
  - Redimensiona imágenes grandes a máximo 1200px manteniendo proporción
  - Comprime con calidad 0.8 (ajustable)
  - Límite de 1.5MB por imagen después de compresión
- **Formatos soportados**: JPG, PNG, WebP y otros formatos de imagen estándar
- **Lazy loading**: Las imágenes del catálogo se cargan solo cuando son visibles

### Cómo usar

1. **Agregar producto**: Selecciona hasta 10 imágenes al crear un producto
2. **Editar producto**: Agrega más imágenes (hasta el límite de 10)
3. **Reordenar**: Arrastra y suelta las imágenes para cambiar el orden
4. **Reemplazar**: Haz clic en el botón de sincronización (🔄) para reemplazar una imagen
5. **Eliminar**: Haz clic en la X para eliminar una imagen específica

### Indicadores visuales

- **Número de posición**: Cada imagen muestra su posición en la galería
- **Tamaño**: Se muestra el tamaño de cada imagen en KB o MB
- **Total**: El tamaño total se muestra al final con advertencia si excede 10MB
- **Progreso**: Barra de progreso al procesar múltiples imágenes
