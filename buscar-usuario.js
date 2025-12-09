// Buscar usuario por email o username
require('dotenv').config();
const db = require('./db-config');

const busqueda = process.argv[2] || 'eskril';

console.log(`🔍 Buscando usuario: ${busqueda}\n`);

db.get(
  `SELECT * FROM users WHERE email LIKE ? OR username LIKE ?`,
  [`%${busqueda}%`, `%${busqueda}%`],
  (err, user) => {
    if (err) {
      console.error('❌ Error:', err.message);
    } else if (user) {
      console.log('✅ Usuario encontrado:');
      console.log('   ID:', user.id);
      console.log('   Username:', user.username);
      console.log('   Email:', user.email);
      console.log('   Role:', user.role);
    } else {
      console.log('❌ Usuario no encontrado');
    }
    process.exit();
  }
);
