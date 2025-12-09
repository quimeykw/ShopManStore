// Diagnóstico completo del sistema de email
require('dotenv').config();
const db = require('./db-config');
const { emailEnabled } = require('./email-service');

console.log('=== DIAGNÓSTICO DE EMAIL ===\n');

// 1. Configuración
console.log('1. Configuración:');
console.log('   EMAIL_USER:', process.env.EMAIL_USER);
console.log('   EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? `✓ Configurado (${process.env.EMAIL_APP_PASSWORD.length} caracteres)` : '✗ No configurado');
console.log('   BASE_URL:', process.env.BASE_URL);

// 2. Servicio
console.log('\n2. Servicio de Email:', emailEnabled ? '✓ Habilitado' : '✗ Deshabilitado');

// 3. Últimos tokens
db.all('SELECT * FROM password_resets ORDER BY created_at DESC LIMIT 5', (err, rows) => {
  console.log('\n3. Últimos tokens generados:');
  if (err) {
    console.log('   Error:', err.message);
  } else if (rows && rows.length > 0) {
    rows.forEach(r => {
      const fecha = new Date(r.created_at).toLocaleString('es-AR');
      const expira = new Date(r.expires_at).toLocaleString('es-AR');
      const usado = r.used ? 'SÍ' : 'NO';
      console.log(`   - ${fecha}`);
      console.log(`     Usuario ID: ${r.user_id}`);
      console.log(`     Token: ${r.token.substring(0, 10)}...`);
      console.log(`     Expira: ${expira}`);
      console.log(`     Usado: ${usado}`);
      console.log('');
    });
  } else {
    console.log('   No hay tokens generados aún');
  }
  
  // 4. Logs de email
  db.all(`SELECT * FROM logs WHERE action LIKE '%Email%' OR action LIKE '%email%' OR action LIKE '%recuperación%' ORDER BY created_at DESC LIMIT 10`, (err, logs) => {
    console.log('4. Últimos logs relacionados con email:');
    if (err) {
      console.log('   Error:', err.message);
    } else if (logs && logs.length > 0) {
      logs.forEach(l => {
        const fecha = new Date(l.created_at).toLocaleString('es-AR');
        console.log(`   - [${fecha}] ${l.action}`);
        console.log(`     ${l.details}`);
        console.log('');
      });
    } else {
      console.log('   No hay logs de email');
    }
    
    // 5. Usuarios en la base de datos
    db.all('SELECT id, username, email FROM users', (err, users) => {
      console.log('5. Usuarios en la base de datos:');
      if (err) {
        console.log('   Error:', err.message);
      } else if (users && users.length > 0) {
        users.forEach(u => {
          console.log(`   - ID: ${u.id}, Usuario: ${u.username}, Email: ${u.email}`);
        });
      } else {
        console.log('   No hay usuarios');
      }
      
      console.log('\n=== FIN DEL DIAGNÓSTICO ===');
      process.exit();
    });
  });
});
