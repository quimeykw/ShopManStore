// Script para migrar la base de datos y agregar campos sizes y stock
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./store.db');

console.log('Iniciando migración de base de datos...\n');

db.serialize(() => {
  // Verificar si las columnas ya existen
  db.all("PRAGMA table_info(products)", (err, columns) => {
    if (err) {
      console.error('Error al leer estructura:', err);
      return;
    }
    
    const hasSizes = columns.some(col => col.name === 'sizes');
    const hasStock = columns.some(col => col.name === 'stock');
    
    if (!hasSizes) {
      console.log('Agregando columna "sizes"...');
      db.run('ALTER TABLE products ADD COLUMN sizes TEXT', (err) => {
        if (err) {
          console.error('Error al agregar sizes:', err.message);
        } else {
          console.log('✓ Columna "sizes" agregada');
        }
      });
    } else {
      console.log('✓ Columna "sizes" ya existe');
    }
    
    if (!hasStock) {
      console.log('Agregando columna "stock"...');
      db.run('ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0', (err) => {
        if (err) {
          console.error('Error al agregar stock:', err.message);
        } else {
          console.log('✓ Columna "stock" agregada');
        }
      });
    } else {
      console.log('✓ Columna "stock" ya existe');
    }
    
    setTimeout(() => {
      // Mostrar productos actuales
      db.all('SELECT id, name, sizes, stock FROM products', (err, rows) => {
        if (err) {
          console.error('Error:', err);
        } else {
          console.log('\n=== Productos en la base de datos ===');
          if (rows.length === 0) {
            console.log('No hay productos todavía');
          } else {
            rows.forEach(p => {
              console.log(`ID: ${p.id} | ${p.name} | Talles: ${p.sizes || 'sin definir'} | Stock: ${p.stock || 0}`);
            });
          }
        }
        db.close();
        console.log('\n✅ Migración completada');
      });
    }, 500);
  });
});
