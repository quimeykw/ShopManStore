// ACTUALIZACIÓN: TALLES SELECCIONABLES
// Copia y pega estas funciones en public/app.js

// 1. REEMPLAZA la función renderProducts() con esta:

function renderProducts() {
  const grid = $('productsGrid');
  grid.innerHTML = products.map(p => {
    const sizes = p.sizes ? p.sizes.split(',').map(s => s.trim()).filter(s => s) : [];
    const stock = p.stock || 0;
    const outOfStock = stock === 0;
    
    return `
    <div class="bg-white rounded-lg shadow p-4">
      <img src="${p.image}" onclick="zoomImage('${p.image}')" class="w-full h-48 object-cover rounded mb-3 cursor-pointer hover:opacity-90 transition">
      <h3 class="font-bold mb-2">${p.name}</h3>
      <p class="text-sm text-gray-600 mb-2">${p.description}</p>
      
      ${sizes.length > 0 ? `
        <div class="mb-2">
          <label class="text-xs text-gray-600 block mb-1"><i class="fas fa-ruler mr-1"></i>Selecciona talle:</label>
          <select id="size-${p.id}" class="w-full p-1 border rounded text-sm">
            <option value="">Elegir talle</option>
            ${sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
          </select>
        </div>
      ` : ''}
      
      <p class="text-xs ${outOfStock ? 'text-red-600' : 'text-green-600'} mb-3">
        <i class="fas fa-box mr-1"></i>${outOfStock ? 'Sin stock' : `Stock: ${stock}`}
      </p>
      <div class="flex justify-between items-center">
        <span class="text-xl font-bold text-indigo-600">$${p.price}</span>
        <button onclick="addToCart(${p.id})" ${outOfStock ? 'disabled' : ''} 
                class="bg-indigo-600 text-white px-3 py-1 rounded ${outOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}">
          <i class="fas fa-cart-plus"></i>
        </button>
      </div>
    </div>
  `;
  }).join('');
}

// 2. REEMPLAZA la función addToCart() con esta:

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  // Verificar si tiene talles y si se seleccionó uno
  const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(s => s) : [];
  let selectedSize = '';
  
  if (sizes.length > 0) {
    const sizeSelect = document.getElementById(`size-${productId}`);
    selectedSize = sizeSelect ? sizeSelect.value : '';
    
    if (!selectedSize) {
      alert('Por favor selecciona un talle');
      return;
    }
  }
  
  const existing = cart.find(item => item.id === productId && item.size === selectedSize);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: productId, 
      name: product.name, 
      price: product.price, 
      image: product.image, 
      size: selectedSize,
      qty: 1
    });
  }
  
  updateCart();
  $('cartSidebar').classList.remove('translate-x-full');
}

// 3. REEMPLAZA la función updateCart() con esta:

function updateCart() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  $('cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  $('cartTotal').textContent = '$' + total.toFixed(2);
  
  $('cartItems').innerHTML = cart.map(item => `
    <div class="flex gap-3 mb-3 pb-3 border-b">
      <img src="${item.image}" class="w-16 h-16 object-cover rounded">
      <div class="flex-1">
        <p class="font-bold">${item.name}</p>
        ${item.size ? `<p class="text-xs text-gray-500">Talle: ${item.size}</p>` : ''}
        <p class="text-sm text-gray-600">$${item.price}</p>
        <div class="flex gap-2 mt-1">
          <button onclick="changeQty(${item.id}, '${item.size}', -1)" class="bg-gray-200 px-2 rounded">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, '${item.size}', 1)" class="bg-gray-200 px-2 rounded">+</button>
        </div>
      </div>
      <span class="font-bold">$${(item.price * item.qty).toFixed(2)}</span>
    </div>
  `).join('');
}

// 4. REEMPLAZA la función changeQty() con esta:

function changeQty(productId, size, delta) {
  const item = cart.find(i => i.id === productId && i.size === size);
  if (!item) return;
  
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => !(i.id === productId && i.size === size));
  }
  
  updateCart();
}
