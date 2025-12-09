// Email service - Hybrid version
// Uses Gmail SMTP in development, SendGrid API in production (Render)
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isRender = !!process.env.RENDER_EXTERNAL_URL;

// Configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@shopmanstore.com';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

// Auto-detect BASE_URL
const BASE_URL = process.env.BASE_URL || 
                 process.env.RENDER_EXTERNAL_URL || 
                 (isProduction ? 'https://shopmanstore.onrender.com' : 'http://localhost:3001');

let emailEnabled = false;
let transporter = null;
let useProvider = null; // 'sendgrid' or 'gmail'

// Initialize email service
try {
  // In production (Render), prefer SendGrid
  if ((isProduction || isRender) && SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
    emailEnabled = true;
    useProvider = 'sendgrid';
    console.log('✓ Servicio de email configurado (SendGrid)');
    console.log(`  BASE_URL: ${BASE_URL}`);
    console.log(`  Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Provider: SendGrid API`);
  }
  // In development or if SendGrid not available, use Gmail SMTP
  else if (EMAIL_USER && EMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_APP_PASSWORD
      }
    });
    emailEnabled = true;
    useProvider = 'gmail';
    console.log('✓ Servicio de email configurado (Gmail SMTP)');
    console.log(`  BASE_URL: ${BASE_URL}`);
    console.log(`  Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Provider: Gmail SMTP`);
  } else {
    console.warn('⚠ Email no configurado - Recuperación de contraseña deshabilitada');
    if (isProduction || isRender) {
      console.warn('  Configura SENDGRID_API_KEY y EMAIL_FROM en Render para habilitar');
    } else {
      console.warn('  Configura EMAIL_USER y EMAIL_APP_PASSWORD en .env para habilitar');
    }
  }
} catch (error) {
  console.error('✗ Error al configurar servicio de email:', error.message);
}

/**
 * Get email HTML template
 */
function getEmailTemplate(user, resetLink) {
  return `
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
  `;
}

/**
 * Send email using SendGrid
 */
async function sendWithSendGrid(user, resetToken) {
  const resetLink = `${BASE_URL}/reset-password.html?token=${resetToken}`;
  
  const msg = {
    to: user.email,
    from: EMAIL_FROM,
    subject: 'Recuperación de Contraseña - ShopManStore',
    html: getEmailTemplate(user, resetLink)
  };

  try {
    console.log(`📧 Intentando enviar email a ${user.email} (SendGrid)...`);
    await sgMail.send(msg);
    console.log(`✓ Email enviado exitosamente a ${user.email}`);
    console.log(`  Provider: SendGrid`);
    console.log(`  Usuario: ${user.username}`);
    console.log(`  Token generado: ${resetToken.substring(0, 10)}...`);
    return true;
  } catch (error) {
    console.error(`✗ Error al enviar email a ${user.email}`);
    console.error(`  Provider: SendGrid`);
    console.error(`  Error: ${error.message}`);
    if (error.code) console.error(`  Código: ${error.code}`);
    if (error.response) {
      console.error(`  Response:`, error.response.body);
    }
    return false;
  }
}

/**
 * Send email using Gmail SMTP
 */
async function sendWithGmail(user, resetToken) {
  const resetLink = `${BASE_URL}/reset-password.html?token=${resetToken}`;

  const mailOptions = {
    from: `ShopManStore <${EMAIL_USER}>`,
    to: user.email,
    subject: 'Recuperación de Contraseña - ShopManStore',
    html: getEmailTemplate(user, resetLink)
  };

  try {
    console.log(`📧 Intentando enviar email a ${user.email} (Gmail)...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Email enviado exitosamente a ${user.email}`);
    console.log(`  Provider: Gmail SMTP`);
    console.log(`  Message ID: ${info.messageId}`);
    console.log(`  Response: ${info.response}`);
    console.log(`  Usuario: ${user.username}`);
    console.log(`  Token generado: ${resetToken.substring(0, 10)}...`);
    return true;
  } catch (error) {
    console.error(`✗ Error al enviar email a ${user.email}`);
    console.error(`  Provider: Gmail SMTP`);
    console.error(`  Error: ${error.message}`);
    if (error.code) console.error(`  Código: ${error.code}`);
    if (error.command) console.error(`  Comando: ${error.command}`);
    return false;
  }
}

/**
 * Send password reset email
 * @param {Object} user - User object with email and username
 * @param {string} resetToken - Password reset token
 * @returns {Promise<boolean>} - True if email sent successfully
 */
async function sendPasswordResetEmail(user, resetToken) {
  if (!emailEnabled) {
    console.error('Email service not configured');
    return false;
  }

  if (useProvider === 'sendgrid') {
    return await sendWithSendGrid(user, resetToken);
  } else if (useProvider === 'gmail') {
    return await sendWithGmail(user, resetToken);
  } else {
    console.error('No email provider configured');
    return false;
  }
}

module.exports = {
  sendPasswordResetEmail,
  emailEnabled
};
