// AGREGAR ESTAS FUNCIONES AL FINAL DE app.js

// Función para ampliar imagen
function zoomImage(imageSrc) {
  $('zoomedImage').src = imageSrc;
  $('imageZoomModal').classList.remove('hidden');
}

function closeImageZoom() {
  $('imageZoomModal').classList.add('hidden');
}

// REEMPLAZAR la función renderProducts() existente con esta:
/*
function renderProducts() {
  const grid = $('productsGrid');
  grid.innerHTML = products.map(p => {
    const sizes = p.sizes ? p.sizes.split(',').filter(s => s) : [];
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
*/

// REEMPLAZAR la función openProductModal() existente con esta:
/*
function openProductModal(productId = null) {
  if (productId) {
    const p = products.find(pr => pr.id === productId);
    $('productModalTitle').textContent = 'Editar Producto';
    $('productId').value = p.id;
    $('productName').value = p.name;
    $('productDesc').value = p.description;
    $('productPrice').value = p.price;
    $('productStock').value = p.stock || 0;
    
    // Marcar talles
    const sizes = p.sizes ? p.sizes.split(',') : [];
    document.querySelectorAll('.size-checkbox').forEach(cb => {
      cb.checked = sizes.includes(cb.value);
    });
    
    $('imagePreview').innerHTML = `<img src="${p.image}" class="w-full h-32 object-cover rounded">`;
  } else {
    $('productModalTitle').textContent = 'Agregar Producto';
    $('productId').value = '';
    $('productName').value = '';
    $('productDesc').value = '';
    $('productPrice').value = '';
    $('productStock').value = '0';
    document.querySelectorAll('.size-checkbox').forEach(cb => cb.checked = false);
    $('imagePreview').innerHTML = '';
  }
  $('productModal').classList.remove('hidden');
}
*/

// REEMPLAZAR la función saveProduct() existente con esta:
/*
async function saveProduct() {
  const id = $('productId').value;
  const name = $('productName').value;
  const description = $('productDesc').value;
  const price = parseFloat($('productPrice').value);
  const stock = parseInt($('productStock').value) || 0;
  const imageFile = $('productImage').files[0];
  
  // Obtener talles seleccionados
  const sizes = Array.from(document.querySelectorAll('.size-checkbox:checked')).map(cb => cb.value);
  
  let image = null;
  if (imageFile) {
    image = await fileToBase64(imageFile);
  } else if (id) {
    image = products.find(p => p.id == id).image;
  }
  
  const url = id ? API + '/products/' + id : API + '/products';
  const method = id ? 'PUT' : 'POST';
  
  try {
    await fetch(url, {
      method,
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
      body: JSON.stringify({name, description, price, image, sizes, stock})
    });
    
    $('productModal').classList.add('hidden');
    loadAdminProducts();
  } catch (err) {
    alert('Error al guardar');
  }
}
*/

// REEMPLAZAR la función loadAdminProducts() existente con esta:
/*
async function loadAdminProducts() {
  await loadProducts();
  $('productsList').innerHTML = products.map(p => {
    const sizes = p.sizes ? p.sizes.split(',').filter(s => s) : [];
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
*/
