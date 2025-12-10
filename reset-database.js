#!/usr/bin/env node

/**
 * Script para resetear completamente la base de datos
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Reseteando base de datos completamente...\n');

// Eliminar base de datos existente
const dbPath = path.join(__dirname, 'store.db');
if (fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    console.log('🗑️  Base de datos anterior eliminada');
  } catch (error) {
    console.log('⚠️  No se pudo eliminar la base de datos (puede estar en uso)');
    console.log('   Cierra cualquier conexión activa y vuelve a intentar');
    process.exit(1);
  }
}

// Esperar un momento
setTimeout(() => {
  console.log('🔧 Inicializando nueva base de datos...\n');
  
  // Importar y inicializar
  const db = require('./db-config');
  const initDatabase = require('./init-db');
  
  // Inicializar con la nueva estructura
  initDatabase(db, false);
  
  console.log('✅ Base de datos inicializada con estructura actualizada');
  
  // Esperar y verificar
  setTimeout(() => {
    db.all(`PRAGMA table_info(products)`, (err, columns) => {
      if (!err && columns) {
        const columnNames = columns.map(c => c.name);
        console.log('📋 Columnas creadas:', columnNames.join(', '));
        
        if (columnNames.includes('colors')) {
          console.log('✅ Columna colors creada correctamente');
        } else {
          console.log('❌ Columna colors no se creó');
        }
      }
      
      db.close();
      console.log('\n🎉 Reset completado!');
      console.log('💡 Ahora ejecuta: npm run setup');
    });
  }, 1000);
  
}, 500);