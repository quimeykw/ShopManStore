# Cómo subir tu proyecto a GitHub (Sin Git instalado)

## OPCIÓN 1: Subir directamente desde GitHub.com (MÁS FÁCIL)

### Paso 1: Crear repositorio en GitHub
1. Ve a https://github.com
2. Haz clic en el botón verde "New" o "New repository"
3. Nombre: `shopmanstore`
4. Descripción: "Tienda de ropa online"
5. Selecciona "Public"
6. **NO marques** "Add a README file"
7. Haz clic en "Create repository"

### Paso 2: Subir archivos
1. En la página del repositorio vacío, haz clic en "uploading an existing file"
2. Arrastra TODA la carpeta de tu proyecto (excepto `node_modules`)
3. O haz clic en "choose your files" y selecciona:
   - ✅ Carpeta `public` completa (con index.html y app.js)
   - ✅ server.js
   - ✅ package.json
   - ✅ .gitignore
   - ✅ vercel.json
   - ✅ render.yaml
   - ✅ railway.json
   - ✅ README.md
   - ✅ DEPLOY.md
   - ❌ NO subas: node_modules, store.db

4. Escribe un mensaje: "Initial commit"
5. Haz clic en "Commit changes"

### Paso 3: Verificar que public/ se subió
1. En tu repositorio de GitHub, verifica que veas:
   ```
   shopmanstore/
   ├── public/
   │   ├── index.html
   │   └── app.js
   ├── server.js
   ├── package.json
   └── ...
   ```

---

## OPCIÓN 2: Instalar Git y usar comandos

### Instalar Git
1. Descarga Git desde: https://git-scm.com/download/win
2. Instala con las opciones por defecto
3. Reinicia tu terminal

### Subir con Git
```bash
git init
git add .
git commit -m "Initial commit - ShopManStore"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/shopmanstore.git
git push -u origin main
```

---

## OPCIÓN 3: Usar GitHub Desktop (RECOMENDADO)

### Instalar GitHub Desktop
1. Descarga desde: https://desktop.github.com
2. Instala y abre la aplicación
3. Inicia sesión con tu cuenta de GitHub

### Subir proyecto
1. File → Add Local Repository
2. Selecciona tu carpeta `programing`
3. Haz clic en "Publish repository"
4. Nombre: `shopmanstore`
5. Desmarca "Keep this code private" si quieres que sea público
6. Haz clic en "Publish repository"

---

## ⚠️ IMPORTANTE: Verificar carpeta public/

Después de subir, **VERIFICA** en GitHub.com que la carpeta `public` con sus archivos esté presente:

```
https://github.com/TU_USUARIO/shopmanstore/tree/main/public
```

Deberías ver:
- ✅ index.html
- ✅ app.js

Si NO están, súbelos manualmente:
1. Ve a tu repositorio en GitHub
2. Haz clic en "Add file" → "Upload files"
3. Arrastra la carpeta `public` completa
4. Commit changes

---

## Después de subir a GitHub

### Desplegar en Render:
1. Ve a https://render.com
2. New → Web Service
3. Conecta tu repositorio `shopmanstore`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Agrega variables de entorno:
   ```
   MP_TOKEN=APP_USR-5802293204482723-111823-41d8e3354a2e15c8dbc4802b59524b0d-3001373888
   JWT_SECRET=shopmanstore_secret_key_2024
   ```
7. Create Web Service

¡Listo! Tu tienda estará online en unos minutos.
