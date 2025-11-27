# 🗄️ Guía Completa: Usar DBeaver con PostgreSQL de Render

## 📥 Paso 1: Descargar e Instalar DBeaver

### 1.1 Descargar
1. Ve a: **https://dbeaver.io/download/**
2. Click en **"Download"** (botón grande)
3. Selecciona **"Windows 64-bit (installer)"**
4. Espera a que descargue (unos 100MB)

### 1.2 Instalar
1. **Doble click** en el archivo descargado
2. Click en **"Next"** (Siguiente)
3. Acepta los términos → **"I accept"** → **"Next"**
4. Deja la ubicación por defecto → **"Next"**
5. Deja las opciones por defecto → **"Next"**
6. Click en **"Install"**
7. Espera a que instale (1-2 minutos)
8. Click en **"Finish"**

---

## 🔑 Paso 2: Obtener Credenciales de Render

### 2.1 Ir a Render Dashboard
1. Abre tu navegador
2. Ve a: **https://dashboard.render.com/**
3. Inicia sesión si no lo has hecho

### 2.2 Encontrar tu Base de Datos
1. En el menú lateral izquierdo, busca **"PostgreSQL"**
2. Click en **"PostgreSQL"**
3. Verás una lista de tus bases de datos
4. **Click en tu base de datos** (probablemente se llama algo como "shopmanstore")

### 2.3 Copiar Credenciales
Verás una sección con información de conexión. **Copia estos datos:**

```
Internal Database URL: postgres://user:password@host/database
```

O individualmente:
```
Hostname: dpg-xxxxxxxxxxxxx-a.oregon-postgres.render.com
Port: 5432
Database: shopmanstore_xxxx
Username: shopmanstore_xxxx_user
Password: [Click en "Show" para ver]
```

**⚠️ IMPORTANTE:** Guarda estos datos en un lugar seguro (Notepad, etc.)

---

## 🔌 Paso 3: Conectar DBeaver a PostgreSQL

### 3.1 Abrir DBeaver
1. Busca **"DBeaver"** en el menú inicio de Windows
2. Doble click para abrir
3. Espera a que cargue (primera vez puede tardar un poco)

### 3.2 Crear Nueva Conexión
1. En la barra superior, busca el icono de **"enchufe con un +"** 
   - O ve a: **Database → New Database Connection**
2. Click en ese icono

### 3.3 Seleccionar PostgreSQL
1. Verás una ventana con muchas bases de datos
2. Busca y click en **"PostgreSQL"**
3. Click en **"Next"** (abajo a la derecha)

### 3.4 Configurar Conexión

**Pestaña "Main":**

Completa con tus datos de Render:

```
Host: dpg-xxxxxxxxxxxxx-a.oregon-postgres.render.com
Port: 5432
Database: shopmanstore_xxxx
Username: shopmanstore_xxxx_user
Password: [tu contraseña de Render]
```

**✅ Marca:** "Save password"

**Ejemplo visual:**
```
┌─────────────────────────────────────┐
│ Host: dpg-abc123-a.oregon-postgres  │
│ Port: 5432                          │
│ Database: shopmanstore_db           │
│ Username: shopmanstore_user         │
│ Password: ••••••••••••              │
│ ☑ Save password                     │
└─────────────────────────────────────┘
```

### 3.5 Configurar SSL (MUY IMPORTANTE)

1. Click en la pestaña **"SSL"** (arriba)
2. En **"SSL mode"** selecciona: **"require"**
3. Deja todo lo demás como está

### 3.6 Probar Conexión

1. Click en **"Test Connection"** (abajo a la izquierda)
2. **Primera vez:** DBeaver descargará el driver de PostgreSQL
   - Click en **"Download"** si aparece
   - Espera 10-20 segundos
3. Deberías ver: **"Connected"** ✅
4. Si ves un error, revisa que:
   - Las credenciales sean correctas
   - SSL esté en "require"
   - Tengas internet

### 3.7 Guardar Conexión

1. Si la prueba fue exitosa, click en **"Finish"**
2. Tu conexión aparecerá en el panel izquierdo

---

## 📊 Paso 4: Usar DBeaver

### 4.1 Navegar por tu Base de Datos

En el panel izquierdo verás:
```
📁 PostgreSQL - shopmanstore
  └─ 📁 Databases
      └─ 📁 shopmanstore_xxxx
          └─ 📁 Schemas
              └─ 📁 public
                  └─ 📁 Tables
                      ├─ 📋 products
                      ├─ 📋 users
                      ├─ 📋 orders
                      └─ 📋 logs
```

### 4.2 Ver Datos de una Tabla

**Opción 1: Doble Click**
1. Doble click en una tabla (ej: "products")
2. Se abrirá una pestaña con los datos
3. Verás todas las filas y columnas

**Opción 2: Click Derecho**
1. Click derecho en una tabla
2. Selecciona **"View Data"** → **"View Data"**
3. Se abrirá con los datos

### 4.3 Ejecutar Consultas SQL

1. **Abrir Editor SQL:**
   - Click en **"SQL Editor"** (icono con "SQL")
   - O: **SQL Editor → New SQL Script**

2. **Escribir tu consulta:**
   ```sql
   SELECT * FROM products;
   ```

3. **Ejecutar:**
   - Presiona **Ctrl + Enter**
   - O click en el botón ▶️ (Play)

