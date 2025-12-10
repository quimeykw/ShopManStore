#!/usr/bin/env node

/**
 * Script simple para añadir productos sin tocar la base de datos existente
 */

const db = require('./db-config');

console.log('🛍️ Añadiendo productos de ejemplo...\n');

// Primero verificar si ya hay productos
db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
  if (err) {
    console.error('❌ Error verificando productos:', err.message);
    return;
  }

  if (row.count > 0) {
    console.log(`ℹ️  Ya hay ${row.count} productos en la base de datos`);
    console.log('¿Quieres añadir más productos de ejemplo? (Ctrl+C para cancelar)');
  }

  // Continuar añadiendo productos
  setTimeout(addProducts, 1000);
});

function addProducts() {
  const sampleProducts = [
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
    }
  ];

  let completed = 0;
  const total = sampleProducts.length;

  sampleProducts.forEach((product, index) => {
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
          console.log(`✅ ${index + 1}/${total} - ${product.name} (ID: ${this.lastID})`);
        }
        
        completed++;
        if (completed === total) {
          console.log(`\n🎉 ¡${total} productos añadidos exitosamente!`);
          console.log('\n🚀 Ahora puedes:');
          console.log('   1. Iniciar el servidor: npm start');
          console.log('   2. Visitar: http://localhost:3001');
          console.log('   3. Ver todos los productos en la página principal');
          
          db.close();
        }
      }
    );
  });
}