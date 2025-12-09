// Test script para verificar notificaciones de compra por WhatsApp
require('dotenv').config();
const { sendPurchaseNotification, formatPurchaseMessage } = require('./whatsapp-service');

// Datos de prueba
const testOrderData = {
  orderId: 123,
  items: [
    {
      id: 1,
      name: 'Remera Negra',
      quantity: 2,
      price: 5000,
      size: 'M',
      color: 'Negro'
    },
    {
      id: 2,
      name: 'Jean Azul',
      quantity: 1,
      price: 12000,
      size: 'L',
      color: null
    }
  ],
  total: 22000,
  paymentMethod: 'Mercado Pago',
  username: 'juan_perez',
  timestamp: new Date()
};

console.log('🧪 TEST: Notificación de Compra por WhatsApp\n');
console.log('='.repeat(60));

// Test 1: Formateo de mensaje
console.log('\n📝 Test 1: Formateo de mensaje');
console.log('-'.repeat(60));
try {
  const message = formatPurchaseMessage(testOrderData);
  console.log('✅ Mensaje formateado correctamente:\n');
  console.log(message);
  console.log('\n' + '-'.repeat(60));
} catch (error) {
  console.error('❌ Error al formatear mensaje:', error.message);
}

// Test 2: Envío de notificación
console.log('\n📱 Test 2: Envío de notificación');
console.log('-'.repeat(60));
sendPurchaseNotification(testOrderData)
  .then(success => {
    if (success) {
      console.log('✅ Notificación preparada exitosamente');
      console.log('\n💡 Nota: En producción, aquí se enviaría el mensaje real');
      console.log('   Para envío real, integrar con:');
      console.log('   - Twilio WhatsApp API');
      console.log('   - WhatsApp Business API');
      console.log('   - Otro servicio de mensajería');
    } else {
      console.log('⚠️  WhatsApp deshabilitado (WHATSAPP_ENABLED=false)');
    }
  })
  .catch(error => {
    console.error('❌ Error al enviar notificación:', error.message);
  })
  .finally(() => {
    console.log('\n' + '='.repeat(60));
    console.log('✅ Tests completados\n');
  });
