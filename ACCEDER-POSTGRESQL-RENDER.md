# 🗄️ Cómo Acceder a PostgreSQL en Render

## 📋 Opciones para Acceder

### Opción 1: Dashboard de Render (Más Fácil)
### Opción 2: pgAdmin (Interfaz Gráfica)
### Opción 3: psql (Línea de Comandos)
### Opción 4: DBeaver (Recomendado)

---

## 🌐 Opción 1: Dashboard de Render

### Pasos:
1. **Ir a Render Dashboard**
   - https://dashboard.render.com/

2. **Seleccionar tu Base de Datos**
   - En el menú lateral, click en "PostgreSQL"
   - Click en tu base de datos

3. **Ver Información de Conexión**
   - Verás:
     - **Hostname:** (ej: dpg-xxxxx-a.oregon-postgres.render.com)
     - **Port:** 5432
     - **Database:** (nombre de tu DB)
     - **Username:** (tu usuario)
     - **Password:** (click en "Show" para ver)

4. **Usar el Shell Integrado**
   - Scroll hacia abajo
   - Click en "Connect" → "External Connection"
   - Copia el comando `psql`
   - Pégalo en tu terminal

---

## 💻 Opción 2: pgAdmin (Interfaz Gráfica)

### 1. Descargar pgAdmin
- Windows: https://www.pgadmin.org/download/pgadmin-4-windows/
- Mac: https://www.pgadmin.org/download/pgadmin-4-macos/
- Linux: https://www.pgadmin.org/download/pgadmin-4-apt/

### 2. Obtener Credenciales de Render
1. Ve a tu dashboard de Render
2. Click en tu base de datos PostgreSQL
3. Copia estos datos:
   ```
   Hostname: dpg-xxxxx-a.oregon-postgres.render.com
   Port: 5432
   Database: tu_database_name
   Username: tu_username
   Password: [Click en "Show"]
   ```

### 3. Configurar Conexión en pgAdmin
1. **Abrir pgAdmin**
2. **Click derecho en "Servers"** → "Register" → "Server"
3. **Pestaña "General":**
   - Name: ShopManStore Render
4. **Pestaña "Connection":**
   - Host name/address: `dpg-xxxxx-a.oregon-postgres.render.com`
   - Port: `5432`
   - Maintenance database: `tu_database_name`
   - Username: `tu_username`
   - Password: `tu_password`
   - ✅ Save password
5. **Pestaña "SSL":**
   - SSL mode: `Require`
6. **Click "Save"**

### 4. Conectar
- Click en tu servidor en el árbol de la izquierda
- Verás tus bases de datos, tablas, etc.

---

## 🖥️ Opción 3: psql (Línea de Comandos)

### 1. Instalar psql

#### Windows:
```bash
# Descargar PostgreSQL desde:
https://www.postgresql.org/download/windows/
# Instalar solo las herramientas de cliente
```

#### Mac:
```bash
brew install postgresql
```

#### Linux:
```bash
sudo apt-get install postgresql-client
```

### 2. Conectar desde Terminal

#### Método A: URL Completa
```bash
psql postgresql://username:password@hostname:5432/database
```

Ejemplo:
```bash
psql postgresql://shopman:mypassword@dpg-xxxxx-a.oregon-postgres.render.com:5432/shopmanstore
```

#### Método B: Parámetros Separados
```bash
psql -h hostname -p 5432 -U username -d database
```

Ejemplo:
```bash
psql -h dpg-xxxxx-a.oregon-postgres.render.com -p 5432 -U shopman -d shopmanstore
```

### 3. Comandos Útiles en psql
```sql
-- Ver todas las tablas
\dt

-- Ver estructura de una tabla
\d nombre_tabla

-- Ver todos los productos
SELECT * FROM products;

-- Ver todos los usuarios
SELECT * FROM users;

-- Ver órdenes
SELECT * FROM orders;

-- Salir
\q
```

---

## 🔧 Opción 4: DBeaver (Recomendado)

### ¿Por qué DBeaver?
- ✅ Gratis y open source
- ✅ Interfaz moderna y fácil
- ✅ Soporta múltiples bases de datos
- ✅ Editor SQL con autocompletado
- ✅ Visualización de datos

