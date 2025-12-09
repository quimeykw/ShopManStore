# 🔐 Configuración de Recuperación de Contraseña

Esta guía te ayudará a configurar el sistema de recuperación de contraseña por email en ShopManStore.

## 📋 Requisitos Previos

- Cuenta de Gmail activa
- Acceso al panel de tu cuenta de Google
- Archivo `.env` en la raíz del proyecto

---

## 🚀 Paso 1: Obtener App Password de Gmail

Google requiere que uses una "Contraseña de Aplicación" específica para aplicaciones de terceros.

### 1.1 Habilitar Verificación en 2 Pasos

1. Ve a tu **Cuenta de Google**: https://myaccount.google.com/
2. En el menú lateral, selecciona **Seguridad**
3. Busca la sección **Cómo inicias sesión en Google**
4. Haz clic en **Verificación en 2 pasos**
5. Sigue los pasos para activarla (necesitarás tu teléfono)

### 1.2 Generar Contraseña de Aplicación

1. Una vez activada la verificación en 2 pasos, vuelve a **Seguridad**
2. Busca **Contraseñas de aplicaciones** (aparece después de activar 2FA)
3. Haz clic en **Contraseñas de aplicaciones**
4. En "Seleccionar app", elige **Correo**
5. En "Seleccionar dispositivo", elige **Otro (nombre personalizado)**
6. Escribe: `ShopManStore`
7. Haz clic en **Generar**
8. **¡IMPORTANTE!** Copia la contraseña de 16 caracteres que aparece (sin espacios)

---

## ⚙️ Paso 2: Configurar Variables de Entorno

### 2.1 Editar archivo .env

Abre el archivo `.env` en la raíz de tu proyecto y agrega estas líneas:

```env
# Configuración de Email para Recuperación de Contraseña
EMAIL_USER=tu-email@gmail.com
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop
BASE_URL=http://localhost:3001
```

**Reemplaza:**
- `tu-email@gmail.com` → Tu email de Gmail
- `abcd efgh ijkl mnop` → La contraseña de 16 caracteres que copiaste (puedes dejar los espacios o quitarlos)
- `http://localhost:3001` → La URL de tu aplicación

### 2.2 Ejemplo Completo

```env
# Configuración de Email
EMAIL_USER=shopmanstore@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
BASE_URL=http://localhost:3001

# Otras variables...
PORT=3001
JWT_SECRET=shopmanstore_secret_key_2024
```

### 2.3 Para Producción (Render, Heroku, etc.)

Si tu app está en producción, cambia `BASE_URL`:

```env
BASE_URL=https://tu-dominio.com
# o
BASE_URL=https://tu-app.onrender.com
```

---

## 🧪 Paso 3: Probar la Configuración

### 3.1 Reiniciar el Servidor

```bash
npm start
```

Deberías ver en la consola:
```
✓ Servicio de email configurado
```

Si ves esto, significa que hay un problema:
```
⚠ Email no configurado - Recuperación de contraseña deshabilitada
```

### 3.2 Probar Recuperación de Contraseña

1. Abre tu aplicación: http://localhost:3001
2. En la pantalla de login, haz clic en **"¿Olvidaste tu contraseña?"**
3. Ingresa tu usuario o email
4. Haz clic en **"Recuperar Contraseña"**
5. Revisa tu bandeja de entrada (y spam) del email registrado
6. Deberías recibir un email con el asunto: **"Recuperación de Contraseña - ShopManStore"**

### 3.3 Completar el Reset

1. Abre el email
2. Haz clic en el botón **"Restablecer Contraseña"**
3. Ingresa tu nueva contraseña (mínimo 6 caracteres)
4. Confirma la contraseña
5. Haz clic en **"Restablecer Contraseña"**
6. Serás redirigido al login automáticamente

---

## 🔧 Solución de Problemas

### ❌ Error: "Email no configurado"

**Causa:** Las variables de entorno no están configuradas correctamente.

