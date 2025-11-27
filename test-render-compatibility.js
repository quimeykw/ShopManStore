// Test de compatibilidad con Render
require('dotenv').config();
const db = require('./db-config');

const isPostgres = !!process.env.DATABASE_URL;

console.log('🧪 INICIANDO TESTS DE COMPATIBILIDAD RENDER\n');
console.log(`Base de datos: ${isPostgres ? 'PostgreSQL' : 'SQLite'}`);
console.log(`Entorno: ${process.env.NODE_ENV || 'development'}\n`);

let testsPassed = 0;
let testsFailed = 0;

// Helper para tests
function test(name, fn) {
  return new Promise((resolve) => {
    console.log(`\n🔍 Test: ${name}`);
    fn()
      .then(() => {
        console.log(`✅ PASÓ: ${name}`);
        testsPassed++;
        resolve();
      })
      .catch((err) => {
        console.error(`❌ FALLÓ: ${name}`);
        console.error(`   Error: ${err.message}`);
        testsFailed++;
        resolve();
      });
  });
}

// Test 1: Conexión a base de datos
async function testDatabaseConnection() {
  return new Promise((resolve, reject) => {
    db.get('SELECT 1 as test', (err, row) => {
      if (err) reject(new Error('No se pudo conectar a la base de datos: ' + err.message));
      else if (row.test === 1) resolve();
      else reject(new Error('Respuesta inesperada de la base de datos'));
    });
  });
}

// Test 2: Verificar estructura de tabla orders
async function testOrdersTableStructure() {
  return new Promise((resolve, reject) => {
    if (isPostgres) {
      db.all(`SELECT column_name FROM information_schema.columns WHERE table_name = 'orders'`, (err, columns) => {
        if (err) reject(new Error('Error al verificar estructura: ' + err.message));
        else {
          const columnNames = columns.map(c => c.column_name);
          const requiredColumns = ['id', 'user_id', 'total', 'payment_method', 'items', 'created_at'];
          const missing = requiredColumns.filter(col => !columnNames.includes(col));
          
          if (missing.length > 0) {
            reject(new Error(`Columnas faltantes: ${missing.join(', ')}`));
          } else {
            console.log(`   Columnas encontradas: ${columnNames.join(', ')}`);
            resolve();
          }
        }
      });
    } else {
      db.all(`PRAGMA table_info(orders)`, (err, columns) => {
        if (err) reject(new Error('Error al verificar estructura: ' + err.message));
        else {
          const columnNames = columns.map(c => c.name);
          const requiredColumns = ['id', 'user_id', 'total', 'payment_method', 'items', 'created_at'];
          const missing = requiredColumns.filter(col => !columnNames.includes(col));
          
          if (missing.length > 0) {
            reject(new Error(`Columnas faltantes: ${missing.join(', ')}`));
          } else {
            console.log(`   Columnas encontradas: ${columnNames.join(', ')}`);
            resolve();
          }
        }
      });
    }
  });
}

// Test 3: Insertar orden con items
async function testInsertOrderWithItems() {
  return new Promise((resolve, reject) => {
    const testItems = [
      { name: 'Test Product 1', quantity: 2, price: 1000, size: 'M' },
      { name: 'Test Product 2', quantity: 1, price: 2000, size: 'L' }
    ];
    const itemsJson = JSON.stringify(testItems);
    
    db.run(
      'INSERT INTO orders (user_id, total, payment_method, items) VALUES (?, ?, ?, ?)',
      [1, 4000, 'Test', itemsJson],
      function(err) {
        if (err) {
          reject(new Error('Error al insertar orden: ' + err.message));
        } else {
          const orderId = this.lastID;
          console.log(`   Orden creada con ID: ${orderId}`);
          
          // Verificar que se insertó correctamente
          db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, order) => {
            if (err) {
              reject(new Error('Error al verificar orden: ' + err.message));
            } else if (!order) {
              reject(new Error('Orden no encontrada después de insertar'));
            } else {
              // Limpiar orden de test
              db.run('DELETE FROM orders WHERE id = ?', [orderId], (err) => {
                if (err) console.warn('   ⚠️ No se pudo limpiar orden de test');
                resolve();
              });
            }
          });
        }
      }
    );
  });
}

