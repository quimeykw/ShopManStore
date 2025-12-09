# ⚡ Pasos Rápidos para Configurar Render

## 🎯 Lo que necesitas hacer AHORA en Render

### 1️⃣ Accede a Render Dashboard

Ve a: **https://dashboard.render.com**

### 2️⃣ Selecciona tu servicio

Haz clic en: **shopmanstore**

### 3️⃣ Ve a Environment

En el menú lateral izquierdo, haz clic en: **Environment**

### 4️⃣ Agrega estas 3 variables

Haz clic en **"Add Environment Variable"** para cada una:

#### Variable 1:
```
Key: EMAIL_USER
Value: quimeykw@gmail.com
```

#### Variable 2:
```
Key: EMAIL_APP_PASSWORD
Value: yianricsnvxfhxbl
```

#### Variable 3:
```
Key: BASE_URL
Value: https://shopmanstore.onrender.com
```
*(Reemplaza con tu URL real de Render)*

### 5️⃣ Guarda los cambios

Haz clic en: **"Save Changes"** (botón azul al final de la página)

### 6️⃣ Espera el redespliegue

- Render redesplegará automáticamente (2-5 minutos)
- Ve a la pestaña **"Logs"** para ver el progreso
- Busca el mensaje: `✓ Servicio de email configurado`

### 7️⃣ ¡Listo!

Prueba la recuperación de contraseña en tu aplicación.

---

## 📸 Captura de Pantalla de Referencia

Deberías ver algo así en Environment:

```
Environment Variables

EMAIL_USER                    quimeykw@gmail.com
EMAIL_APP_PASSWORD           •••••••••••••••••
BASE_URL                     https://shopmanstore.onrender.com
WHATSAPP_PHONE              5491122549995
WHATSAPP_ENABLED            true
MP_TOKEN                    •••••••••••••••••
NODE_ENV                    production
DATABASE_URL                •••••••••••••••••
```

---

## ✅ Verificación Rápida

Después de guardar, ve a **Logs** y busca:

```
✓ Servicio de email configurado
Server: http://0.0.0.0:10000
Environment: production
```

Si ves esto, ¡está funcionando! 🎉

---

## 🆘 Si algo sale mal

Lee el archivo completo: **CONFIGURAR-RENDER-EMAIL.md**

---

**Tiempo estimado:** 2 minutos + 5 minutos de redespliegue = 7 minutos total