**Solución:**
1. Verifica que el archivo `.env` existe en la raíz del proyecto
2. Verifica que las variables `EMAIL_USER` y `EMAIL_APP_PASSWORD` están escritas correctamente
3. Reinicia el servidor después de editar `.env`

### ❌ Error: "Error al enviar el email"

**Causa:** Credenciales incorrectas o problema de conexión.

**Solución:**
1. Verifica que la contraseña de aplicación es correcta (16 caracteres)
2. Asegúrate de que la verificación en 2 pasos está activa
3. Genera una nueva contraseña de aplicación si es necesario
4. Verifica tu conexión a internet

### ❌ No recibo el email

**Solución:**
1. Revisa la carpeta de **Spam** o **Correo no deseado**
2. Verifica que el email del usuario está correcto en la base de datos
3. Espera unos minutos (puede tardar)
4. Revisa los logs del servidor para ver si hay errores

### ❌ Error: "Token inválido o expirado"

**Causa:** El link de reset expiró (dura 1 hora) o ya fue usado.

**Solución:**
1. Solicita un nuevo link de recuperación
2. Usa el link dentro de 1 hora
3. No uses el mismo link dos veces

### ❌ Error: "Por favor espera 5 minutos..."

**Causa:** Rate limiting activado (seguridad).

**Solución:**
- Espera 5 minutos antes de solicitar otro reset
- Esto previene abuso del sistema

---

## 🔒 Seguridad

El sistema implementa las siguientes medidas de seguridad:

✅ **Tokens únicos y seguros**: Generados con `crypto.randomBytes(32)`
✅ **Expiración de tokens**: 1 hora de validez
✅ **Uso único**: Los tokens se invalidan después de usarse
✅ **Rate limiting**: Máximo 1 solicitud cada 5 minutos por usuario
✅ **Hashing de contraseñas**: Bcrypt con salt
✅ **No revela información**: No indica si el usuario existe o no

---

## 📝 Variables de Entorno Completas

```env
# Servidor
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=shopmanstore_secret_key_2024

# Email (Recuperación de Contraseña)
EMAIL_USER=tu-email@gmail.com
EMAIL_APP_PASSWORD=tu-app-password-de-16-caracteres
BASE_URL=http://localhost:3001

# Base de Datos (PostgreSQL - Opcional)
DATABASE_URL=postgresql://user:password@host:5432/database

# Mercado Pago (Opcional)
MP_TOKEN=tu-token-de-mercadopago
```

---

## 🎯 Checklist de Configuración

- [ ] Verificación en 2 pasos activada en Gmail
- [ ] Contraseña de aplicación generada
- [ ] Variables `EMAIL_USER` y `EMAIL_APP_PASSWORD` en `.env`
- [ ] Variable `BASE_URL` configurada correctamente
- [ ] Servidor reiniciado después de configurar
- [ ] Mensaje "✓ Servicio de email configurado" aparece en consola
- [ ] Prueba de recuperación exitosa
- [ ] Email recibido correctamente
- [ ] Reset de contraseña funciona

---

## 📚 Recursos Adicionales

- **Documentación de Nodemailer**: https://nodemailer.com/
- **Contraseñas de aplicaciones de Google**: https://support.google.com/accounts/answer/185833
- **Verificación en 2 pasos**: https://support.google.com/accounts/answer/185839

---

## 💡 Consejos

1. **Guarda la contraseña de aplicación**: Una vez generada, no podrás verla de nuevo
2. **Usa un email dedicado**: Considera crear un email específico para tu aplicación
3. **Revisa los logs**: El servidor muestra mensajes útiles en la consola
4. **Prueba en local primero**: Asegúrate de que funciona antes de desplegar
5. **Configura BASE_URL correctamente**: Debe coincidir con la URL real de tu app

---

¿Necesitas ayuda? Revisa los logs del servidor o contacta al equipo de desarrollo.
