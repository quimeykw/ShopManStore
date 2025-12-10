#!/usr/bin/env node

/**
 * Script de configuración automática para Render
 * Se ejecuta después del deploy para asegurar que todos los productos estén disponibles
 */

const db = require('./db-config');
const isPostgres = !!process.env.DATABASE_URL;

console.log('🚀 RENDER SETUP - Configuración automática de productos...\n');
console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log(`💾 Base de datos: ${isPostgres ? 'PostgreSQL' : 'SQLite'}`);

// Productos completos para Render
const renderProducts = [
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

// Función para setup en Render
function setupRenderProducts() {
  console.log('🔍 Verificando productos existentes en Render...');
  
  // Verificar si ya hay productos
  const checkQuery = isPostgres 
    ? 'SELECT COUNT(*) as count FROM products'
    : 'SELECT COUNT(*) as count FROM products';
    
  db.get(checkQuery, (err, result) => {
    if (err) {
      console.error('❌ Error verificando productos:', err.message);
      return;
    }
    
    const existingCount = result.count;
    console.log(`📦 Productos existentes: ${existingCount}`);
    
    if (existingCount >= renderProducts.length) {
      console.log('✅ Productos ya están configurados en Render');
      console.log(`🎉 Total productos disponibles: ${existingCount}`);
      db.close();
      return;
    }
    
    console.log('🚀 Configurando productos para Render...');
    addProductsToRender();
  });
}

function addProductsToRender() {
  let completed = 0;
  let added = 0;
  let skipped = 0;
  const total = renderProducts.length;
  
  renderProducts.forEach((product, index) => {
    // Verificar si el producto ya existe
    db.get('SELECT id FROM products WHERE name = ?', [product.name], (err, existing) => {
      if (err) {
        console.error(`❌ Error verificando ${product.name}:`, err.message);
        completed++;
        if (completed === total) finishRenderSetup(added, skipped);
        return;
      }
      
      if (existing) {
        console.log(`⚠️  ${index + 1}/${total} - ${product.name} ya existe, saltando...`);
        skipped++;
        completed++;
        if (completed === total) finishRenderSetup(added, skipped);
        return;
      }
      
      // Añadir producto nuevo
      const imagesArray = [product.image];
      const imagesJson = JSON.stringify(imagesArray);
      
      const insertQuery = isPostgres
        ? 'INSERT INTO products (name, description, price, image, images, sizes, colors, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id'
        : 'INSERT INTO products (name, description, price, image, images, sizes, colors, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      
      const params = [
        product.name,
        product.description,
        product.price,
        product.image,
        imagesJson,
        product.sizes,
        product.colors,
        product.stock
      ];
      
      db.run(insertQuery, params, function(err) {
        if (err) {
          console.error(`❌ Error añadiendo ${product.name}:`, err.message);
        } else {
          const productId = isPostgres ? this.id : this.lastID;
          console.log(`✅ ${index + 1}/${total} - Añadido: ${product.name} (ID: ${productId})`);
          added++;
        }
        
        completed++;
        if (completed === total) {
          finishRenderSetup(added, skipped);
        }
      });
    });
  });
}

function finishRenderSetup(added, skipped) {
  console.log('\n🎉 ¡RENDER SETUP COMPLETADO!');
  console.log(`📊 Resumen:`);
  console.log(`   • Productos añadidos: ${added}`);
  console.log(`   • Productos existentes: ${skipped}`);
  console.log(`   • Total disponible: ${added + skipped}`);
  console.log(`   • Stock total: ${renderProducts.reduce((sum, p) => sum + p.stock, 0)} unidades`);
  
  // Verificar total final
  db.get('SELECT COUNT(*) as count FROM products', (err, result) => {
    if (err) {
      console.error('❌ Error contando productos finales:', err.message);
    } else {
      console.log(`\n🚀 RENDER LISTO:`);
      console.log(`   • Total productos en BD: ${result.count}`);
      console.log(`   • Base de datos: ${isPostgres ? 'PostgreSQL' : 'SQLite'}`);
      console.log(`   • Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n✅ ShopManStore configurado exitosamente en Render!`);
    }
    
    db.close();
  });
}

// Ejecutar setup si es llamado directamente
if (require.main === module) {
  setupRenderProducts();
}

module.exports = { setupRenderProducts };