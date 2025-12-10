# 🚀 Setup Rápido - ShopManStore

## ⚡ Inicio Rápido (2 minutos)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Añadir productos de ejemplo
```bash
npm run setup
```

### 3. Iniciar servidor
```bash
npm start
```

### 4. Abrir en navegador
```
http://localhost:3001
```

**¡Listo!** Tu tienda ya tiene productos y está optimizada para máximo rendimiento.

## 🔑 Credenciales por Defecto

- **Usuario**: `admin`
- **Contraseña**: `admin123`

## 📦 Scripts Disponibles

```bash
npm start          # Iniciar servidor
npm run setup      # Añadir productos de ejemplo
npm run check-products  # Ver productos en DB
npm run verify     # Verificar optimizaciones
npm run minify     # Minificar CSS/JS
```

## 🎯 Características Incluidas

✅ **8 productos de ejemplo** con imágenes, talles y colores
✅ **Optimizaciones de rendimiento** para Render
✅ **Sistema de keep-alive** (elimina cold starts)
✅ **Compresión HTTP** (70% menos datos)
✅ **Caché inteligente** (archivos se descargan una vez)
✅ **Lazy loading** en imágenes
✅ **Paginación automática** en productos
✅ **Core Web Vitals** monitoring

## 🚀 Para Producción en Render

### 1. Configurar UptimeRobot (5 min)
```
1. Ir a https://uptimerobot.com
2. Crear monitor HTTP: https://tu-app.onrender.com/health
3. Intervalo: 5 minutos
```

### 2. Activar CDN en Render
```
Dashboard → Tu servicio → Settings → Static File Routing → ENABLED
```

## 📊 Rendimiento Esperado

| Métrica | Antes | Después |
|---------|-------|---------|
| Cold Start | 10-30s | <3s |
| Tamaño respuestas | 100% | 30% |
| Carga de imágenes | Inmediata | Lazy |
| Uptime | Variable | 99%+ |

## 🛠️ Personalización

### Añadir más productos
1. Ir a http://localhost:3001
2. Login como admin
3. Panel Admin → Productos → Agregar

### Modificar productos existentes
```bash
npm run check-products  # Ver productos actuales
```

## 🆘 Problemas Comunes

### No aparecen productos
```bash
npm run check-products
# Si está vacío:
npm run setup
```

### Servidor lento en Render
- Verificar que UptimeRobot esté configurado
- Activar CDN en Render dashboard

### Verificar optimizaciones
```bash
npm run verify
```

## 📁 Archivos Importantes

- `server.js` - Servidor optimizado
- `public/index.html` - Frontend optimizado
- `store.db` - Base de datos SQLite
- `render.yaml` - Configuración de Render

¡Tu ShopManStore está listo para vender! 🛍️