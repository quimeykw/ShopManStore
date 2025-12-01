// Script de migración para agregar columna colors a la tabla products
require('dotenv').config();
const db = require('./db-config');

const isPostgres = !!process.env.DATABASE_URL;

console.log('🔄 Iniciando migración: agregar columna colors a products...');
console.log(`Base de datos: ${isPostgres ? 'PostgreSQL' : 'SQLite'}`);

if (isPostgres) {
  // PostgreSQL
  db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS colors TEXT`, (err) => {
    if (err) {
      console.error('❌ Error en migración:', err.message);
      process.exit(1);
    }
    console.log('✓ Columna colors agregada/verificada en PostgreSQL');
    
    // Verificar la estructura
    db.all(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products'`, (err, columns) => {
      if (!err && columns) {
        console.log('\n📋 Estructura actual de la tabla products:');
        columns.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type}`);
        });
      }
      console.log('\n✅ Migración completada exitosamente');
      process.exit(0);
    });
  });
} else {
  // SQLite - verificar si la columna ya existe
  db.all(`PRAGMA table_info(products)`, (err, columns) => {
    if (err) {
      console.error('❌ Error al verificar tabla:', err.message);
      process.exit(1);
    }
    
    const hasColorsColumn = columns.some(col => col.name === 'colors');
    
    if (hasColorsColumn) {
      console.log('✓ La columna colors ya existe en SQLite');
      console.log('\n📋 Estructura actual de la tabla products:');
      columns.forEach(col => {
        console.log(`  - ${col.name}: ${col.type}`);
      });
      console.log('\n✅ Migración completada (sin cambios necesarios)');
      process.exit(0);
    } else {
      // Agregar columna
      db.run(`ALTER TABLE products ADD COLUMN colors TEXT`, (err) => {
        if (err) {
          console.error('❌ Error en migración:', err.message);
          process.exit(1);
        }
        console.log('✓ Columna colors agregada a SQLite');
        
        // Verificar la estructura actualizada
        db.all(`PRAGMA table_info(products)`, (err, updatedColumns) => {
          if (!err && updatedColumns) {
            console.log('\n📋 Estructura actualizada de la tabla products:');
            updatedColumns.forEach(col => {
              console.log(`  - ${col.name}: ${col.type}`);
            });
          }
          console.log('\n✅ Migración completada exitosamente');
          process.exit(0);
        });
      });
    }
  });
}
