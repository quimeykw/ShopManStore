#!/usr/bin/env node

/**
 * Script para forzar actualización completa de productos
 * Limpia caché, verifica BD y asegura que todos los productos estén disponibles
 */

const db = require('./db-config');
const http = require('http');

console.log('🔄 FORZANDO ACTUALIZACIÓN COMPLETA DE PRODUCTOS...\n');

// Productos completos que deben estar disponibles
const allProducts = [
  {
    name: 'Remera Básica Algodón',
    description: 'Remera de algodón 100% suave y cómoda. Perfecta para uso diario.',
    price: 2500,
    sizes: 'S, M, L, XL',
    colors: 'Blanco, Negro, Gris, Azul Marino',
    stock: 50,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5SZW1lcmE8L3RleHQ+PC9zdmc+'
  },
  {
    name: 'Jean Clásico Azul',
    description: 'Jean de corte clásico en denim de alta calidad. Cómodo y resistente.',
    price: 4500,
    sizes: '28, 30, 32, 34, 36, 38, 40',
    colors: 'Azul Clásico, Azul Oscuro, Negro',
    stock: 30,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDY4MmI0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSI+SmVhbjwvdGV4dD48L3N2Zz4='
  },
  {
    name: 'Zapatillas Deportivas',
    description: 'Zapatillas cómodas para uso diario y deportivo. Suela antideslizante.',
    price: 8500,
    sizes: '37, 38, 39, 40, 41, 42, 43, 44',
    colors: 'Blanco, Negro, Azul, Rojo',
    stock: 25,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5aYXBhdGlsbGFzPC90ZXh0Pjwvc3ZnPg=='
  },
  {
    name: 'Campera de Abrigo',
    description: 'Campera térmica perfecta para el invierno. Resistente al viento.',
    price: 12500,
    sizes: 'S, M, L, XL, XXL',
    colors: 'Negro, Azul Marino, Gris, Verde Militar',
    stock: 20,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSI+Q2FtcGVyYTwvdGV4dD48L3N2Zz4='
  },
  {
    name: 'Vestido Casual',
    description: 'Vestido cómodo y elegante para cualquier ocasión. Tela suave.',
    price: 5500,
    sizes: 'XS, S, M, L, XL',
    colors: 'Rosa, Azul, Negro, Blanco, Floreado',
    stock: 35,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZiNmM1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5WZXN0aWRvPC90ZXh0Pjwvc3ZnPg=='
  },
  {
    name: 'Buzo con Capucha',
    description: 'Buzo cómodo con capucha. Ideal para días frescos.',
    price: 6500,
    sizes: 'S, M, L, XL, XXL',
    colors: 'Gris, Negro, Azul, Rojo, Verde',
    stock: 40,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSI+QnV6bzwvdGV4dD48L3N2Zz4='
  },
  {
    name: 'Pantalón Deportivo',
    description: 'Pantalón cómodo para hacer ejercicio o uso casual.',
    price: 3500,
    sizes: 'S, M, L, XL, XXL',
    colors: 'Negro, Gris, Azul Marino, Verde',
    stock: 45,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjIyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSI+UGFudGFsw7NuPC90ZXh0Pjwvc3ZnPg=='
  },
  {
    name: 'Camisa Formal',
    description: 'Camisa elegante para ocasiones formales. Corte clásico.',
    price: 4200,
    sizes: 'S, M, L, XL, XXL',
    colors: 'Blanco, Celeste, Azul, Rosa, Gris',
    stock: 28,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOGZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DYW1pc2E8L3RleHQ+PC9zdmc+'
  },
  // Productos adicionales para llegar a más variedad
  {
    name: 'Shorts Deportivos',
    description: 'Shorts cómodos para ejercicio y uso casual en verano.',
    price: 2800,
    sizes: 'S, M, L, XL, XXL',
    colors: 'Negro, Azul, Gris, Rojo',
    stock: 60,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSI+U2hvcnRzPC90ZXh0Pjwvc3ZnPg=='
  },
  {
    name: 'Pollera Elegante',
    description: 'Pollera elegante para ocasiones especiales. Corte moderno.',
    price: 4800,
    sizes: 'XS, S, M, L, XL',
    colors: 'Negro, Azul Marino, Gris, Bordo',
    stock: 25,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSI+UG9sbGVyYTwvdGV4dD48L3N2Zz4='
  }
];

// Función para hacer request HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Timeout')));
    req.end();
  });
}

// Función para limpiar caché del servidor
async function clearServerCache() {
  console.log('🧹 Limpiando caché del servidor...');
  
  try {
    // Hacer request para limpiar caché de productos
    await makeRequest('http://localhost:3001/api/products?_cache_bust=' + Date.now());
    console.log('✅ Caché del servidor limpiado');
  } catch (error) {
    console.log('⚠️  Servidor no está corriendo, continuando...');
  }
}

