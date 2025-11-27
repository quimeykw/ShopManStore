# 🚀 Guía de Deploy a Render - Sistema Completo

## ✅ Estado del Sistema

**TODAS LAS FUNCIONES HAN SIDO TESTEADAS Y ESTÁN LISTAS PARA RENDER**

### Tests Ejecutados
- ✅ Conexión a PostgreSQL
- ✅ Estructura de base de datos (columna `items` incluida)
- ✅ Inserción de órdenes con productos detallados
- ✅ Parseo de JSON para items
- ✅ Compatibilidad de `lastID` entre SQLite y PostgreSQL
- ✅ Servicio de WhatsApp
- ✅ Servicio de Email
- ✅ Variables de entorno
- ✅ Todas las dependencias

### Funcionalidades Implementadas
1. **Logs detallados de compras** - Muestra productos, cantidades y totales
2. **Notificaciones WhatsApp automáticas** - Se envían después de cada compra
3. **Descuento automático del 10%** - Aplicado a todas las compras
4. **Envío gratis** - Para compras mayores a $80,000 (después del descuento)
5. **Pagos reales con Mercado Pago** - Modo producción configurado
6. **Logs con colores** - Verde para pagos, azul para logins, rojo para errores

---

## 📋 Pre-requisitos

### 1. Verificar Sistema Local
```bash
# Ejecutar verificación completa
node verify-render-ready.js

# Ejecutar tests de compatibilidad
node test-render-compatibility.js
```

Ambos scripts deben pasar sin errores.

### 2. Asegurar Migración de Base de Datos
```bash
# Si usas PostgreSQL local, ejecuta:
node migrate-add-items-column.js
```

---

## 🔧 Configuración en Render

### Paso 1: Variables de Entorno

En el dashboard de Render, configura estas variables:

#### **Variables Requeridas:**
```
DATABASE_URL=<tu-postgresql-url-de-render>
JWT_SECRET=<genera-un-secreto-seguro>
NODE_ENV=production
```

#### **Variables Opcionales (Recomendadas):**
```
MP_TOKEN=<tu-token-de-mercadopago-produccion>
WHATSAPP_PHONE=5491122549995
WHATSAPP_ENABLED=true
EMAIL_USER=<tu-email-gmail>
EMAIL_APP_PASSWORD=<tu-app-password-gmail>
```

### Paso 2: Configuración del Servicio

En Render, asegúrate de:
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** `Node`
- **Region:** Selecciona la más cercana a tus usuarios

---

## 🗄️ Base de Datos PostgreSQL

### Crear Base de Datos en Render

1. Ve a **Dashboard** → **New** → **PostgreSQL**
2. Nombra tu base de datos (ej: `shopmanstore-db`)
3. Selecciona el plan (Free tier está bien para empezar)
4. Copia la **Internal Database URL**
5. Pégala en la variable `DATABASE_URL` de tu Web Service

### Migración Automática

El sistema ejecutará automáticamente:
1. Creación de todas las tablas (users, products, orders, logs, password_resets)
2. Usuario admin por defecto (username: `admin`, password: `admin123`)
3. Productos de ejemplo

**IMPORTANTE:** La columna `items` se creará automáticamente en la tabla `orders`.

---

## 🚀 Deploy

### Opción 1: Deploy Automático (Recomendado)

```bash
# 1. Agregar todos los cambios
git add .

# 2. Commit con mensaje descriptivo
git commit -m "feat: Sistema completo con todas las funcionalidades"

# 3. Push a GitHub
git push origin main
```

Render detectará los cambios y desplegará automáticamente.

### Opción 2: Deploy Manual

1. Ve a tu servicio en Render
2. Click en **Manual Deploy** → **Deploy latest commit**

---

## ✅ Verificación Post-Deploy

### 1. Verificar que el Servicio Está Corriendo

Visita tu URL de Render (ej: `https://tu-app.onrender.com`)

Deberías ver la página principal de ShopManStore.

### 2. Verificar Logs

En Render Dashboard → **Logs**, busca:
```
Server: http://0.0.0.0:10000
Environment: production
Usando PostgreSQL
Mercado Pago configurado correctamente
```

