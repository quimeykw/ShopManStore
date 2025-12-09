# 📧 Configurar SendGrid para Render

## 🎯 Objetivo

Configurar SendGrid para enviar emails de recuperación de contraseña desde Render, ya que Render bloquea conexiones SMTP salientes.

---

## 📋 Pasos para Configurar SendGrid

### Paso 1: Crear Cuenta en SendGrid

1. Ve a https://sendgrid.com/
2. Haz clic en "Start for Free"
3. Completa el formulario de registro:
   - Email
   - Contraseña
   - Nombre completo
4. Verifica tu email
5. Completa el cuestionario inicial:
   - "I'm sending emails for": **Transactional Emails**
   - "How many emails do you send per month?": **Less than 40,000**
   - "I'm using SendGrid for": **My own business**

### Paso 2: Obtener API Key

1. En el Dashboard de SendGrid, ve a:
   - **Settings** → **API Keys**
2. Haz clic en **"Create API Key"**
3. Configuración:
   - **API Key Name**: `ShopManStore`
   - **API Key Permissions**: **Full Access** (o solo "Mail Send" si prefieres)
4. Haz clic en **"Create & View"**
5. **¡IMPORTANTE!** Copia la API Key inmediatamente
   - Se muestra solo una vez
   - Formato: `SG.xxxxxxxxxxxxxxxxxxxxxxxx`
   - Guárdala en un lugar seguro

### Paso 3: Verificar Sender Identity

SendGrid requiere que verifiques tu identidad de remitente:

#### Opción A: Single Sender Verification (Más Rápido)

1. Ve a **Settings** → **Sender Authentication**
2. Haz clic en **"Verify a Single Sender"**
3. Completa el formulario:
   - **From Name**: `ShopManStore`
   - **From Email Address**: Tu email (ej: `quimeykw@gmail.com`)
   - **Reply To**: El mismo email
   - **Company Address**: Tu dirección
   - **City, State, Zip**: Tu ubicación
   - **Country**: Tu país
4. Haz clic en **"Create"**
5. Revisa tu email y haz clic en el link de verificación
6. Una vez verificado, usa este email como `EMAIL_FROM`

#### Opción B: Domain Authentication (Recomendado para Producción)

Si tienes un dominio propio:

1. Ve a **Settings** → **Sender Authentication**
2. Haz clic en **"Authenticate Your Domain"**
3. Sigue las instrucciones para agregar registros DNS
4. Una vez verificado, puedes usar cualquier email de tu dominio

### Paso 4: Instalar Dependencia

```bash
npm install @sendgrid/mail
```

### Paso 5: Reemplazar email-service.js

Opción 1: Usar la versión híbrida (recomendado):

```bash
# Respaldar versión actual
cp email-service.js email-service-gmail.js

# Usar versión híbrida
cp email-service-hybrid.js email-service.js
```

Opción 2: Editar manualmente (ver SOLUCION-SMTP-RENDER.md)

### Paso 6: Configurar Variables en Render

1. Ve a tu servicio en Render Dashboard
2. Ve a **Environment**
3. Agrega estas variables:

```
SENDGRID_API_KEY=SG.tu-api-key-aqui
EMAIL_FROM=tu-email-verificado@gmail.com
NODE_ENV=production
```

**Notas:**
- `SENDGRID_API_KEY`: La API Key que copiaste en el Paso 2
- `EMAIL_FROM`: El email que verificaste en el Paso 3
- `NODE_ENV`: Debe ser "production" para usar SendGrid

### Paso 7: Actualizar .env.example

```bash
# Email Configuration
# Development: Uses Gmail SMTP
EMAIL_USER=tu-email@gmail.com
EMAIL_APP_PASSWORD=tu-contraseña-de-aplicacion

# Production (Render): Uses SendGrid API
SENDGRID_API_KEY=SG.tu-api-key-aqui
EMAIL_FROM=noreply@shopmanstore.com
```

### Paso 8: Desplegar a Render

```bash
git add .
git commit -m "Configurar SendGrid para emails en Render"
git push
```

Render detectará los cambios y redesplegará automáticamente.

---

## 🧪 Probar la Configuración

### En Desarrollo (Localhost):

El sistema seguirá usando Gmail SMTP:

```bash
npm start
```

Deberías ver:
```
✓ Servicio de email configurado (Gmail SMTP)
  BASE_URL: http://localhost:3001
  Entorno: development
  Provider: Gmail SMTP
```