// Función principal
async function forceUpdate() {
  console.log('🔍 PASO 1: Verificando estructura de base de datos...');
  
  // Verificar y añadir columna colors si no existe
  db.all('PRAGMA table_info(products)', (err, columns) => {
    if (err) {
      console.error('❌ Error verificando estructura:', err.message);
      return;
    }
    
    const columnNames = columns.map(col => col.name);
    console.log(`📋 Columnas actuales: ${columnNames.join(', ')}`);
    
    if (!columnNames.includes('colors')) {
      console.log('🔧 Añadiendo columna colors...');
      db.run('ALTER TABLE products ADD COLUMN colors TEXT', (err) => {
        if (err && !err.message.includes('duplicate')) {
          console.error('❌ Error añadiendo columna colors:', err.message);
        } else {
          console.log('✅ Columna colors añadida/verificada');
        }
        proceedWithProducts();
      });
    } else {
      console.log('✅ Estructura de BD correcta');
      proceedWithProducts();
    }
  });
}

function proceedWithProducts() {
  console.log('\n🔍 PASO 2: Verificando productos existentes...');
  
  db.all('SELECT name FROM products', (err, existingProducts) => {
    if (err) {
      console.error('❌ Error consultando productos:', err.message);
      return;
    }
    
    const existingNames = existingProducts.map(p => p.name);
    console.log(`📦 Productos actuales en BD: ${existingNames.length}`);
    
    console.log('\n🚀 PASO 3: Forzando actualización completa...');
    
    let completed = 0;
    let added = 0;
    let updated = 0;
    const total = allProducts.length;
    
    allProducts.forEach((product, index) => {
      const imagesArray = [product.image];
      const imagesJson = JSON.stringify(imagesArray);
      
      if (existingNames.includes(product.name)) {
        // Actualizar producto existente
        db.run(
          'UPDATE products SET description=?, price=?, sizes=?, colors=?, stock=?, image=?, images=? WHERE name=?',
          [product.description, product.price, product.sizes, product.colors, product.stock, product.image, imagesJson, product.name],
          function(err) {
            if (err) {
              console.error(`❌ Error actualizando ${product.name}:`, err.message);
            } else {
              console.log(`🔄 ${index + 1}/${total} - Actualizado: ${product.name}`);
              updated++;
            }
            
            completed++;
            if (completed === total) {
              finishUpdate(added, updated);
            }
          }
        );
      } else {
        // Insertar nuevo producto
        db.run(
          'INSERT INTO products (name, description, price, image, images, sizes, colors, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [product.name, product.description, product.price, product.image, imagesJson, product.sizes, product.colors, product.stock],
          function(err) {
            if (err) {
              console.error(`❌ Error añadiendo ${product.name}:`, err.message);
            } else {
              console.log(`✅ ${index + 1}/${total} - Añadido: ${product.name} (ID: ${this.lastID})`);
              added++;
            }
            
            completed++;
            if (completed === total) {
              finishUpdate(added, updated);
            }
          }
        );
      }
    });
  });
}

async function finishUpdate(added, updated) {
  console.log('\n🔍 PASO 4: Verificando resultado final...');
  
  db.get('SELECT COUNT(*) as count FROM products', async (err, result) => {
    if (err) {
      console.error('❌ Error contando productos:', err.message);
    } else {
      console.log(`\n🎉 ¡ACTUALIZACIÓN FORZADA COMPLETADA!`);
      console.log(`📊 Resumen:`);
      console.log(`   • Productos añadidos: ${added}`);
      console.log(`   • Productos actualizados: ${updated}`);
      console.log(`   • Total en BD: ${result.count}`);
      console.log(`   • Stock total: ${allProducts.reduce((sum, p) => sum + p.stock, 0)} unidades`);
      
      // Limpiar caché del servidor
      await clearServerCache();
      
      console.log(`\n⚡ PASO 5: Forzando actualización inmediata...`);
      
      // Hacer múltiples requests para forzar actualización
      try {
        for (let i = 0; i < 3; i++) {
          await makeRequest(`http://localhost:3001/api/products?force_refresh=${Date.now()}`);
          console.log(`✅ Request ${i + 1}/3 - Caché invalidado`);
        }
        console.log(`\n🚀 ¡ACTUALIZACIÓN COMPLETA Y RÁPIDA FINALIZADA!`);
      } catch (error) {
        console.log(`⚠️  Servidor no está corriendo. Inicia con: npm start`);
      }
      
      console.log(`\n💡 Comandos de verificación:`);
      console.log(`   npm run check-products  # Ver productos en BD`);
      console.log(`   npm start              # Iniciar servidor`);
      console.log(`   npm test               # Ejecutar tests`);
      console.log(`   http://localhost:3001   # Ver tienda`);
    }
    
    db.close();
  });
}

// Ejecutar actualización forzada
forceUpdate();