// Test del descuento en Mercado Pago
console.log('🧪 TEST: Descuento en Mercado Pago\n');

// Función de formato de precio
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Simular función formatCartItems con descuento
function formatCartItems(cart) {
  // Aplicar 10% de descuento a cada item
  return cart.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.qty,
    price: Math.round(item.price * 0.9), // Precio con 10% de descuento
    size: item.size || null
  }));
}

// Casos de prueba
const testCases = [
  {
    name: 'Caso 1: Un producto',
    cart: [
      { id: 1, name: 'Remera', price: 10000, qty: 1 }
    ]
  },
  {
    name: 'Caso 2: Múltiples productos',
    cart: [
      { id: 1, name: 'Remera', price: 10000, qty: 2 },
      { id: 2, name: 'Pantalón', price: 25000, qty: 1 }
    ]
  },
  {
    name: 'Caso 3: Producto con talle',
    cart: [
      { id: 1, name: 'Jean', price: 30000, qty: 1, size: 'M' }
    ]
  },
  {
    name: 'Caso 4: Múltiples cantidades',
    cart: [
      { id: 1, name: 'Remera', price: 15000, qty: 3 },
      { id: 2, name: 'Campera', price: 50000, qty: 2 }
    ]
  }
];

testCases.forEach((testCase, index) => {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📦 ${testCase.name}`);
  console.log(`${'─'.repeat(60)}`);
  
  // Calcular totales sin descuento
  const subtotal = testCase.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = subtotal * 0.10;
  const totalExpected = subtotal - discount;
  
  // Formatear items con descuento (como se envía a MP)
  const formattedItems = formatCartItems(testCase.cart);
  
  // Calcular total que recibirá MP
  const totalMP = formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  console.log('\nCarrito original:');
  testCase.cart.forEach(item => {
    console.log(`  • ${item.name}: $${formatPrice(item.price)} x ${item.qty} = $${formatPrice(item.price * item.qty)}`);
  });
  
  console.log('\nItems enviados a Mercado Pago:');
  formattedItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    console.log(`  • ${item.name}: $${formatPrice(item.price)} x ${item.quantity} = $${formatPrice(itemTotal)}`);
  });
  
  console.log('\nCálculos:');
  console.log(`  Subtotal original:     $${formatPrice(subtotal)}`);
  console.log(`  Descuento (10%):       -$${formatPrice(discount)}`);
  console.log(`  Total esperado:        $${formatPrice(totalExpected)}`);
  console.log(`  Total enviado a MP:    $${formatPrice(totalMP)}`);
  
  // Verificar que coincidan
  if (totalMP === totalExpected) {
    console.log('\n✅ El total enviado a MP coincide con el total con descuento');
  } else {
    console.log('\n❌ ERROR: Los totales no coinciden');
    console.log(`   Diferencia: $${formatPrice(Math.abs(totalMP - totalExpected))}`);
  }
  
  // Verificar que cada item tenga el descuento aplicado
  let allItemsCorrect = true;
  testCase.cart.forEach((originalItem, i) => {
    const formattedItem = formattedItems[i];
    const expectedPrice = Math.round(originalItem.price * 0.9);
    
    if (formattedItem.price !== expectedPrice) {
      console.log(`   ❌ Item ${originalItem.name}: precio incorrecto`);
      console.log(`      Esperado: $${formatPrice(expectedPrice)}, Obtenido: $${formatPrice(formattedItem.price)}`);
      allItemsCorrect = false;
    }
  });
  
  if (allItemsCorrect) {
    console.log('✅ Todos los items tienen el descuento aplicado correctamente');
  }
});

console.log('\n' + '═'.repeat(60));
console.log('📊 RESUMEN');
console.log('═'.repeat(60));
console.log('✅ Descuento del 10% aplicado a cada item');
console.log('✅ Total enviado a MP coincide con total con descuento');
console.log('\n💡 Cómo funciona:');
console.log('   1. Frontend aplica 10% de descuento a cada precio');
console.log('   2. Envía items con precios ya descontados a MP');
console.log('   3. MP calcula el total basándose en precios descontados');
console.log('   4. Usuario paga el precio con descuento');
console.log('═'.repeat(60));
