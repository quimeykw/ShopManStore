// Script de migración para convertir imagen única a múltiples imágenes
const db = require('./db-config');

console.log('🔄 Iniciando migración de imágenes...');

db.serialize(() => {
  // Verificar si la columna 'image' existe
  db.all("PRAGMA table_info(products)", (err, columns) => {
    if (err) {
      console.error('❌ Error al verificar estructura:', err);
      return;
    }

    const hasImageColumn = columns.some(col => col.name === 'image');
    const hasImagesColumn = columns.some(col => col.name === 'images');

    if (hasImageColumn && !hasImagesColumn) {
      console.log('📋 Renombrando columna image a images...');
      
      // SQLite no soporta RENAME COLUMN directamente en versiones antiguas
      // Usamos una estrategia de crear nueva columna y copiar datos
      db.run(`ALTER TABLE products ADD COLUMN images TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('❌ Error al agregar columna images:', err);
          return;
        }

        console.log('✓ Columna images agregada');

        // Copiar datos de image a images, convirtiendo a array JSON
        db.run(`UPDATE products SET images = json_array(image) WHERE images IS NULL AND image IS NOT NULL`, (err) => {
          if (err) {
            console.error('❌ Error al migrar datos:', err);
            return;
          }

          console.log('✓ Datos migrados a formato array');

          // Verificar migración
          db.all('SELECT id, name, image, images FROM products LIMIT 5', (err, rows) => {
            if (err) {
              console.error('❌ Error al verificar:', err);
              return;
            }

            console.log('\n📊 Muestra de productos migrados:');
            rows.forEach(row => {
              console.log(`  - ${row.name}: ${row.images || 'sin imágenes'}`);
            });

            console.log('\n✅ Migración completada exitosamente');
            console.log('⚠️  Nota: La columna "image" antigua aún existe para compatibilidad');
            console.log('   Puedes eliminarla manualmente si lo deseas');
            
            process.exit(0);
          });
        });
      });
    } else if (hasImagesColumn) {
      console.log('✓ La columna images ya existe');
      
      // Verificar si hay productos con images que no sean arrays
      db.all(`SELECT id, name, images FROM products WHERE images NOT LIKE '[%' AND images IS NOT NULL`, (err, rows) => {
        if (err) {
          console.error('❌ Error:', err);
          return;
        }

        if (rows.length > 0) {
          console.log(`📋 Encontrados ${rows.length} productos con formato antiguo, convirtiendo...`);
          
          rows.forEach(row => {
            const imagesArray = JSON.stringify([row.images]);
            db.run('UPDATE products SET images = ? WHERE id = ?', [imagesArray, row.id], (err) => {
              if (err) {
                console.error(`❌ Error al actualizar producto ${row.id}:`, err);
              }
            });
          });

          setTimeout(() => {
            console.log('✅ Conversión completada');
            process.exit(0);
          }, 1000);
        } else {
          console.log('✅ Todos los productos ya tienen formato de array');
          process.exit(0);
        }
      });
    } else {
      console.log('⚠️  No se encontró columna image ni images');
      process.exit(1);
    }
  });
});
