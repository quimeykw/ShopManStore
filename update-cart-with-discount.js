// Nueva función updateCart con descuento del 10% y envío gratis para compras mayores a $80,000

function updateCart() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  // Aplicar 10% de descuento
  const discount = subtotal * 0.10;
  const totalWithDiscount = subtotal - discount;
  
  // Envío gratis si es mayor a $80,000
  const freeShipping = totalWithDiscount >= 80000;
  
  $('cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  
  // Mostrar desglose de precios
  let priceBreakdown = `
    <div class="bg-gray-50 p-3 rounded mb-3">
      <div class="flex justify-between text-sm mb-1">
        <span>Subtotal:</span>
        <span>$${formatPrice(subtotal)}</span>
      </div>
      <div class="flex justify-between text-sm mb-1 text-green-600 font-semibold">
        <span>✨ Descuento (10%):</span>
        <span>-$${formatPrice(discount)}</span>
      </div>
      ${freeShipping ? `
        <div class="flex justify-between text-sm mb-1 text-green-600 font-semibold">
          <span>🚚 Envío gratis:</span>
          <span>$0</span>
        </div>
      ` : `
        <div class="flex justify-between text-sm mb-1 text-gray-600">
          <span>📦 Envío:</span>
          <span class="text-xs">Gratis en compras +$80,000</span>
        </div>
      `}
      <div class="flex justify-between font-bold text-lg border-t pt-2 mt-2">
        <span>Total:</span>
        <span class="text-indigo-600">$${formatPrice(totalWithDiscount)}</span>
      </div>
    </div>
  `;
  
  $('cartItems').innerHTML = cart.map(item => `
    <div class="flex gap-3 mb-3 pb-3 border-b">
      <img src="${item.image}" class="w-16 h-16 object-cover rounded">
      <div class="flex-1">
        <p class="font-bold">${item.name}</p>
        ${item.size ? `<p class="text-xs text-gray-500">Talle: ${item.size}</p>` : ''}
        <p class="text-sm text-gray-600">$${formatPrice(item.price)}</p>
        <div class="flex gap-2 mt-1">
          <button onclick="changeQty(${item.id}, '${item.size}', -1)" class="bg-gray-200 px-2 rounded">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, '${item.size}', 1)" class="bg-gray-200 px-2 rounded">+</button>
        </div>
      </div>
      <span class="font-bold">$${formatPrice(item.price * item.qty)}</span>
    </div>
  `).join('') + priceBreakdown;
  
  // Guardar el total con descuento para usar en checkout
  window.cartTotal = totalWithDiscount;
  window.cartSubtotal = subtotal;
  window.cartDiscount = discount;
  window.freeShipping = freeShipping;
}
