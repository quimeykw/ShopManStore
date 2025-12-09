// Verificar el último token generado
require('dotenv').config();
const db = require('./db-config');

console.log('🔍 Verificando último token generado\n');

db.get(
  'SELECT pr.*, u.username, u.email FROM password_resets pr JOIN users u ON pr.user_id = u.id ORDER BY pr.created_at DESC LIMIT 1',
  (err, token) => {
    if (err) {
      console.error('❌ Error:', err.message);
      process.exit(1);
    }
    
    if (!token) {
      console.log('❌ No hay tokens en la base de datos');
      process.exit(1);
    }
    
    console.log('✅ Token encontrado:\n');
    console.log('📋 Información del Token:');
    console.log('   ID:', token.id);
    console.log('   Token completo:', token.token);
    console.log('   Usuario ID:', token.user_id);
    console.log('   Username:', token.username);
    console.log('   Email:', token.email);
    console.log('   Creado:', new Date(token.created_at).toLocaleString('es-AR'));
    console.log('   Expira:', new Date(token.expires_at).toLocaleString('es-AR'));
    console.log('   Usado:', token.used ? 'SÍ' : 'NO');
    
    // Verificar si está expirado
    const ahora = new Date();
    const expira = new Date(token.expires_at);
    const tiempoRestante = Math.round((expira - ahora) / 1000 / 60); // minutos
    
    console.log('\n⏰ Estado del Token:');
    if (tiempoRestante > 0) {
      console.log(`   ✅ VÁLIDO - Expira en ${tiempoRestante} minutos`);
    } else {
      console.log(`   ❌ EXPIRADO - Hace ${Math.abs(tiempoRestante)} minutos`);
    }
    
    if (token.used) {
      console.log('   ⚠️  Ya fue usado');
    }
    
    // Generar URL de recuperación
    const BASE_URL = process.env.BASE_URL || 
                     process.env.RENDER_EXTERNAL_URL || 
                     (process.env.NODE_ENV === 'production' ? 'https://shopmanstore.onrender.com' : 'http://localhost:3001');
    
    const resetLink = `${BASE_URL}/reset-password.html?token=${token.token}`;
    
    console.log('\n🔗 Link de Recuperación:');
    console.log(`   ${resetLink}`);
    
    console.log('\n📧 Este link fue enviado a:', token.email);
    console.log('   Revisa la carpeta SPAM si no lo encuentras');
    
    process.exit();
  }
);
