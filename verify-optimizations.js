#!/usr/bin/env node

/**
 * Script para verificar que todas las optimizaciones de rendimiento estén activas
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://shopmanstorej.onrender.com' 
  : `http://localhost:${PORT}`;

console.log('🔍 Verificando optimizaciones de rendimiento...\n');

// Función para hacer requests HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ 
        statusCode: res.statusCode, 
        headers: res.headers, 
        data 
      }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => reject(new Error('Timeout')));
    req.end();
  });
}

// Tests de verificación
const tests = [
  {
    name: 'Health Check Endpoint',
    test: async () => {
      const response = await makeRequest(`${BASE_URL}/health`);
      return {
        passed: response.statusCode === 200,
        details: `Status: ${response.statusCode}, Response time: ${Date.now()}`
      };
    }
  },
  
  {
    name: 'Ping Endpoint',
    test: async () => {
      const response = await makeRequest(`${BASE_URL}/ping`);
      return {
        passed: response.statusCode === 200 && response.data === 'pong',
        details: `Status: ${response.statusCode}, Response: ${response.data}`
      };
    }
  },
  
  {
    name: 'Compression Headers',
    test: async () => {
      const response = await makeRequest(`${BASE_URL}/api/products`, {
        headers: { 'Accept-Encoding': 'gzip, deflate, br' }
      });
      const hasCompression = response.headers['content-encoding'];
      return {
        passed: !!hasCompression,
        details: `Content-Encoding: ${hasCompression || 'none'}`
      };
    }
  },
  
  {
    name: 'Static File Caching',
    test: async () => {
      const response = await makeRequest(`${BASE_URL}/app.js`);
      const cacheControl = response.headers['cache-control'];
      const etag = response.headers['etag'];
      return {
        passed: !!cacheControl && !!etag,
        details: `Cache-Control: ${cacheControl || 'none'}, ETag: ${etag || 'none'}`
      };
    }
  },
  
  {
    name: 'Products API Pagination',
    test: async () => {
      const response = await makeRequest(`${BASE_URL}/api/products?page=1&limit=5`);
      if (response.statusCode !== 200) {
        return { passed: false, details: `Status: ${response.statusCode}` };
      }
      
      const data = JSON.parse(response.data);
      const hasPagination = data.pagination && data.products;
      return {
        passed: hasPagination,
        details: hasPagination 
          ? `Products: ${data.products.length}, Total: ${data.pagination.total}`
          : 'No pagination structure found'
      };
    }
  },
  
  {
    name: 'HTML Optimization',
    test: async () => {
      const response = await makeRequest(`${BASE_URL}/`);
      const html = response.data;
      const hasPreconnect = html.includes('rel="preconnect"');
      const hasDefer = html.includes('defer');
      const hasLazyLoading = html.includes('loading="lazy"');
      
      return {
        passed: hasPreconnect && hasDefer,
        details: `Preconnect: ${hasPreconnect}, Defer: ${hasDefer}, Lazy: ${hasLazyLoading}`
      };
    }
  }
];

// Ejecutar tests
async function runTests() {
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      console.log(`⏳ ${test.name}...`);
      const result = await test.test();
      
      if (result.passed) {
        console.log(`✅ ${test.name}: PASSED`);
        console.log(`   ${result.details}\n`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        console.log(`   ${result.details}\n`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR`);
      console.log(`   ${error.message}\n`);
    }
  }
  
  console.log(`\n📊 Resultados: ${passed}/${total} tests pasaron`);
  
  if (passed === total) {
    console.log('🎉 ¡Todas las optimizaciones están funcionando correctamente!');
  } else {
    console.log('⚠️  Algunas optimizaciones necesitan atención.');
  }
  
  // Verificar archivos locales
  console.log('\n📁 Verificando archivos locales...');
  
  const files = [
    'render.yaml',
    'package.json',
    'server.js',
    'public/index.html',
    'public/app.js'
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} existe`);
    } else {
      console.log(`❌ ${file} no encontrado`);
    }
  });
  
  return passed === total;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Error ejecutando tests:', error);
    process.exit(1);
  });
}

module.exports = { runTests, makeRequest };