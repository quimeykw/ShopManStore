# 🚀 Configurar Email y WhatsApp en Render

## 📋 Variables de Entorno Requeridas

Para que el sistema de recuperación de contraseña y notificaciones WhatsApp funcione en Render, necesitas configurar estas variables de entorno:

### Variables de Email (Recuperación de Contraseña)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `EMAIL_USER` | `quimeykw@gmail.com` | Tu email de Gmail |
| `EMAIL_APP_PASSWORD` | `yianricsnvxfhxbl` | Contraseña de aplicación de Gmail |
| `BASE_URL` | `https://tu-app.onrender.com` | URL de tu aplicación en Render |

### Variables de WhatsApp (Notificaciones)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `WHATSAPP_PHONE` | `5491122549995` | Número de WhatsApp (ya configurado) |
| `WHATSAPP_ENABLED` | `true` | Habilitar notificaciones (ya configurado) |

---

## 🔧 Pasos para Configurar en Render

### Opción 1: Desde el Dashboard de Render (Recomendado)

1. **Accede a tu servicio en Render:**
   - Ve a: https://dashboard.render.com
   - Selecciona tu servicio `shopmanstore`

2. **Ve a Environment:**
   - En el menú lateral, haz clic en **"Environment"**

3. **Agrega las variables de email:**
   
   **Variable 1: EMAIL_USER**
   - Key: `EMAIL_USER`
   - Value: `quimeykw@gmail.com`
   - Haz clic en "Add Environment Variable"
   
   **Variable 2: EMAIL_APP_PASSWORD**
   - Key: `EMAIL_APP_PASSWORD`
   - Value: `yianricsnvxfhxbl`
   - Haz clic en "Add Environment Variable"
   
   **Variable 3: BASE_URL**
   - Key: `BASE_URL`
   - Value: `https://shopmanstore.onrender.com` (o tu URL de Render)
   - Haz clic en "Add Environment Variable"

4. **Guarda los cambios:**
   - Haz clic en **"Save Changes"** al final de la página
   - Render automáticamente redesplegará tu aplicación

5. **Espera el redespliegue:**
   - El proceso toma 2-5 minutos
   - Verás el progreso en la pestaña "Logs"

### Opción 2: Usando Render CLI

Si prefieres usar la línea de comandos:

```bash
# Instalar Render CLI (si no lo tienes)
npm install -g @render/cli

# Login
render login

# Configurar variables
render env set EMAIL_USER=quimeykw@gmail.com
render env set EMAIL_APP_PASSWORD=yianricsnvxfhxbl
render env set BASE_URL=https://shopmanstore.onrender.com
```

---

## ✅ Verificar la Configuración

### 1. Revisar los Logs

Después del redespliegue, ve a la pestaña **"Logs"** en Render y busca:

```
✓ Servicio de email configurado
Server: http://0.0.0.0:10000
Environment: production
```

Si ves `✓ Servicio de email configurado`, significa que las variables están correctas.

### 2. Probar la Recuperación de Contraseña

1. Ve a tu aplicación en Render: `https://shopmanstore.onrender.com`
2. Haz clic en "¿Olvidaste tu contraseña?"
3. Ingresa tu usuario: `quimeykw`
4. Haz clic en "Enviar"
5. Revisa tu email (carpeta SPAM primero)

### 3. Verificar en los Logs de Render

En la pestaña "Logs", deberías ver:

```
📧 Intentando enviar email de recuperación a: quimeykw@gmail.com
✓ Email enviado exitosamente a quimeykw@gmail.com
  Message ID: <...>
  Response: 250 2.0.0 OK
```

---

## 🔍 Troubleshooting

### Problema: "Servicio de email no configurado"

**Causa:** Las variables de entorno no están configuradas correctamente.

**Solución:**
1. Verifica que las 3 variables estén en Render (EMAIL_USER, EMAIL_APP_PASSWORD, BASE_URL)
2. Asegúrate de que no haya espacios extra en los valores
3. Guarda los cambios y espera el redespliegue

### Problema: "Error al enviar email"

**Causa:** La contraseña de aplicación de Gmail es incorrecta.

**Solución:**
1. Verifica que la contraseña sea: `yianricsnvxfhxbl` (sin espacios)
2. Si no funciona, genera una nueva contraseña de aplicación:
   - Ve a: https://myaccount.google.com/apppasswords
   - Genera una nueva contraseña
   - Actualiza `EMAIL_APP_PASSWORD` en Render

### Problema: El link de recuperación no funciona

**Causa:** La variable `BASE_URL` está incorrecta.

**Solución:**
1. Verifica que `BASE_URL` sea tu URL de Render
2. Debe ser: `https://shopmanstore.onrender.com` (sin barra final)
3. NO debe ser `http://localhost:3001`

### Problema: Los emails van a SPAM

**Esto es normal.** Gmail marca emails automáticos como spam.

**Solución:**
1. Revisa la carpeta SPAM
2. Marca el email como "No es spam"
3. Los próximos emails llegarán a la bandeja principal

---

## 📊 Verificación Completa

Después de configurar, ejecuta esta checklist:

- [ ] Variables agregadas en Render Dashboard
- [ ] Cambios guardados
- [ ] Aplicación redesplegada
- [ ] Logs muestran "✓ Servicio de email configurado"
- [ ] Prueba de recuperación de contraseña realizada
- [ ] Email recibido (revisar SPAM)
- [ ] Link de recuperación funciona

---

## 🔐 Seguridad

### Importante:

1. **No compartas tu EMAIL_APP_PASSWORD** - Es una contraseña sensible
2. **Usa contraseñas de aplicación** - No uses tu contraseña real de Gmail
3. **Revoca contraseñas antiguas** - Si cambias la contraseña, revoca la anterior en Google

### Revocar Contraseña de Aplicación:

1. Ve a: https://myaccount.google.com/apppasswords
2. Encuentra la contraseña que creaste
3. Haz clic en "Revocar"
4. Genera una nueva si es necesario

---

## 📝 Resumen de Configuración

```yaml
# Variables en Render Dashboard
EMAIL_USER=quimeykw@gmail.com
EMAIL_APP_PASSWORD=yianricsnvxfhxbl
BASE_URL=https://shopmanstore.onrender.com
WHATSAPP_PHONE=5491122549995
WHATSAPP_ENABLED=true
```

---

## 🆘 Soporte

Si sigues teniendo problemas:

1. **Revisa los logs de Render** - Busca mensajes de error
2. **Verifica las variables** - Asegúrate de que estén correctas
3. **Prueba localmente** - Ejecuta `npm run test:email` en local
4. **Contacta soporte de Render** - Si el problema persiste

---

## ✨ Funcionalidades que se Activarán

Una vez configurado correctamente:

1. ✅ **Recuperación de contraseña** - Los usuarios podrán recuperar su contraseña por email
2. ✅ **Notificaciones WhatsApp** - Confirmaciones automáticas de compra
3. ✅ **Logs detallados** - Seguimiento de productos en cada orden
4. ✅ **Sistema profesional** - Experiencia completa para tus clientes

---

**¡Listo!** Una vez configuradas las variables en Render, todo funcionará automáticamente. 🚀
