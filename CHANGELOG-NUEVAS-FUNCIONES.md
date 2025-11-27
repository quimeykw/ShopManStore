# Changelog - Nuevas Funcionalidades

## 🎉 Versión 2.0 - Noviembre 2025

### ✨ Nuevas Funcionalidades Implementadas

#### 1. **Sistema de Logs Detallados de Compras**
- ✅ Los logs ahora muestran información completa de cada compra
- ✅ Incluye: productos, cantidades, talles, método de pago y total
- ✅ Formato legible para administradores
- ✅ Vista mejorada en el panel de admin con iconos y colores

**Ejemplo de log:**
```
Productos: Remera Negra (M) x2, Jean Azul (L) x1 | Total productos: 3 | Método: Mercado Pago | Total: $22,000
```

#### 2. **Notificaciones Automáticas por WhatsApp**
- ✅ Se envía automáticamente al completar cualquier compra
- ✅ Incluye todos los detalles: orden, productos, cantidades, total
- ✅ Formato profesional con emojis
- ✅ No bloquea el proceso de compra si falla el envío
- ✅ Registra en logs cada intento de envío

**Formato del mensaje:**
```
🛍️ COMPRA CONFIRMADA
📦 Orden #123
👤 Cliente: usuario
📅 Fecha: 26/11/2025 20:30
Productos:
• Remera Negra (M) x2 - $10,000
• Jean Azul (L) x1 - $12,000
💰 Total: $22,000
💳 Método: Mercado Pago
¡Gracias por tu compra! 🎉
```

#### 3. **Almacenamiento Detallado de Órdenes**
- ✅ Nueva columna `items` en la tabla `orders`
- ✅ Guarda información completa de cada producto en JSON
- ✅ Permite análisis y reportes futuros
- ✅ Compatible con órdenes antiguas (backward compatible)

**Estructura de datos:**
```json
{
  "id": 1,
  "name": "Remera Negra",
  "quantity": 2,
  "price": 5000,
  "size": "M"
}
```

#### 4. **Descuento Automático del 10%**
- ✅ Se aplica automáticamente a todas las compras
- ✅ Se muestra claramente en el carrito
- ✅ Desglose de precios: Subtotal, Descuento, Total

#### 5. **Envío Gratis para Compras Mayores a $80,000**
- ✅ Se activa automáticamente cuando el total (después del descuento) supera $80,000
- ✅ Indicador visual en el carrito
- ✅ Mensaje informativo cuando no califica

#### 6. **Pagos Reales con Mercado Pago**
- ✅ Configurado para usar credenciales de producción
- ✅ Genera links de pago reales
- ✅ Mensaje de alerta claro: "PAGO REAL - Se cobrará dinero real"

### 🔧 Mejoras Técnicas

#### Backend
- ✅ Nuevo servicio `whatsapp-service.js` para notificaciones
- ✅ Función `formatPurchaseLog()` para logs estructurados
- ✅ Endpoint GET `/api/orders` para obtener órdenes con items parseados
- ✅ Mejora en `db-config.js` para soportar `lastID` en PostgreSQL
- ✅ Manejo robusto de errores en notificaciones WhatsApp

#### Frontend
- ✅ Función `formatCartItems()` para preparar datos de compra
- ✅ Función `updateCart()` mejorada con desglose de precios
- ✅ Vista de logs mejorada con iconos distintivos y colores
- ✅ Cálculo automático de descuentos y envío gratis

#### Base de Datos
- ✅ Script de migración `migrate-add-items-column.js`
- ✅ Soporte para SQLite y PostgreSQL
- ✅ Migración automática al iniciar el servidor

### 📁 Archivos Nuevos

```
whatsapp-service.js                    # Servicio de notificaciones WhatsApp
migrate-add-items-column.js            # Migración de base de datos
test-purchase-notification.js          # Test de notificaciones
test-log-formatting.js                 # Test de formateo de logs
test-mercadopago-integration.js        # Test de integración completo
NUEVAS-FUNCIONALIDADES-COMPRAS.md      # Documentación detallada
CHANGELOG-NUEVAS-FUNCIONES.md          # Este archivo
```

### 📝 Archivos Modificados

```
server.js                              # Endpoints actualizados
public/app.js                          # Frontend con descuentos y envío gratis
db-config.js                           # Soporte para lastID en PostgreSQL
.env.example                           # Variables de entorno agregadas
```

### 🔐 Variables de Entorno Nuevas

```bash
# WhatsApp Configuration
WHATSAPP_PHONE=5491122549995           # Número de WhatsApp destino
WHATSAPP_ENABLED=true                  # Habilitar/deshabilitar notificaciones
```

### ✅ Tests Realizados

- ✅ Login y autenticación
- ✅ Obtención de productos
- ✅ Creación de preferencia de Mercado Pago
- ✅ Guardado de orden con items
- ✅ Logs detallados de compra
- ✅ Notificaciones WhatsApp preparadas
- ✅ Formato correcto de datos
- ✅ Descuento del 10% aplicado
- ✅ Envío gratis para compras +$80,000

### 🚀 Despliegue a Render

**Pasos para desplegar:**

1. **Commit y push a GitHub:**
```bash
git add .
git commit -m "feat: Agregar logs detallados, notificaciones WhatsApp, descuentos y envío gratis"
git push origin main
```

2. **Render detectará los cambios automáticamente**
   - La migración de base de datos se ejecutará automáticamente
   - Las nuevas variables de entorno ya están configuradas en Render

3. **Verificar en producción:**
   - Probar una compra de prueba
   - Verificar logs en el panel de admin
   - Confirmar que las notificaciones se preparan correctamente

### 📊 Compatibilidad

- ✅ **Backward Compatible**: Órdenes antiguas siguen funcionando
- ✅ **Multi-DB**: Funciona con SQLite (desarrollo) y PostgreSQL (producción)
- ✅ **Manejo de Errores**: Fallos de WhatsApp no afectan las compras
- ✅ **Responsive**: Funciona en móviles y desktop

### 🎯 Próximos Pasos Opcionales

1. **Webhooks de Mercado Pago**: Para actualizar estado de órdenes automáticamente
2. **Envío a Cliente**: Enviar notificación al teléfono del cliente
3. **Dashboard de Ventas**: Análisis de productos más vendidos
4. **Reportes**: Exportar datos de ventas

### 📞 Soporte

Si encuentras algún problema:
1. Revisa los logs del servidor
2. Verifica las variables de entorno
3. Asegúrate de que la migración se ejecutó correctamente

---

**Desarrollado con ❤️ para ShopManStore**
