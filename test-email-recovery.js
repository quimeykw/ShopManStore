/**
 * Script de Prueba: Verificar Email de Recuperación
 * 
 * Este script prueba si el servicio de email está funcionando correctamente
 * y si los emails de recuperación de contraseña se envían exitosamente.
 */

require('dotenv').config();
const { sendPasswordResetEmail, emailEnabled } = require('./email-service');

console.log('='.repeat(60));
console.log('🧪 TEST: Servicio de Email de Recuperación de Contraseña');
console.log('='.repeat(60));
console.log('');

// Verificar configuración
console.log('📋 Verificando configuración...');
console.log('');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;
const BASE_URL = process.env.BASE_URL;

console.log(`EMAIL_USER: ${EMAIL_USER ? '✓ Configurado' : '✗ NO configurado'}`);
console.log(`  Valor: ${EMAIL_USER || '(vacío)'}`);
console.log('');

console.log(`EMAIL_APP_PASSWORD: ${EMAIL_APP_PASSWORD ? '✓ Configurado' : '✗ NO configurado'}`);
console.log(`  Longitud: ${EMAIL_APP_PASSWORD ? EMAIL_APP_PASSWORD.replace(/\s/g, '').length + ' caracteres' : '(vacío)'}`);
console.log('');

console.log(`BASE_URL: ${BASE_URL ? '✓ Configurado' : '⚠ Usando default'}`);
console.log(`  Valor: ${BASE_URL || 'http://localhost:3001'}`);
console.log('');

console.log(`Email Service: ${emailEnabled ? '✓ HABILITADO' : '✗ DESHABILITADO'}`);
console.log('');

if (!emailEnabled) {
  console.log('❌ El servicio de email NO está habilitado.');
  console.log('');
  console.log('Para habilitar:');
  console.log('1. Configura EMAIL_USER en .env');
  console.log('2. Configura EMAIL_APP_PASSWORD en .env');
  console.log('3. Reinicia el servidor');
  console.log('');
  process.exit(1);
}

// Crear usuario de prueba
const testUser = {
  id: 999,
  username: 'test_user',
  email: EMAIL_USER // Enviar al mismo email configurado
};

const testToken = 'test_token_' + Date.now() + '_abcdef123456';

console.log('='.repeat(60));
console.log('📧 Enviando email de prueba...');
console.log('='.repeat(60));
console.log('');

console.log(`Destinatario: ${testUser.email}`);
console.log(`Usuario: ${testUser.username}`);
console.log(`Token: ${testToken.substring(0, 20)}...`);
console.log('');

// Enviar email de prueba
(async () => {
  try {
    console.log('⏳ Enviando...');
    console.log('');
    
    const result = await sendPasswordResetEmail(testUser, testToken);
    
    console.log('');
    console.log('='.repeat(60));
    
    if (result) {
      console.log('✅ EMAIL ENVIADO EXITOSAMENTE');
      console.log('='.repeat(60));
      console.log('');
      console.log('🎉 ¡El servicio de email está funcionando correctamente!');
      console.log('');
      console.log('📬 Revisa tu bandeja de entrada:');
      console.log(`   Email: ${testUser.email}`);
      console.log('   Asunto: "Recuperación de Contraseña - ShopManStore"');
      console.log('');
      console.log('💡 Si no lo ves:');
      console.log('   1. Revisa la carpeta de SPAM');
      console.log('   2. Espera unos minutos (puede tardar)');
      console.log('   3. Verifica que el email sea correcto');
      console.log('');
      console.log('✓ El email debería llegar en menos de 1 minuto');
      console.log('');
    } else {
      console.log('❌ ERROR AL ENVIAR EMAIL');
      console.log('='.repeat(60));
      console.log('');
      console.log('El email NO se pudo enviar.');
      console.log('');
      console.log('Posibles causas:');
      console.log('1. Credenciales incorrectas');
      console.log('2. App Password inválido');
      console.log('3. Verificación en 2 pasos no activada');
      console.log('4. Problema de conexión a internet');
      console.log('');
      console.log('Solución:');
      console.log('1. Verifica EMAIL_USER y EMAIL_APP_PASSWORD en .env');
      console.log('2. Genera un nuevo App Password en Google');
      console.log('3. Verifica tu conexión a internet');
      console.log('');
    }
    
  } catch (error) {
    console.log('');
    console.log('='.repeat(60));
    console.log('❌ ERROR INESPERADO');
    console.log('='.repeat(60));
    console.log('');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.log('');
  }
})();
