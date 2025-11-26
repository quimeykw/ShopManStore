// Script de prueba para verificar las nuevas funcionalidades
require('dotenv').config();
const { sendPurchaseNotification, formatPurchaseMessage } = require('./whatsapp-service');

console.log('🧪 Probando funcionalidades de compra y notificación...\n');

// Datos de prueba
const testOrderData = {
  orderId: 123,
  items: [
    { name: 'Remera Negra', quantity: 2, price: 5000, size: 'M' },
    { name: 'Jean Azul', quantity: 1, price: 12000, size: 'L' }
  ],
  total: 22000,
  paymentMethod: 'Mercado Pago',
  username: 'test_user',
  timestamp: new Date()
};

console.log('📋 Datos de orden de prueba:');
console.log(JSON.stringify(testOrderData, null, 2));
console.log('\n---\n');

// Probar formateo de mensaje
console.log('📱 Mensaje WhatsApp formateado:');
const message = formatPurchaseMessage(testOrderData);
console.log(message);
console.log('\n---\n');

// Probar envío de notificación
console.log('🚀 Probando envío de notificación...');
sendPurchaseNotification(testOrderData)
  .then(sent => {
    if (sent) {
      console.log('✅ Notificación preparada exitosamente');
    } else {
      console.log('⚠️ Notificación deshabilitada o falló');
    }
    console.log('\n✅ Prueba completada');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error en prueba:', error.message);
    process.exit(1);
  });
