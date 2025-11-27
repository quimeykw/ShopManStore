// Verificación rápida del arreglo del carrito
console.log('🔍 VERIFICACIÓN: Arreglo del Total del Carrito\n');

const fs = require('fs');

let checks = 0;
let passed = 0;

function check(name, condition) {
  checks++;
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
  }
}

// Verificar HTML
console.log('📄 Verificando HTML...');
const html = fs.readFileSync('public/index.html', 'utf8');

check('Elemento cartSubtotalDisplay existe', html.includes('id="cartSubtotalDisplay"'));
check('Elemento cartDiscountDisplay existe', html.includes('id="cartDiscountDisplay"'));
check('Elemento cartShippingDisplay existe', html.includes('id="cartShippingDisplay"'));
check('Texto "Subtotal:" presente', html.includes('Subtotal:'));
check('Texto "Descuento (10%):" presente', html.includes('Descuento (10%):'));
check('Texto "Envío:" presente', html.includes('Envío:'));
check('Altura del carrito ajustada', html.includes('height: calc(100% - 280px)'));

// Verificar JavaScript
console.log('\n📜 Verificando JavaScript...');
const js = fs.readFileSync('public/app.js', 'utf8');

check('Actualiza cartSubtotalDisplay', js.includes("$('cartSubtotalDisplay').textContent"));
check('Actualiza cartDiscountDisplay', js.includes("$('cartDiscountDisplay').textContent"));
check('Actualiza cartShippingDisplay', js.includes("$('cartShippingDisplay').textContent"));
check('Muestra "GRATIS 🎉" cuando aplica', js.includes("'GRATIS 🎉'"));
check('Aplica clase verde para envío gratis', js.includes("'text-green-600 font-bold'"));
check('Calcula descuento del 10%', js.includes('subtotal * 0.10'));
check('Verifica envío gratis >= 80000', js.includes('>= 80000'));

// Verificar sintaxis
console.log('\n🔍 Verificando sintaxis...');
try {
  const hasBalancedBraces = (js.match(/{/g) || []).length === (js.match(/}/g) || []).length;
  check('Llaves balanceadas', hasBalancedBraces);
  
  const hasBalancedParens = (js.match(/\(/g) || []).length === (js.match(/\)/g) || []).length;
  check('Paréntesis balanceados', hasBalancedParens);
  
  const hasBalancedBrackets = (js.match(/\[/g) || []).length === (js.match(/\]/g) || []).length;
  check('Corchetes balanceados', hasBalancedBrackets);
} catch (e) {
  console.log(`❌ Error al verificar sintaxis: ${e.message}`);
}

// Resumen
console.log('\n' + '═'.repeat(60));
console.log('📊 RESUMEN');
console.log('═'.repeat(60));
console.log(`Total de verificaciones: ${checks}`);
console.log(`✅ Pasadas: ${passed}`);
console.log(`❌ Falladas: ${checks - passed}`);

if (passed === checks) {
  console.log('\n🎉 ¡TODAS LAS VERIFICACIONES PASARON!');
  console.log('\n✨ El carrito está correctamente configurado para mostrar:');
  console.log('   • Subtotal');
  console.log('   • Descuento (10%)');
  console.log('   • Información de envío');
  console.log('   • Total final');
  console.log('\n💡 Próximo paso: Probar en el navegador');
  process.exit(0);
} else {
  console.log('\n⚠️  Algunas verificaciones fallaron');
  console.log('   Revisa los errores marcados arriba');
  process.exit(1);
}
