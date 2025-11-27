# Guía de Prueba - Mercado Pago

## ✅ Configuración Actual

**Token configurado:** `APP_USR-312986056474853-112320-2e5d635775f72335200f0a75382f96a6-3008632533`

**Estado del servidor:**
- ✅ Servidor activo en http://localhost:3001
- ✅ Mercado Pago configurado correctamente
- ✅ Endpoints disponibles: `/api/mp-link` y `/api/mp-payment`

## 🧪 Pasos para Probar Mercado Pago

### 1. Acceder a la Aplicación
1. Abre tu navegador en: http://localhost:3001
2. Inicia sesión con:
   - **Usuario:** admin
   - **Contraseña:** admin123

### 2. Crear un Producto de Prueba
1. Haz clic en el botón **Admin** (icono de engranaje)
2. Haz clic en **Agregar** (botón verde)
3. Completa los datos:
   - **Nombre:** Producto de Prueba MP
   - **Descripción:** Prueba de integración con Mercado Pago
   - **Precio:** 100
   - **Stock:** 10
   - **Talles:** (opcional)
4. Sube al menos una imagen
5. Haz clic en **Guardar**

### 3. Agregar al Carrito
1. Cierra el panel de admin
2. Busca el producto que acabas de crear
3. Haz clic en el botón del carrito (🛒)
4. Verifica que aparezca en el carrito lateral

### 4. Probar Mercado Pago
1. En el carrito, haz clic en **Pagar**
2. Selecciona **Mercado Pago** (botón celeste con icono QR)
3. Observa:
   - El botón debe mostrar "Procesando..." con un spinner
   - Se debe abrir una nueva ventana/pestaña con el link de pago de MP
   - Debe aparecer un alert con el ID del pago
   - El carrito debe vaciarse automáticamente

### 5. Verificar en la Consola del Servidor
Revisa la terminal donde corre el servidor, deberías ver:
```
Creando pago MP para: admin Total: 100
Respuesta de MP: { status: 200, payment_id: XXXXX, payment_status: 'pending' }
Orden guardada exitosamente
```

## 🔍 Verificación de Errores Comunes

### Error: "Mercado Pago no configurado"
**Causa:** El token no está configurado correctamente
**Solución:** 
- Verifica que el archivo `.env` existe y contiene el token
- Reinicia el servidor con `npm start`

### Error: "Error de conexión con Mercado Pago"
**Causa:** Problema de red o token inválido
**Solución:**
- Verifica tu conexión a internet
- Verifica que el token sea válido en tu cuenta de Mercado Pago
- Revisa los logs del servidor para más detalles

### No se abre la ventana de pago
**Causa:** Bloqueador de ventanas emergentes
**Solución:**
- Permite ventanas emergentes para localhost:3001
- El sistema mostrará el link en un alert como alternativa

## 📊 Verificar Órdenes en la Base de Datos

Para ver las órdenes creadas, puedes:

1. **Desde el panel de admin:**
   - Ve a la pestaña "Logs" para ver la actividad

2. **Desde la consola del servidor:**
   - Las órdenes se guardan en la tabla `orders`
   - Cada orden incluye el ID de pago de Mercado Pago

## 🎯 Funcionalidades Implementadas

✅ **Integración con API de Payments de Mercado Pago**
- Endpoint `/api/mp-link` para generar links de pago
- Endpoint `/api/mp-payment` para pagos directos con tarjeta

✅ **Manejo de Errores Mejorado**
- Validación de datos antes de enviar a MP
- Mensajes de error descriptivos
- Logs detallados en el servidor

✅ **Experiencia de Usuario**
- Indicador de carga mientras se procesa
- Mensajes informativos con ID de pago
- Limpieza automática del carrito tras pago exitoso

✅ **Persistencia de Datos**
- Órdenes guardadas en la base de datos
- Registro del ID de pago de Mercado Pago

## 🔗 Recursos Adicionales

- **Documentación de MP:** https://www.mercadopago.com.ar/developers
- **API Reference:** https://www.mercadopago.com.ar/developers/es/reference/payments/_payments/post
- **Dashboard de MP:** https://www.mercadopago.com.ar/

## 💡 Próximos Pasos (Opcional)

Para una integración más completa, considera:

1. **Webhooks:** Recibir notificaciones automáticas de cambios de estado
2. **Checkout Pro:** Usar el checkout completo de Mercado Pago
3. **Tarjetas guardadas:** Permitir guardar tarjetas para compras futuras
4. **Cuotas:** Implementar pagos en cuotas
5. **Devoluciones:** Sistema de reembolsos

## 🐛 Reporte de Problemas

Si encuentras algún problema:
1. Revisa los logs del servidor en la terminal
2. Abre la consola del navegador (F12) para ver errores de JavaScript
3. Verifica que el token de MP sea válido
4. Asegúrate de tener conexión a internet

---

**Última actualización:** $(Get-Date -Format "yyyy-MM-dd HH:mm")
**Estado:** ✅ Configurado y listo para probar
