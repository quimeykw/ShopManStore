// REEMPLAZA ESTAS DOS FUNCIONES EN public/app.js

// 1. Busca la función renderProducts() (línea ~172) y reemplázala con esta:

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
      ${sizes.length > 0 ? `<p class="text-xs text-gray-500 mb-1"><i class="fas fa-ruler mr-1"></i>Talles: ${sizes.join(', ')}</p>` : ''}
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

// 2. Busca la función loadAdminProducts() (línea ~382) y reemplázala con esta:

async function loadAdminProducts() {
  await loadProducts();
  $('productsList').innerHTML = products.map(p => {
    const sizes = p.sizes ? p.sizes.split(',').map(s => s.trim()).filter(s => s) : [];
    const stock = p.stock || 0;
    return `
    <div class="flex gap-3 p-3 bg-gray-50 rounded mb-2">
      <img src="${p.image}" onclick="zoomImage('${p.image}')" class="w-16 h-16 object-cover rounded cursor-pointer">
      <div class="flex-1">
        <p class="font-bold">${p.name}</p>
        <p class="text-sm text-gray-600">$${p.price}</p>
        ${sizes.length > 0 ? `<p class="text-xs text-gray-500">Talles: ${sizes.join(', ')}</p>` : ''}
        <p class="text-xs ${stock === 0 ? 'text-red-600' : 'text-green-600'}">Stock: ${stock}</p>
      </div>
      <div class="flex gap-2">
        <button onclick="editProduct(${p.id})" class="bg-blue-600 text-white px-3 py-1 rounded">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteProduct(${p.id})" class="bg-red-600 text-white px-3 py-1 rounded">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;
  }).join('');
}
