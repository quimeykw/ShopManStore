require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function resetAllPasswords() {
  try {
    const defaultPassword = 'ShopMan2024'; // Contraseña temporal para todos
    const hash = await bcrypt.hash(defaultPassword, 10);
    
    console.log('⚠️  ADVERTENCIA: Esto cambiará la contraseña de TODOS los usuarios\n');
    console.log(`Nueva contraseña temporal: ${defaultPassword}\n`);
    
    const result = await pool.query('SELECT id, username FROM users');
    
    console.log(`Se cambiarán ${result.rows.length} contraseñas.\n`);
    
    for (const user of result.rows) {
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hash, user.id]);
      console.log(`✓ ${user.username} - contraseña actualizada`);
    }
    
    console.log(`\n✓ Todas las contraseñas han sido cambiadas a: ${defaultPassword}`);
    console.log('⚠️  Recuerda pedirles a los usuarios que cambien su contraseña\n');
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
  }
}

resetAllPasswords();
