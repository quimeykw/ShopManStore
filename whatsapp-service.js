// Servicio de notificaciones WhatsApp para compras
require('dotenv').config();

const WHATSAPP_PHONE = process.env.WHATSAPP_PHONE || '5491122549995';
const WHATSAPP_ENABLED = process.env.WHATSAPP_ENABLED !== 'false'; // Habilitado por defecto

/**
 * Formatea el mensaje de compra para WhatsApp
 * @param {Object} orderData - Datos de la orden
 * @param {number} orderData.orderId - ID de la orden
 * @param {Array} orderData.items - Items comprados [{name, quantity, price, size}]
 * @param {number} orderData.total - Total de la compra
 * @param {string} orderData.paymentMethod - Método de pago
 * @param {string} orderData.username - Nombre del usuario
 * @param {Date} orderData.timestamp - Fecha/hora de la compra
 * @returns {string} - Mensaje formateado para WhatsApp
 */
function formatPurchaseMessage(orderData) {
  const { orderId, items, total, paymentMethod, username, timestamp } = orderData;
  
  // Formatear fecha
  const date = timestamp || new Date();
  const dateStr = date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const timeStr = date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Construir mensaje
  let message = '🛍️ *COMPRA CONFIRMADA*\n\n';
  message += `📦 *Orden #${orderId}*\n`;
  message += `👤 Cliente: ${username}\n`;
  message += `📅 Fecha: ${dateStr} ${timeStr}\n\n`;
  message += '*Productos:*\n';
  
  // Listar productos
  items.forEach(item => {
    const size = item.size ? ` (${item.size})` : '';
    const priceFormatted = formatPrice(item.price * item.quantity);
    message += `• ${item.name}${size} x${item.quantity} - $${priceFormatted}\n`;
  });
  
  message += `\n💰 *Total: $${formatPrice(total)}*\n`;
  message += `💳 Método: ${paymentMethod}\n\n`;
  message += '¡Gracias por tu compra! 🎉';
  
  return message;
}

/**
 * Formatea precio con separadores de miles
 * @param {number} price - Precio a formatear
 * @returns {string} - Precio formateado
 */
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Envía notificación de compra por WhatsApp
 * @param {Object} orderData - Datos de la orden
 * @returns {Promise<boolean>} - true si se envió exitosamente
 */
async function sendPurchaseNotification(orderData) {
  if (!WHATSAPP_ENABLED) {
    console.log('📱 WhatsApp deshabilitado - notificación no enviada');
    return false;
  }
  
  try {
    const message = formatPurchaseMessage(orderData);
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    
    // Por ahora, solo logueamos el mensaje y la URL
    // En producción, aquí se integraría con una API de WhatsApp Business
    console.log('📱 Notificación WhatsApp preparada:');
    console.log('   URL:', url);
    console.log('   Mensaje:', message);
    
    // Simular envío exitoso
    // TODO: Integrar con API real de WhatsApp (Twilio, WhatsApp Business API, etc.)
    return true;
  } catch (error) {
    console.error('❌ Error al preparar notificación WhatsApp:', error.message);
    throw error;
  }
}

/**
 * Obtiene la URL de WhatsApp para abrir en el navegador
 * @param {Object} orderData - Datos de la orden
 * @returns {string} - URL de WhatsApp
 */
function getWhatsAppUrl(orderData) {
  const message = formatPurchaseMessage(orderData);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

module.exports = {
  sendPurchaseNotification,
  formatPurchaseMessage,
  getWhatsAppUrl,
  WHATSAPP_ENABLED,
  WHATSAPP_PHONE
};
