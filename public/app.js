// ShopManStore App
const API = '/api';
let user = null;
let token = null;
let products = [];
let cart = [];

// Elementos DOM
const $ = id => document.getElementById(id);

// Inicializar
window.addEventListener('DOMContentLoaded', init);

function init() {
  checkAuth();
  setupEvents();
}

function checkAuth() {
  token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    user = JSON.parse(userData);
    $('loginModal').classList.add('hidden');
    $('userInfo').textContent = 'Hola, ' + user.username;
    $('userInfo').classList.remove('hidden');
    $('logoutBtn').classList.remove('hidden');
    
    if (user.role === 'admin') {
      $('adminBtn').classList.remove('hidden');
    }
    
    loadProducts();
  } else {
    $('loginModal').classList.remove('hidden');
  }
}

function setupEvents() {
  // Auth
  $('loginSubmit').onclick = handleLogin;
  $('registerSubmit').onclick = handleRegister;
  $('showRegister').onclick = () => {
    $('loginModal').classList.add('hidden');
    $('registerModal').classList.remove('hidden');
  };
  $('showLogin').onclick = () => {
    $('registerModal').classList.add('hidden');
    $('loginModal').classList.remove('hidden');
  };
  $('logoutBtn').onclick = () => {
    localStorage.clear();
    location.reload();
  };
  
  // Cart
  $('cartBtn').onclick = () => $('cartSidebar').classList.remove('translate-x-full');
  $('closeCart').onclick = () => $('cartSidebar').classList.add('translate-x-full');
  $('checkoutBtn').onclick = handleCheckout;
  
  // Admin
  $('adminBtn').onclick = () => {
    $('adminPanel').classList.remove('hidden');
    loadAdminProducts();
  };
  $('closeAdmin').onclick = () => $('adminPanel').classList.add('hidden');
  
  // Admin tabs
  $('tabProducts').onclick = () => switchTab('Products');
  $('tabUsers').onclick = () => switchTab('Users');
  $('tabLogs').onclick = () => switchTab('Logs');
  
  // Product modal
  $('addProductBtn').onclick = () => openProductModal();
  $('saveProduct').onclick = saveProduct;
  $('cancelProduct').onclick = () => $('productModal').classList.add('hidden');
  $('productImage').onchange = previewImage;
  
  // Payment
  $('payCard').onclick = showCardForm;
  $('payMP').onclick = handleMercadoPago;
  $('payWA').onclick = handleWhatsApp;
  $('cancelPayment').onclick = () => $('paymentModal').classList.add('hidden');
  
  // Card form
  $('cardForm').onsubmit = (e) => {
    e.preventDefault();
    processCardPayment();
  };
  $('cancelCard').onclick = () => {
    $('cardModal').classList.add('hidden');
    $('paymentModal').classList.remove('hidden');
  };
  
  // Format card inputs
  $('cardNumber').oninput = formatCardNumber;
  $('cardExpiry').oninput = formatExpiry;
  $('cardCVV').oninput = formatCVV;
  $('cardDNI').oninput = formatDNI;
}

// Auth
async function handleLogin() {
  const username = $('loginUser').value;
  const password = $('loginPass').value;
  
  try {
    const res = await fetch(API + '/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
    
    const data = await res.json();
    
    if (res.ok) {
      token = data.token;
      user = data.user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      checkAuth();
    } else {
      $('loginError').textContent = data.error;
      $('loginError').classList.remove('hidden');
    }
  } catch (err) {
    $('loginError').textContent = 'Error de conexión';
    $('loginError').classList.remove('hidden');
  }
}

async function handleRegister() {
  const username = $('regUser').value;
  const email = $('regEmail').value;
  const password = $('regPass').value;
  
  try {
    const res = await fetch(API + '/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, email, password})
    });
    
    const data = await res.json();
    
    if (res.ok) {
      alert('Registro exitoso');
      $('registerModal').classList.add('hidden');
      $('loginModal').classList.remove('hidden');
    } else {
      $('regError').textContent = data.error;
      $('regError').classList.remove('hidden');
    }
  } catch (err) {
    $('regError').textContent = 'Error de conexión';
    $('regError').classList.remove('hidden');
  }
}

