// Diagnóstico de error 500 en forgot-password
require('dotenv').config();
const db = require('./db-config');
const isPostgres = !!process.env.DATABASE_URL;

console.log('🔍 Diagnóstico de Error 500 en /api/forgot-password');
console.log(`📊 Base de datos: ${isPostgres ? 'PostgreSQL' : 'SQLite'}\n`);

// 1. Verificar tabla password_resets existe
console.log('1️⃣ Verificando tabla password_resets...');
const checkTableQuery = isPostgres 
  ? "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'password_resets')"
  : "SELECT name FROM sqlite_master WHERE type='table' AND name='password_resets'";

db.get(checkTableQuery, (err, result) => {
  if (err) {
    console.error('❌ Error al verificar tabla:', err.message);
    process.exit(1);
  }
  
  const tableExists = isPostgres ? result.exists : !!result;
  
  if (!tableExists) {
    console.error('❌ Tabla password_resets NO existe');
    console.log('\n💡 Solución: Ejecuta el script para crear la tabla:');
    console.log('   node -e "require(\'./init-db\')(require(\'./db-config\'), ' + isPostgres + ')"');
    process.exit(1);
  } else {
    console.log('✅ Tabla password_resets existe\n');
    
    // 2. Verificar usuarios con email
    console.log('2️⃣ Verificando usuarios con email configurado...');
    db.all("SELECT id, username, email FROM users WHERE email IS NOT NULL AND email != ''", (err, users) => {
      if (err) {
        console.error('❌ Error:', err.message);
      } else {
        console.log(`✅ Usuarios con email: ${users.length}`);
        users.forEach(u => {
          console.log(`   - ${u.username} (${u.email})`);
        });
        console.log();
        
        // 3. Verificar usuarios sin email
        console.log('3️⃣ Verificando usuarios SIN email...');
        db.all("SELECT id, username, email FROM users WHERE email IS NULL OR email = ''", (err, noEmailUsers) => {
          if (err) {
            console.error('❌ Error:', err.message);
          } else if (noEmailUsers.length > 0) {
            console.log(`⚠️  Usuarios sin email: ${noEmailUsers.length}`);
            noEmailUsers.forEach(u => {
              console.log(`   - ${u.username} (sin email)`);
            });
            console.log('\n💡 Estos usuarios NO pueden recuperar contraseña');
          } else {
            console.log('✅ Todos los usuarios tienen email');
          }
          console.log();
          
          // 4. Verificar tokens recientes
          console.log('4️⃣ Verificando tokens recientes (últimos 10)...');
          db.all(
            'SELECT pr.*, u.username FROM password_resets pr JOIN users u ON pr.user_id = u.id ORDER BY pr.created_at DESC LIMIT 10',
            (err, tokens) => {
              if (err) {
                console.error('❌ Error:', err.message);
              } else {
                console.log(`✅ Tokens encontrados: ${tokens.length}`);
                tokens.forEach(t => {
                  const expira = new Date(t.expires_at);
                  const ahora = new Date();
                  const estado = t.used ? '🔒 Usado' : (expira > ahora ? '✅ Válido' : '⏰ Expirado');
                  console.log(`   ${estado} - ${t.username} - ${new Date(t.created_at).toLocaleString('es-AR')}`);
                });
              }
              console.log();
              
              // 5. Verificar configuración de email
              console.log('5️⃣ Verificando configuración de email...');
              const { emailEnabled } = require('./email-service');
              if (emailEnabled) {
                console.log('✅ Servicio de email configurado');
                console.log(`   EMAIL_USER: ${process.env.EMAIL_USER}`);
                console.log(`   EMAIL_APP_PASSWORD: ${process.env.EMAIL_APP_PASSWORD ? '***configurado***' : '❌ NO configurado'}`);
              } else {
                console.error('❌ Servicio de email NO configurado');
                console.log('\n💡 Configura estas variables en .env:');
                console.log('   EMAIL_USER=tu-email@gmail.com');
                console.log('   EMAIL_APP_PASSWORD=tu-contraseña-de-aplicacion');
              }
              
              console.log('\n📊 Resumen:');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('Si ves error 500, las causas más comunes son:');
              console.log('1. Rate limiting (espera 5 minutos entre solicitudes)');
              console.log('2. Usuario sin email configurado');
              console.log('3. Tabla password_resets no existe');
              console.log('4. Servicio de email no configurado');
              console.log('5. Gmail bloqueando por demasiados emails');
              
              process.exit();
            }
          );
        });
      }
    });
  }
});
