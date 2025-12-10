#!/usr/bin/env node

/**
 * Script para añadir productos sin la columna colors (temporal)
 */

const db = require('./db-config');

console.log('🛍️ Añadiendo productos (sin colores por ahora)...\n');

const sampleProducts = [
  {
    name: 'Remera Básica Algodón',
    description: 'Remera de algodón 100% suave y cómoda. Perfecta para uso diario. Disponible en varios colores.',
    price: 2500,
    sizes: 'S, M, L, XL',
    stock: 50,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5SZW1lcmE8L3RleHQ+PC9zdmc+'
  },
  {
    name: 'Jean Clásico Azul',
    description: 'Jean de corte clásico en denim de alta calidad. Cómodo y resistente. Varios tonos de azul disponibles.',
    price: 4500,
    sizes: '28, 30, 32, 34, 36, 38, 40',
    stock: 30,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDY4MmI0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSI+SmVhbjwvdGV4dD48L3N2Zz4='
  },
  {
    name: 'Zapatillas Deportivas',
    description: 'Zapatillas cómodas para uso diario y deportivo. Suela antideslizante. Múltiples colores disponibles.',
    price: 8500,
    sizes: '37, 38, 39, 40, 41, 42, 43, 44',
    stock: 25,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5aYXBhdGlsbGFzPC90ZXh0Pjwvc3ZnPg=='
  },
  {
    name: 'Campera de Abrigo',
    description: 'Campera térmica perfecta para el invierno. Resistente al viento. Varios colores disponibles.',
    price: 12500,
    sizes: 'S, M, L, XL, XXL',
    stock: 20,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSI+Q2FtcGVyYTwvdGV4dD48L3N2Zz4='
  },
  {
    name: 'Vestido Casual',
    description: 'Vestido cómodo y elegante para cualquier ocasión. Tela suave. Múltiples colores y estampados.',
    price: 5500,
    sizes: 'XS, S, M, L, XL',
    stock: 35,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZiNmM1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5WZXN0aWRvPC90ZXh0Pjwvc3ZnPg=='
  },
  {
    name: 'Buzo con Capucha',
    description: 'Buzo cómodo con capucha. Ideal para días frescos. Varios colores disponibles.',
    price: 6500,
    sizes: 'S, M, L, XL, XXL',
    stock: 40,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSI+QnV6bzwvdGV4dD48L3N2Zz4='
  },
  {
    name: 'Pantalón Deportivo',
    description: 'Pantalón cómodo para hacer ejercicio o uso casual. Múltiples colores disponibles.',
    price: 3500,
    sizes: 'S, M, L, XL, XXL',
    stock: 45,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjIyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSI+UGFudGFsw7NuPC90ZXh0Pjwvc3ZnPg=='
  },
  {
    name: 'Camisa Formal',
    description: 'Camisa elegante para ocasiones formales. Corte clásico. Varios colores disponibles.',
    price: 4200,
    sizes: 'S, M, L, XL, XXL',
    stock: 28,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOGZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DYW1pc2E8L3RleHQ+PC9zdmc+'
  }
];

let completed = 0;
const total = sampleProducts.length;

sampleProducts.forEach((product, index) => {
  // Crear array de imágenes para el nuevo formato
  const imagesArray = [product.image];
  const imagesJson = JSON.stringify(imagesArray);
  
  db.run(
    'INSERT INTO products (name, description, price, image, images, sizes, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [product.name, product.description, product.price, product.image, imagesJson, product.sizes, product.stock],
    function(err) {
      if (err) {
        console.error(`❌ Error añadiendo ${product.name}:`, err.message);
      } else {
        console.log(`✅ ${index + 1}/${total} - ${product.name} (ID: ${this.lastID})`);
      }
      
      completed++;
      if (completed === total) {
        console.log(`\n🎉 ¡${total} productos añadidos exitosamente!`);
        console.log('\n📊 Resumen:');
        console.log(`   • Total productos: ${total}`);
        console.log(`   • Stock total: ${sampleProducts.reduce((sum, p) => sum + p.stock, 0)} unidades`);
        console.log(`   • Rango de precios: $${Math.min(...sampleProducts.map(p => p.price))} - $${Math.max(...sampleProducts.map(p => p.price))}`);
        console.log('\n🚀 Tu tienda ya tiene productos para mostrar!');
        console.log('   Inicia el servidor: npm start');
        console.log('   Visita: http://localhost:3001');
        
        db.close();
      }
    }
  );
});