// Products
async function loadProducts() {
  try {
    const res = await fetch(API + '/products');
    products = await res.json();
    renderProducts();
  } catch (err) {
    console.error(err);
  }
}

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

// Payment
function handleCheckout() {
  if (cart.length === 0) return alert('Carrito vacío');
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  $('paymentTotal').textContent = '$' + total.toFixed(2);
  $('cartSidebar').classList.add('translate-x-full');
  $('paymentModal').classList.remove('hidden');
}

function showCardForm() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  $('cardTotal').textContent = '$' + total.toFixed(2);
  $('paymentModal').classList.add('hidden');
  $('cardModal').classList.remove('hidden');
  
  // Clear form
  $('cardForm').reset();
}

async function processCardPayment() {
  const cardNumber = $('cardNumber').value.replace(/\s/g, '');
  const cardName = $('cardName').value;
  const cardExpiry = $('cardExpiry').value;
  const cardCVV = $('cardCVV').value;
  const cardDNI = $('cardDNI').value;
  
  // Validaciones básicas
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return alert('Número de tarjeta inválido');
  }
  
  if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
    return alert('Fecha de vencimiento inválida (MM/AA)');
  }
  
  if (cardCVV.length < 3 || cardCVV.length > 4) {
    return alert('CVV inválido');
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  try {
    const res = await fetch(API + '/orders', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
      body: JSON.stringify({
        total, 
        paymentMethod: 'Tarjeta',
        cardData: {
          lastDigits: cardNumber.slice(-4),
          cardHolder: cardName,
          dni: cardDNI
        }
      })
    });
    
    if (res.ok) {
      alert('¡Pago procesado exitosamente!');
      cart = [];
      updateCart();
      $('cardModal').classList.add('hidden');
    } else {
      alert('Error al procesar el pago');
    }
  } catch (err) {
    alert('Error de conexión');
  }
}

// Format functions
function formatCardNumber(e) {
  let value = e.target.value.replace(/\s/g, '');
  let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
  e.target.value = formatted;
}

function formatExpiry(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4);
  }
  e.target.value = value;
}

function formatCVV(e) {
  e.target.value = e.target.value.replace(/\D/g, '');
}

function formatDNI(e) {
  e.target.value = e.target.value.replace(/\D/g, '');
}

async function handleMercadoPago() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  try {
    const res = await fetch(API + '/mp-link', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
      body: JSON.stringify({items: cart, total})
    });
    
    const data = await res.json();
    
    if (res.ok && data.link) {
      window.open(data.link, '_blank');
      $('paymentModal').classList.add('hidden');
    } else {
      alert('Mercado Pago no configurado');
    }
  } catch (err) {
    alert('Error con Mercado Pago');
  }
}

function handleWhatsApp() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let msg = 'Hola! Quiero comprar:\n\n';
  cart.forEach(item => {
    msg += `${item.name} x${item.qty} - $${(item.price * item.qty).toFixed(2)}\n`;
  });
  msg += `\nTotal: $${total.toFixed(2)}`;
  
  const url = 'https://wa.me/5493764416263?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
  $('paymentModal').classList.add('hidden');
}

// Admin
function switchTab(tab) {
  ['Products', 'Users', 'Logs'].forEach(t => {
    $('section' + t).classList.add('hidden');
    $('tab' + t).classList.remove('bg-indigo-600', 'text-white');
    $('tab' + t).classList.add('bg-gray-300');
  });
  
  $('section' + tab).classList.remove('hidden');
  $('tab' + tab).classList.add('bg-indigo-600', 'text-white');
  $('tab' + tab).classList.remove('bg-gray-300');
  
  if (tab === 'Users') loadUsers();
  if (tab === 'Logs') loadLogs();
}

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


