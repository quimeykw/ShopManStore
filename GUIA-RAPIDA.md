# 🚀 Guía Rápida - ShopManStore

## ✅ Tu Tienda Está Lista

**URL:** http://localhost:3001  
**Estado:** 🟢 Funcionando perfectamente

---

## 🔐 Acceso Rápido

### Credenciales de Admin:
```
Usuario: admin
Contraseña: admin123
```

---

## 💳 Métodos de Pago Disponibles

### 1. 💳 Tarjeta de Crédito/Débito
**Estado:** ✅ Funcionando  
**Tipo:** Simulado (para pruebas)

**Cómo funciona:**
- El cliente completa el formulario de tarjeta
- El sistema valida el formato
- Se guarda la orden en la base de datos
- **No procesa pagos reales** (es para demostración)

### 2. ✅ Mercado Pago
**Estado:** ✅ OPERATIVO EN MODO TEST  
**Tipo:** Pagos simulados (NO cobra dinero real)

**Cómo funciona:**
- Usa credenciales de TEST
- Los pagos son simulados
- Perfecto para probar tu tienda
- Usa tarjetas de prueba especiales

**Tarjeta de prueba APROBADA:**
```
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
Nombre: APRO
DNI: 12345678
```

**Más tarjetas:** Ver `TARJETAS-DE-PRUEBA-MP.md`

### 3. 💬 WhatsApp
**Estado:** ✅ Funcionando  
**Número:** +54 9 11 2254-9995

**Cómo funciona:**
- El cliente hace su pedido en la web
- Al seleccionar WhatsApp, se genera un mensaje automático
- Se abre WhatsApp con el pedido completo
- El cliente envía el mensaje y coordina el pago

**Ejemplo de mensaje:**
```
Hola! Quiero comprar:

Remera Básica (Talle: M) x2 - $3000
Pantalón Jean (Talle: 42) x1 - $5000

Total: $8000
```

---

## 🛍️ Flujo de Compra

### Para Clientes:
1. **Navegar** productos en la página principal
2. **Seleccionar talle** (si aplica)
3. **Agregar al carrito** (botón 🛒)
4. **Ver carrito** (click en "Carrito" arriba)
5. **Ajustar cantidades** (+/-)
6. **Hacer checkout** (botón "Pagar")
7. **Elegir método de pago:**
   - Tarjeta → Completar formulario
   - WhatsApp → Se abre automáticamente

---

## 📦 Gestión de Productos (Admin)

### Agregar Producto:
1. **Login** como admin
2. **Click en "Admin"** (icono ⚙️)
3. **Click en "Agregar"** (botón verde)
4. **Completar datos:**
   - Nombre del producto
   - Descripción
   - Precio
   - Stock disponible
   - Talles (separados por comas: 36, 38, 40, 42)
   - Imágenes (hasta 10)
5. **Guardar**

### Subir Imágenes:
- **Click en "Seleccionar archivos"**
- **Elegir hasta 10 imágenes**
- **Esperar compresión automática**
- **Reordenar** arrastrando (drag & drop)
- **Reemplazar** con el botón 🔄
- **Eliminar** con el botón ❌

---

## 🎨 Características Destacadas

### ✅ Multi-Imagen
- Hasta 10 imágenes por producto
- Compresión automática
- Drag & drop para reordenar
- Vista previa en tiempo real

### ✅ Galería Interactiva
- Navegación con flechas
- Miniaturas clickeables
- Zoom al hacer click
- Indicadores de posición

### ✅ Selección de Talles
- Dropdown con talles disponibles
- Validación antes de agregar al carrito
- Se muestra en el mensaje de WhatsApp

### ✅ Carrito Inteligente
- Contador en header
- Modificar cantidades
- Eliminar productos
- Cálculo automático de total

---

## 👥 Gestión de Usuarios (Admin)

### Ver Usuarios:
1. **Panel Admin** → Pestaña "Usuarios"
2. **Ver lista** de todos los usuarios
3. **Cambiar roles** (Admin/Cliente)

### Usuarios Actuales:
- **admin** - Administrador principal
- **quimeykw** - Cliente registrado

---

## 📊 Sistema de Logs (Admin)

### Ver Actividad:
1. **Panel Admin** → Pestaña "Logs"
2. **Ver historial** de acciones
3. **Información mostrada:**
   - Usuario que realizó la acción
   - Tipo de acción
   - Fecha y hora
   - Detalles

---

## 🔧 Comandos Útiles

### Iniciar servidor:
```bash
npm start
```

### Detener servidor:
```
Ctrl + C en la terminal
```

### Reinstalar dependencias:
```bash
npm install
```

---

## 📱 Responsive

La tienda se adapta automáticamente a:
- 📱 **Móviles** - Diseño vertical optimizado
- 📱 **Tablets** - Grid de 2 columnas
- 💻 **Desktop** - Grid de 4 columnas

---

## 🎯 Casos de Uso Comunes

### Cliente quiere comprar:
1. Navega productos
2. Agrega al carrito
3. Paga por WhatsApp o Tarjeta

### Admin agrega producto nuevo:
1. Login como admin
2. Panel Admin → Agregar
3. Completa datos y sube imágenes
4. Guarda

### Admin actualiza stock:
1. Panel Admin → Lista de productos
2. Click en editar (✏️)
3. Modifica stock
4. Guarda

### Cliente olvidó contraseña:
1. Click en "¿Olvidaste tu contraseña?"
2. Ingresa usuario o email
3. Ve información de su cuenta
4. Contacta al admin para resetear

---

## 💡 Tips y Trucos

### Para Mejores Fotos de Productos:
- Usa fondo blanco o neutro
- Buena iluminación
- Múltiples ángulos
- Detalles importantes (etiquetas, texturas)

### Para Gestionar Pedidos:
- Revisa WhatsApp regularmente
- Confirma stock antes de confirmar pedido
- Actualiza stock después de cada venta

### Para Mejorar Ventas:
- Descripciones claras y detalladas
- Precios competitivos
- Stock actualizado
- Respuesta rápida por WhatsApp

---

## ⚠️ Notas Importantes

### Mercado Pago:
- ✅ **OPERATIVO** en modo TEST
- 💳 Usa tarjetas de prueba (no cobra dinero real)
- 📚 Ver tarjetas: `TARJETAS-DE-PRUEBA-MP.md`
- 🔗 Panel: https://www.mercadopago.com.ar/

### Seguridad:
- Cambiar contraseña de admin regularmente
- No compartir credenciales
- Hacer backup de `store.db` periódicamente

### Backup:
```bash
# Copiar base de datos
copy store.db store_backup_$(Get-Date -Format "yyyyMMdd").db
```

---

## 📞 Soporte

### Archivos de Ayuda:
- `ESTADO-FINAL.md` - Estado completo del sistema
- `CONFIGURACION-ACTUAL.md` - Configuración detallada
- `MERCADOPAGO-CREDENCIALES.md` - Guía de Mercado Pago
- `MERCADOPAGO-TEST.md` - Pruebas de Mercado Pago

---

## 🎉 ¡Listo para Vender!

Tu tienda está **100% funcional** con:
- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ 3 métodos de pago funcionando (Tarjeta, Mercado Pago TEST, WhatsApp)
- ✅ Panel de administración
- ✅ Sistema de usuarios
- ✅ Gestión de imágenes
- ✅ Diseño responsive

**¡Éxito con tus ventas!** 🚀💰
