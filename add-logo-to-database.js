fgquire('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addLogoToDatabase() {
  try {
    console.log('Creando tabla de configuración...\n');
    
    // Crear tabla para configuración de la tienda
    await pool.query(`
      CREATE TABLE IF NOT EXISTS store_config (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✓ Tabla store_config creada\n');
    
    // Leer el logo como Base64
    const logoPath = path.join(__dirname, 'public', 'logo.png');
    
    if (!fs.existsSync(logoPath)) {
      console.log('⚠️  Archivo logo.png no encontrado en public/');
      console.log('   Guardando solo la URL del logo...\n');
      
      // Guardar URL del logo
      await pool.query(`
        INSERT INTO store_config (key, value)
        VALUES ('logo_url', '/logo.png')
        ON CONFLICT (key) 
        DO UPDATE SET value = '/logo.png', updated_at = CURRENT_TIMESTAMP
      `);
      
      console.log('✓ URL del logo guardada en la base de datos');
    } else {
      // Leer el archivo y convertirlo a Base64
      const logoBuffer = fs.readFileSync(logoPath);
      const logoBase64 = logoBuffer.toString('base64');
      const logoDataUrl = `data:image/png;base64,${logoBase64}`;
      
      console.log('✓ Logo leído y convertido a Base64\n');
      
      // Guardar el logo en Base64
      await pool.query(`
        INSERT INTO store_config (key, value)
        VALUES ('logo_base64', $1)
        ON CONFLICT (key) 
        DO UPDATE SET value = $1, updated_at = CURRENT_TIMESTAMP
      `, [logoDataUrl]);
      
      console.log('✓ Logo en Base64 guardado en la base de datos');
      
      // Guardar también la URL
      await pool.query(`
        INSERT INTO store_config (key, value)
        VALUES ('logo_url', '/logo.png')
        ON CONFLICT (key) 
        DO UPDATE SET value = '/logo.png', updated_at = CURRENT_TIMESTAMP
      `);
      
      console.log('✓ URL del logo guardada en la base de datos');
    }
    
    // Guardar nombre de la tienda
    await pool.query(`
      INSERT INTO store_config (key, value)
      VALUES ('store_name', 'ShopManStore')
      ON CONFLICT (key) 
      DO UPDATE SET value = 'ShopManStore', updated_at = CURRENT_TIMESTAMP
    `);
    
    console.log('✓ Nombre de la tienda guardado\n');
    
    // Mostrar configuración guardada
    const result = await pool.query('SELECT key, LEFT(value, 50) as value_preview FROM store_config');
    
    console.log('Configuración guardada:');
    console.log('═══════════════════════════════════════════════════════════════');
    result.rows.forEach(row => {
      console.log(`${row.key}: ${row.value_preview}${row.value_preview.length >= 50 ? '...' : ''}`);
    });
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
  }
}

addLogoToDatabase();
