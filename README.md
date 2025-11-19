# ShopManStore

Tienda de ropa online con panel de administración.

## Características

- **Autenticación**: Login y registro de usuarios
- **Roles**: Administrador y Cliente
- **Productos**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- **Carrito de compras**: Agregar productos y gestionar cantidades
- **Métodos de pago**:
  - Tarjeta de crédito
  - Mercado Pago (configurable)
  - WhatsApp (549 3764 416263)
- **Panel Admin**:
  - Gestión de productos
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