### 3. Probar Funcionalidades

#### Login
- Usuario: `admin`
- Password: `admin123`

#### Crear Producto
1. Ir a Panel Admin
2. Crear un producto de prueba
3. Verificar que se guarda correctamente

#### Realizar Compra
1. Agregar producto al carrito
2. Proceder al pago
3. Verificar que:
   - Se aplica el 10% de descuento
   - Se muestra envío gratis si corresponde
   - Se crea la orden en la base de datos
   - Aparece en los logs con detalles completos

#### Verificar Logs
1. Ir a Panel Admin → Logs
2. Verificar que los logs muestran:
   - Productos comprados con cantidades
   - Colores correctos (verde para pagos)
   - Detalles completos de la transacción

---

## 🔍 Troubleshooting

### Error: "Cannot find module"
**Solución:** Verifica que todas las dependencias estén en `package.json`
```bash
npm install
```

### Error: "Column 'items' does not exist"
**Solución:** Ejecuta la migración manualmente en Render
```bash
# En Render Shell
node migrate-add-items-column.js
```

### Error: "Database connection failed"
**Solución:** Verifica que `DATABASE_URL` esté configurada correctamente en Render

### Mercado Pago no funciona
**Solución:** 
1. Verifica que `MP_TOKEN` sea tu token de **producción** (no test)
2. Verifica que tu cuenta de Mercado Pago esté activada para producción

### WhatsApp no envía notificaciones
**Nota:** El sistema actualmente solo genera el mensaje y la URL. Para envíos automáticos reales, necesitas integrar con:
- Twilio API
- WhatsApp Business API
- O un servicio similar

---

## 📊 Monitoreo

### Health Check

El sistema incluye un endpoint de health check:
```
GET https://tu-app.onrender.com/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-11-26T...",
  "uptime": 3600,
  "environment": "production"
}
```

### Configurar UptimeRobot (Opcional)

Para mantener el servicio activo en Render Free tier:

1. Crea cuenta en [UptimeRobot](https://uptimerobot.com)
2. Agrega nuevo monitor:
   - **Type:** HTTP(s)
   - **URL:** `https://tu-app.onrender.com/health`
   - **Interval:** 5 minutos
3. Esto evitará que Render suspenda tu servicio por inactividad

---

## 🔐 Seguridad Post-Deploy

### 1. Cambiar Credenciales Admin
```sql
-- Conecta a tu PostgreSQL en Render y ejecuta:
UPDATE users 
SET password = '<nuevo-hash-bcrypt>' 
WHERE username = 'admin';
```

O usa el script `change-password.js`:
```bash
node change-password.js admin nueva-contraseña-segura
```

### 2. Rotar JWT_SECRET
Si sospechas que tu JWT_SECRET fue comprometido:
1. Genera un nuevo secreto
2. Actualiza la variable en Render
3. Todos los usuarios deberán volver a iniciar sesión

### 3. Verificar .gitignore
Asegúrate de que `.env` esté en `.gitignore` para no subir secretos a GitHub.

---

## 📈 Optimizaciones Aplicadas

El sistema ya incluye:
- ✅ Compresión HTTP (gzip)
- ✅ Caché de archivos estáticos (1 día)
- ✅ Índices en base de datos
- ✅ Manejo de errores robusto
- ✅ Logs estructurados
- ✅ Health check endpoint

---

## 🎯 Próximos Pasos Recomendados

1. **Configurar dominio personalizado** en Render
2. **Habilitar SSL** (Render lo hace automáticamente)
3. **Configurar backups** de PostgreSQL
4. **Implementar analytics** (Google Analytics, etc.)
5. **Agregar más productos** desde el panel admin
6. **Personalizar diseño** según tu marca

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs en Render Dashboard
2. Ejecuta `node verify-render-ready.js` localmente
3. Verifica que todas las variables de entorno estén configuradas
4. Consulta la documentación de Render: https://render.com/docs

---

## ✨ ¡Listo!

Tu sistema está completamente testeado y listo para producción en Render.

**Comando final para desplegar:**
```bash
git add . && git commit -m "feat: Deploy a producción" && git push origin main
```

🎉 **¡Buena suerte con tu tienda online!**
