require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function findUser(username) {
  try {
    console.log(`Buscando usuario: ${username}...`);
    
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (result.rows.length > 0) {
      console.log('\n✓ Usuario encontrado:');
      console.log('==================');
      console.log('ID:', result.rows[0].id);
      console.log('Username:', result.rows[0].username);
      console.log('Email:', result.rows[0].email);
      console.log('Role:', result.rows[0].role);
      console.log('Created:', result.rows[0].created_at);
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

// Buscar el usuario
const username = process.argv[2] || 'Jazz.04';
findUser(username);
