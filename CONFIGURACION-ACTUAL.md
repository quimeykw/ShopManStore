# ⚙️ Configuración Actual de ShopManStore

## ✅ Estado del Sistema

**Servidor:** http://localhost:3001  
**Estado:** ✅ Activo y funcionando  
**Base de datos:** SQLite (store.db)  
**Credenciales de admin:** admin / admin123

---

## 💳 Métodos de Pago Disponibles

### 1. ✅ Pago con Tarjeta (Simulado)
- **Estado:** Activo
- **Descripción:** Formulario de tarjeta de crédito/débito
- **Funcionalidad:** 
  - Captura datos de tarjeta
  - Valida formato
  - Guarda orden en la base de datos
  - **Nota:** Es una simulación, no procesa pagos reales

### 2. ✅ WhatsApp
- **Estado:** Activo
- **Número:** +54 9 11 2254-9995
- **Descripción:** Envía el pedido por WhatsApp
- **Funcionalidad:**
  - Genera mensaje con detalles del pedido
  - Abre WhatsApp con el mensaje pre-cargado
  - El cliente completa el pago por WhatsApp

### 3. ⏸️ Mercado Pago
- **Estado:** Desactivado temporalmente
- **Razón:** Requiere credenciales de TEST válidas
- **Para reactivar:** Ver sección "Reactivar Mercado Pago" más abajo

---

## 🖼️ Funcionalidades de Imágenes

### ✅ Carga Múltiple de Imágenes
- **Límite:** Hasta 10 imágenes por producto
- **Tamaño máximo:** 1.5MB por imagen (después de compresión)
- **Compresión automática:** Sí
- **Drag & Drop:** Sí, para reordenar imágenes
- **Reemplazo individual:** Sí
- **Indicador de progreso:** Sí

### ✅ Galería de Imágenes
- **Navegación:** Flechas y miniaturas
- **Zoom:** Click en imagen para ampliar
- **Lazy loading:** Sí
- **Responsive:** Sí, adaptado a móviles

---

## 👥 Gestión de Usuarios

### Roles Disponibles:
- **Admin:** Acceso completo (gestión de productos, usuarios, logs)
- **Cliente:** Compra de productos

### Usuario Admin por Defecto:
- **Usuario:** admin
- **Contraseña:** admin123

---

## 📦 Gestión de Productos

### Campos de Producto:
- ✅ Nombre
- ✅ Descripción
- ✅ Precio
- ✅ Stock
- ✅ Talles (opcional, separados por comas)
- ✅ Imágenes (hasta 10)

### Funcionalidades:
- ✅ Crear productos
- ✅ Editar productos
- ✅ Eliminar productos
- ✅ Ver lista de productos
- ✅ Filtrar por stock
- ✅ Selección de talles en el carrito

---

## 🛒 Carrito de Compras

### Funcionalidades:
- ✅ Agregar productos
- ✅ Modificar cantidades
- ✅ Eliminar productos
- ✅ Ver total
- ✅ Selección de talles
- ✅ Persistencia en sesión

---

## 🔧 Reactivar Mercado Pago

Si quieres reactivar Mercado Pago en el futuro:

### Paso 1: Obtener Credenciales de TEST
1. Ve a: https://www.mercadopago.com.ar/developers/panel/credentials
2. Busca "Credenciales de prueba"
3. Copia el "Access Token" que comienza con `TEST-`

### Paso 2: Configurar el Token
1. Abre el archivo `.env`
2. Descomenta y actualiza la línea:
   ```env
   MP_TOKEN=TEST-tu-token-aqui
   ```

### Paso 3: Reactivar en el Código

**En `public/index.html`:**
```html
<!-- Descomentar estas líneas -->
<button id="payMP" class="w-full bg-cyan-500 text-white p-3 rounded mb-2">
  <i class="fas fa-qrcode mr-2"></i>Mercado Pago
</button>
```

**En `public/app.js`:**
```javascript
// Descomentar esta línea
$('payMP').onclick = handleMercadoPago;
```

### Paso 4: Reiniciar el Servidor
```bash
npm start
```

---

## 📊 Base de Datos

### Tablas:
- **users:** Usuarios del sistema
- **products:** Catálogo de productos
- **orders:** Historial de pedidos
- **logs:** Registro de actividad

### Ubicación:
- Archivo: `store.db`
- Tipo: SQLite3

---

## 🚀 Comandos Útiles

### Iniciar el servidor:
```bash
npm start
```

### Detener el servidor:
```
Ctrl + C
```

### Ver logs en tiempo real:
Los logs aparecen en la terminal donde ejecutaste `npm start`

---

## 📝 Archivos de Configuración

- **`.env`** - Variables de entorno (puerto, tokens, etc.)
- **`server.js`** - Servidor backend
- **`public/app.js`** - Lógica del frontend
- **`public/index.html`** - Interfaz de usuario
- **`store.db`** - Base de datos SQLite

---

## 🐛 Solución de Problemas

### El servidor no inicia:
```bash
# Verifica que las dependencias estén instaladas
npm install

# Intenta iniciar nuevamente
npm start
```

### Error de puerto ocupado:
- Cambia el puerto en `.env`: `PORT=3002`
- O cierra la aplicación que usa el puerto 3001

### No puedo iniciar sesión:
- Usuario: `admin`
- Contraseña: `admin123`
- Si no funciona, elimina `store.db` y reinicia el servidor

---

## 📞 Soporte

Para más información, consulta:
- `MERCADOPAGO-CREDENCIALES.md` - Guía de credenciales de MP
- `MERCADOPAGO-TEST.md` - Guía de pruebas de MP
- `README.md` - Documentación general

---

**Última actualización:** $(Get-Date -Format "yyyy-MM-dd HH:mm")  
**Configuración:** Mercado Pago desactivado, Tarjeta y WhatsApp activos
