# 🚨 Solución: Connection Timeout SMTP en Render

## 🎯 Problema Identificado

```
❌ Fallo al enviar email a: eskrilmeygm@gmail.com
✗ Error al enviar email a eskrilmeygm@gmail.com
Error: Connection timeout
Código: ETIMEDOUT
Comando: CONN
```

---

## 🔍 Causa del Problema

**Render bloquea las conexiones SMTP salientes por defecto** en los planes gratuitos y algunos planes pagos por razones de seguridad (prevenir spam).

### Puertos Bloqueados en Render:
- Puerto 25 (SMTP)
- Puerto 587 (SMTP con STARTTLS)
- Puerto 465 (SMTPS)

**Resultado:** No puedes conectarte directamente a Gmail SMTP desde Render.

---

## ✅ Soluciones

### Solución 1: Usar un Servicio de Email Transaccional (Recomendado) 🌟

Los servicios de email transaccional usan APIs HTTP en lugar de SMTP, que **SÍ funcionan en Render**.

#### Opciones Recomendadas:

#### A) SendGrid (Gratis hasta 100 emails/día)

**Ventajas:**
- ✅ Plan gratuito generoso
- ✅ API simple
- ✅ Funciona en Render
- ✅ Buena entregabilidad

**Configuración:**

1. **Crear cuenta en SendGrid:**
   - Ve a https://sendgrid.com/
   - Regístrate gratis
   - Verifica tu email

2. **Obtener API Key:**
   - Dashboard → Settings → API Keys
   - Create API Key
   - Nombre: "ShopManStore"
   - Permisos: Full Access (o solo Mail Send)
   - Copia la API Key (solo se muestra una vez)

3. **Instalar paquete:**
   ```bash
   npm install @sendgrid/mail
   ```

4. **Actualizar email-service.js:**
   ```javascript
   const sgMail = require('@sendgrid/mail');
   
   const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
   const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@shopmanstore.com';
   
   if (SENDGRID_API_KEY) {
     sgMail.setApiKey(SENDGRID_API_KEY);
     emailEnabled = true;
   }
   
   async function sendPasswordResetEmail(user, resetToken) {
     const resetLink = `${BASE_URL}/reset-password.html?token=${resetToken}`;
     
     const msg = {
       to: user.email,
       from: EMAIL_FROM,
       subject: 'Recuperación de Contraseña - ShopManStore',
       html: `...tu HTML actual...`
     };
     
     try {
       await sgMail.send(msg);
       console.log(`✓ Email enviado exitosamente a ${user.email}`);
       return true;
     } catch (error) {
       console.error(`✗ Error al enviar email:`, error.message);
       return false;
     }
   }
   ```

5. **Configurar en Render:**
   ```
   SENDGRID_API_KEY=SG.tu-api-key-aqui
   EMAIL_FROM=noreply@shopmanstore.com
   ```

#### B) Resend (Gratis hasta 3,000 emails/mes)

**Ventajas:**
- ✅ Plan gratuito muy generoso
- ✅ API moderna y simple
- ✅ Funciona en Render
- ✅ Excelente documentación

**Configuración:**

1. **Crear cuenta en Resend:**
   - Ve a https://resend.com/
   - Regístrate gratis
   - Verifica tu email

2. **Obtener API Key:**
   - Dashboard → API Keys
   - Create API Key
   - Copia la API Key

3. **Instalar paquete:**
   ```bash
   npm install resend
   ```

4. **Actualizar email-service.js:**
   ```javascript
   const { Resend } = require('resend');
   
   const RESEND_API_KEY = process.env.RESEND_API_KEY;
   const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
   
   let resend = null;
   if (RESEND_API_KEY) {
     resend = new Resend(RESEND_API_KEY);
     emailEnabled = true;
   }
   
   async function sendPasswordResetEmail(user, resetToken) {
     const resetLink = `${BASE_URL}/reset-password.html?token=${resetToken}`;
     
     try {
       const { data, error } = await resend.emails.send({
         from: EMAIL_FROM,
         to: user.email,
         subject: 'Recuperación de Contraseña - ShopManStore',
         html: `...tu HTML actual...`
       });
       
       if (error) {
         console.error(`✗ Error al enviar email:`, error);
         return false;
       }
       
       console.log(`✓ Email enviado exitosamente a ${user.email}`);
       return true;
     } catch (error) {
       console.error(`✗ Error al enviar email:`, error.message);
       return false;
     }
   }
   ```

