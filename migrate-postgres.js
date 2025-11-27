// Script para migrar PostgreSQL en Render
// Agrega las columnas sizes y stock si no existen

const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL no está configurada');
  console.log('Este script debe ejecutarse en Render o con DATABASE_URL configurada');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  console.log('🔄 Iniciando migración de PostgreSQL...\n');
  
  try {
    // Verificar si las columnas existen
    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products'
    `);
    
    const columns = checkColumns.rows.map(row => row.column_name);
    console.log('Columnas actuales:', columns.join(', '));
    
    // Agregar columna sizes si no existe
    if (!columns.includes('sizes')) {
      console.log('\n📝 Agregando columna "sizes"...');
      await pool.query('ALTER TABLE products ADD COLUMN sizes TEXT');
      console.log('✅ Columna "sizes" agregada');
    } else {
      console.log('✅ Columna "sizes" ya existe');
    }
    
    // Agregar columna stock si no existe
    if (!columns.includes('stock')) {
      console.log('\n📝 Agregando columna "stock"...');
      await pool.query('ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0');
      console.log('✅ Columna "stock" agregada');
    } else {
      console.log('✅ Columna "stock" ya existe');
    }
    
    // Mostrar productos actuales
    const products = await pool.query('SELECT id, name, sizes, stock FROM products');
    
    console.log('\n=== Productos en la base de datos ===');
    if (products.rows.length === 0) {
      console.log('No hay productos todavía');
    } else {
      products.rows.forEach(p => {
        console.log(`ID: ${p.id} | ${p.name} | Talles: ${p.sizes || 'sin definir'} | Stock: ${p.stock || 0}`);
      });
    }
    
    console.log('\n✅ Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
