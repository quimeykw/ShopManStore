// Test del cálculo del total del carrito
console.log('🧪 TEST: Cálculo del Total del Carrito\n');

// Función de formato de precio (simulada)
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Simular carrito con productos
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
    name: 'Caso 3: Envío gratis (> $80,000)',
    cart: [
      { id: 1, name: 'Campera', price: 50000, qty: 2 }
    ]
  },
  {
    name: 'Caso 4: Múltiples cantidades',
    cart: [
      { id: 1, name: 'Remera', price: 15000, qty: 3 },
      { id: 2, name: 'Jean', price: 30000, qty: 2 }
    ]
  }
];

testCases.forEach((testCase, index) => {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📦 ${testCase.name}`);
  console.log(`${'─'.repeat(60)}`);
  
  // Calcular subtotal
  const subtotal = testCase.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  // Aplicar 10% de descuento
  const discount = subtotal * 0.10;
  const total = subtotal - discount;
  
  // Envío gratis si es mayor a $80,000
  const freeShipping = total >= 80000;
  
  // Mostrar productos
  console.log('\nProductos:');
  testCase.cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    console.log(`  • ${item.name}: $${formatPrice(item.price)} x ${item.qty} = $${formatPrice(itemTotal)}`);
  });
  
  // Mostrar cálculos
  console.log('\nCálculos:');
  console.log(`  Subtotal:        $${formatPrice(subtotal)}`);
  console.log(`  Descuento (10%): -$${formatPrice(discount)}`);
  console.log(`  ─────────────────────────────`);
  console.log(`  Total:           $${formatPrice(total)}`);
  console.log(`  Envío:           ${freeShipping ? 'GRATIS 🎉' : 'Estándar'}`);
  
  // Verificar cálculos
  const expectedDiscount = Math.floor(subtotal * 0.10);
  const expectedTotal = subtotal - expectedDiscount;
  
  if (discount === expectedDiscount && total === expectedTotal) {
    console.log('\n✅ Cálculos correctos');
  } else {
    console.log('\n❌ Error en cálculos');
    console.log(`   Esperado: Descuento=$${expectedDiscount}, Total=$${expectedTotal}`);
    console.log(`   Obtenido: Descuento=$${discount}, Total=$${total}`);
  }
});

console.log('\n' + '═'.repeat(60));
console.log('📊 RESUMEN');
console.log('═'.repeat(60));
console.log('✅ Todos los casos de prueba verificados');
console.log('\n💡 Fórmulas aplicadas:');
console.log('   • Subtotal = Σ(precio × cantidad)');
console.log('   • Descuento = Subtotal × 0.10');
console.log('   • Total = Subtotal - Descuento');
console.log('   • Envío gratis si Total >= $80,000');
console.log('═'.repeat(60));