### 1. Descargar DBeaver
- https://dbeaver.io/download/

### 2. Configurar Conexión
1. **Abrir DBeaver**
2. **Click en "Nueva Conexión"** (icono de enchufe)
3. **Seleccionar "PostgreSQL"**
4. **Configurar:**
   ```
   Host: dpg-xxxxx-a.oregon-postgres.render.com
   Port: 5432
   Database: tu_database_name
   Username: tu_username
   Password: tu_password
   ```
5. **Pestaña "SSL":**
   - ✅ Use SSL
   - SSL mode: require
6. **Test Connection** (para verificar)
7. **Finish**

### 3. Usar DBeaver
- Navega por tus tablas en el árbol de la izquierda
- Doble click en una tabla para ver datos
- Click derecho → "View Data" para ver contenido
- Editor SQL para ejecutar queries

---

## 📊 Consultas SQL Útiles

### Ver Todos los Productos
```sql
SELECT * FROM products ORDER BY id;
```

### Ver Usuarios
```sql
SELECT id, username, email, role FROM users;
```

### Ver Órdenes Recientes
```sql
SELECT * FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```

### Contar Productos
```sql
SELECT COUNT(*) as total_productos FROM products;
```

### Ver Productos con Stock Bajo
```sql
SELECT name, stock FROM products 
WHERE stock < 5 
ORDER BY stock;
```

### Ver Logs Recientes
```sql
SELECT l.*, u.username 
FROM logs l 
LEFT JOIN users u ON l.user_id = u.id 
ORDER BY l.created_at DESC 
LIMIT 20;
```

---

## 🔐 Seguridad

### ⚠️ Importante:
- **NO compartas** tus credenciales de PostgreSQL
- **NO las subas** a GitHub
- **Usa variables de entorno** en tu código
- **Cambia la contraseña** si se filtra

### Rotar Contraseña:
1. Ve a Render Dashboard
2. Click en tu base de datos
3. Settings → "Rotate Password"
4. Actualiza la variable `DATABASE_URL` en tu app

---

## 🚀 Acceso Rápido desde Render

### Shell Directo:
1. Ve a tu dashboard de Render
2. Click en tu base de datos PostgreSQL
3. Click en "Connect" (arriba a la derecha)
4. Selecciona "PSQL Command"
5. Copia el comando completo
6. Pégalo en tu terminal

Ejemplo del comando:
```bash
PGPASSWORD=tu_password psql -h dpg-xxxxx-a.oregon-postgres.render.com -U tu_username tu_database
```

---

## 📱 Apps Móviles

### Para iOS:
- **Postgres Client** (App Store)

### Para Android:
- **DBeaver Mobile** (Google Play)

---

## 🔍 Troubleshooting

### Error: "Connection refused"
- Verifica que el hostname sea correcto
- Asegúrate de usar el puerto 5432
- Verifica que SSL esté habilitado

### Error: "Password authentication failed"
- Verifica tu contraseña en Render Dashboard
- Copia y pega (no escribas manualmente)
- Verifica que no haya espacios extra

### Error: "SSL required"
- Habilita SSL en tu cliente
- SSL mode: `require` o `prefer`

### No puedo ver mis tablas
- Verifica que estés conectado a la base de datos correcta
- Ejecuta `\dt` en psql para listar tablas
- Puede que la base de datos esté vacía (necesitas migrar)

---

## 📚 Recursos

- **Render Docs:** https://render.com/docs/databases
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **pgAdmin:** https://www.pgadmin.org/docs/
- **DBeaver:** https://dbeaver.com/docs/

---

## ✅ Resumen Rápido

**Para acceder rápidamente:**

1. **Desde Render Dashboard:**
   - Dashboard → PostgreSQL → Tu DB → Connect → PSQL Command

2. **Con DBeaver (Recomendado):**
   - Descargar DBeaver
   - Nueva conexión PostgreSQL
   - Copiar credenciales de Render
   - Conectar

3. **Con psql:**
   ```bash
   psql postgresql://user:pass@host:5432/database
   ```

---

¿Necesitas ayuda con alguna opción específica? 🚀
