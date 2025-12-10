#!/usr/bin/env node

/**
 * Script para verificar y mostrar todos los productos en la base de datos
 */

const db = require('./db-config');

console.log('🔍 Verificando productos en la base de datos...\n');

// Consultar todos los productos
db.all('SELECT * FROM products ORDER BY id DESC', (err, rows) => {
  if (err) {
    console.error('❌ Error al consultar productos:', err.message);
    return;
  }

  if (!rows || rows.length === 0) {
    console.log('⚠️  No hay productos en la base de datos');
    console.log('\n💡 Para añadir productos de prueba, usa el panel de administración:');
    console.log('   1. Inicia sesión como admin (admin/admin123)');
    console.log('   2. Ve al panel de administración');
    console.log('   3. Añade algunos productos');
    return;
  }

  console.log(`✅ Encontrados ${rows.length} productos:\n`);

  rows.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Precio: $${product.price}`);
    console.log(`   Descripción: ${product.description}`);
    
    if (product.sizes) {
      console.log(`   Talles: ${product.sizes}`);
    }
    
    if (product.colors) {
      console.log(`   Colores: ${product.colors}`);
    }
    
    console.log(`   Stock: ${product.stock || 0}`);
    
    // Verificar imágenes
    if (product.images) {
      try {
        const images = JSON.parse(product.images);
        console.log(`   Imágenes: ${images.length} imagen(es)`);
      } catch (e) {
        console.log(`   Imágenes: Error al parsear JSON`);
      }
    } else if (product.image) {
      console.log(`   Imagen: 1 imagen (legacy)`);
    } else {
      console.log(`   Imágenes: Sin imágenes`);
    }
    
    console.log(`   Creado: ${product.created_at || 'N/A'}\n`);
  });

  console.log(`📊 Total de productos: ${rows.length}`);
  
  // Verificar si hay productos sin stock
  const outOfStock = rows.filter(p => !p.stock || p.stock === 0);
  if (outOfStock.length > 0) {
    console.log(`⚠️  Productos sin stock: ${outOfStock.length}`);
  }

  // Verificar productos sin imágenes
  const noImages = rows.filter(p => !p.image && !p.images);
  if (noImages.length > 0) {
    console.log(`⚠️  Productos sin imágenes: ${noImages.length}`);
  }

  db.close();
});

// Función para añadir productos de ejemplo si no hay ninguno
function addSampleProducts() {
  console.log('🔧 Añadiendo productos de ejemplo...\n');
  
  const sampleProducts = [
    {
      name: 'Remera Básica',
      description: 'Remera de algodón 100% en colores variados',
      price: 2500,
      sizes: 'S, M, L, XL',
      colors: 'Blanco, Negro, Gris',
      stock: 50
    },
    {
      name: 'Jean Clásico',
      description: 'Jean de corte clásico, cómodo y resistente',
      price: 4500,
      sizes: '28, 30, 32, 34, 36, 38',
      colors: 'Azul, Negro',
      stock: 30
    },
    {
      name: 'Zapatillas Deportivas',
      description: 'Zapatillas cómodas para uso diario',
      price: 8500,
      sizes: '37, 38, 39, 40, 41, 42, 43',
      colors: 'Blanco, Negro, Azul',
      stock: 25
    }
  ];

  let completed = 0;
  sampleProducts.forEach((product, index) => {
    db.run(
      'INSERT INTO products (name, description, price, sizes, colors, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [product.name, product.description, product.price, product.sizes, product.colors, product.stock],
      function(err) {
        if (err) {
          console.error(`❌ Error añadiendo ${product.name}:`, err.message);
        } else {
          console.log(`✅ Añadido: ${product.name} (ID: ${this.lastID})`);
        }
        
        completed++;
        if (completed === sampleProducts.length) {
          console.log('\n🎉 Productos de ejemplo añadidos exitosamente!');
          db.close();
        }
      }
    );
  });
}

// Exportar función para uso externo
module.exports = { addSampleProducts };