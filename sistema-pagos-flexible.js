#!/usr/bin/env node

/**
 * SISTEMA DE PAGOS FLEXIBLE - SIN DEPENDENCIA OBLIGATORIA DE MERCADO PAGO
 * Múltiples métodos de pago alternativos
 */

// Agregar estos endpoints al server.js para tener un sistema más flexible

// MÉTODO 1: PAGO POR TRANSFERENCIA BANCARIA
app.post('/api/payment-transfer', auth, async (req, res) => {
  try {
    const { items, total, transferData } = req.body;
    
    // Validar datos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items requeridos' });
    }
    
    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Total inválido' });
    }
    
    // Generar número de orden único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Datos bancarios para mostrar al usuario
    const bankData = {
      banco: 'Banco Ejemplo',
      cbu: '0000003100010000000001',
      alias: 'SHOPMAN.STORE',
      titular: 'ShopManStore',
      cuit: '20-12345678-9'
    };
    
    // Guardar la orden como "pendiente de pago"
    const itemsJson = JSON.stringify(items);
    db.run('INSERT INTO orders (user_id, total, payment_method, items, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, total, `Transferencia - ${orderNumber}`, itemsJson, 'pending_payment'],
      function(err) {
        if (err) {
          console.error('Error saving transfer order:', err);
          return res.status(500).json({ error: 'Error al crear orden' });
        }
        
        const orderId = this.lastID;
        
        // Guardar log
        const logDetails = `Orden ${orderNumber} - Transferencia bancaria - Total: $${total}`;
        saveLog(req.user.id, 'Orden transferencia creada', logDetails);
        
        // Enviar notificación WhatsApp con datos bancarios
        (async () => {
          try {
            const orderData = {
              orderId: orderId,
              orderNumber: orderNumber,
              items: items,
              total,
              paymentMethod: 'Transferencia Bancaria',
              username: req.user.username,
              timestamp: new Date(),
              bankData: bankData
            };
            
            const whatsappSent = await sendPurchaseNotification(orderData);
            if (whatsappSent) {
              saveLog(req.user.id, 'WhatsApp enviado', `Datos bancarios enviados para orden ${orderNumber}`);
            }
          } catch (error) {
            console.error('Error al enviar WhatsApp:', error.message);
          }
        })();
        
        res.json({
          success: true,
          orderId: orderId,
          orderNumber: orderNumber,
          status: 'pending_payment',
          message: 'Orden creada. Realiza la transferencia con los datos proporcionados.',
          bankData: bankData,
          instructions: [
            '1. Realiza la transferencia bancaria con los datos proporcionados',
            '2. Envía el comprobante por WhatsApp al 5491122549995',
            '3. Incluye tu número de orden en el mensaje',
            '4. Tu pedido será procesado una vez confirmado el pago'
          ]
        });
      }
    );
    
  } catch (error) {
    console.error('Transfer payment error:', error);
    res.status(500).json({ error: 'Error al procesar pago por transferencia' });
  }
});

