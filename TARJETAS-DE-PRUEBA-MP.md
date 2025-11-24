# 💳 Tarjetas de Prueba - Mercado Pago

## ✅ Mercado Pago Configurado en Modo TEST

Tu tienda ahora usa credenciales de TEST de Mercado Pago. Esto significa:
- ✅ Puedes probar pagos sin cobrar dinero real
- ✅ Usa las tarjetas de prueba de abajo
- ✅ Los pagos son simulados
- ✅ Perfecto para desarrollo y pruebas

---

## 🧪 Tarjetas de Prueba

### ✅ Pago APROBADO

**Mastercard:**
```
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
Nombre: APRO
DNI: 12345678
```

**Visa:**
```
Número: 4509 9535 6623 3704
CVV: 123
Vencimiento: 11/25
Nombre: APRO
DNI: 12345678
```

---

### ❌ Pago RECHAZADO

**Mastercard:**
```
Número: 5031 4332 1540 6351
CVV: 123
Vencimiento: 11/25
Nombre: OTRE
DNI: 12345678
```

**Visa:**
```
Número: 4074 5957 4450 2899
CVV: 123
Vencimiento: 11/25
Nombre: OTRE
DNI: 12345678
```

---

### ⏳ Pago PENDIENTE

**Mastercard:**
```
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
Nombre: CONT
DNI: 12345678
```

---

### 💰 Fondos INSUFICIENTES

**Mastercard:**
```
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
Nombre: FUND
DNI: 12345678
```

---

### 🔒 Tarjeta con SEGURIDAD

**Mastercard:**
```
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
Nombre: SECU
DNI: 12345678
```

---

### 💳 American Express

**Aprobada:**
```
Número: 3711 803032 57522
CVV: 1234
Vencimiento: 11/25
Nombre: APRO
DNI: 12345678
```

---

## 🧪 Cómo Probar

### 1. Abrir tu Tienda
```
http://localhost:3001
```

### 2. Agregar Productos al Carrito
- Navega por los productos
- Agrega algunos al carrito
- Selecciona talles si es necesario

### 3. Ir a Checkout
- Click en "Carrito" (arriba a la derecha)
- Click en "Pagar"

### 4. Seleccionar Mercado Pago
- Click en el botón "Mercado Pago"
- Se abrirá una nueva ventana con el checkout de Mercado Pago
- Verás un mensaje: "⚠️ Modo TEST - Usa tarjetas de prueba"

### 5. Completar el Pago en Mercado Pago
- En la ventana que se abrió, verás el checkout de Mercado Pago
- Ingresa los datos de una tarjeta de prueba de arriba
- Completa el formulario
- Click en "Pagar"

### 6. Ver el Resultado
- ✅ Si usaste "APRO" → Pago aprobado
- ❌ Si usaste "OTRE" → Pago rechazado
- ⏳ Si usaste "CONT" → Pago pendiente
- Serás redirigido de vuelta a tu tienda

---

## 📊 Verificar Transacciones

### En tu Panel de Mercado Pago:
1. Ve a: https://www.mercadopago.com.ar/
2. Cambia a modo **TEST** (toggle arriba)
3. Ve a "Actividad" o "Ventas"
4. Verás todas las transacciones de prueba

### En tu Base de Datos:
Las órdenes se guardan en `store.db` en la tabla `orders`

### En los Logs del Servidor:
En la consola donde corre `npm start` verás:
```
Creando pago MP para: [usuario] Total: [monto]
Respuesta de MP: { status: 200, payment_id: '...', payment_status: 'approved' }
Orden guardada exitosamente
```

---

## 💡 Consejos para Pruebas

### Prueba Diferentes Escenarios:
- ✅ Pago aprobado (tarjeta APRO)
- ❌ Pago rechazado (tarjeta OTRE)
- ⏳ Pago pendiente (tarjeta CONT)
- 💰 Fondos insuficientes (tarjeta FUND)

### Verifica que tu App:
- Muestra mensajes claros de éxito/error
- Guarda las órdenes correctamente
- Limpia el carrito después del pago
- Maneja errores sin cerrar sesión

---

## 🚀 Cuando Estés Listo para Producción

### 1. Certificar tu Aplicación
- Ve a: https://www.mercadopago.com.ar/developers/panel/app
- Completa el formulario de certificación
- Espera la aprobación (puede tomar días)

### 2. Cambiar a Credenciales de Producción
Una vez aprobado:
```env
# En .env
MP_TOKEN=APP_USR-tu-token-de-produccion-aqui
```

### 3. Reiniciar Servidor
```bash
npm start
```

### 4. Probar con Dinero Real
- Haz una compra pequeña de prueba
- Verifica que el dinero llegue a tu cuenta
- ⚠️ Los pagos serán REALES

---

## 📞 Más Información

### Documentación Oficial:
- Tarjetas de prueba: https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing
- Credenciales: https://www.mercadopago.com.ar/developers/panel/credentials
- Certificación: https://www.mercadopago.com.ar/developers/panel/app

### Archivos de Ayuda:
- `COMO-USAR-MERCADOPAGO-TEST.md` - Guía completa de TEST
- `PROBLEMA-CREDENCIALES-PRODUCCION.md` - Explicación del problema anterior
- `ESTADO-FINAL.md` - Estado actual del sistema

---

## ✅ Estado Actual

- ✅ Mercado Pago configurado en modo TEST
- ✅ Token válido: `TEST-6705758039481271-...`
- ✅ Servidor corriendo en http://localhost:3001
- ✅ Listo para probar con tarjetas de prueba
- ⚠️ Los pagos NO son reales (es para pruebas)

---

## 🎉 ¡Listo para Probar!

Ahora puedes probar Mercado Pago sin cobrar dinero real. Usa las tarjetas de arriba y verifica que todo funcione correctamente.

**¡Buena suerte con las pruebas!** 🚀
