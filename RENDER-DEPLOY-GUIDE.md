# 🚀 Guía Completa de Deploy en Render

Esta guía te ayudará a desplegar tu ShopManStore en Render con todos los productos configurados automáticamente.

## 📋 Preparación Previa

### ✅ Verificar que tienes:
- [x] Repositorio en GitHub actualizado
- [x] Todos los productos en el código
- [x] Scripts de setup automático
- [x] Configuración de Render optimizada

## 🌐 Paso 1: Crear Servicio en Render

### 1.1 Acceder a Render
1. Ve a [render.com](https://render.com)
2. Inicia sesión o crea una cuenta
3. Conecta tu cuenta de GitHub

### 1.2 Crear Nuevo Web Service
1. Click en "New +" → "Web Service"
2. Conecta tu repositorio: `https://github.com/quimeykw/ShopManStore`
3. Configurar el servicio:

```yaml
Name: shopmanstore
Environment: Node
Region: Oregon (US West) # Más rápido para Latinoamérica
Branch: main
Build Command: npm install && node render-setup.js
Start Command: npm start
```

## ⚙️ Paso 2: Variables de Entorno

### 2.1 Variables Requeridas
```env
NODE_ENV=production
PORT=10000
JWT_SECRET=shopmanstore_secret_key_2024
```

### 2.2 Variables Opcionales
```env
MP_TOKEN=tu_token_de_mercadopago
GMAIL_USER=tu_email@gmail.com
GMAIL_PASS=tu_app_password
```

## 🔧 Paso 3: Configuración Automática

### 3.1 El archivo `render.yaml` incluye:
- ✅ Build command con setup automático de productos
- ✅ Headers de caché optimizados
- ✅ Configuración de rendimiento
- ✅ Health check endpoint

### 3.2 El script `render-setup.js` ejecuta:
- ✅ Verificación de base de datos
- ✅ Instalación automática de 10 productos
- ✅ Configuración de colores y talles
- ✅ Optimización para PostgreSQL/SQLite

## 🚀 Paso 4: Deploy

### 4.1 Iniciar Deploy
1. Click en "Create Web Service"
2. Render comenzará el build automáticamente
3. El proceso toma 2-5 minutos

### 4.2 Monitorear el Deploy
```bash
# Logs que verás durante el build:
📦 Installing dependencies...
🚀 RENDER SETUP - Configuración automática de productos...
💾 Base de datos: PostgreSQL
✅ Añadido: Remera Básica Algodón (ID: 1)
✅ Añadido: Jean Clásico Azul (ID: 2)
... (10 productos total)
🎉 RENDER SETUP COMPLETADO!
🚀 Server starting on port 10000...
```

## ✅ Paso 5: Verificación

### 5.1 Verificar Automáticamente
```bash
# Ejecutar desde tu máquina local:
RENDER_URL=https://tu-app.onrender.com node render-verify.js
```

### 5.2 Verificar Manualmente
1. **Health Check**: `https://tu-app.onrender.com/health`
2. **API Productos**: `https://tu-app.onrender.com/api/products`
3. **Página Principal**: `https://tu-app.onrender.com`
4. **Admin Panel**: Login con admin/admin123

### 5.3 Verificar Productos
- ✅ 10 productos disponibles
- ✅ Colores y talles configurados
- ✅ Stock total: 358 unidades
- ✅ Imágenes SVG funcionando

## 🎯 Productos Incluidos Automáticamente

1. **Remera Básica Algodón** - $2,500 (Stock: 50)
2. **Jean Clásico Azul** - $4,500 (Stock: 30)
3. **Zapatillas Deportivas** - $8,500 (Stock: 25)
4. **Campera de Abrigo** - $12,500 (Stock: 20)
5. **Vestido Casual** - $5,500 (Stock: 35)
6. **Buzo con Capucha** - $6,500 (Stock: 40)
7. **Pantalón Deportivo** - $3,500 (Stock: 45)
8. **Camisa Formal** - $4,200 (Stock: 28)
9. **Shorts Deportivos** - $2,800 (Stock: 60)
10. **Pollera Elegante** - $4,800 (Stock: 25)

## ⚡ Optimizaciones Incluidas

### 🚀 Rendimiento
- **Compresión Brotli**: 70% reducción de tamaño
- **Caché agresivo**: 1 año para assets estáticos
- **Keep-alive**: Evita cold starts
- **Core Web Vitals**: Monitoring automático

### 💾 Base de Datos
- **PostgreSQL**: Automático en Render
- **Migraciones**: Automáticas en deploy
- **Índices**: Optimizados para consultas rápidas

### 🔒 Seguridad
- **Headers de seguridad**: X-Frame-Options, X-Content-Type-Options
- **JWT**: Autenticación segura
- **Validación**: Inputs sanitizados

## 🛠️ Comandos Útiles Post-Deploy

### Verificar Estado
```bash
# Verificar productos en Render
curl https://tu-app.onrender.com/api/products | jq '.products | length'

# Health check
curl https://tu-app.onrender.com/health
```

### Re-deploy Manual
```bash
# Si necesitas re-deployar:
git commit -m "Force redeploy" --allow-empty
git push origin main
```

## 🔧 Troubleshooting

### ❌ Build Fails
- Verificar que `render-setup.js` existe
- Revisar logs de build en Render dashboard
- Verificar variables de entorno

### ❌ No Products Visible
- Verificar que el setup script se ejecutó
- Revisar logs de aplicación
- Verificar conexión a base de datos

### ❌ Slow Performance
- Verificar que las optimizaciones están activas
- Revisar headers de caché
- Verificar compresión Brotli

## 📞 Soporte

### 🔗 URLs Importantes
- **Render Dashboard**: https://dashboard.render.com
- **GitHub Repo**: https://github.com/quimeykw/ShopManStore
- **Documentación Render**: https://render.com/docs

### 💡 Consejos
- El primer deploy puede tardar más (cold start)
- Los deploys subsecuentes son más rápidos
- Render hace auto-deploy en cada push a main
- La base de datos PostgreSQL es persistente

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu ShopManStore estará funcionando en Render con:

✅ **10 productos** configurados automáticamente  
✅ **Rendimiento optimizado** para máxima velocidad  
✅ **Base de datos PostgreSQL** persistente  
✅ **Auto-deploy** en cada cambio  
✅ **SSL/HTTPS** automático  
✅ **Dominio personalizado** disponible  

**Tu tienda estará disponible 24/7 con máximo rendimiento!** 🚀