5. **Configurar en Render:**
   ```
   RESEND_API_KEY=re_tu-api-key-aqui
   EMAIL_FROM=onboarding@resend.dev
   ```

#### C) Mailgun (Gratis hasta 5,000 emails/mes)

**Ventajas:**
- ✅ Plan gratuito generoso
- ✅ API robusta
- ✅ Funciona en Render

**Configuración similar a SendGrid.**

---

### Solución 2: Usar Gmail con OAuth2 (Complejo)

**No recomendado** - Requiere configuración OAuth2 compleja y tokens de refresh.

---

### Solución 3: Upgrade a Render Plan Pago con SMTP

**Render Pro Plan** ($7/mes) permite conexiones SMTP salientes.

**Pasos:**
1. Upgrade a Render Pro
2. Contacta soporte para habilitar SMTP
3. Mantén la configuración actual de Gmail

**No recomendado** - Más caro que usar un servicio de email transaccional.

---

## 🚀 Implementación Recomendada: SendGrid

### Paso 1: Instalar SendGrid

```bash
npm install @sendgrid/mail
```

### Paso 2: Actualizar package.json

Verifica que se agregó:
```json
{
  "dependencies": {
    "@sendgrid/mail": "^8.1.0"
  }
}
```

### Paso 3: Crear nuevo email-service.js

```javascript
// email-service.js - Versión con SendGrid para Render
const sgMail = require('@sendgrid/mail');

// Configuración
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@shopmanstore.com';
const BASE_URL = process.env.BASE_URL || 
                 process.env.RENDER_EXTERNAL_URL || 
                 (process.env.NODE_ENV === 'production' ? 'https://shopmanstore.onrender.com' : 'http://localhost:3001');

let emailEnabled = false;

// Inicializar SendGrid
try {
  if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
    emailEnabled = true;
    console.log('✓ Servicio de email configurado (SendGrid)');
    console.log(`  BASE_URL: ${BASE_URL}`);
    console.log(`  Entorno: ${process.env.NODE_ENV || 'development'}`);
  } else {
    console.warn('⚠ Email no configurado - Recuperación de contraseña deshabilitada');
    console.warn('  Configura SENDGRID_API_KEY en .env para habilitar');
  }
} catch (error) {
  console.error('✗ Error al configurar servicio de email:', error.message);
}

/**
 * Send password reset email
 * @param {Object} user - User object with email and username
 * @param {string} resetToken - Password reset token
 * @returns {Promise<boolean>} - True if email sent successfully
 */
async function sendPasswordResetEmail(user, resetToken) {
  if (!emailEnabled || !sgMail) {
    console.error('Email service not configured');
    return false;
  }

  const resetLink = `${BASE_URL}/reset-password.html?token=${resetToken}`;

  const msg = {
    to: user.email,
    from: EMAIL_FROM,
    subject: 'Recuperación de Contraseña - ShopManStore',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background: #4F46E5;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
          .warning {
            background: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 15px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ShopManStore</h1>
          <p>Recuperación de Contraseña</p>
        </div>
        <div class="content">
          <p>Hola <strong>${user.username}</strong>,</p>
          
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en ShopManStore.</p>
          
          <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Restablecer Contraseña</a>
          </div>
          
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">
            ${resetLink}
          </p>
          
          <div class="warning">
            <strong>⏰ Importante:</strong> Este enlace expirará en <strong>1 hora</strong> por razones de seguridad.
          </div>
          
          <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña no será modificada.</p>
          
          <p>Saludos,<br>El equipo de ShopManStore</p>
        </div>
        <div class="footer">
          <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          <p>&copy; ${new Date().getFullYear()} ShopManStore. Todos los derechos reservados.</p>
        </div>
      </body>
      </html>
    `
  };

  try {
    console.log(`📧 Intentando enviar email a ${user.email}...`);
    await sgMail.send(msg);
    console.log(`✓ Email enviado exitosamente a ${user.email}`);
    console.log(`  Usuario: ${user.username}`);
    console.log(`  Token generado: ${resetToken.substring(0, 10)}...`);
    return true;
  } catch (error) {
    console.error(`✗ Error al enviar email a ${user.email}`);
    console.error(`  Error: ${error.message}`);
    if (error.code) console.error(`  Código: ${error.code}`);
    if (error.response) {
      console.error(`  Response:`, error.response.body);
    }
    return false;
  }
}

