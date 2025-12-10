#!/usr/bin/env node

/**
 * Script para verificar el estado de productos en Render
 */

const https = require('https');
const http = require('http');

console.log('🔍 VERIFICANDO ESTADO EN RENDER...\n');

// URL de tu aplicación en Render (actualizar con tu URL real)
const RENDER_URL = process.env.RENDER_URL || 'https://shopmanstore.onrender.com';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ 
        statusCode: res.statusCode, 
        headers: res.headers,
        data 
      }));
    });
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Timeout')));
    req.end();
  });
}

async function verifyRender() {
  console.log(`🌐 Verificando: ${RENDER_URL}`);
  
  try {
    // 1. Verificar health check
    console.log('\n🔍 1. Verificando health check...');
    const healthResponse = await makeRequest(`${RENDER_URL}/health`);
    
    if (healthResponse.statusCode === 200) {
      console.log('✅ Health check: OK');
      const healthData = JSON.parse(healthResponse.data);
      console.log(`   Status: ${healthData.status}`);
      console.log(`   Uptime: ${healthData.uptime}s`);
      console.log(`   Environment: ${healthData.environment}`);
    } else {
      console.log(`❌ Health check failed: ${healthResponse.statusCode}`);
      return;
    }
    
    // 2. Verificar API de productos
    console.log('\n🔍 2. Verificando API de productos...');
    const productsResponse = await makeRequest(`${RENDER_URL}/api/products`);
    
    if (productsResponse.statusCode === 200) {
      const productsData = JSON.parse(productsResponse.data);
      const products = productsData.products || productsData;
      
      console.log('✅ API de productos: OK');
      console.log(`   Total productos: ${products.length}`);
      console.log(`   Compresión: ${productsResponse.headers['content-encoding'] || 'none'}`);
      
      // Mostrar algunos productos
      if (products.length > 0) {
        console.log('\n📦 Productos disponibles:');
        products.slice(0, 5).forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.name} - $${product.price}`);
          if (product.colors) console.log(`      Colores: ${product.colors}`);
          if (product.sizes) console.log(`      Talles: ${product.sizes}`);
        });
        
        if (products.length > 5) {
          console.log(`   ... y ${products.length - 5} productos más`);
        }
      }
    } else {
      console.log(`❌ API de productos failed: ${productsResponse.statusCode}`);
    }
    
    // 3. Verificar página principal
    console.log('\n🔍 3. Verificando página principal...');
    const homeResponse = await makeRequest(RENDER_URL);
    
    if (homeResponse.statusCode === 200) {
      const hasShopManStore = homeResponse.data.includes('ShopManStore');
      const hasProducts = homeResponse.data.includes('productos') || homeResponse.data.includes('product');
      
      console.log('✅ Página principal: OK');
      console.log(`   Contiene ShopManStore: ${hasShopManStore ? 'Sí' : 'No'}`);
      console.log(`   Contiene productos: ${hasProducts ? 'Sí' : 'No'}`);
      console.log(`   Cache-Control: ${homeResponse.headers['cache-control'] || 'none'}`);
    } else {
      console.log(`❌ Página principal failed: ${homeResponse.statusCode}`);
    }
    
    // 4. Verificar optimizaciones
    console.log('\n🔍 4. Verificando optimizaciones...');
    const jsResponse = await makeRequest(`${RENDER_URL}/app.js`);
    
    if (jsResponse.statusCode === 200) {
      console.log('✅ Archivos estáticos: OK');
      console.log(`   Cache-Control: ${jsResponse.headers['cache-control'] || 'none'}`);
      console.log(`   ETag: ${jsResponse.headers['etag'] ? 'present' : 'none'}`);
      console.log(`   Compresión: ${jsResponse.headers['content-encoding'] || 'none'}`);
    }
    
    console.log('\n🎉 VERIFICACIÓN COMPLETADA');
    console.log(`\n🚀 Tu ShopManStore está funcionando en: ${RENDER_URL}`);
    console.log('💡 Credenciales de admin: admin / admin123');
    
  } catch (error) {
    console.error('\n❌ Error verificando Render:', error.message);
    console.log('\n💡 Posibles causas:');
    console.log('   • La aplicación aún se está desplegando');
    console.log('   • URL incorrecta en RENDER_URL');
    console.log('   • Problemas de red o timeout');
    console.log('\n🔄 Intenta nuevamente en unos minutos');
  }
}

// Ejecutar verificación
verifyRender();