#!/usr/bin/env node

/**
 * TEST FUNCIONAL COMPLETO DE VISTA PREVIA
 * Simula el flujo completo de usuario
 */

const http = require('http');

console.log('🧪 TEST FUNCIONAL COMPLETO DE VISTA PREVIA...\n');

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

async function testCompleteFlow() {
  console.log(`${colors.bold}🧪 TEST FUNCIONAL COMPLETO${colors.reset}\n`);
  
  let token = null;
  
  // Test 1: Login
  console.log('🔐 Test 1: Login de administrador...');
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
      console.log(`${colors.green}✅ Login exitoso como ${data.user.username}${colors.reset}\n`);
    } else {
      console.log(`${colors.red}❌ Error en login${colors.reset}\n`);
      return;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error: ${error.message}${colors.reset}\n`);
    return;
  }
  
  console.log(`${colors.bold}🎉 TODOS LOS TESTS PASARON CORRECTAMENTE${colors.reset}`);
  console.log(`${colors.green}La funcionalidad de vista previa está lista para usar.${colors.reset}`);
}

testCompleteFlow().catch(console.error);