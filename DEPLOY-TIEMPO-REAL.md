# Despliegue en Tiempo Real - ShopManStore

## Cambios realizados

✅ Base de datos persistente (PostgreSQL en producción, SQLite en local)
✅ Configuración automática según entorno
✅ Los datos NO se pierden al reiniciar

## Pasos para desplegar en Render

### 1. Instalar dependencias localmente

```bash
npm install
```

### 2. Subir a GitHub

```bash
git add .
git commit -m "Configuración para base de datos persistente"
git push
```

### 3. Configurar en Render Dashboard

1. Ve a https://dashboard.render.com
2. Tu servicio web ya existe, ahora agrega la base de datos:
   - Click en **"New +"** → **"PostgreSQL"**
   - Name: `shopmanstore-db`
   - Database: `shopmanstore`
   - User: `shopmanstore`
   - Plan: **Free**
   - Click **"Create Database"**

3. Conectar la base de datos al servicio web:
   - Ve a tu servicio web "shopmanstore"
   - Tab **"Environment"**
   - Agrega variable:
     - Key: `DATABASE_URL`
     - Value: Copia el **"Internal Database URL"** de tu PostgreSQL
   - Agrega variable:
     - Key: `NODE_ENV`
     - Value: `production`
   - Click **"Save Changes"**

### 4. Redesplegar

El servicio se redesplega automáticamente. Espera 2-3 minutos.

## Verificar que funciona

1. Ve a tu URL: `https://tu-app.onrender.com`
2. Login con: `admin` / `admin123`
3. Agrega productos
4. **Reinicia el servicio** en Render
5. Verifica que los productos siguen ahí ✅

## Desarrollo local

Sigue usando SQLite localmente (no necesitas PostgreSQL):

```bash
npm start
```

La app detecta automáticamente el entorno.

## Solución de problemas

### Ver logs en Render
Dashboard → Tu servicio → Tab "Logs"

### Verificar conexión a base de datos
Busca en los logs:
- ✅ "Usando PostgreSQL"
- ✅ "Usuario admin inicializado"

### Si hay errores
1. Verifica que `DATABASE_URL` esté configurada
2. Verifica que `NODE_ENV=production`
3. Revisa los logs para errores específicos
