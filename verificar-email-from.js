// Verificar qué EMAIL_FROM está usando el sistema
require('dotenv').config();

console.log('🔍 Verificando configuración de EMAIL_FROM\n');

console.log('Variables de entorno:');
console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || '❌ NO CONFIGURADO');
console.log('  SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Configurado' : '❌ NO CONFIGURADO');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('  RENDER_EXTERNAL_URL:', process.env.RENDER_EXTERNAL_URL || '❌ NO CONFIGURADO');

console.log('\n📧 Email que se usará para enviar:');
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@shopmanstore.com';
console.log('  ', EMAIL_FROM);

console.log('\n⚠️  IMPORTANTE:');
console.log('  Este email DEBE estar verificado en SendGrid');
console.log('  Ve a: https://app.sendgrid.com/settings/sender_auth');
console.log('  Y verifica que este email esté en la lista con ✓ verde');

console.log('\n📋 Senders verificados en tu captura:');
console.log('  ✅ angiemanstore@gmail.com');
console.log('\n💡 Si EMAIL_FROM no coincide, cámbialo en Render a: angiemanstore@gmail.com');
