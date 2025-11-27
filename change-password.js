require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function changePassword(username, newPassword) {
  try {
    console.log(`Cambiando contraseña para: ${username}...`);
    
    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Actualizar en la base de datos
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE username = $2 RETURNING id, username, email',
      [hashedPassword, username]
    );
    
    if (result.rows.length > 0) {
      console.log('\n✓ Contraseña actualizada exitosamente!');
      console.log('==================');
      console.log('Usuario:', result.rows[0].username);
      console.log('Email:', result.rows[0].email);
      console.log('Nueva contraseña:', newPassword);
      console.log('==================\n');
    } else {
      console.log('\n✗ Usuario no encontrado\n');
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
  }
}

// Cambiar contraseña
const username = 'Jazz.04';
const newPassword = '04092023';
changePassword(username, newPassword);
