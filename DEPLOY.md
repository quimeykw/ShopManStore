# Guía de Despliegue - ShopManStore

Tu tienda está lista para ser publicada online. Aquí tienes 3 opciones GRATUITAS:

---

## 🚀 OPCIÓN 1: RAILWAY (Recomendado - Más fácil)

**Ventajas**: Gratis, muy fácil, base de datos incluida

### Pasos:

1. **Crear cuenta en Railway**
   - Ve a https://railway.app
   - Regístrate con GitHub

2. **Subir tu proyecto**
   - Crea un repositorio en GitHub con tu código
   - En Railway: "New Project" → "Deploy from GitHub repo"
   - Selecciona tu repositorio

3. **Configurar variables de entorno**
   - En Railway, ve a tu proyecto → Variables
   - Agrega:
     ```
     MP_TOKEN=APP_USR-5802293204482723-111823-41d8e3354a2e15c8dbc4802b59524b0d-3001373888
     JWT_SECRET=shopmanstore_secret_key_2024
     ```

4. **¡Listo!** Railway te dará una URL como: `https://shopmanstore.up.railway.app`

---

## 🌐 OPCIÓN 2: RENDER

**Ventajas**: Gratis, confiable, fácil de usar

### Pasos:

1. **Crear cuenta en Render**
   - Ve a https://render.com
   - Regístrate con GitHub

2. **Crear Web Service**
   - Dashboard → "New" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Render detectará automáticamente Node.js

3. **Configurar**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - En "Environment Variables" agrega:
     ```
     MP_TOKEN=APP_USR-5802293204482723-111823-41d8e3354a2e15c8dbc4802b59524b0d-3001373888
     JWT_SECRET=shopmanstore_secret_key_2024
     ```

4. **Deploy** - Render te dará una URL como: `https://shopmanstore.onrender.com`

---

## ⚡ OPCIÓN 3: VERCEL

**Ventajas**: Súper rápido, gratis

### Pasos:

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Desplegar**
   ```bash
   vercel
   ```

3. **Configurar variables**
   ```bash
   vercel env add MP_TOKEN
   vercel env add JWT_SECRET
   ```

4. **Producción**
   ```bash
   vercel --prod
   ```

---

## 📋 ANTES DE DESPLEGAR

### 1. Crear repositorio en GitHub

```bash
git init
git add .
git commit -m "Initial commit - ShopManStore"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/shopmanstore.git
git push -u origin main
```

### 2. Verificar archivos

Asegúrate de tener estos archivos:
- ✅ `.gitignore` (para no subir node_modules)
- ✅ `package.json` (con engines de Node)
- ✅ `vercel.json` (para Vercel)
- ✅ `render.yaml` (para Render)
- ✅ `railway.json` (para Railway)

---

## 🔒 IMPORTANTE - SEGURIDAD

Después de desplegar:

1. **Cambia el JWT_SECRET** por uno más seguro
2. **Cambia la contraseña del admin** (admin/admin123)
3. **Nunca compartas tu MP_TOKEN** públicamente

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### La base de datos se borra al reiniciar
- **Solución**: Usa un servicio de base de datos externo como:
  - Railway Postgres (gratis)
  - Supabase (gratis)
  - PlanetScale (gratis)

### Error de CORS
- Ya está configurado en el código con `cors()`

### El sitio es lento
- Normal en planes gratuitos, se "duerme" después de inactividad
- Se despierta automáticamente al recibir una visita

---

## 📱 DESPUÉS DE DESPLEGAR

Tu tienda estará disponible 24/7 en internet con:
- ✅ Login y registro de usuarios
- ✅ Panel de administración
- ✅ Carrito de compras
- ✅ Pagos con Mercado Pago
- ✅ Pagos con tarjeta
- ✅ Contacto por WhatsApp

**¡Tu tienda online está lista para vender!** 🎉
