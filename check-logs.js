require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkLogs() {
  try {
    const result = await pool.query('SELECT * FROM logs ORDER BY created_at DESC LIMIT 20');
    
    console.log(`\nÚltimos ${result.rows.length} logs:\n`);
    console.log('═══════════════════════════════════════════════════════════════');
    
    result.rows.forEach(log => {
      const date = new Date(log.created_at).toLocaleString('es-AR');
      console.log(`[${date}] User ID: ${log.user_id}`);
      console.log(`Acción: ${log.action}`);
      console.log(`Detalles: ${log.details || 'N/A'}`);
      console.log('───────────────────────────────────────────────────────────────');
    });
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
  }
}

checkLogs();
