# ⚠️ Problema: Credenciales de Producción No Autorizadas

## 🔴 Error Detectado

```
Error: Unauthorized use of live credentials
```

## 📋 ¿Qué significa esto?

Aunque tienes credenciales de **PRODUCCIÓN** de Mercado Pago, tu cuenta **NO está autorizada** para usarlas en la API todavía.

Mercado Pago requiere que completes ciertos pasos antes de poder usar credenciales de producción:

### Requisitos para usar credenciales de PRODUCCIÓN:

1. ✅ **Cuenta verificada** - Identidad confirmada
2. ❌ **Certificación completada** - Debes certificar tu integración
3. ❌ **Homologación aprobada** - Mercado Pago debe aprobar tu aplicación

## 🎯 Solución: Usar Credenciales de TEST

Para desarrollo y pruebas, **DEBES usar credenciales de TEST**, no de producción.

### ¿Por qué usar TEST?

- ✅ No requiere certificación
- ✅ No cobra dinero real
- ✅ Puedes probar todo el flujo
- ✅ Usa tarjetas de prueba
- ✅ Funciona inmediatamente

### ¿Cuándo usar PRODUCCIÓN?

- Solo después de completar la certificación
- Solo cuando Mercado Pago apruebe tu aplicación
- Solo cuando estés listo para cobrar dinero real

---

## 🔧 Cómo Obtener Credenciales de TEST

### Paso 1: Ir al Panel de Desarrolladores
https://www.mercadopago.com.ar/developers/panel/credentials

### Paso 2: Cambiar a "Credenciales de prueba"
- Verás un toggle o pestaña que dice "Producción" / "Prueba"
- Selecciona **"Prueba"** o **"Test"**

### Paso 3: Copiar el Access Token de TEST
- Debe empezar con `TEST-` (no `APP_USR-`)
- Ejemplo: `TEST-1234567890123456-112233-abcdef1234567890abcdef1234567890-123456789`

### Paso 4: Actualizar tu .env
```env
PORT=3001
JWT_SECRET=shopmanstore_secret_key_2024
# Mercado Pago - Credenciales de TEST (para desarrollo)
MP_TOKEN=TEST-tu-token-de-test-aqui
MP_CLIENT_SECRET=tu-client-secret-aqui
```

### Paso 5: Reiniciar el servidor
```bash
# Detener el servidor actual (Ctrl+C)
# Luego iniciar de nuevo
npm start
```

---

## 🧪 Tarjetas de Prueba

Con credenciales de TEST, usa estas tarjetas:

### Tarjeta Aprobada:
- **Número:** 5031 7557 3453 0604
- **CVV:** 123
- **Vencimiento:** 11/25
- **Nombre:** APRO

### Tarjeta Rechazada:
- **Número:** 5031 4332 1540 6351
- **CVV:** 123
- **Vencimiento:** 11/25
- **Nombre:** OTRE

### Más tarjetas de prueba:
https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing

---

## 📝 Proceso de Certificación (para PRODUCCIÓN)

Si quieres usar credenciales de producción en el futuro:

### 1. Completar la Integración
- Implementar todos los flujos de pago
- Manejar todos los estados (approved, rejected, pending)
- Implementar webhooks para notificaciones

### 2. Certificar tu Aplicación
- Ir a: https://www.mercadopago.com.ar/developers/panel/app
- Completar el formulario de certificación
- Probar todos los casos de uso

### 3. Esperar Aprobación
- Mercado Pago revisará tu integración
- Puede tomar varios días
- Te notificarán por email

### 4. Activar Producción
- Una vez aprobado, podrás usar credenciales de producción
- Los pagos serán reales

---

## 🎯 Recomendación Actual

**Para tu tienda ShopManStore:**

1. **Usa credenciales de TEST** para desarrollo
2. **Prueba todo el flujo** con tarjetas de prueba
3. **Cuando estés listo para vender:**
   - Completa la certificación
   - Espera la aprobación
   - Cambia a credenciales de producción

---

## 💡 Alternativas Mientras Tanto

Mientras no tengas Mercado Pago de producción funcionando:

### Opción 1: Solo WhatsApp y Tarjeta
- ✅ WhatsApp funciona perfectamente
- ✅ Tarjeta (simulada) funciona
- Los clientes pueden pagar por WhatsApp (transferencia, efectivo, etc.)

### Opción 2: Mercado Pago con TEST
- Usa credenciales de TEST
- Explica a los clientes que es un demo
- Cuando certifiques, cambia a producción

### Opción 3: Otros métodos de pago
- Transferencia bancaria
- Efectivo
- Otros procesadores de pago

---

## 🔄 Próximos Pasos

1. **Obtener credenciales de TEST** del panel de Mercado Pago
2. **Actualizar .env** con el token de TEST
3. **Reiniciar servidor**
4. **Probar con tarjetas de prueba**
5. **Cuando estés listo, certificar** para producción

---

## 📞 Soporte de Mercado Pago

- Documentación: https://www.mercadopago.com.ar/developers/es/docs
- Soporte: https://www.mercadopago.com.ar/ayuda
- Certificación: https://www.mercadopago.com.ar/developers/panel/app

---

## ✅ Resumen

- ❌ **Credenciales de PRODUCCIÓN no funcionan** (requieren certificación)
- ✅ **Credenciales de TEST funcionan** inmediatamente
- 💡 **Usa TEST para desarrollo**
- 🚀 **Certifica cuando estés listo** para producción

**Por ahora, obtén credenciales de TEST y úsalas para probar tu tienda.**
