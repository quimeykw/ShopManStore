# 🔑 Cómo Obtener Credenciales de Mercado Pago

## ⚠️ Problema Actual

El error **"Unauthorized use of live credentials"** significa que estás usando credenciales de **PRODUCCIÓN** pero tu cuenta no está autorizada para usarlas, o estás intentando hacer pruebas con ellas.

## ✅ Solución: Usar Credenciales de TEST

### Paso 1: Acceder al Panel de Desarrolladores

1. Ve a: https://www.mercadopago.com.ar/developers/panel
2. Inicia sesión con tu cuenta de Mercado Pago

### Paso 2: Ir a Credenciales

1. En el menú lateral, haz clic en **"Credenciales"**
2. Verás dos secciones:
   - **Credenciales de prueba** (para desarrollo)
   - **Credenciales de producción** (para ventas reales)

### Paso 3: Copiar el Access Token de PRUEBA

1. En la sección **"Credenciales de prueba"**
2. Busca el campo **"Access Token"**
3. Debería verse algo así: `TEST-1234567890-112320-abcdef1234567890-12345678`
4. Copia ese token completo

### Paso 4: Actualizar el archivo .env

1. Abre el archivo `.env` en la raíz del proyecto
2. Reemplaza la línea de `MP_TOKEN` con tu token de TEST:

```env
MP_TOKEN=TEST-tu-token-de-prueba-aqui
```

### Paso 5: Reiniciar el Servidor

```bash
# Detener el servidor (Ctrl+C)
# Iniciar nuevamente
npm start
```

## 🧪 Diferencias entre TEST y PRODUCCIÓN

### Credenciales de TEST (Sandbox)
- ✅ Para desarrollo y pruebas
- ✅ No procesa pagos reales
- ✅ Usa tarjetas de prueba
- ✅ No requiere verificación de cuenta
- ✅ Token comienza con `TEST-`

### Credenciales de PRODUCCIÓN
- 💰 Para ventas reales
- 💰 Procesa pagos reales con dinero real
- 💰 Requiere cuenta verificada
- 💰 Requiere certificación de Mercado Pago
- 💰 Token comienza con `APP_USR-`

## 💳 Tarjetas de Prueba

Una vez que tengas las credenciales de TEST, usa estas tarjetas para probar:

### Visa - Pago Aprobado
- **Número:** 4509 9535 6623 3704
- **CVV:** 123
- **Fecha:** 11/25
- **Nombre:** APRO (cualquier nombre)
- **DNI:** 12345678

### Mastercard - Pago Rechazado
- **Número:** 5031 7557 3453 0604
- **CVV:** 123
- **Fecha:** 11/25
- **Nombre:** OTHE (cualquier nombre)
- **DNI:** 12345678

### Más tarjetas de prueba:
https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing

## 🚀 Pasar a Producción (Cuando estés listo)

### Requisitos:
1. ✅ Cuenta de Mercado Pago verificada
2. ✅ Aplicación certificada por Mercado Pago
3. ✅ Completar el formulario de homologación
4. ✅ Cumplir con los requisitos de seguridad

### Pasos:
1. Ve a: https://www.mercadopago.com.ar/developers/panel/credentials
2. En **"Credenciales de producción"**
3. Copia el **Access Token** de producción
4. Actualiza el `.env` con el token de producción
5. Reinicia el servidor

## 🔍 Verificar que Funciona

Después de actualizar las credenciales:

1. Reinicia el servidor
2. Verifica en los logs que diga: `Mercado Pago configurado correctamente`
3. Intenta hacer un pago de prueba
4. Deberías ver en los logs: `Respuesta de MP: { status: 200, ... }`

## ❌ Errores Comunes

### Error 401: "Unauthorized use of live credentials"
**Causa:** Usando credenciales de producción sin autorización
**Solución:** Usa credenciales de TEST

### Error 401: "Invalid token"
**Causa:** Token incorrecto o mal copiado
**Solución:** Verifica que copiaste el token completo

### Error 403: "Forbidden"
**Causa:** Cuenta no verificada o sin permisos
**Solución:** Verifica tu cuenta en Mercado Pago

## 📞 Soporte

Si tienes problemas:
- **Documentación:** https://www.mercadopago.com.ar/developers
- **Soporte:** https://www.mercadopago.com.ar/developers/es/support
- **Comunidad:** https://www.mercadopago.com.ar/developers/es/community

---

**Nota:** Las credenciales de TEST son seguras para compartir en desarrollo, pero NUNCA compartas tus credenciales de PRODUCCIÓN.
