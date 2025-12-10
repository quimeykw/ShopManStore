#!/usr/bin/env node

/**
 * Script de migración para actualizar la base de datos
 */

const db = require('./db-config');

console.log('🔧 Migrando base de datos...\n');

// Función para añadir columna si no existe
function addColumnIfNotExists(tableName, columnName, columnType, defaultValue = null) {
  return new Promise((resolve) => {
    // Verificar si la columna ya existe
    db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
      if (err) {
        console.error(`❌ Error verificando tabla ${tableName}:`, err.message);
        resolve(false);
        return;
      }

      const columnNames = columns.map(col => col.name);
      
      if (columnNames.includes(columnName)) {
        console.log(`✅ Columna ${columnName} ya existe en ${tableName}`);
        resolve(true);
        return;
      }

      // Añadir la columna
      const defaultClause = defaultValue ? ` DEFAULT ${defaultValue}` : '';
      const sql = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}${defaultClause}`;
      
      db.run(sql, (err) => {
        if (err) {
          console.error(`❌ Error añadiendo columna ${columnName}:`, err.message);
          resolve(false);
        } else {
          console.log(`✅ Columna ${columnName} añadida a ${tableName}`);
          resolve(true);
        }
      });
    });
  });
}

async function runMigrations() {
  console.log('📋 Ejecutando migraciones...\n');

  // Migración 1: Añadir columna colors a products
  await addColumnIfNotExists('products', 'colors', 'TEXT');

  // Migración 2: Verificar que todas las columnas necesarias existan
  const requiredColumns = [
    { table: 'products', column: 'sizes', type: 'TEXT' },
    { table: 'products', column: 'stock', type: 'INTEGER', default: '0' },
    { table: 'products', column: 'images', type: 'TEXT' }
  ];

  for (const col of requiredColumns) {
    await addColumnIfNotExists(col.table, col.column, col.type, col.default);
  }

  console.log('\n📊 Verificando estructura final...');
  
  db.all(`PRAGMA table_info(products)`, (err, columns) => {
    if (!err && columns) {
      const columnNames = columns.map(c => c.name);
      console.log('📋 Columnas en products:', columnNames.join(', '));
      
      const requiredCols = ['id', 'name', 'price', 'images', 'sizes', 'colors', 'stock'];
      const hasAllColumns = requiredCols.every(col => columnNames.includes(col));
      
      if (hasAllColumns) {
        console.log('✅ Todas las columnas necesarias están presentes');
      } else {
        const missing = requiredCols.filter(col => !columnNames.includes(col));
        console.log('❌ Columnas faltantes:', missing.join(', '));
      }
    }
    
    db.close();
    console.log('\n🎉 Migración completada!');
    console.log('💡 Ahora puedes ejecutar: npm run setup');
  });
}

runMigrations().catch(error => {
  console.error('❌ Error en migración:', error);
  db.close();
});