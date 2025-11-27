// Script de migración para agregar columna items a la tabla orders
require('dotenv').config();
const db = require('./db-config');

const isPostgres = !!process.env.DATABASE_URL;

console.log('🔄 Iniciando migración: agregar columna items a orders...');
console.log(`Base de datos: ${isPostgres ? 'PostgreSQL' : 'SQLite'}`);

if (isPostgres) {
  // PostgreSQL
  db.run(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS items TEXT`, (err) => {
    if (err) {
      console.error('❌ Error en migración:', err.message);
      process.exit(1);
    }
    console.log('✓ Columna items agregada/verificada en PostgreSQL');
    
    // Verificar la estructura
    db.all(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders'`, (err, columns) => {
      if (!err && columns) {
        console.log('\n📋 Estructura actual de la tabla orders:');
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
  db.all(`PRAGMA table_info(orders)`, (err, columns) => {
    if (err) {
      console.error('❌ Error al verificar tabla:', err.message);
      process.exit(1);
    }
    
    const hasItemsColumn = columns.some(col => col.name === 'items');
    
    if (hasItemsColumn) {
      console.log('✓ La columna items ya existe en SQLite');
      console.log('\n📋 Estructura actual de la tabla orders:');
      columns.forEach(col => {
        console.log(`  - ${col.name}: ${col.type}`);
      });
      console.log('\n✅ Migración completada (sin cambios necesarios)');
      process.exit(0);
    } else {
      // Agregar columna
      db.run(`ALTER TABLE orders ADD COLUMN items TEXT`, (err) => {
        if (err) {
          console.error('❌ Error en migración:', err.message);
          process.exit(1);
        }
        console.log('✓ Columna items agregada a SQLite');
        
        // Verificar la estructura actualizada
        db.all(`PRAGMA table_info(orders)`, (err, updatedColumns) => {
          if (!err && updatedColumns) {
            console.log('\n📋 Estructura actualizada de la tabla orders:');
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
