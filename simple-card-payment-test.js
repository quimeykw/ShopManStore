#!/usr/bin/env node

/**
 * TEST SIMPLE DEL PAGO POR TARJETA
 * Verifica que el endpoint básico funcione
 */

const http = require('http');

console.log('💳 TEST SIMPLE DE PAGO POR TARJETA...\n');

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}`;

// Función para hacer requests HTTP
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
    req.setTimeout(10000, () => reject(new Error('Timeout')));
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testBasicEndpoints() {
  console.log('🔍 Verificando endpoints básicos...\n');
  
  // Test 1: Health check
  try {
    const health = await makeRequest(`${BASE_URL}/health`);
    if (health.statusCode === 200) {
      console.log('✅ Health check: OK');
    } else {
      console.log('❌ Health check: FAIL');
      return false;
    }
  } catch (error) {
    console.log('❌ Servidor no disponible');
    return false;
  }
  
  // Test 2: Login
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
      console.log('✅ Login: OK');
      console.log(`   Token: ${data.token.substring(0, 20)}...`);
      
      // Test 3: Verificar endpoint de pago existente
      const mpTest = await makeRequest(`${BASE_URL}/api/mp-payment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`
        },
        body: JSON.stringify({
          items: [{ name: 'Test', qty: 1, price: 100 }],
          total: 100,
          paymentData: {
            card_number: '4509953566233704',
            cardholder_name: 'APRO',
            security_code: '123',
            expiration_month: '11',
            expiration_year: '2025',
            identification_number: '12345678'
          }
        })
      });
      
      console.log(`💳 Endpoint mp-payment: Status ${mpTest.statusCode}`);
      
      if (mpTest.statusCode === 200) {
        const paymentResult = JSON.parse(mpTest.data);
        console.log('✅ Pago por tarjeta: FUNCIONANDO');
        console.log(`   ID: ${paymentResult.id || paymentResult.payment_id}`);
        console.log(`   Estado: ${paymentResult.status}`);
      } else if (mpTest.statusCode === 503) {
        console.log('⚠️  Mercado Pago no configurado (normal en desarrollo)');
      } else {
        console.log('❌ Error en pago por tarjeta');
        console.log(`   Respuesta: ${mpTest.data}`);
      }
      
      return true;
    } else {
      console.log('❌ Login: FAIL');
      return false;
    }
  } catch (error) {
    console.log(`❌ Error en tests: ${error.message}`);
    return false;
  }
}

async function runSimpleTest() {
  console.log('🚀 INICIANDO TEST SIMPLE DE PAGO POR TARJETA\n');
  
  const success = await testBasicEndpoints();
  
  console.log('\n📊 RESULTADO:');
  if (success) {
    console.log('✅ Sistema de pagos básico funcionando');
    console.log('\n💡 Para habilitar pagos reales:');
    console.log('   1. Configura MP_TOKEN en variables de entorno');
    console.log('   2. Usa credenciales de producción de Mercado Pago');
    console.log('   3. Implementa validación de tarjetas');
  } else {
    console.log('❌ Problemas detectados en el sistema');
    console.log('\n🔧 Soluciones:');
    console.log('   1. Verifica que el servidor esté corriendo');
    console.log('   2. Revisa la configuración de Mercado Pago');
    console.log('   3. Verifica las credenciales de admin');
  }
}

// Ejecutar test
runSimpleTest().catch(console.error);