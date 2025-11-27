# 🧪 Cómo Usar Mercado Pago con Credenciales de TEST

## 📋 Guía Paso a Paso

Esta guía te ayudará a configurar Mercado Pago con credenciales de TEST para que puedas probar tu tienda sin cobrar dinero real.

---

## 🎯 Paso 1: Obtener Credenciales de TEST

### 1.1 Ir al Panel de Desarrolladores
Abre tu navegador y ve a:
```
https://www.mercadopago.com.ar/developers/panel/credentials
```

### 1.2 Iniciar Sesión
- Usa tu cuenta de Mercado Pago
- Si no tienes cuenta, créala en: https://www.mercadopago.com.ar/

### 1.3 Cambiar a Modo TEST
- Busca un toggle o pestaña que diga **"Producción"** / **"Prueba"**
- Haz click en **"Prueba"** o **"Test"**
- La página mostrará tus credenciales de prueba

### 1.4 Copiar las Credenciales
Verás dos credenciales importantes:

**Access Token (Public Key):**
```
TEST-1234567890123456-112233-abcdef1234567890abcdef1234567890-123456789
```
- Debe empezar con `TEST-`
- Es una cadena larga de números y letras

**Client Secret:**
```
abcdefghijklmnopqrstuvwxyz123456
```
- Es más corta que el Access Token

---

## 🔧 Paso 2: Actualizar tu Aplicación

### 2.1 Abrir el archivo .env
En tu proyecto, abre el archivo `.env`

### 2.2 Reemplazar las Credenciales
Cambia las líneas de Mercado Pago:

**ANTES:**
```env
PORT=3001
JWT_SECRET=shopmanstore_secret_key_2024
# Mercado Pago - Credenciales de PRODUCCIÓN (cobros reales)
MP_TOKEN=APP_USR-6705758039481271-111823-09ca53b5914d9759bf8dd9c972abf4cc-222452450
MP_CLIENT_SECRET=huxcuGkqQWwE6pRBjQx6jiN3zuZEQ16b
```

**DESPUÉS:**
```env
PORT=3001
JWT_SECRET=shopmanstore_secret_key_2024
# Mercado Pago - Credenciales de TEST (para desarrollo)
MP_TOKEN=TEST-tu-token-de-test-aqui
MP_CLIENT_SECRET=tu-client-secret-de-test-aqui
```

### 2.3 Guardar el Archivo
- Guarda los cambios en `.env`
- Asegúrate de que no haya espacios extra

---

## 🔄 Paso 3: Reiniciar el Servidor

### 3.1 Detener el Servidor Actual
En la terminal donde corre el servidor:
- Presiona `Ctrl + C`
- Espera a que se detenga completamente

### 3.2 Iniciar el Servidor de Nuevo
```bash
npm start
```

### 3.3 Verificar que Funciona
Deberías ver en la consola:
```
Usando SQLite
Mercado Pago configurado correctamente
Server: http://localhost:3001
Environment: development
✓ Usuario admin inicializado
```

---

## 🧪 Paso 4: Probar con Tarjetas de Prueba

### 4.1 Abrir tu Tienda
Ve a: http://localhost:3001

### 4.2 Agregar Productos al Carrito
- Navega por los productos
- Agrega algunos al carrito

### 4.3 Ir a Checkout
- Click en "Carrito"
- Click en "Pagar"

### 4.4 Seleccionar Mercado Pago
- Click en el botón "Mercado Pago"

### 4.5 Usar Tarjeta de Prueba

**Para pago APROBADO:**
```
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
Nombre: APRO
DNI: 12345678
```

**Para pago RECHAZADO:**
```
Número: 5031 4332 1540 6351
CVV: 123
Vencimiento: 11/25
Nombre: OTRE
DNI: 12345678
```

**Para pago PENDIENTE:**
```
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
Nombre: CONT
DNI: 12345678
```

---

## 📊 Paso 5: Verificar los Resultados

### 5.1 En tu Aplicación
- Deberías ver un mensaje de éxito o error
- La orden se guarda en la base de datos

### 5.2 En el Panel de Mercado Pago
- Ve a: https://www.mercadopago.com.ar/
- Cambia a modo TEST
- Verás las transacciones de prueba

### 5.3 En los Logs del Servidor
En la consola donde corre el servidor verás:
```
Creando pago MP para: [usuario] Total: [monto]
Respuesta de MP: { status: 200, payment_id: '...', payment_status: 'approved' }
Orden guardada exitosamente
```

---

## ✅ Verificación Final

### Todo funciona si:
- ✅ El servidor inicia sin errores
- ✅ Puedes seleccionar Mercado Pago en checkout
- ✅ Las tarjetas de prueba funcionan
- ✅ Ves las transacciones en el panel de MP
- ✅ No hay errores en la consola

### Si algo falla:
- ❌ Verifica que copiaste bien las credenciales
- ❌ Asegúrate de que el token empiece con `TEST-`
- ❌ Reinicia el servidor después de cambiar `.env`
- ❌ Revisa los logs del servidor para errores

---

## 🎓 Más Tarjetas de Prueba

### Mastercard
```
Aprobada: 5031 7557 3453 0604
Rechazada: 5031 4332 1540 6351
```

### Visa
```
Aprobada: 4509 9535 6623 3704
Rechazada: 4074 5957 4450 2899
```

### American Express
```
Aprobada: 3711 803032 57522
```

**Lista completa:**
https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing

---

## 💡 Consejos

### Durante el Desarrollo:
- ✅ Usa siempre credenciales de TEST
- ✅ Prueba todos los casos (aprobado, rechazado, pendiente)
- ✅ Verifica que los errores se manejen bien
- ✅ Asegúrate de que las órdenes se guarden correctamente

### Antes de Producción:
- 📝 Completa la certificación de Mercado Pago
- 🔍 Prueba exhaustivamente con TEST
- 📧 Implementa notificaciones por email
- 🔔 Configura webhooks para actualizaciones automáticas

---

## 🚀 Cuando Estés Listo para Producción

### 1. Certificar tu Aplicación
- Ve a: https://www.mercadopago.com.ar/developers/panel/app
- Completa el formulario de certificación
- Espera la aprobación (puede tomar días)

### 2. Cambiar a Credenciales de Producción
- Una vez aprobado, obtén credenciales de producción
- Actualiza `.env` con las credenciales de producción
- Reinicia el servidor

### 3. Probar con Dinero Real
- Haz una compra pequeña de prueba
- Verifica que el dinero llegue a tu cuenta
- Confirma que todo funciona correctamente

---

## 📞 Soporte

### Documentación Oficial:
- Credenciales: https://www.mercadopago.com.ar/developers/panel/credentials
- Testing: https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing
- Certificación: https://www.mercadopago.com.ar/developers/panel/app

### Ayuda de Mercado Pago:
- https://www.mercadopago.com.ar/ayuda

### Archivos de Ayuda en tu Proyecto:
- `PROBLEMA-CREDENCIALES-PRODUCCION.md` - Explicación del problema
- `ESTADO-FINAL.md` - Estado actual del sistema
- `GUIA-RAPIDA.md` - Guía rápida de uso

---

## 🎉 ¡Listo!

Siguiendo estos pasos, tendrás Mercado Pago funcionando en modo TEST y podrás probar tu tienda sin cobrar dinero real.

**¡Buena suerte con tu tienda!** 🚀
