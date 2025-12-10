#!/usr/bin/env node

/**
 * Script para recuperar los productos faltantes
 */

const db = require('./db-config');

console.log('🔄 Recuperando productos faltantes...\n');

// Productos que faltan (los que no están en los 5 actuales)
const missingProducts = [
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
  }
];

let completed = 0;
const total = missingProducts.length;

console.log(`🔍 Verificando productos existentes...`);

// Primero verificar qué productos ya existen
db.all('SELECT name FROM products', (err, existingProducts) => {
  if (err) {
    console.error('❌ Error verificando productos:', err.message);
    return;
  }

  const existingNames = existingProducts.map(p => p.name);
  console.log(`📦 Productos actuales: ${existingNames.length}`);
  existingNames.forEach(name => console.log(`   • ${name}`));

  console.log(`\n🔄 Añadiendo productos faltantes...`);

  missingProducts.forEach((product, index) => {
    // Solo añadir si no existe
    if (existingNames.includes(product.name)) {
      console.log(`⚠️  ${product.name} ya existe, saltando...`);
      completed++;
      if (completed === total) {
        finishProcess();
      }
      return;
    }

    // Crear array de imágenes para el nuevo formato
    const imagesArray = [product.image];
    const imagesJson = JSON.stringify(imagesArray);
    
    db.run(
      'INSERT INTO products (name, description, price, image, images, sizes, colors, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [product.name, product.description, product.price, product.image, imagesJson, product.sizes, product.colors, product.stock],
      function(err) {
        if (err) {
          console.error(`❌ Error añadiendo ${product.name}:`, err.message);
        } else {
          console.log(`✅ ${index + 1}/${total} - Añadido: ${product.name} (ID: ${this.lastID})`);
        }
        
        completed++;
        if (completed === total) {
          finishProcess();
        }
      }
    );
  });
});

function finishProcess() {
  // Verificar total final
  db.get('SELECT COUNT(*) as count FROM products', (err, result) => {
    if (err) {
      console.error('❌ Error contando productos:', err.message);
    } else {
      console.log(`\n🎉 ¡Proceso completado!`);
      console.log(`📊 Total de productos en base de datos: ${result.count}`);
      console.log(`\n💡 Comandos útiles:`);
      console.log(`   npm run check-products  # Ver todos los productos`);
      console.log(`   npm start              # Iniciar servidor`);
      console.log(`   http://localhost:3001   # Ver la tienda`);
    }
    
    db.close();
  });
}