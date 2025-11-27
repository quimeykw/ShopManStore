// Script de debug para ver qué se envía a Mercado Pago
console.log('🔍 DEBUG: Request a Mercado Pago\n');

// Simular carrito
const cart = [
  { id: 1, name: 'Remera', price: 10000, qty: 2 },
  { id: 2, name: 'Pantalón', price: 25000, qty: 1 }
];

console.log('📦 CARRITO ORIGINAL:');
console.log('─'.repeat(60));
cart.forEach(item => {
  console.log(`${item.name}: $${item.price.toLocaleString()} x ${item.qty} = $${(item.price * item.qty).toLocaleString()}`);
});

const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
const discount = subtotal * 0.10;
const total = subtotal - discount;

console.log(`\nSubtotal: $${subtotal.toLocaleString()}`);
console.log(`Descuento (10%): -$${discount.toLocaleString()}`);
console.log(`Total: $${total.toLocaleString()}`);

// Simular formatCartItems
function formatCartItems(cart) {
  return cart.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.qty,
    price: Math.round(item.price * 0.9),
    size: item.size || null
  }));
}

const formattedItems = formatCartItems(cart);

console.log('\n📤 ITEMS ENVIADOS AL BACKEND:');
console.log('─'.repeat(60));
console.log(JSON.stringify(formattedItems, null, 2));

// Simular lo que el backend envía a MP
const mpRequest = {
  items: formattedItems.map(item => ({
    title: item.name,
    quantity: item.quantity,
    unit_price: Number(item.price),
    currency_id: 'ARS'
  })),
  payer: {
    email: 'test@shopmanstore.com'
  },
  external_reference: `order_${Date.now()}`,
  statement_descriptor: 'ShopManStore'
};

console.log('\n📨 REQUEST A MERCADO PAGO:');
console.log('─'.repeat(60));
console.log(JSON.stringify(mpRequest, null, 2));

// Calcular total que verá MP
const mpTotal = mpRequest.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

console.log('\n💰 TOTALES:');
console.log('─'.repeat(60));
console.log(`Total esperado (frontend): $${total.toLocaleString()}`);
console.log(`Total que calculará MP:    $${mpTotal.toLocaleString()}`);

if (mpTotal === total) {
  console.log('\n✅ Los totales coinciden!');
} else {
  console.log('\n❌ ERROR: Los totales NO coinciden');
  console.log(`   Diferencia: $${Math.abs(mpTotal - total).toLocaleString()}`);
}

console.log('\n' + '═'.repeat(60));
console.log('💡 VERIFICACIÓN:');
console.log('═'.repeat(60));

formattedItems.forEach((item, i) => {
  const original = cart[i];
  const expectedPrice = Math.round(original.price * 0.9);
  const itemTotal = item.price * item.quantity;
  
  console.log(`\n${item.name}:`);
  console.log(`  Precio original:  $${original.price.toLocaleString()}`);
  console.log(`  Precio con desc:  $${item.price.toLocaleString()} (${item.price === expectedPrice ? '✅' : '❌'})`);
  console.log(`  Cantidad:         ${item.quantity}`);
  console.log(`  Total item:       $${itemTotal.toLocaleString()}`);
});

console.log('\n' + '═'.repeat(60));
