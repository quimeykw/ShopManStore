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

### 3. Configurar en Render Dashboard (DETALLADO)

#### 3.1 Crear la base de datos PostgreSQL

1. **Ir a Render Dashboard**
   - Abre tu navegador
   - Ve a: https://dashboard.render.com
   - Inicia sesión con tu cuenta

2. **Crear nueva base de datos**
   - En la esquina superior derecha, busca el botón azul **"New +"**
   - Click en **"New +"**
   - En el menú desplegable, selecciona **"PostgreSQL"**

3. **Configurar la base de datos**
   Verás un formulario, llena los campos:
   
   ```
   Name: shopmanstore-db
   Database: shopmanstore
   User: shopmanstore
   Region: (Deja el que está por defecto, ej: Oregon)
   PostgreSQL Version: (Deja la última versión)
   Datadog API Key: (Déjalo vacío)
   ```

4. **Seleccionar plan gratuito**
   - Baja hasta la sección **"Instance Type"**
   - Selecciona: **"Free"** (dice "Free - 0.1 CPU, 256 MB RAM")
   - Click en el botón verde **"Create Database"**

5. **Esperar a que se cree**
   - Verás una pantalla que dice "Creating..."
   - Espera 1-2 minutos hasta que diga **"Available"** (con un punto verde)

6. **Copiar la URL de conexión**
   - Una vez que esté "Available", verás varias URLs
   - Busca la sección **"Connections"**
   - Encuentra **"Internal Database URL"** (NO la "External")
   - Click en el ícono de copiar (📋) al lado de "Internal Database URL"
   - Se verá algo así: `postgresql://shopmanstore:XXXXX@dpg-xxxxx/shopmanstore`
   - **GUARDA ESTA URL**, la necesitarás en el siguiente paso

#### 3.2 Conectar la base de datos a tu aplicación web

1. **Ir a tu servicio web**
   - En el Dashboard de Render, click en **"Dashboard"** (arriba a la izquierda)
   - Verás una lista de tus servicios
   - Click en tu servicio web **"shopmanstore"** (o como lo hayas llamado)

2. **Ir a variables de entorno**
   - En el menú lateral izquierdo, click en **"Environment"**
   - Verás una lista de variables (probablemente solo `MP_TOKEN`)

3. **Agregar DATABASE_URL**
   - Click en el botón **"Add Environment Variable"**
   - En el campo **"Key"**, escribe: `DATABASE_URL`
   - En el campo **"Value"**, pega la URL que copiaste en el paso 3.1.6
   - **NO** hagas click en "Save Changes" todavía

4. **Agregar NODE_ENV**
   - Click nuevamente en **"Add Environment Variable"**
   - En el campo **"Key"**, escribe: `NODE_ENV`
   - En el campo **"Value"**, escribe: `production`

5. **Guardar cambios**
   - Ahora sí, click en el botón azul **"Save Changes"** (abajo)
   - Verás un mensaje: "Your service will automatically deploy with these changes"

### 4. Redesplegar y verificar

1. **Esperar el redespliegue automático**
   - Render automáticamente redesplegará tu app
   - Ve a la pestaña **"Logs"** (menú lateral izquierdo)
   - Verás el proceso de despliegue en tiempo real
   - Espera 2-3 minutos

2. **Buscar mensajes de éxito**
   En los logs deberías ver:
   ```
   Usando PostgreSQL
   ✓ Usuario admin inicializado
   Server: http://localhost:XXXX
   ```

3. **Probar la aplicación**
   - Click en la URL de tu app (arriba, algo como: https://shopmanstore-xxxx.onrender.com)
   - Inicia sesión: `admin` / `admin123`
   - Agrega un producto de prueba
   - Ve a tu servicio en Render y click en **"Manual Deploy"** → **"Deploy latest commit"**
   - Espera que se reinicie
   - Vuelve a entrar a tu app
   - **El producto debe seguir ahí** ✅

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

### ❌ Error: "Cannot find module 'pg'"
**Solución:**
```bash
npm install
git add .
git commit -m "Actualizar dependencias"
git push
```

### ❌ Error: "relation 'users' does not exist"
**Causa:** La base de datos no se inicializó correctamente

**Solución:**
1. Ve a tu base de datos PostgreSQL en Render
2. Click en **"Connect"** → Copia el comando `psql`
3. Abre una terminal y pégalo (necesitas tener PostgreSQL instalado localmente)
4. O simplemente **elimina y vuelve a crear** la base de datos en Render

### ❌ No puedo iniciar sesión con admin/admin123
**Solución:**
1. Ve a los logs de tu servicio
2. Busca el mensaje: `✓ Usuario admin inicializado`
3. Si no aparece, hay un problema con la inicialización
4. Verifica que `DATABASE_URL` esté correctamente configurada

### ❌ Los datos se siguen perdiendo al reiniciar
**Causa:** Estás usando SQLite en producción (no PostgreSQL)

**Verificar:**
1. Ve a los logs
2. Si dice "Usando SQLite" → MAL ❌
3. Debe decir "Usando PostgreSQL" → BIEN ✅

**Solución:**
- Verifica que `DATABASE_URL` esté en las variables de entorno
- Verifica que `NODE_ENV=production`

### 📋 Checklist de verificación

Antes de contactar soporte, verifica:

- [ ] `npm install` ejecutado localmente
- [ ] Código subido a GitHub (`git push`)
- [ ] Base de datos PostgreSQL creada en Render (estado: Available)
- [ ] Variable `DATABASE_URL` agregada al servicio web
- [ ] Variable `NODE_ENV=production` agregada
- [ ] Logs muestran "Usando PostgreSQL"
- [ ] Logs muestran "✓ Usuario admin inicializado"

### 🆘 Cómo pedir ayuda

Si sigues teniendo problemas, copia y pega:

1. **Los últimos 50 líneas de logs** (Tab "Logs" en Render)
2. **Tus variables de entorno** (oculta la parte sensible de DATABASE_URL)
3. **El mensaje de error exacto** que ves
