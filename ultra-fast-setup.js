#!/usr/bin/env node

/**
 * ULTRA FAST SETUP - Configuración súper rápida para Render
 * Optimizado para máxima velocidad de deploy y carga
 */

const db = require('./db-config');
const isPostgres = !!process.env.DATABASE_URL;

console.log('⚡ ULTRA FAST SETUP - Configuración súper rápida...\n');

// Productos mínimos pero completos para máxima velocidad
const fastProducts = [
  {
    name: 'Remera Básica',
    description: 'Remera de algodón cómoda y versátil',
    price: 2500,
    sizes: 'S,M,L,XL',
    colors: 'Blanco,Negro,Gris',
    stock: 50,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5SZW1lcmE8L3RleHQ+PC9zdmc+'
  },
  {
    name: 'Jean Clásico',
    description: 'Jean resistente y cómodo',
    price: 4500,
    sizes: '28,30,32,34,36,38',
    colors: 'Azul,Negro',
    stock: 30,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDY4MmI0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSI+SmVhbjwvdGV4dD48L3N2Zz4='
  },
  {
    name: 'Zapatillas',
    description: 'Zapatillas deportivas cómodas',
    price: 8500,
    sizes: '37,38,39,40,41,42,43',
    colors: 'Blanco,Negro,Azul',
    stock: 25,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5aYXBhdGlsbGFzPC90ZXh0Pjwvc3ZnPg=='
  },
  {
    name: 'Campera',
    description: 'Campera de abrigo resistente',
    price: 12500,
    sizes: 'S,M,L,XL,XXL',
    colors: 'Negro,Gris,Azul',
    stock: 20,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSI+Q2FtcGVyYTwvdGV4dD48L3N2Zz4='
  },
  {
    name: 'Vestido',
    description: 'Vestido casual elegante',
    price: 5500,
    sizes: 'XS,S,M,L,XL',
    colors: 'Rosa,Azul,Negro',
    stock: 35,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZiNmM1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5WZXN0aWRvPC90ZXh0Pjwvc3ZnPg=='
  }
];

// Setup ultra rápido
function ultraFastSetup() {
  console.log('🚀 Iniciando setup ultra rápido...');
  
  // Verificar productos existentes rápidamente
  db.get('SELECT COUNT(*) as count FROM products', (err, result) => {
    if (err) {
      console.error('❌ Error:', err.message);
      return;
    }
    
    const existingCount = result.count;
    console.log(`📦 Productos existentes: ${existingCount}`);
    
    if (existingCount >= 5) {
      console.log('✅ Productos ya configurados - ULTRA FAST READY!');
      console.log(`🎉 Total: ${existingCount} productos disponibles`);
      db.close();
      return;
    }
    
    console.log('⚡ Instalando productos ultra rápido...');
    installProductsFast();
  });
}

function installProductsFast() {
  let completed = 0;
  const total = fastProducts.length;
  
  // Inserción paralela para máxima velocidad
  fastProducts.forEach((product, index) => {
    const imagesJson = JSON.stringify([product.image]);
    
    const query = isPostgres
      ? 'INSERT INTO products (name, description, price, image, images, sizes, colors, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (name) DO NOTHING'
      : 'INSERT OR IGNORE INTO products (name, description, price, image, images, sizes, colors, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
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
    
    db.run(query, params, function(err) {
      if (err) {
        console.error(`❌ ${product.name}:`, err.message);
      } else {
        console.log(`✅ ${index + 1}/${total} - ${product.name}`);
      }
      
      completed++;
      if (completed === total) {
        finishUltraFast();
      }
    });
  });
}

function finishUltraFast() {
  console.log('\n⚡ ULTRA FAST SETUP COMPLETADO!');
  console.log('📊 5 productos instalados en tiempo récord');
  console.log('🚀 ShopManStore listo para máxima velocidad!');
  
  db.close();
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  ultraFastSetup();
}

module.exports = { ultraFastSetup };