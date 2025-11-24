# ✅ Mercado Pago - Credenciales de Producción Configuradas

## 🎉 Estado: OPERATIVO

Tu tienda ShopManStore ahora tiene Mercado Pago completamente funcional con credenciales de producción.

---

## 🔑 Credenciales Configuradas

### Access Token (Producción)
```
APP_USR-6705758039481271-111823-09ca53b5914d9759bf8dd9c972abf4cc-222452450
```

### Client Secret
```
huxcuGkqQWwE6pRBjQx6jiN3zuZEQ16b
```

---

## ⚠️ ADVERTENCIAS IMPORTANTES

### 🚨 PAGOS REALES
- Estas son credenciales de **PRODUCCIÓN**
- Todos los pagos procesados son **REALES**
- Se cobrarán **comisiones reales** por cada transacción
- El dinero se depositará en tu cuenta de Mercado Pago

### 💰 Comisiones de Mercado Pago
- Aproximadamente 4-6% + IVA por transacción
- Varía según el método de pago del cliente
- Consulta las tarifas actuales en tu panel de Mercado Pago

### 🔒 Seguridad
- **NO compartas estas credenciales** con nadie
- **NO las subas a repositorios públicos** (GitHub, GitLab, etc.)
- Mantén el archivo `.env` en tu `.gitignore`
- Considera usar variables de entorno en producción

---

## 📋 Configuración Actual

### Archivo .env
```env
PORT=3001
JWT_SECRET=shopmanstore_secret_key_2024
# Mercado Pago - Credenciales de PRODUCCIÓN (cobros reales)
MP_TOKEN=APP_USR-6705758039481271-111823-09ca53b5914d9759bf8dd9c972abf4cc-222452450
MP_CLIENT_SECRET=huxcuGkqQWwE6pRBjQx6jiN3zuZEQ16b
```

### Estado del Servidor
- ✅ Servidor corriendo en http://localhost:3001
- ✅ Mercado Pago configurado correctamente
- ✅ Procesando pagos reales

---

## 🧪 Cómo Probar

### Opción 1: Prueba con Dinero Real (NO RECOMENDADO)
1. Agregar productos al carrito
2. Ir a checkout
3. Seleccionar "Mercado Pago"
4. Completar el pago con una tarjeta real
5. ⚠️ **SE COBRARÁ DINERO REAL**

### Opción 2: Usar Credenciales de TEST (RECOMENDADO para pruebas)
Si quieres probar sin cobrar dinero real:

1. Ve a https://www.mercadopago.com.ar/developers/panel/credentials
2. Cambia a "Credenciales de prueba"
3. Copia el Access Token de TEST
4. Actualiza `.env` con el token de TEST
5. Reinicia el servidor
6. Usa tarjetas de prueba: https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing

---

## 💳 Métodos de Pago Disponibles

Tu tienda ahora acepta:

1. ✅ **Tarjeta de Crédito/Débito** (simulado)
2. ✅ **Mercado Pago** (REAL - Producción)
3. ✅ **WhatsApp** (+54 9 11 2254-9995)

---

## 📊 Monitoreo de Pagos

### Panel de Mercado Pago
- URL: https://www.mercadopago.com.ar/
- Aquí verás todas las transacciones reales
- Podrás ver comisiones, reembolsos, etc.

### Base de Datos Local
- Los pedidos también se guardan en `store.db`
- Tabla: `orders`
- Incluye: user_id, total, payment_method, created_at

---

## 🔄 Cambiar entre TEST y PRODUCCIÓN

### Para volver a TEST (desarrollo):
1. Obtén credenciales de TEST del panel de Mercado Pago
2. Actualiza `.env`:
   ```env
   MP_TOKEN=TEST-123456789-...
   ```
3. Reinicia servidor: `npm start`

### Para usar PRODUCCIÓN (actual):
- Ya está configurado ✅
- No requiere cambios

---

## 🛠️ Solución de Problemas

### Error: "Las credenciales no son válidas"
- Verifica que copiaste el token completo
- Asegúrate de no tener espacios extra
- Reinicia el servidor después de cambiar `.env`

### Error: "MP no configurado"
- Verifica que `MP_TOKEN` esté en `.env`
- Revisa los logs del servidor
- Asegúrate de tener instalado `mercadopago` npm package

### Pagos no se procesan
- Verifica tu conexión a internet
- Revisa el estado de Mercado Pago: https://status.mercadopago.com/
- Consulta los logs del servidor

---

## 📞 Soporte

### Mercado Pago
- Documentación: https://www.mercadopago.com.ar/developers/es/docs
- Soporte: https://www.mercadopago.com.ar/ayuda

### Tu Aplicación
- Logs del servidor: Consola donde corre `npm start`
- Logs del navegador: F12 > Console

---

## ✅ Checklist de Producción

Antes de publicar tu tienda:

- [ ] Probar flujo completo de compra
- [ ] Verificar que los pagos lleguen a tu cuenta MP
- [ ] Configurar webhooks para notificaciones automáticas
- [ ] Implementar manejo de estados de pago (pending, approved, rejected)
- [ ] Agregar página de confirmación de pago
- [ ] Configurar emails de confirmación
- [ ] Revisar comisiones y precios de productos
- [ ] Tener plan para reembolsos
- [ ] Documentar proceso de atención al cliente

---

## 🎯 Próximos Pasos Recomendados

1. **Webhooks de Mercado Pago**
   - Recibir notificaciones automáticas de pagos
   - Actualizar estado de órdenes automáticamente

2. **Página de Confirmación**
   - Mostrar estado del pago al usuario
   - Enviar email de confirmación

3. **Panel de Órdenes**
   - Ver todas las órdenes en el admin
   - Filtrar por estado de pago
   - Gestionar envíos

4. **Reembolsos**
   - Implementar sistema de reembolsos
   - Integrar con API de Mercado Pago

---

## 🎉 ¡Felicitaciones!

Tu tienda ya puede procesar pagos reales con Mercado Pago. Asegúrate de probar todo exhaustivamente antes de publicar.

**¡Éxito con tus ventas!** 🚀
