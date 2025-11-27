require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function listUsers() {
  try {
    console.log('Consultando usuarios en la base de datos...\n');
    
    const result = await pool.query(
      'SELECT id, username, email, role, created_at FROM users ORDER BY id'
    );
    
    if (result.rows.length === 0) {
      console.log('No hay usuarios en la base de datos.\n');
    } else {
      console.log(`Total de usuarios: ${result.rows.length}\n`);
      console.log('═══════════════════════════════════════════════════════════════');
      
      result.rows.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Usuario: ${user.username}`);
        console.log(`Email: ${user.email}`);
        console.log(`Rol: ${user.role}`);
        console.log(`Creado: ${new Date(user.created_at).toLocaleString('es-AR')}`);
        console.log('───────────────────────────────────────────────────────────────');
      });
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
  }
}

listUsers();