### En Producción (Render):

Después del despliegue, revisa los logs en Render:

```
✓ Servicio de email configurado (SendGrid)
  BASE_URL: https://shopmanstore.onrender.com
  Entorno: production
  Provider: SendGrid API
```

### Probar Recuperación de Contraseña:

1. Ve a tu aplicación en Render
2. Haz clic en "¿Olvidaste tu contraseña?"
3. Ingresa tu usuario
4. Revisa tu email (incluyendo SPAM)

En los logs de Render deberías ver:
```
📧 Intentando enviar email a usuario@gmail.com (SendGrid)...
✓ Email enviado exitosamente a usuario@gmail.com
  Provider: SendGrid
  Usuario: usuario
  Token generado: abc123...
```

---

## 🔍 Troubleshooting

### Error: "The from email does not match a verified Sender Identity"

**Causa:** El email en `EMAIL_FROM` no está verificado en SendGrid.

**Solución:**
1. Ve a SendGrid → Settings → Sender Authentication
2. Verifica que el email esté en la lista de "Verified Senders"
3. Si no está, verifica un nuevo sender
4. Actualiza `EMAIL_FROM` en Render con el email verificado

### Error: "Unauthorized"

**Causa:** La API Key es incorrecta o no tiene permisos.

**Solución:**
1. Verifica que `SENDGRID_API_KEY` esté correctamente configurada en Render
2. Verifica que la API Key tenga permisos de "Mail Send"
3. Si es necesario, crea una nueva API Key

### Error: "Daily sending limit exceeded"

**Causa:** Has excedido el límite de 100 emails/día del plan gratuito.

**Solución:**
1. Espera hasta el día siguiente
2. Considera upgrade a un plan pago si necesitas más emails
3. Revisa que no haya un loop enviando emails

### Emails no llegan

**Causa:** Pueden estar en SPAM o bloqueados.

**Solución:**
1. Revisa la carpeta SPAM
2. Verifica los logs de SendGrid:
   - Dashboard → Activity Feed
   - Busca el email enviado
   - Revisa el estado (Delivered, Bounced, etc.)
3. Marca los emails como "No es spam"

### Sistema sigue usando Gmail en Render

**Causa:** `NODE_ENV` no está configurado como "production".

**Solución:**
1. Ve a Render → Environment
2. Verifica que `NODE_ENV=production`
3. Redespliega si es necesario

---

## 📊 Monitoreo

### Ver Emails Enviados:

1. Ve a SendGrid Dashboard
2. **Activity** → **Activity Feed**
3. Verás todos los emails enviados con su estado

### Estadísticas:

1. Ve a SendGrid Dashboard
2. **Stats** → **Overview**
3. Verás gráficas de emails enviados, entregados, abiertos, etc.

---

## 💰 Límites del Plan Gratuito

| Métrica | Límite |
|---------|--------|
| Emails por día | 100 |
| Emails por mes | ~3,000 |
| Validez de API Key | Permanente |
| Soporte | Community |

**Nota:** Si necesitas más emails, puedes upgrade a un plan pago desde $19.95/mes.

---

## ✅ Checklist de Configuración

- [ ] Cuenta de SendGrid creada
- [ ] Email verificado
- [ ] API Key creada y guardada
- [ ] Sender Identity verificada
- [ ] `@sendgrid/mail` instalado
- [ ] `email-service.js` actualizado
- [ ] Variables configuradas en Render:
  - [ ] `SENDGRID_API_KEY`
  - [ ] `EMAIL_FROM`
  - [ ] `NODE_ENV=production`
- [ ] Código desplegado a Render
- [ ] Logs verificados (usando SendGrid)
- [ ] Email de prueba enviado y recibido

---

## 🎉 Resultado Esperado

### Desarrollo (Localhost):
```
✓ Servicio de email configurado (Gmail SMTP)
  Provider: Gmail SMTP
```

### Producción (Render):
```
✓ Servicio de email configurado (SendGrid)
  Provider: SendGrid API
```

### Email Enviado:
```
📧 Intentando enviar email a usuario@gmail.com (SendGrid)...
✓ Email enviado exitosamente a usuario@gmail.com
  Provider: SendGrid
```

---

**¡Con esta configuración, tus emails funcionarán perfectamente en Render!** 🚀
