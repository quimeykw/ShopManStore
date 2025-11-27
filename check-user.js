const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./store.db');

const email = 'jazz.martinez0409@gmail.com';

db.get('SELECT id, username, email, role FROM users WHERE email = ?', [email], (err, user) => {
  if (err) {
    console.error('Error:', err);
    db.close();
    return;
  }
  
  if (!user) {
    console.log('❌ Usuario no encontrado con ese email');
    console.log('\n📋 Usuarios registrados:');
    
    db.all('SELECT id, username, email, role FROM users', (err, users) => {
      if (users && users.length > 0) {
        users.forEach(u => {
          console.log(`  - Usuario: ${u.username}, Email: ${u.email}, Rol: ${u.role}`);
        });
      } else {
        console.log('  No hay usuarios registrados');
      }
      db.close();
    });
  } else {
    console.log('✅ Usuario encontrado:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Usuario: ${user.username}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Rol: ${user.role}`);
    console.log('\n💡 Para resetear la contraseña, usa el panel de admin o la función de recuperación.');
    console.log('\n🔑 Credenciales por defecto:');
    console.log('  Usuario: admin');
    console.log('  Contraseña: admin123');
    db.close();
  }
});
