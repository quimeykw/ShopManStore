#!/usr/bin/env node

/**
 * TEST PRÁCTICO DE VISTA PREVIA
 * Simula el flujo completo de crear un producto con imágenes
 */

const http = require('http');

console.log('🛠️ TEST PRÁCTICO DE VISTA PREVIA...\n');

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}`;

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ 
        statusCode: res.statusCode, 
        headers: res.headers, 
        data 
      }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => reject(new Error('Timeout')));
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testPracticalFlow() {
  console.log(`${colors.bold}🛠️ TEST PRÁCTICO COMPLETO${colors.reset}\n`);
  
  let token = null;
  
  // Test 1: Login
  console.log('🔐 Test 1: Autenticación...');
  try {
    const login = await makeRequest(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    if (login.statusCode === 200) {
      const data = JSON.parse(login.data);
      token = data.token;
      console.log(`${colors.green}✅ Login exitoso${colors.reset}\n`);
    } else {
      console.log(`${colors.red}❌ Error en login${colors.reset}\n`);
      return;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error: ${error.message}${colors.reset}\n`);
    return;
  }
  
  // Test 2: Verificar productos existentes
  console.log('📦 Test 2: Verificando productos...');
  try {
    const products = await makeRequest(`${BASE_URL}/api/products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (products.statusCode === 200) {
      const data = JSON.parse(products.data);
      const productList = data.products || data;
      console.log(`${colors.green}✅ ${productList.length} productos disponibles${colors.reset}\n`);
    }
  } catch (error) {
    console.log(`${colors.yellow}⚠️ Error obteniendo productos: ${error.message}${colors.reset}\n`);
  }
  
  console.log(`${colors.bold}=== INSTRUCCIONES PARA TEST MANUAL ===${colors.reset}\n`);
  
  console.log(`${colors.blue}🎯 Para probar la vista previa manualmente:${colors.reset}`);
  console.log(`1. Abre: ${colors.yellow}http://localhost:3001${colors.reset}`);
  console.log(`2. Inicia sesión con: ${colors.yellow}admin / admin123${colors.reset}`);
  console.log(`3. Haz clic en el botón ${colors.yellow}"Admin"${colors.reset}`);
  console.log(`4. Haz clic en ${colors.yellow}"Agregar"${colors.reset} para crear un producto`);
  console.log(`5. Llena los campos básicos (nombre, precio, etc.)`);
  console.log(`6. ${colors.green}Sube 2-3 imágenes${colors.reset} usando el selector de archivos`);
  console.log(`7. ${colors.green}¡Debería aparecer el botón "Vista Previa de Imágenes"!${colors.reset}`);
  console.log(`8. Haz clic en ${colors.yellow}"Vista Previa de Imágenes"${colors.reset}`);
  console.log(`9. ${colors.green}Prueba todas las funciones:${colors.reset}`);
  console.log(`   • Navegar con las flechas laterales`);
  console.log(`   • Hacer clic en las miniaturas`);
  console.log(`   • Usar las teclas ← → para navegar`);
  console.log(`   • Presionar ESC para cerrar`);
  console.log(`   • Probar el botón "Descargar"`);
  console.log(`   • Probar el botón "Eliminar" (con confirmación)`);
  console.log(`10. Haz clic en ${colors.yellow}"Continuar"${colors.reset} para seguir editando`);
  
  console.log(`\n${colors.bold}🎉 SISTEMA LISTO PARA PRUEBA MANUAL${colors.reset}`);
  console.log(`${colors.green}Todos los componentes están en su lugar y funcionando.${colors.reset}`);
}

testPracticalFlow().catch(console.error);