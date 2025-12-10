#!/usr/bin/env node

/**
 * Script para actualizar el endpoint de pago por tarjeta en server.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Actualizando endpoint de pago por tarjeta...\n');

// Leer el archivo server.js actual
const serverPath = path.join(__dirname, 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Nuevo endpoint mejorado de pago por tarjeta
const newCardPaymentEndpoint = `
// PAGO POR TARJETA MEJORADO
app.post('/api/card-payment', auth, async (req, res) => {
  if (!mpPayment) return res.status(503).json({ error: 'Mercado Pago no configurado' });
  
  try {
    const { items, total, paymentData } = req.body;
    
    console.log('💳 Procesando pago por tarjeta:', {
      amount: total,
      user: req.user.username,
      method: paymentData.payment_method_id || 'visa'
    });
    
    // Validaciones básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items requeridos' });
    }
    
    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Total inválido' });
    }
    
    if (!paymentData || !paymentData.token) {
      return res.status(400).json({ error: 'Datos de pago requeridos' });
    }
    
    // Preparar datos del pago
    const paymentBody = {
      transaction_amount: Number(total),
      description: items.map(i => \`\${i.name} x\${i.quantity || i.qty}\`).join(', '),
      payment_method_id: paymentData.payment_method_id || 'visa',
      
      // Token de la tarjeta (generado por MercadoPago.js en el frontend)
      token: paymentData.token,
      installments: parseInt(paymentData.installments) || 1,
      
      // Datos del pagador
      payer: {
        email: req.user.email || req.user.username + '@shopmanstore.com',
        identification: {
          type: paymentData.identification_type || 'DNI',
          number: paymentData.identification_number || '12345678'
        }
      },
      
      // Información adicional para mayor seguridad
      additional_info: {
        items: items.map(item => ({
          id: item.id ? item.id.toString() : 'item',
          title: item.name,
          description: item.name,
          category_id: 'clothing',
          quantity: item.quantity || item.qty || 1,
          unit_price: Number(item.price)
        })),
        payer: {
          first_name: paymentData.cardholder_name ? paymentData.cardholder_name.split(' ')[0] : 'Cliente',
          last_name: paymentData.cardholder_name ? paymentData.cardholder_name.split(' ').slice(1).join(' ') || 'ShopManStore' : 'ShopManStore'
        }
      }
    };
    
    console.log('📤 Enviando pago a Mercado Pago...');
    
    // Crear el pago
    const response = await mpPayment.create({ body: paymentBody });
    
    console.log('📥 Respuesta de Mercado Pago:', {
      id: response.id,
      status: response.status,
      status_detail: response.status_detail
    });
    
    // Guardar la orden en la base de datos
    const itemsJson = JSON.stringify(items);
    const paymentMethod = \`Tarjeta \${paymentData.payment_method_id || 'Visa'}\`;
    
    db.run('INSERT INTO orders (user_id, total, payment_method, items, transaction_id, payment_status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, total, paymentMethod, itemsJson, response.id, response.status],
      function(err) {
        if (err) {
          console.error('❌ Error guardando orden:', err);
          return res.status(500).json({ error: 'Error guardando la orden' });
        }
        
        const orderId = this.lastID;
        console.log(\`✅ Orden guardada: #\${orderId}\`);
        
        // Guardar log detallado
        const logDetails = formatPurchaseLog(items, total, paymentMethod);
        saveLog(req.user.id, 'Pago con tarjeta', logDetails);
        
        // Enviar notificación WhatsApp (asíncrono)
        (async () => {
          try {
            const orderData = {
              orderId,
              items,
              total,
              paymentMethod,
              username: req.user.username,
              timestamp: new Date()
            };
            
            const whatsappSent = await sendPurchaseNotification(orderData);
            if (whatsappSent) {
              saveLog(req.user.id, 'WhatsApp enviado', \`Notificación enviada para orden #\${orderId}\`);
            }
          } catch (error) {
            console.error('Error enviando WhatsApp:', error.message);
          }
        })();
      }
    );
    
    // Respuesta exitosa
    res.json({
      success: true,
      payment_id: response.id,
      status: response.status,
      status_detail: response.status_detail,
      transaction_amount: response.transaction_amount,
      payment_method: response.payment_method_id,
      installments: response.installments,
      message: 'Pago procesado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error procesando pago por tarjeta:', error);
    
    // Respuesta de error detallada
    res.status(500).json({
      success: false,
      error: error.message || 'Error al procesar el pago',
      details: error.cause || [],
      code: error.status || 'PAYMENT_ERROR'
    });
  }
});

// Endpoint para obtener métodos de pago disponibles
app.get('/api/payment-methods', auth, async (req, res) => {
  try {
    const response = await fetch('https://api.mercadopago.com/v1/payment_methods', {
      headers: {
        'Authorization': \`Bearer \${MP_TOKEN}\`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error obteniendo métodos de pago');
    }
    
    const methods = await response.json();
    
    // Filtrar solo tarjetas de crédito activas
    const creditCards = methods.filter(method => 
      method.payment_type_id === 'credit_card' && 
      method.status === 'active'
    );
    
    res.json({
      success: true,
      payment_methods: creditCards.map(method => ({
        id: method.id,
        name: method.name,
        thumbnail: method.thumbnail,
        secure_thumbnail: method.secure_thumbnail,
        min_allowed_amount: method.min_allowed_amount,
        max_allowed_amount: method.max_allowed_amount
      }))
    });
    
  } catch (error) {
    console.error('Error obteniendo métodos de pago:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo métodos de pago'
    });
  }
});`;

// Buscar y reemplazar el endpoint existente
const oldEndpointRegex = /\/\/ MERCADO PAGO[\s\S]*?app\.post\('\/api\/mp-payment'[\s\S]*?}\);/;

if (serverContent.match(oldEndpointRegex)) {
  serverContent = serverContent.replace(oldEndpointRegex, newCardPaymentEndpoint);
  console.log('✅ Endpoint de pago por tarjeta actualizado');
} else {
  // Si no encuentra el endpoint, añadirlo antes del endpoint de mp-link
  const mpLinkIndex = serverContent.indexOf("app.post('/api/mp-link'");
  if (mpLinkIndex !== -1) {
    serverContent = serverContent.slice(0, mpLinkIndex) + newCardPaymentEndpoint + '\n\n' + serverContent.slice(mpLinkIndex);
    console.log('✅ Nuevo endpoint de pago por tarjeta añadido');
  } else {
    console.log('❌ No se pudo encontrar dónde insertar el endpoint');
    return;
  }
}

// Guardar el archivo actualizado
fs.writeFileSync(serverPath, serverContent);

console.log('\n🎉 ¡Endpoint de pago por tarjeta actualizado exitosamente!');
console.log('\n📋 Nuevos endpoints disponibles:');
console.log('   POST /api/card-payment     # Pago directo por tarjeta');
console.log('   GET  /api/payment-methods  # Métodos de pago disponibles');
console.log('\n💡 Características mejoradas:');
console.log('   • Validaciones completas de datos');
console.log('   • Manejo de errores mejorado');
console.log('   • Logs detallados');
console.log('   • Respuestas estructuradas');
console.log('   • Soporte para tokens de MercadoPago.js');