module.exports = {
  sendPasswordResetEmail,
  emailEnabled
};
```

### Paso 4: Configurar Variables en Render

En Render Dashboard → Environment:

```
SENDGRID_API_KEY=SG.tu-api-key-de-sendgrid
EMAIL_FROM=noreply@shopmanstore.com
NODE_ENV=production
```

### Paso 5: Desplegar

```bash
git add .
git commit -m "Migrar de Gmail SMTP a SendGrid para Render"
git push
```

Render detectará los cambios y redesplegará automáticamente.

---

## 🧪 Pruebas

### En Desarrollo (Localhost):

Si quieres seguir usando Gmail en desarrollo:

```javascript
// email-service.js - Versión híbrida
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const isProduction = process.env.NODE_ENV === 'production';
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

let emailEnabled = false;
let transporter = null;

if (isProduction && SENDGRID_API_KEY) {
  // Producción: usar SendGrid
  sgMail.setApiKey(SENDGRID_API_KEY);
  emailEnabled = true;
  console.log('✓ Servicio de email configurado (SendGrid)');
} else if (!isProduction && EMAIL_USER && EMAIL_APP_PASSWORD) {
  // Desarrollo: usar Gmail SMTP
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_APP_PASSWORD }
  });
  emailEnabled = true;
  console.log('✓ Servicio de email configurado (Gmail)');
}

async function sendPasswordResetEmail(user, resetToken) {
  if (isProduction) {
    // Usar SendGrid
    return await sendWithSendGrid(user, resetToken);
  } else {
    // Usar Gmail
    return await sendWithGmail(user, resetToken);
  }
}
```

---

## 📊 Comparación de Servicios

| Servicio | Plan Gratuito | Emails/Mes | API | Complejidad |
|----------|---------------|------------|-----|-------------|
| **SendGrid** | ✅ | 100/día (3,000/mes) | HTTP | Baja |
| **Resend** | ✅ | 3,000/mes | HTTP | Muy Baja |
| **Mailgun** | ✅ | 5,000/mes | HTTP | Media |
| **Gmail SMTP** | ✅ | 500/día | SMTP | Baja |
| **Render Pro + Gmail** | ❌ $7/mes | 500/día | SMTP | Baja |

**Recomendación:** SendGrid o Resend

---

## ✅ Resumen

### Problema:
- ❌ Render bloquea conexiones SMTP salientes
- ❌ Gmail SMTP no funciona en Render
- ❌ Connection timeout (ETIMEDOUT)

### Solución:
- ✅ Usar SendGrid (API HTTP)
- ✅ Plan gratuito: 100 emails/día
- ✅ Funciona perfectamente en Render
- ✅ Fácil de implementar

### Pasos:
1. Crear cuenta en SendGrid
2. Obtener API Key
3. Instalar `@sendgrid/mail`
4. Actualizar `email-service.js`
5. Configurar variables en Render
6. Desplegar

---

**¡Con SendGrid, tus emails funcionarán perfectamente en Render!** 🚀
