# ✅ Migración Automática Configurada

## 🎯 ¿Qué hice?

Actualicé `init-db.js` para que **automáticamente agregue las columnas `sizes` y `stock`** si no existen cuando el servidor se inicia en Render.

## 📝 Cambios realizados:

En `init-db.js` agregué estas líneas para PostgreSQL:

```javascript
// Migrar columnas si la tabla ya existe (para bases de datos antiguas)
db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes TEXT`, (err) => {
  if (!err) console.log('✓ Columna sizes verificada/agregada');
});

db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0`, (err) => {
  if (!err) console.log('✓ Columna stock verificada/agregada');
});
```

## 🚀 Cómo aplicar:

### 1. Subir los cambios

```bash
git add init-db.js
git commit -m "Migración automática de columnas sizes y stock"
git push
```

### 2. Esperar redespliegue

1. Ve a https://dashboard.render.com
2. Tu servicio se redespliegará automáticamente
3. Espera 2-3 minutos hasta que diga "Live"

### 3. Verificar en los logs

Ve a la pestaña **"Logs"** y busca:

```
Usando PostgreSQL
✓ Columna sizes verificada/agregada
✓ Columna stock verificada/agregada
✓ Usuario admin inicializado
Server: http://localhost:XXXX
```

Si ves esos mensajes, ¡la migración funcionó! ✅

### 4. Probar en tu app

1. Abre tu URL de Render
2. **Limpia el caché**: Ctrl + Shift + R
3. Login como admin
4. Edita un producto existente
5. Deberías ver los campos de **talles** y **stock**
6. Agrega talles: `36, 38, 40` y stock: `10`
7. Guarda
8. Verifica que aparezca el selector de talles en el catálogo

## ✅ Ventajas de este método:

- ✅ No necesitas acceso al Shell de Render
- ✅ Se ejecuta automáticamente cada vez que se despliega
- ✅ Es seguro: usa `IF NOT EXISTS` para no duplicar columnas
- ✅ Funciona tanto para bases de datos nuevas como existentes

## 🔍 Solución de problemas:

### No veo los mensajes en los logs
- Espera 1-2 minutos más, el servidor puede tardar en iniciar
- Refresca la página de logs

### Sigo sin ver los campos en la app
1. Limpia el caché del navegador (Ctrl + Shift + Delete)
2. Abre en modo incógnito
3. Verifica que el redespliegue haya terminado (estado "Live")

### Error en los logs
- Copia el error completo y dímelo para ayudarte

## 📌 Nota importante:

Esta migración se ejecuta **cada vez que el servidor inicia**, pero como usa `IF NOT EXISTS`, no causará problemas si las columnas ya existen.
