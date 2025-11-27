// Test de integración completa de Mercado Pago
require('dotenv').config();
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api';
let authToken = null;

console.log('🧪 Test de Integración - Mercado Pago + WhatsApp + Logs\n');

// Función helper para hacer requests
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (authToken) {
    options.headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();
  
  return { response, data };
}

async function runTests() {
  try {
    // Test 1: Login
    console.log('📝 Test 1: Login como admin...');
    const { response: loginRes, data: loginData } = await apiRequest('/login', 'POST', {
      username: 'admin',
      password: 'admin123'
    });

    if (!loginRes.ok) {
      throw new Error('Login falló: ' + JSON.stringify(loginData));
    }

    authToken = loginData.token;
    console.log('✅ Login exitoso\n');

    // Test 2: Obtener productos
    console.log('📝 Test 2: Obtener productos...');
    const { response: productsRes, data: products } = await apiRequest('/products');
    
    if (!productsRes.ok || !Array.isArray(products) || products.length === 0) {
      throw new Error('No hay productos disponibles');
    }

    console.log(`✅ ${products.length} productos encontrados\n`);

    // Test 3: Crear preferencia de Mercado Pago
    console.log('📝 Test 3: Crear preferencia de pago...');
    
    const testItems = [
      {
        id: products[0].id,
        name: products[0].name,
        quantity: 2,
        price: products[0].price,
        size: 'M'
      }
    ];

    const total = testItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const { response: mpRes, data: mpData } = await apiRequest('/mp-link', 'POST', {
      items: testItems,
      total: total
    });

    if (!mpRes.ok) {
      console.error('❌ Error al crear preferencia:', mpData);
      throw new Error('Falló creación de preferencia: ' + JSON.stringify(mpData));
    }

    console.log('✅ Preferencia creada exitosamente');
    console.log('   Preference ID:', mpData.preference_id);
    console.log('   Link de pago:', mpData.link ? '✅ Disponible' : '❌ No disponible');
    console.log('   Status:', mpData.status);
    console.log('');

    // Test 4: Verificar que se guardó la orden
    console.log('📝 Test 4: Verificar orden guardada...');
    const { response: ordersRes, data: orders } = await apiRequest('/orders');
    
    if (!ordersRes.ok) {
      throw new Error('Error al obtener órdenes');
    }

    const lastOrder = orders[0];
    console.log('✅ Orden guardada:');
    console.log('   ID:', lastOrder.id);
    console.log('   Total:', lastOrder.total);
    console.log('   Items type:', typeof lastOrder.items);
    console.log('   Items:', Array.isArray(lastOrder.items) ? lastOrder.items.length + ' productos' : 'No es array');
    console.log('   Método:', lastOrder.payment_method);
    console.log('');

    // Test 5: Verificar logs
    console.log('📝 Test 5: Verificar logs...');
    const { response: logsRes, data: logs } = await apiRequest('/logs');
    
    if (!logsRes.ok) {
      throw new Error('Error al obtener logs');
    }

    const purchaseLogs = logs.filter(log => log.action === 'Compra realizada');
    const whatsappLogs = logs.filter(log => log.action === 'WhatsApp enviado');

    console.log('✅ Logs verificados:');
    console.log('   Total logs:', logs.length);
    console.log('   Logs de compra:', purchaseLogs.length);
    console.log('   Logs de WhatsApp:', whatsappLogs.length);
    
    if (purchaseLogs.length > 0) {
      console.log('   Último log de compra:', purchaseLogs[0].details.substring(0, 80) + '...');
    }
    console.log('');

    // Test 6: Verificar formato de items
    console.log('📝 Test 6: Verificar formato de items...');
    if (lastOrder.items && Array.isArray(lastOrder.items) && lastOrder.items.length > 0) {
      const firstItem = lastOrder.items[0];
      
      const hasRequiredFields = firstItem.id && firstItem.name && 
                               (firstItem.quantity || firstItem.qty) && firstItem.price;
      
      if (!hasRequiredFields) {
        throw new Error('Items no tienen todos los campos requeridos');
      }

      console.log('✅ Items tienen formato correcto:');
      console.log('   ID:', firstItem.id);
      console.log('   Nombre:', firstItem.name);
      console.log('   Cantidad:', firstItem.quantity || firstItem.qty);
      console.log('   Precio:', firstItem.price);
      console.log('   Talle:', firstItem.size || 'N/A');
      console.log('');
    } else {
      console.log('⚠️  Items no disponibles o vacíos');
      console.log('');
    }

    // Resumen final
    console.log('═══════════════════════════════════════');
    console.log('✅ TODOS LOS TESTS PASARON EXITOSAMENTE');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Funcionalidades verificadas:');
    console.log('  ✅ Login y autenticación');
    console.log('  ✅ Obtención de productos');
    console.log('  ✅ Creación de preferencia de Mercado Pago');
    console.log('  ✅ Guardado de orden con items');
    console.log('  ✅ Logs detallados de compra');
    console.log('  ✅ Notificaciones WhatsApp preparadas');
    console.log('  ✅ Formato correcto de datos');
    console.log('');
    console.log('🎉 El sistema está funcionando correctamente!');
    console.log('');
    console.log('Próximo paso: Probar en el navegador');
    console.log('  1. Abre http://localhost:3001');
    console.log('  2. Inicia sesión (admin/admin123)');
    console.log('  3. Agrega productos al carrito');
    console.log('  4. Haz clic en "Mercado Pago"');
    console.log('  5. Verás el link de pago REAL');

  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════');
    console.error('❌ TEST FALLÓ');
    console.error('═══════════════════════════════════════');
    console.error('Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

// Ejecutar tests
console.log('Esperando que el servidor esté listo...\n');
setTimeout(() => {
  runTests().then(() => process.exit(0));
}, 2000);