// Test 4: Parsear items de JSON
async function testParseOrderItems() {
  return new Promise((resolve, reject) => {
    const testItems = [
      { name: 'Test Product', quantity: 3, price: 1500 }
    ];
    const itemsJson = JSON.stringify(testItems);
    
    db.run(
      'INSERT INTO orders (user_id, total, payment_method, items) VALUES (?, ?, ?, ?)',
      [1, 4500, 'Test Parse', itemsJson],
      function(err) {
        if (err) {
          reject(new Error('Error al insertar: ' + err.message));
        } else {
          const orderId = this.lastID;
          
          // Recuperar y parsear
          db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, order) => {
            if (err) {
              reject(new Error('Error al recuperar: ' + err.message));
            } else {
              try {
                const parsedItems = JSON.parse(order.items);
                if (Array.isArray(parsedItems) && parsedItems.length === 1) {
                  console.log(`   Items parseados correctamente: ${parsedItems[0].name}`);
                  
                  // Limpiar
                  db.run('DELETE FROM orders WHERE id = ?', [orderId], () => {
                    resolve();
                  });
                } else {
                  reject(new Error('Items no se parsearon correctamente'));
                }
              } catch (e) {
                reject(new Error('Error al parsear JSON: ' + e.message));
              }
            }
          });
        }
      }
    );
  });
}

// Test 5: Verificar variables de entorno críticas
async function testEnvironmentVariables() {
  return new Promise((resolve, reject) => {
    const required = ['JWT_SECRET'];
    const optional = ['MP_TOKEN', 'WHATSAPP_PHONE', 'DATABASE_URL'];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      reject(new Error(`Variables requeridas faltantes: ${missing.join(', ')}`));
    } else {
      console.log('   Variables requeridas: ✓');
      
      optional.forEach(key => {
        if (process.env[key]) {
          console.log(`   ${key}: configurado`);
        } else {
          console.log(`   ${key}: no configurado (opcional)`);
        }
      });
      
      resolve();
    }
  });
}

// Test 6: Verificar servicio WhatsApp
async function testWhatsAppService() {
  return new Promise((resolve, reject) => {
    try {
      const { formatPurchaseMessage, WHATSAPP_ENABLED, WHATSAPP_PHONE } = require('./whatsapp-service');
      
      console.log(`   WhatsApp habilitado: ${WHATSAPP_ENABLED}`);
      console.log(`   Teléfono: ${WHATSAPP_PHONE}`);
      
      const testOrder = {
        orderId: 123,
        items: [
          { name: 'Test Product', quantity: 2, price: 1000, size: 'M' }
        ],
        total: 2000,
        paymentMethod: 'Test',
        username: 'testuser',
        timestamp: new Date()
      };
      
      const message = formatPurchaseMessage(testOrder);
      
      if (message.includes('COMPRA CONFIRMADA') && message.includes('Test Product')) {
        console.log('   Formato de mensaje: ✓');
        resolve();
      } else {
        reject(new Error('Formato de mensaje incorrecto'));
      }
    } catch (err) {
      reject(new Error('Error al cargar servicio WhatsApp: ' + err.message));
    }
  });
}

// Test 7: Verificar que lastID funciona correctamente
async function testLastIDCompatibility() {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)',
      [1, 'Test', 'Test lastID compatibility'],
      function(err) {
        if (err) {
          reject(new Error('Error al insertar log: ' + err.message));
        } else if (!this.lastID) {
          reject(new Error('lastID no está disponible (problema de compatibilidad)'));
        } else {
          console.log(`   lastID funciona correctamente: ${this.lastID}`);
          
          // Limpiar
          db.run('DELETE FROM logs WHERE id = ?', [this.lastID], () => {
            resolve();
          });
        }
      }
    );
  });
}

// Ejecutar todos los tests
async function runAllTests() {
  console.log('═'.repeat(60));
  
  await test('1. Conexión a base de datos', testDatabaseConnection);
  await test('2. Estructura de tabla orders', testOrdersTableStructure);
  await test('3. Insertar orden con items', testInsertOrderWithItems);
  await test('4. Parsear items de JSON', testParseOrderItems);
  await test('5. Variables de entorno', testEnvironmentVariables);
  await test('6. Servicio WhatsApp', testWhatsAppService);
  await test('7. Compatibilidad lastID', testLastIDCompatibility);
  
  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 RESUMEN DE TESTS:');
  console.log(`   ✅ Pasaron: ${testsPassed}`);
  console.log(`   ❌ Fallaron: ${testsFailed}`);
  console.log(`   📈 Total: ${testsPassed + testsFailed}`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 ¡TODOS LOS TESTS PASARON! Sistema listo para Render.\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Algunos tests fallaron. Revisa los errores arriba.\n');
    process.exit(1);
  }
}

// Ejecutar
runAllTests().catch(err => {
  console.error('\n💥 Error fatal:', err.message);
  process.exit(1);
});
