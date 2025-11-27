# Migrar Base de Datos PostgreSQL en Render

## 🎯 Objetivo:
Agregar las columnas `sizes` y `stock` a la base de datos PostgreSQL en Render.

---

## Opción 1: Usar Render Shell (RECOMENDADO)

### Paso 1: Subir el script de migración

```bash
git add migrate-postgres.js
git commit -m "Script de migración PostgreSQL"
git push
```

### Paso 2: Ejecutar en Render Shell

1. Ve a https://dashboard.render.com
2. Abre tu servicio web **"shopmanstore"**
3. Click en la pestaña **"Shell"** (menú lateral izquierdo)
4. Espera a que se abra la terminal
5. Ejecuta:

```bash
node migrate-postgres.js
```

Deberías ver:
```
🔄 Iniciando migración de PostgreSQL...
Columnas actuales: id, name, description, price, image, created_at
📝 Agregando columna "sizes"...
✅ Columna "sizes" agregada
📝 Agregando columna "stock"...
✅ Columna "stock" agregada
✅ Migración completada exitosamente
```

---

## Opción 2: Agregar comando de inicio

Si la Opción 1 no funciona, puedes hacer que la migración se ejecute automáticamente:

### Paso 1: Crear script de inicio

Crea el archivo `start.sh`:

```bash
#!/bin/bash
echo "Ejecutando migración..."
node migrate-postgres.js
echo "Iniciando servidor..."
node server.js
```

### Paso 2: Actualizar package.json

Cambia el script de inicio:

```json
"scripts": {
  "start": "bash start.sh"
}
```

### Paso 3: Subir cambios

```bash
git add start.sh package.json
git commit -m "Auto-migración al iniciar"
git push
```

Render ejecutará la migración automáticamente cada vez que se despliegue.

---

## Opción 3: Usar psql directamente

Si tienes PostgreSQL instalado localmente:

### Paso 1: Obtener la URL de conexión

1. Ve a tu base de datos PostgreSQL en Render
2. Copia la **"External Database URL"**

### Paso 2: Conectar y ejecutar

```bash
psql "TU_DATABASE_URL_AQUI"
```

Luego ejecuta:

```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
SELECT id, name, sizes, stock FROM products;
\q
```

---

## ✅ Verificar que funcionó

Después de la migración:

1. Ve a tu app en Render
2. Login como admin
3. Edita un producto existente
4. Deberías ver los campos de **talles** y **stock**
5. Agrega talles: `36, 38, 40` y stock: `10`
6. Guarda
7. Verifica que se vea en el catálogo

---

## 🔍 Solución de problemas

### Error: "relation 'products' does not exist"
La tabla products no existe. Verifica que el servidor se haya iniciado al menos una vez.

### Error: "column 'sizes' already exists"
La columna ya existe. La migración ya se ejecutó correctamente.

### No veo los cambios en la app
1. Limpia el caché del navegador (Ctrl + Shift + R)
2. Abre en modo incógnito
3. Verifica los logs de Render para errores

---

## 📝 Nota importante

Esta migración solo necesita ejecutarse **UNA VEZ**. Una vez que las columnas existen, no es necesario volver a ejecutarla.
