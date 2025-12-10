#!/usr/bin/env node

/**
 * TEST COMPLETO DEL SISTEMA DE PAGO POR TARJETA
 * Verifica que todo funcione correctamente
 */

const http = require('http');
const https = require('https');

console.log('💳 INICIANDO TESTS DE PAGO POR TARJETA...\n');

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
    req.setTimeout(15000, () => reject(new Error('Timeout')));
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Test de login para obtener token
async function testLogin() {
  console.log('🔐 Test 1: Login de usuario...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log(`${colors.green}✅ Login exitoso${colors.reset}`);
      console.log(`   Token obtenido: ${data.token.substring(0, 20)}...`);
      console.log(`   Usuario: ${data.user.username} (${data.user.role})\n`);
      return data.token;
    } else {
      console.log(`${colors.red}❌ Login falló: ${response.statusCode}${colors.reset}\n`);
      return null;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error en login: ${error.message}${colors.reset}\n`);
    return null;
  }
}

// Test de métodos de pago disponibles
async function testPaymentMethods(token) {
  console.log('💳 Test 2: Métodos de pago disponibles...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/payment-methods`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log(`${colors.green}✅ Métodos de pago obtenidos${colors.reset}`);
      
      if (data.success && data.payment_methods) {
        console.log(`   Métodos disponibles: ${data.payment_methods.length}`);
        data.payment_methods.slice(0, 3).forEach(method => {
          console.log(`   • ${method.name} (${method.id})`);
        });
      }
      console.log('');
      return data.payment_methods || [];
    } else {
      console.log(`${colors.yellow}⚠️  Métodos de pago no disponibles: ${response.statusCode}${colors.reset}\n`);
      return [];
    }
  } catch (error) {
    console.log(`${colors.yellow}⚠️  Error obteniendo métodos: ${error.message}${colors.reset}\n`);
    return [];
  }
}

