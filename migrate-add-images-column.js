const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./store.db');

console.log('🔄 Iniciando migración de base de datos...');

db.serialize(() => {
  // Verificar si la columna images existe
  db.all("PRAGMA table_info(products)", (err, columns) => {
    if (err) {
      console.error('❌ Error al verificar columnas:', err);
      return;
    }
    
    const hasImagesColumn = columns.some(col => col.name === 'images');
    
    if (!hasImagesColumn) {
      console.log('📝 Agregando columna images...');
      
      db.run('ALTER TABLE products ADD COLUMN images TEXT', (err) => {
        if (err) {
          console.error('❌ Error al agregar columna images:', err);
        } else {
          console.log('✅ Columna images agregada exitosamente');
          
          // Migrar datos existentes
          console.log('🔄 Migrando imágenes existentes...');
          db.run(`UPDATE products SET images = json_array(image) WHERE image IS NOT NULL AND images IS NULL`, (err) => {
            if (err) {
              console.error('❌ Error al migrar imágenes:', err);
            } else {
              console.log('✅ Imágenes migradas exitosamente');
              
              // Verificar migración
              db.all('SELECT id, name, image, images FROM products LIMIT 5', (err, rows) => {
                if (!err && rows) {
                  console.log('\n📊 Muestra de productos migrados:');
                  rows.forEach(row => {
                    console.log(`  - ${row.name}: ${row.images ? 'OK' : 'Pendiente'}`);
                  });
                }
                
                console.log('\n✅ Migración completada. Reinicia el servidor (npm start)');
                db.close();
              });
            }
          });
        }
      });
    } else {
      console.log('✅ La columna images ya existe');
      
      // Verificar si hay productos sin migrar
      db.all('SELECT COUNT(*) as count FROM products WHERE image IS NOT NULL AND images IS NULL', (err, result) => {
        if (!err && result[0].count > 0) {
          console.log(`🔄 Migrando ${result[0].count} productos sin columna images...`);
          db.run(`UPDATE products SET images = json_array(image) WHERE image IS NOT NULL AND images IS NULL`, (err) => {
            if (err) {
              console.error('❌ Error al migrar:', err);
            } else {
              console.log('✅ Productos migrados exitosamente');
            }
            db.close();
          });
        } else {
          console.log('✅ Todos los productos ya están migrados');
          db.close();
        }
      });
    }
  });
});