// MÉTODO 2: PAGO EN EFECTIVO / PUNTO DE RETIRO
app.post('/api/payment-cash', auth, async (req, res) => {
  try {
    const { items, total, pickupLocation } = req.body;
    
    // Validar datos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items requeridos' });
    }
    
    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Total inválido' });
    }
    
    // Generar código de retiro
    const pickupCode = `CASH-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Ubicaciones disponibles para retiro
    const locations = {
      'centro': 'Centro - Av. Corrientes 1234, CABA',
      'palermo': 'Palermo - Av. Santa Fe 5678, CABA',
      'belgrano': 'Belgrano - Av. Cabildo 9012, CABA'
    };
    
    const selectedLocation = locations[pickupLocation] || locations['centro'];
    
    // Guardar la orden
    const itemsJson = JSON.stringify(items);
    db.run('INSERT INTO orders (user_id, total, payment_method, items, status, pickup_code) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, total, `Efectivo - ${pickupCode}`, itemsJson, 'pending_pickup', pickupCode],
      function(err) {
        if (err) {
          console.error('Error saving cash order:', err);
          return res.status(500).json({ error: 'Error al crear orden' });
        }
        
        const orderId = this.lastID;
        
        // Guardar log
        const logDetails = `Código ${pickupCode} - Pago en efectivo - Total: $${total} - Ubicación: ${selectedLocation}`;
        saveLog(req.user.id, 'Orden efectivo creada', logDetails);
        
        // Enviar notificación WhatsApp
        (async () => {
          try {
            const orderData = {
              orderId: orderId,
              pickupCode: pickupCode,
              items: items,
              total,
              paymentMethod: 'Pago en Efectivo',
              username: req.user.username,
              timestamp: new Date(),
              location: selectedLocation
            };
            
            const whatsappSent = await sendPurchaseNotification(orderData);
            if (whatsappSent) {
              saveLog(req.user.id, 'WhatsApp enviado', `Código de retiro enviado: ${pickupCode}`);
            }
          } catch (error) {
            console.error('Error al enviar WhatsApp:', error.message);
          }
        })();
        
        res.json({
          success: true,
          orderId: orderId,
          pickupCode: pickupCode,
          status: 'pending_pickup',
          message: 'Orden creada. Retira y paga en nuestro local.',
          location: selectedLocation,
          instructions: [
            '1. Dirígete a la ubicación seleccionada',
            '2. Presenta tu código de retiro',
            '3. Paga en efectivo al retirar',
            '4. Horarios: Lun-Vie 9-18hs, Sáb 9-13hs'
          ]
        });
      }
    );
    
  } catch (error) {
    console.error('Cash payment error:', error);
    res.status(500).json({ error: 'Error al procesar pago en efectivo' });
  }
});

// MÉTODO 3: PAGO SOLO POR WHATSAPP (SIN MERCADO PAGO)
app.post('/api/payment-whatsapp', auth, async (req, res) => {
  try {
    const { items, total, contactMethod } = req.body;
    
    // Validar datos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items requeridos' });
    }
    
    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Total inválido' });
    }
    
    // Generar código de pedido
    const orderCode = `WA-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Guardar la orden
    const itemsJson = JSON.stringify(items);
    db.run('INSERT INTO orders (user_id, total, payment_method, items, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, total, `WhatsApp - ${orderCode}`, itemsJson, 'pending_contact'],
      function(err) {
        if (err) {
          console.error('Error saving WhatsApp order:', err);
          return res.status(500).json({ error: 'Error al crear orden' });
        }
        
        const orderId = this.lastID;
        
        // Guardar log
        const logDetails = `Código ${orderCode} - Coordinación por WhatsApp - Total: $${total}`;
        saveLog(req.user.id, 'Orden WhatsApp creada', logDetails);
        
        // Crear mensaje para WhatsApp
        const whatsappMessage = `🛍️ *NUEVO PEDIDO - ${orderCode}*\n\n` +
          `👤 Cliente: ${req.user.username}\n` +
          `📦 Productos:\n${items.map(item => `• ${item.name} x${item.quantity || 1} - $${item.price}`).join('\n')}\n\n` +
          `💰 *Total: $${total}*\n\n` +
          `📱 El cliente se contactará para coordinar pago y entrega.`;
        
        // URL para WhatsApp Business
        const whatsappUrl = `https://wa.me/5491122549995?text=${encodeURIComponent(whatsappMessage)}`;
        
        res.json({
          success: true,
          orderId: orderId,
          orderCode: orderCode,
          status: 'pending_contact',
          message: 'Orden creada. Contacta por WhatsApp para coordinar.',
          whatsappUrl: whatsappUrl,
          whatsappNumber: '5491122549995',
          instructions: [
            '1. Haz clic en el enlace de WhatsApp',
            '2. Envía el mensaje pre-cargado',
            '3. Coordina forma de pago y entrega',
            '4. Recibirás confirmación una vez procesado'
          ]
        });
      }
    );
    
  } catch (error) {
    console.error('WhatsApp payment error:', error);
    res.status(500).json({ error: 'Error al procesar pedido por WhatsApp' });
  }
});

// ENDPOINT PARA OBTENER MÉTODOS DE PAGO DISPONIBLES
app.get('/api/payment-methods', (req, res) => {
  const methods = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Coordina pago y entrega por WhatsApp',
      icon: '📱',
      available: true,
      processing_time: 'Inmediato',
      fees: 'Sin comisión'
    },
    {
      id: 'transfer',
      name: 'Transferencia Bancaria',
      description: 'Pago por transferencia o depósito bancario',
      icon: '🏦',
      available: true,
      processing_time: '24-48 horas',
      fees: 'Sin comisión'
    },
    {
      id: 'cash',
      name: 'Efectivo en Local',
      description: 'Paga en efectivo al retirar en nuestro local',
      icon: '💵',
      available: true,
      processing_time: 'Inmediato',
      fees: 'Sin comisión'
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      description: 'Pago online con tarjeta de crédito/débito',
      icon: '💳',
      available: !!mpPayment, // Solo disponible si MP está configurado
      processing_time: 'Inmediato',
      fees: 'Comisión MP aplicable'
    }
  ];
  
  res.json({
    methods: methods,
    default_method: 'whatsapp',
    message: 'Elige el método de pago que prefieras'
  });
});

module.exports = {
  // Exportar funciones si se necesitan en otros archivos
};