// Test de pago por tarjeta (simulado)
async function testCardPayment(token) {
  console.log('💳 Test 3: Pago por tarjeta (simulado)...');
  
  // Datos de prueba de Mercado Pago
  const testPaymentData = {
    items: [
      {
        id: 1,
        name: 'Remera Test',
        quantity: 1,
        price: 2500
      }
    ],
    total: 2500,
    paymentData: {
      // Datos de tarjeta de prueba de Mercado Pago
      card_number: '4509953566233704',
      cardholder_name: 'APRO',
      security_code: '123',
      expiration_month: '11',
      expiration_year: '2025',
      identification_type: 'DNI',
      identification_number: '12345678',
      payment_method_id: 'visa',
      installments: 1
    }
  };
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/card-payment`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testPaymentData)
    });
    
    console.log(`   Status: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      
      if (data.success) {
        console.log(`${colors.green}✅ Pago procesado exitosamente${colors.reset}`);
        console.log(`   ID de pago: ${data.payment_id}`);
        console.log(`   Estado: ${data.status} - ${data.status_detail}`);
        console.log(`   Monto: $${data.transaction_amount}`);
        console.log(`   Método: ${data.payment_method}`);
        console.log(`   Cuotas: ${data.installments}\n`);
        return true;
      } else {
        console.log(`${colors.yellow}⚠️  Pago rechazado: ${data.error}${colors.reset}`);
        if (data.details && data.details.length > 0) {
          console.log(`   Detalles: ${data.details.join(', ')}`);
        }
        console.log('');
        return false;
      }
    } else {
      const data = JSON.parse(response.data);
      console.log(`${colors.red}❌ Error en pago: ${response.statusCode}${colors.reset}`);
      console.log(`   Error: ${data.error || 'Error desconocido'}\n`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error procesando pago: ${error.message}${colors.reset}\n`);
    return false;
  }
}

// Test de validación de datos
async function testPaymentValidation(token) {
  console.log('🔍 Test 4: Validación de datos de pago...');
  
  const invalidPaymentData = {
    items: [],  // Items vacíos
    total: 0,   // Total inválido
    paymentData: {
      // Datos inválidos
      card_number: '123',
      cardholder_name: '',
      security_code: '1',
      identification_number: '123'
    }
  };
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/card-payment`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(invalidPaymentData)
    });
    
    if (response.statusCode === 400) {
      console.log(`${colors.green}✅ Validación funcionando correctamente${colors.reset}`);
      const data = JSON.parse(response.data);
      console.log(`   Error esperado: ${data.error}\n`);
      return true;
    } else {
      console.log(`${colors.yellow}⚠️  Validación no funcionó como esperado: ${response.statusCode}${colors.reset}\n`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error en test de validación: ${error.message}${colors.reset}\n`);
    return false;
  }
}

// Test de órdenes guardadas
async function testOrdersSaved(token) {
  console.log('📋 Test 5: Verificar órdenes guardadas...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/orders`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.statusCode === 200) {
      const orders = JSON.parse(response.data);
      console.log(`${colors.green}✅ Órdenes obtenidas${colors.reset}`);
      console.log(`   Total órdenes: ${orders.length}`);
      
      // Buscar órdenes de tarjeta recientes
      const cardOrders = orders.filter(order => 
        order.payment_method && order.payment_method.includes('Tarjeta')
      );
      
      if (cardOrders.length > 0) {
        console.log(`   Órdenes con tarjeta: ${cardOrders.length}`);
        const lastOrder = cardOrders[0];
        console.log(`   Última orden: #${lastOrder.id} - $${lastOrder.total}`);
      }
      console.log('');
      return true;
    } else {
      console.log(`${colors.yellow}⚠️  No se pudieron obtener órdenes: ${response.statusCode}${colors.reset}\n`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error obteniendo órdenes: ${error.message}${colors.reset}\n`);
    return false;
  }
}

// Función principal de tests
async function runCardPaymentTests() {
  console.log(`${colors.bold}💳 TESTS DE PAGO POR TARJETA - ShopManStore${colors.reset}\n`);
  
  const results = [];
  
  // Verificar que el servidor esté corriendo
  console.log('🔍 Verificando servidor...');
  try {
    await makeRequest(`${BASE_URL}/health`);
    console.log(`${colors.green}✅ Servidor corriendo en ${BASE_URL}${colors.reset}\n`);
  } catch (error) {
    console.log(`${colors.red}❌ Servidor no disponible. Inicia con: npm start${colors.reset}\n`);
    return;
  }
  
  // Ejecutar tests
  const token = await testLogin();
  if (!token) {
    console.log(`${colors.red}❌ No se pudo obtener token. Tests cancelados.${colors.reset}`);
    return;
  }
  
  results.push(await testPaymentMethods(token));
  results.push(await testCardPayment(token));
  results.push(await testPaymentValidation(token));
  results.push(await testOrdersSaved(token));
  
  // Resumen final
  console.log(`${colors.bold}=== RESUMEN DE TESTS ===${colors.reset}\n`);
  
  const testNames = [
    'Métodos de pago',
    'Pago por tarjeta',
    'Validación de datos',
    'Órdenes guardadas'
  ];
  
  let passed = 0;
  results.forEach((result, index) => {
    const status = result ? `${colors.green}✅ PASS${colors.reset}` : `${colors.red}❌ FAIL${colors.reset}`;
    console.log(`${testNames[index]}: ${status}`);
    if (result) passed++;
  });
  
  const percentage = Math.round((passed / results.length) * 100);
  const overallColor = percentage === 100 ? colors.green : percentage >= 75 ? colors.yellow : colors.red;
  
  console.log(`\n${colors.bold}${overallColor}RESULTADO: ${passed}/${results.length} tests pasaron (${percentage}%)${colors.reset}\n`);
  
  if (percentage === 100) {
    console.log(`${colors.green}🎉 ¡Todos los tests de pago por tarjeta pasaron!${colors.reset}`);
    console.log(`${colors.green}✅ El sistema de pagos está funcionando correctamente${colors.reset}`);
  } else if (percentage >= 75) {
    console.log(`${colors.yellow}⚠️  La mayoría de tests pasaron. Revisa los fallos.${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Varios tests fallaron. Revisa la configuración.${colors.reset}`);
  }
  
  console.log(`\n${colors.blue}💡 Notas importantes:${colors.reset}`);
  console.log(`   • Usa tarjetas de prueba de Mercado Pago para testing`);
  console.log(`   • Configura tu MP_TOKEN en las variables de entorno`);
  console.log(`   • Los pagos de prueba no cobran dinero real`);
  console.log(`   • Revisa los logs del servidor para más detalles`);
}

// Ejecutar tests si es llamado directamente
if (require.main === module) {
  runCardPaymentTests().catch(error => {
    console.error(`${colors.red}Error ejecutando tests:${colors.reset}`, error);
    process.exit(1);
  });
}

module.exports = { runCardPaymentTests };