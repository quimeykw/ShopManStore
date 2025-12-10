#!/usr/bin/env node

/**
 * Test completo del sistema ShopManStore
 * Verifica base de datos, API, optimizaciones y funcionalidad
 */

const http = require('http');
const https = require('https');
const db = require('./db-config');

console.log('🧪 Iniciando tests completos del sistema ShopManStore...\n');

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}`;

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

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
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Tests de base de datos
const databaseTests = [
  {
    name: 'Verificar estructura de tablas',
    test: () => {
      return new Promise((resolve) => {
        db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
          const tableNames = tables ? tables.map(t => t.name) : [];
          const requiredTables = ['users', 'products', 'orders', 'logs'];
          const hasAllTables = requiredTables.every(table => tableNames.includes(table));
          
          resolve({
            passed: hasAllTables,
            details: `Tablas encontradas: ${tableNames.join(', ')}`
          });
        });
      });
    }
  },
  
  {
    name: 'Verificar columnas de productos',
    test: () => {
      return new Promise((resolve) => {
        db.all("PRAGMA table_info(products)", (err, columns) => {
          const columnNames = columns ? columns.map(c => c.name) : [];
          const requiredColumns = ['id', 'name', 'price', 'images', 'sizes', 'colors', 'stock'];
          const hasAllColumns = requiredColumns.every(col => columnNames.includes(col));
          
          resolve({
            passed: hasAllColumns,
            details: `Columnas: ${columnNames.join(', ')}`
          });
        });
      });
    }
  },
  
  {
    name: 'Verificar productos en base de datos',
    test: () => {
      return new Promise((resolve) => {
        db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
          const count = row ? row.count : 0;
          resolve({
            passed: count > 0,
            details: `${count} productos encontrados`
          });
        });
      });
    }
  },
  
  {
    name: 'Verificar usuario admin',
    test: () => {
      return new Promise((resolve) => {
        db.get("SELECT * FROM users WHERE username = 'admin'", (err, user) => {
          resolve({
            passed: !!user,
            details: user ? `Admin existe con rol: ${user.role}` : 'Admin no encontrado'
          });
        });
      });
    }
  }
];

// Tests de API
const apiTests = [
  {
    name: 'Health Check Endpoint',
    test: async () => {
      try {
        const response = await makeRequest(`${BASE_URL}/health`);
        return {
          passed: response.statusCode === 200,
          details: `Status: ${response.statusCode}`
        };
      } catch (error) {
        return {
          passed: false,
          details: `Error: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Ping Endpoint',
    test: async () => {
      try {
        const response = await makeRequest(`${BASE_URL}/ping`);
        return {
          passed: response.statusCode === 200 && response.data === 'pong',
          details: `Status: ${response.statusCode}, Response: ${response.data}`
        };
      } catch (error) {
        return {
          passed: false,
          details: `Error: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'API de Productos',
    test: async () => {
      try {
        const response = await makeRequest(`${BASE_URL}/api/products`);
        if (response.statusCode !== 200) {
          return {
            passed: false,
            details: `Status: ${response.statusCode}`
          };
        }
        
        const data = JSON.parse(response.data);
        const products = data.products || data;
        
        return {
          passed: Array.isArray(products) && products.length > 0,
          details: `${products.length} productos en API`
        };
      } catch (error) {
        return {
          passed: false,
          details: `Error: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Compresión HTTP',
    test: async () => {
      try {
        const response = await makeRequest(`${BASE_URL}/api/products`, {
          headers: { 'Accept-Encoding': 'gzip, deflate, br' }
        });
        const hasCompression = response.headers['content-encoding'];
        return {
          passed: !!hasCompression,
          details: `Content-Encoding: ${hasCompression || 'none'}`
        };
      } catch (error) {
        return {
          passed: false,
          details: `Error: ${error.message}`
        };
      }
    }
  }
];

// Tests de archivos estáticos
const staticTests = [
  {
    name: 'Página principal (index.html)',
    test: async () => {
      try {
        const response = await makeRequest(`${BASE_URL}/`);
        const hasHtml = response.data.includes('<html') && response.data.includes('ShopManStore');
        return {
          passed: response.statusCode === 200 && hasHtml,
          details: `Status: ${response.statusCode}, HTML válido: ${hasHtml}`
        };
      } catch (error) {
        return {
          passed: false,
          details: `Error: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'JavaScript principal (app.js)',
    test: async () => {
      try {
        const response = await makeRequest(`${BASE_URL}/app.js`);
        const hasJs = response.data.includes('ShopManStore') || response.data.includes('loadProducts');
        return {
          passed: response.statusCode === 200 && hasJs,
          details: `Status: ${response.statusCode}, JS válido: ${hasJs}`
        };
      } catch (error) {
        return {
          passed: false,
          details: `Error: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Headers de caché en archivos estáticos',
    test: async () => {
      try {
        const response = await makeRequest(`${BASE_URL}/app.js`);
        const cacheControl = response.headers['cache-control'];
        const etag = response.headers['etag'];
        return {
          passed: !!cacheControl && !!etag,
          details: `Cache-Control: ${cacheControl || 'none'}, ETag: ${etag ? 'present' : 'none'}`
        };
      } catch (error) {
        return {
          passed: false,
          details: `Error: ${error.message}`
        };
      }
    }
  }
];

// Tests de optimización
const optimizationTests = [
  {
    name: 'Core Web Vitals script',
    test: async () => {
      try {
        const response = await makeRequest(`${BASE_URL}/core-web-vitals.js`);
        const hasWebVitals = response.data.includes('getCLS') || response.data.includes('getLCP');
        return {
          passed: response.statusCode === 200 && hasWebVitals,
          details: `Status: ${response.statusCode}, Web Vitals: ${hasWebVitals}`
        };
      } catch (error) {
        return {
          passed: false,
          details: `Error: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'HTML optimizado',
    test: async () => {
      try {
        const response = await makeRequest(`${BASE_URL}/`);
        const html = response.data;
        const hasPreconnect = html.includes('rel="preconnect"');
        const hasDefer = html.includes('defer');
        const hasLazyLoading = html.includes('loading="lazy"') || html.includes('fetchpriority="high"');
        
        return {
          passed: hasPreconnect && hasDefer,
          details: `Preconnect: ${hasPreconnect}, Defer: ${hasDefer}, Lazy/Priority: ${hasLazyLoading}`
        };
      } catch (error) {
        return {
          passed: false,
          details: `Error: ${error.message}`
        };
      }
    }
  }
];

// Función para ejecutar tests
async function runTestSuite(suiteName, tests, color = colors.blue) {
  console.log(`${color}${colors.bold}=== ${suiteName} ===${colors.reset}\n`);
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      console.log(`⏳ ${test.name}...`);
      const result = await test.test();
      
      if (result.passed) {
        console.log(`${colors.green}✅ ${test.name}: PASSED${colors.reset}`);
        console.log(`   ${result.details}\n`);
        passed++;
      } else {
        console.log(`${colors.red}❌ ${test.name}: FAILED${colors.reset}`);
        console.log(`   ${result.details}\n`);
      }
    } catch (error) {
      console.log(`${colors.red}❌ ${test.name}: ERROR${colors.reset}`);
      console.log(`   ${error.message}\n`);
    }
  }
  
  const percentage = Math.round((passed / total) * 100);
  const statusColor = percentage === 100 ? colors.green : percentage >= 80 ? colors.yellow : colors.red;
  
  console.log(`${statusColor}📊 ${suiteName}: ${passed}/${total} tests pasaron (${percentage}%)${colors.reset}\n`);
  
  return { passed, total, percentage };
}

// Función principal
async function runAllTests() {
  console.log(`${colors.bold}🚀 ShopManStore - Test Completo del Sistema${colors.reset}\n`);
  
  const results = [];
  
  // Tests de base de datos
  results.push(await runTestSuite('Tests de Base de Datos', databaseTests, colors.blue));
  
  // Tests de API (solo si el servidor está corriendo)
  console.log('🔍 Verificando si el servidor está corriendo...');
  try {
    await makeRequest(`${BASE_URL}/health`);
    console.log(`${colors.green}✅ Servidor detectado en ${BASE_URL}${colors.reset}\n`);
    
    results.push(await runTestSuite('Tests de API', apiTests, colors.green));
    results.push(await runTestSuite('Tests de Archivos Estáticos', staticTests, colors.yellow));
    results.push(await runTestSuite('Tests de Optimización', optimizationTests, colors.blue));
  } catch (error) {
    console.log(`${colors.yellow}⚠️  Servidor no está corriendo. Saltando tests de API.${colors.reset}`);
    console.log(`   Para tests completos, ejecuta: npm start${colors.reset}\n`);
  }
  
  // Resumen final
  console.log(`${colors.bold}=== RESUMEN FINAL ===${colors.reset}\n`);
  
  let totalPassed = 0;
  let totalTests = 0;
  
  results.forEach((result, index) => {
    const suiteNames = ['Base de Datos', 'API', 'Archivos Estáticos', 'Optimización'];
    const suiteName = suiteNames[index] || `Suite ${index + 1}`;
    const statusColor = result.percentage === 100 ? colors.green : result.percentage >= 80 ? colors.yellow : colors.red;
    
    console.log(`${statusColor}${suiteName}: ${result.passed}/${result.total} (${result.percentage}%)${colors.reset}`);
    totalPassed += result.passed;
    totalTests += result.total;
  });
  
  const overallPercentage = Math.round((totalPassed / totalTests) * 100);
  const overallColor = overallPercentage === 100 ? colors.green : overallPercentage >= 80 ? colors.yellow : colors.red;
  
  console.log(`\n${colors.bold}${overallColor}TOTAL: ${totalPassed}/${totalTests} tests pasaron (${overallPercentage}%)${colors.reset}\n`);
  
  if (overallPercentage === 100) {
    console.log(`${colors.green}🎉 ¡Todos los tests pasaron! Tu ShopManStore está funcionando perfectamente.${colors.reset}`);
  } else if (overallPercentage >= 80) {
    console.log(`${colors.yellow}⚠️  La mayoría de tests pasaron. Revisa los fallos para optimización completa.${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Varios tests fallaron. Revisa la configuración y vuelve a intentar.${colors.reset}`);
  }
  
  console.log(`\n${colors.blue}💡 Comandos útiles:${colors.reset}`);
  console.log(`   npm start              # Iniciar servidor`);
  console.log(`   npm run setup          # Añadir productos`);
  console.log(`   npm run check-products # Verificar productos`);
  console.log(`   npm run verify         # Verificar optimizaciones`);
  
  db.close();
  return overallPercentage === 100;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error(`${colors.red}Error ejecutando tests:${colors.reset}`, error);
    process.exit(1);
  });
}

module.exports = { runAllTests };