// Script de prueba para verificar el formateo de logs
require('dotenv').config();

// Simular la función formatPurchaseLog del servidor
const formatPurchaseLog = (items, total, paymentMethod) => {
  if (!items || items.length === 0) {
    return `Método: ${paymentMethod}, Total: $${total}`;
  }
  
  // Formatear lista de productos
  const productList = items.map(item => {
    const size = item.size ? ` (${item.size})` : '';
    return `${item.name}${size} x${item.quantity}`;
  }).join(', ');
  
  // Calcular total de productos
  const totalProducts = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return `Productos: ${productList} | Total productos: ${totalProducts} | Método: ${paymentMethod} | Total: $${total}`;
};

console.log('🧪 Probando formateo de logs de compra...\n');

// Caso 1: Compra con múltiples productos
const items1 = [
  { name: 'Remera Negra', quantity: 2, price: 5000, size: 'M' },
  { name: 'Jean Azul', quantity: 1, price: 12000, size: 'L' },
  { name: 'Zapatillas', quantity: 1, price: 8000, size: '42' }
];

console.log('📋 Caso 1: Compra con 3 productos diferentes');
console.log('Log:', formatPurchaseLog(items1, 28000, 'Mercado Pago'));
console.log('\n---\n');

// Caso 2: Compra con un solo producto
const items2 = [
  { name: 'Remera Blanca', quantity: 1, price: 4500, size: 'S' }
];

console.log('📋 Caso 2: Compra con 1 producto');
console.log('Log:', formatPurchaseLog(items2, 4500, 'Tarjeta'));
console.log('\n---\n');

// Caso 3: Compra sin items (legacy)
console.log('📋 Caso 3: Orden legacy sin items');
console.log('Log:', formatPurchaseLog([], 10000, 'WhatsApp'));
console.log('\n---\n');

// Caso 4: Productos sin talle
const items4 = [
  { name: 'Gorra', quantity: 2, price: 3000 },
  { name: 'Medias', quantity: 3, price: 1500 }
];

console.log('📋 Caso 4: Productos sin talle especificado');
console.log('Log:', formatPurchaseLog(items4, 10500, 'Mercado Pago'));

console.log('\n✅ Prueba de formateo completada');
