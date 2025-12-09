// Test de email para un usuario específico
require('dotenv').config();
const db = require('./db-config');
const { sendPasswordResetEmail } = require('./email-service');
const crypto = require('crypto');

const username = process.argv[2] || 'eskrilmeygm';

console.log(`🧪 Test de email para usuario: ${username}\n`);

// Buscar usuario
db.get(
  'SELECT * FROM users WHERE username = ? OR email = ?',
  [username, username],
  async (err, user) => {
    if (err) {
      console.error('❌ Error al buscar usuario:', err.message);
      process.exit(1);
    }
    
    if (!user) {
      console.error('❌ Usuario no encontrado');
      process.exit(1);
    }
    
    console.log('✅ Usuario encontrado:');
    console.log('   ID:', user.id);
    console.log('   Username:', user.username);
    console.log('   Email:', user.email);
    console.log('');
    
    // Generar token
    const token = crypto.randomBytes(32).toString('hex');
    console.log('🔑 Token generado:', token.substring(0, 10) + '...');
    console.log('');
    
    // Intentar enviar email
    console.log('📧 Intentando enviar email...\n');
    
    try {
      const result = await sendPasswordResetEmail(user, token);
      
      if (result) {
        console.log('\n✅ Email enviado exitosamente!');
        console.log('   Revisa la bandeja de entrada (y SPAM) de:', user.email);
      } else {
        console.log('\n❌ Fallo al enviar email');
        console.log('   Revisa los logs arriba para más detalles');
      }
    } catch (error) {
      console.log('\n❌ Error al enviar email:');
      console.log('   Mensaje:', error.message);
      console.log('   Stack:', error.stack);
    }
    
    process.exit();
  }
);
