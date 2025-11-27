# 🚀 Instrucciones de Deploy - ShopManStore

## ✅ Sistema Verificado y Listo

Todas las verificaciones han pasado exitosamente. El sistema está listo para ser desplegado a producción.

## 📋 Resumen de Cambios

### Nuevas Funcionalidades
- ✅ Logs detallados de compras con productos y cantidades
- ✅ Notificaciones automáticas por WhatsApp
- ✅ Descuento automático del 10% en todas las compras
- ✅ Envío gratis para compras mayores a $80,000
- ✅ Pagos reales con Mercado Pago (producción)
- ✅ Almacenamiento detallado de órdenes

### Archivos Nuevos
```
whatsapp-service.js
migrate-add-items-column.js
test-purchase-notification.js
test-log-formatting.js
test-mercadopago-integration.js
NUEVAS-FUNCIONALIDADES-COMPRAS.md
CHANGELOG-NUEVAS-FUNCIONES.md
DEPLOY-INSTRUCTIONS.md
pre-deploy-check.js
```

### Archivos Modificados
```
server.js
public/app.js
db-config.js
.env.example
```

## 🔧 Pasos para Deploy

### 1. Preparar el Commit

```bash
# Verificar estado
git status

# Agregar todos los cambios
git add .

# Crear commit con mensaje descriptivo
git commit -m "feat: Agregar logs detallados, notificaciones WhatsApp, descuentos y envío gratis

- Implementar sistema de logs detallados de compras
- Agregar notificaciones automáticas por WhatsApp
- Aplicar descuento del 10% automático
- Activar envío gratis para compras +$80,000
- Configurar pagos reales con Mercado Pago
- Mejorar almacenamiento de órdenes con detalles de productos
- Actualizar frontend con desglose de precios
- Agregar tests de integración completos"
```

### 2. Push a GitHub

```bash
# Push a la rama principal
git push origin main

# O si usas master:
git push origin master
```

### 3. Verificar en Render

Render detectará automáticamente los cambios y comenzará el deploy.

**Monitorear el deploy:**
1. Ve a https://dashboard.render.com
2. Selecciona tu servicio "shopmanstore"
3. Ve a la pestaña "Events" o "Logs"
4. Verás el progreso del deploy en tiempo real

**El deploy incluirá:**
- ✅ Instalación de dependencias
- ✅ Ejecución de la migración de base de datos (automática)
- ✅ Reinicio del servidor con los nuevos cambios

### 4. Verificar Variables de Entorno en Render

Asegúrate de que estas variables estén configuradas en Render:

```bash
# Ya configuradas (verificar):
PORT=3001
JWT_SECRET=shopmanstore_secret_key_2024
MP_TOKEN=APP_USR-6705758039481271-111823-09ca53b5914d9759bf8dd9c972abf4cc-222452450
MP_CLIENT_SECRET=huxcuGkqQWwE6pRBjQx6jiN3zuZEQ16b
DATABASE_URL=(automático de Render)
EMAIL_USER=shopmanstorej@gmail.com
EMAIL_APP_PASSWORD=urvryhdurzflowwaq
BASE_URL=(tu URL de Render)

# Nuevas (agregar si no existen):
WHATSAPP_PHONE=5491122549995
WHATSAPP_ENABLED=true
```

**Para agregar variables en Render:**
1. Ve a tu servicio en Render
2. Click en "Environment"
3. Click en "Add Environment Variable"
4. Agrega `WHATSAPP_PHONE` y `WHATSAPP_ENABLED`
5. Click en "Save Changes"

### 5. Verificar el Deploy

Una vez que el deploy termine (usualmente 2-5 minutos):

**Pruebas básicas:**
1. Abre tu URL de Render: `https://tu-app.onrender.com`
2. Verifica que la página carga correctamente
3. Inicia sesión con admin/admin123
4. Agrega un producto al carrito
5. Verifica que se muestre el descuento del 10%
6. Verifica el mensaje de envío gratis

**Pruebas de compra:**
1. Intenta hacer una compra de prueba (NO completes el pago a menos que quieras cobrar dinero real)
2. Ve al panel de admin → Logs
3. Verifica que los logs muestren los detalles completos
4. Verifica en los logs del servidor que se preparó la notificación de WhatsApp

## 🔍 Monitoreo Post-Deploy

### Logs del Servidor

```bash
# En Render, ve a la pestaña "Logs" para ver:
- Mensajes de inicio del servidor
- Confirmación de migración de base de datos
- Logs de compras con detalles
- Notificaciones de WhatsApp preparadas
```

### Verificar Base de Datos

La migración se ejecuta automáticamente al iniciar el servidor. Verás en los logs:

```
✓ Columna items agregada/verificada en PostgreSQL
```

### Verificar Funcionalidades

**Checklist post-deploy:**
- [ ] Página principal carga correctamente
- [ ] Login funciona
- [ ] Productos se muestran
- [ ] Carrito muestra descuento del 10%
- [ ] Mensaje de envío gratis aparece cuando corresponde
- [ ] Mercado Pago genera links de pago
- [ ] Logs muestran detalles de compras
- [ ] Panel de admin funciona correctamente

## 🚨 Troubleshooting

### Si el deploy falla:

1. **Revisa los logs en Render**
   - Busca mensajes de error en rojo
   - Verifica que todas las dependencias se instalaron

2. **Verifica las variables de entorno**
   - Asegúrate de que todas estén configuradas
   - Verifica que no haya espacios extra

3. **Verifica la migración de base de datos**
   - Debe ejecutarse automáticamente
   - Si falla, puedes ejecutarla manualmente desde el shell de Render

4. **Rollback si es necesario**
   ```bash
   # Volver al commit anterior
   git revert HEAD
   git push origin main
   ```

### Si algo no funciona en producción:

1. **Revisa los logs en tiempo real**
   - En Render: Pestaña "Logs"
   - Busca errores o warnings

2. **Verifica la base de datos**
   - Conecta a PostgreSQL desde DBeaver
   - Verifica que la columna `items` existe en la tabla `orders`

3. **Prueba localmente primero**
   - Usa las mismas variables de entorno de producción
   - Reproduce el error localmente

## 📊 Métricas a Monitorear

Después del deploy, monitorea:

1. **Tasa de error**: Debe mantenerse baja
2. **Tiempo de respuesta**: Debe ser similar al anterior
3. **Logs de compras**: Deben mostrar información completa
4. **Notificaciones WhatsApp**: Deben prepararse correctamente

## 🎉 ¡Deploy Exitoso!

Si todo funciona correctamente, verás:

- ✅ Página cargando normalmente
- ✅ Descuento del 10% aplicándose automáticamente
- ✅ Envío gratis para compras +$80,000
- ✅ Logs detallados en el panel de admin
- ✅ Notificaciones WhatsApp preparándose automáticamente
- ✅ Pagos reales funcionando con Mercado Pago

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en Render
2. Verifica las variables de entorno
3. Ejecuta `node pre-deploy-check.js` localmente
4. Revisa `CHANGELOG-NUEVAS-FUNCIONES.md` para detalles

---

**¡Felicitaciones! Tu tienda está lista para recibir pagos reales con todas las nuevas funcionalidades.** 🎊