4. **Ver resultados:**
   - Aparecerán abajo en la pestaña "Data"

### 4.4 Consultas Útiles

**Ver todos los productos:**
```sql
SELECT * FROM products ORDER BY id;
```

**Ver usuarios:**
```sql
SELECT id, username, email, role FROM users;
```

**Ver órdenes recientes:**
```sql
SELECT * FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```

**Contar productos:**
```sql
SELECT COUNT(*) as total FROM products;
```

**Buscar un producto:**
```sql
SELECT * FROM products 
WHERE name LIKE '%remera%';
```

---

## 🎨 Paso 5: Funciones Útiles de DBeaver

### 5.1 Editar Datos

1. Abre una tabla (doble click)
2. Doble click en una celda para editar
3. Modifica el valor
4. Presiona **Enter**
5. Click en **"Save"** (💾) arriba

### 5.2 Agregar Fila

1. Abre una tabla
2. Click en **"+"** (agregar fila) en la barra de herramientas
3. Completa los datos
4. Click en **"Save"** (💾)

### 5.3 Eliminar Fila

1. Abre una tabla
2. Click derecho en la fila
3. Selecciona **"Delete"**
4. Confirma
5. Click en **"Save"** (💾)

### 5.4 Exportar Datos

1. Abre una tabla
2. Click derecho en los datos
3. **"Export Data"**
4. Selecciona formato (CSV, Excel, JSON, etc.)
5. Elige ubicación
6. Click en **"Proceed"**

### 5.5 Importar Datos

1. Click derecho en una tabla
2. **"Import Data"**
3. Selecciona archivo (CSV, Excel, etc.)
4. Mapea las columnas
5. Click en **"Proceed"**

---

## 🔍 Paso 6: Explorar tu Base de Datos

### Ver Estructura de una Tabla

1. Click derecho en una tabla
2. Selecciona **"View Table"**
3. Verás:
   - **Columns:** Columnas y tipos de datos
   - **Constraints:** Claves primarias, únicas, etc.
   - **Indexes:** Índices (los que creamos para optimizar)
   - **Data:** Los datos

### Ver Relaciones

1. Click derecho en una tabla
2. **"View Diagram"** → **"ER Diagram"**
3. Verás un diagrama visual de las relaciones entre tablas

### Buscar en Toda la Base de Datos

1. **Ctrl + H** o **Database → Search**
2. Escribe lo que buscas
3. Selecciona dónde buscar (tablas, columnas, datos)
4. Click en **"Search"**

---

## 💡 Tips y Trucos

### Atajos de Teclado

```
Ctrl + Enter    → Ejecutar consulta SQL
Ctrl + Space    → Autocompletar
Ctrl + /        → Comentar/descomentar línea
Ctrl + H        → Buscar
Ctrl + S        → Guardar cambios
F5              → Refrescar
```

### Temas Oscuros

1. **Window → Preferences**
2. **General → Appearance**
3. **Theme:** Selecciona "Dark"
4. **Apply and Close**

### Múltiples Conexiones

Puedes tener varias conexiones:
- PostgreSQL de Render (producción)
- SQLite local (desarrollo)
- Otras bases de datos

### Favoritos

1. Click derecho en una tabla frecuente
2. **"Add to Favorites"**
3. Aparecerá en la carpeta "Bookmarks"

---

## ⚠️ Troubleshooting

### "Cannot establish connection"

**Solución:**
1. Verifica las credenciales en Render
2. Asegúrate de que SSL esté en "require"
3. Verifica tu conexión a internet
4. Intenta descargar el driver de nuevo

### "SSL connection required"

**Solución:**
1. Ve a la pestaña "SSL"
2. Cambia SSL mode a "require"
3. Prueba de nuevo

### "Password authentication failed"

**Solución:**
1. Ve a Render Dashboard
2. Click en "Show" para ver la contraseña
3. Cópiala exactamente (sin espacios)
4. Pégala en DBeaver

### "Driver not found"

**Solución:**
1. Click en "Download" cuando aparezca
2. Espera a que descargue
3. Si falla, ve a: **Database → Driver Manager**
4. Busca PostgreSQL
5. Click en "Download/Update"

---

## 📚 Recursos Adicionales

- **Documentación oficial:** https://dbeaver.com/docs/
- **Tutoriales en video:** https://www.youtube.com/c/DBeaver
- **Foro de ayuda:** https://github.com/dbeaver/dbeaver/discussions

---

## ✅ Checklist Final

- [ ] DBeaver descargado e instalado
- [ ] Credenciales de Render copiadas
- [ ] Conexión creada en DBeaver
- [ ] SSL configurado en "require"
- [ ] Test de conexión exitoso
- [ ] Puedo ver mis tablas
- [ ] Puedo ejecutar consultas SQL
- [ ] Puedo ver y editar datos

---

## 🎉 ¡Listo!

Ahora puedes:
- ✅ Ver todos tus productos, usuarios, órdenes
- ✅ Ejecutar consultas SQL
- ✅ Editar datos directamente
- ✅ Exportar/importar datos
- ✅ Analizar tu base de datos

**¡Disfruta usando DBeaver!** 🚀

---

**¿Necesitas ayuda?** Revisa la sección de Troubleshooting o pregúntame. 😊
