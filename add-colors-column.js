#!/usr/bin/env node

/**
 * Script para añadir la columna colors a la tabla products
 */

const db = require('./db-config');

console.log('🔧 Añadiendo columna colors a la tabla products...\n');

// Verificar si la columna ya existe
db.all(`PRAGMA table_info(products)`, (err, columns) => {
  if (err) {
    console.error('❌ Error al verificar estructura de tabla:', err.message);
    return;
  }

  const columnNames = columns.map(col => col.name);
  console.log('📋 Columnas actuales:', columnNames.join(', '));

  if (columnNames.includes('colors')) {
    console.log('✅ La columna colors ya existe');
    db.close();
    return;
  }

  // Añadir la columna colors
  db.run(`ALTER TABLE products ADD COLUMN colors TEXT`, (err) => {
    if (err) {
      console.error('❌ Error al añadir columna colors:', err.message);
    } else {
      console.log('✅ Columna colors añadida exitosamente');
      
      // Verificar que se añadió correctamente
      db.all(`PRAGMA table_info(products)`, (err, newColumns) => {
        if (!err) {
          const newColumnNames = newColumns.map(col => col.name);
          console.log('📋 Columnas actualizadas:', newColumnNames.join(', '));
        }
        db.close();
      });
    }
  });
});