function openProductModal(productId = null) {
  if (productId) {
    const p = products.find(pr => pr.id === productId);
    $('productModalTitle').textContent = 'Editar Producto';
    $('productId').value = p.id;
    $('productName').value = p.name;
    $('productDesc').value = p.description;
    $('productPrice').value = p.price;
    $('productStock').value = p.stock || 0;
    $('productSizes').value = p.sizes || '';
    
    $('imagePreview').innerHTML = `<img src="${p.image}" class="w-full h-32 object-cover rounded">`;
  } else {
    $('productModalTitle').textContent = 'Agregar Producto';
    $('productId').value = '';
    $('productName').value = '';
    $('productDesc').value = '';
    $('productPrice').value = '';
    $('productStock').value = '0';
    $('productSizes').value = '';
    $('imagePreview').innerHTML = '';
  }
  $('productModal').classList.remove('hidden');
}

function editProduct(id) {
  openProductModal(id);
}

async function saveProduct() {
  const id = $('productId').value;
  const name = $('productName').value;
  const description = $('productDesc').value;
  const price = parseFloat($('productPrice').value);
  const stock = parseInt($('productStock').value) || 0;
  const imageFile = $('productImage').files[0];
  
  // Obtener talles ingresados (limpiar espacios)
  const sizesInput = $('productSizes').value.trim();
  const sizes = sizesInput ? sizesInput.split(',').map(s => s.trim()).filter(s => s) : [];
  
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

async function deleteProduct(id) {
  if (!confirm('¿Eliminar producto?')) return;
  
  try {
    await fetch(API + '/products/' + id, {
      method: 'DELETE',
      headers: {'Authorization': 'Bearer ' + token}
    });
    loadAdminProducts();
  } catch (err) {
    alert('Error al eliminar');
  }
}

function previewImage() {
  const file = $('productImage').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      $('imagePreview').innerHTML = `<img src="${e.target.result}" class="w-full h-32 object-cover rounded">`;
    };
    reader.readAsDataURL(file);
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function loadUsers() {
  try {
    const res = await fetch(API + '/users', {
      headers: {'Authorization': 'Bearer ' + token}
    });
    const users = await res.json();
    
    $('usersList').innerHTML = users.map(u => `
      <div class="flex justify-between p-3 bg-gray-50 rounded mb-2">
        <div>
          <p class="font-bold">${u.username}</p>
          <p class="text-sm text-gray-600">${u.email}</p>
        </div>
        <select onchange="changeRole(${u.id}, this.value)" class="border rounded px-2">
          <option value="cliente" ${u.role === 'cliente' ? 'selected' : ''}>Cliente</option>
          <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

async function changeRole(userId, role) {
  try {
    await fetch(API + '/users/' + userId + '/role', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
      body: JSON.stringify({role})
    });
  } catch (err) {
    alert('Error al cambiar rol');
  }
}

async function loadLogs() {
  try {
    const res = await fetch(API + '/logs', {
      headers: {'Authorization': 'Bearer ' + token}
    });
    const logs = await res.json();
    
    $('logsList').innerHTML = logs.map(log => `
      <div class="p-3 bg-gray-50 rounded mb-2">
        <div class="flex justify-between">
          <span class="font-bold">${log.username || 'Sistema'}</span>
          <span class="text-sm text-gray-600">${new Date(log.created_at).toLocaleString()}</span>
        </div>
        <p class="text-sm">${log.action}: ${log.details}</p>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}


// Función para ampliar imagen
function zoomImage(imageSrc) {
  $('zoomedImage').src = imageSrc;
  $('imageZoomModal').classList.remove('hidden');
}

function closeImageZoom() {
  $('imageZoomModal').classList.add('hidden');
}
