// ShopManStore App
const API = '/api';
let user = null;
let token = null;
let products = [];
let cart = [];

// Image Gallery Component
class ImageGallery {
  constructor(productId, images) {
    this.productId = productId;
    this.images = images || [];
    this.currentIndex = 0;
  }
  
  render() {
    if (this.images.length === 0) {
      return '<img src="/placeholder.jpg" class="w-full h-48 object-cover rounded mb-3">';
    }
    
    const mainImage = this.images[this.currentIndex];
    const hasMultiple = this.images.length > 1;
    
    return `
      <div class="relative mb-3">
        <img src="${mainImage}" 
             loading="lazy"
             onclick="openImageZoom(${this.productId}, ${this.currentIndex})" 
             class="w-full h-48 object-cover rounded cursor-pointer hover:opacity-90 transition">
        
        ${hasMultiple ? `
          <!-- Navigation arrows -->
          <button onclick="galleryPrev(${this.productId}); event.stopPropagation();" 
                  class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button onclick="galleryNext(${this.productId}); event.stopPropagation();" 
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70">
            <i class="fas fa-chevron-right"></i>
          </button>
          
          <!-- Indicators -->
          <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            ${this.images.map((_, i) => `
              <button onclick="galleryGoTo(${this.productId}, ${i}); event.stopPropagation();" 
                      class="w-2 h-2 rounded-full ${i === this.currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'}">
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
      
      ${hasMultiple ? `
        <!-- Thumbnails -->
        <div class="flex gap-2 mb-3 overflow-x-auto">
          ${this.images.map((img, i) => `
            <img src="${img}" 
                 loading="lazy"
                 onclick="galleryGoTo(${this.productId}, ${i})" 
                 class="w-16 h-16 object-cover rounded cursor-pointer ${i === this.currentIndex ? 'ring-2 ring-indigo-600' : 'opacity-60 hover:opacity-100'} transition">
          `).join('')}
        </div>
      ` : ''}
    `;
  }
  
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateDisplay();
  }
  
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateDisplay();
  }
  
  goTo(index) {
    this.currentIndex = index;
    this.updateDisplay();
  }
  
  updateDisplay() {
    // Re-render the product card
    renderProducts();
  }
}

// Gallery instances
const galleries = {};

// Touch Handler for swipe gestures
class TouchHandler {
  constructor(element, onSwipeLeft, onSwipeRight) {
    this.element = element;
    this.onSwipeLeft = onSwipeLeft;
    this.onSwipeRight = onSwipeRight;
    this.startX = 0;
    this.startY = 0;
    this.minSwipeDistance = 50;
    
    element.addEventListener('touchstart', this.handleStart.bind(this), { passive: true });
    element.addEventListener('touchend', this.handleEnd.bind(this), { passive: true });
  }
  
  handleStart(e) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  }
  
  handleEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = this.startX - endX;
    const diffY = this.startY - endY;
    
    // Detectar swipe horizontal (más horizontal que vertical)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.minSwipeDistance) {
      if (diffX > 0) {
        // Swipe left (next image)
        this.onSwipeLeft();
      } else {
        // Swipe right (previous image)
        this.onSwipeRight();
      }
    }
  }
}

// Elementos DOM
const $ = id => document.getElementById(id);

// Helper function to get product images with error handling
function getProductImages(product) {
  try {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    
    if (typeof product.images === 'string') {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    
    // Fallback to single image field
    if (product.image) {
      return [product.image];
    }
    
    // Return placeholder
    return ['/placeholder.jpg'];
  } catch (e) {
    console.error('Error parsing product images:', e);
    return product.image ? [product.image] : ['/placeholder.jpg'];
  }
}

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
  $('productImages').onchange = previewImages;
  
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
    
    // Crear galería para este producto
    const images = getProductImages(p);
    galleries[p.id] = new ImageGallery(p.id, images);
    
    return `
    <div class="bg-white rounded-lg shadow p-4">
      ${galleries[p.id].render()}
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
    const images = getProductImages(p);
    const imageCount = images.length;
    return `
    <div class="flex gap-3 p-3 bg-gray-50 rounded mb-2">
      <div class="relative">
        <img src="${images[0] || p.image}" onclick="zoomImage('${images[0] || p.image}')" class="w-16 h-16 object-cover rounded cursor-pointer">
        ${imageCount > 1 ? `<span class="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">${imageCount}</span>` : ''}
      </div>
      <div class="flex-1">
        <p class="font-bold">${p.name}</p>
        <p class="text-sm text-gray-600">$${p.price}</p>
        ${sizes.length > 0 ? `<p class="text-xs text-gray-500">Talles: ${sizes.join(', ')}</p>` : ''}
        <p class="text-xs ${stock === 0 ? 'text-red-600' : 'text-green-600'}">Stock: ${stock}</p>
        ${imageCount > 1 ? `<p class="text-xs text-blue-600"><i class="fas fa-images mr-1"></i>${imageCount} imágenes</p>` : ''}
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
    
    // Cargar imágenes existentes
    currentImages = getProductImages(p);
    updateImagePreview();
  } else {
    $('productModalTitle').textContent = 'Agregar Producto';
    $('productId').value = '';
    $('productName').value = '';
    $('productDesc').value = '';
    $('productPrice').value = '';
    $('productStock').value = '0';
    $('productSizes').value = '';
    currentImages = [];
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
  
  // Obtener talles ingresados (limpiar espacios)
  const sizesInput = $('productSizes').value.trim();
  const sizes = sizesInput ? sizesInput.split(',').map(s => s.trim()).filter(s => s) : [];
  
  // Usar currentImages que ya contiene las imágenes (existentes + nuevas)
  if (currentImages.length === 0) {
    alert('Debes agregar al menos una imagen');
    return;
  }
  
  if (currentImages.length > 5) {
    alert('Máximo 5 imágenes permitidas');
    return;
  }
  
  const url = id ? API + '/products/' + id : API + '/products';
  const method = id ? 'PUT' : 'POST';
  
  try {
    await fetch(url, {
      method,
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
      body: JSON.stringify({
        name, 
        description, 
        price, 
        images: currentImages,
        image: currentImages[0], // Mantener compatibilidad
        sizes, 
        stock
      })
    });
    
    $('productModal').classList.add('hidden');
    currentImages = [];
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

// Variable global para almacenar imágenes actuales
let currentImages = [];

async function handleMultipleImages(files) {
  const images = [];
  for (const file of files) {
    if (file.size > 2 * 1024 * 1024) {
      alert(`La imagen ${file.name} excede 2MB`);
      continue;
    }
    // TODO: Consider adding image compression here before converting to base64
    // This would reduce storage size and improve load times
    const base64 = await fileToBase64(file);
    images.push(base64);
  }
  return images;
}

async function previewImages() {
  const files = $('productImages').files;
  
  if (files.length > 5) {
    alert('Máximo 5 imágenes permitidas');
    $('productImages').value = '';
    return;
  }
  
  currentImages = await handleMultipleImages(files);
  updateImagePreview();
}

function updateImagePreview() {
  const preview = $('imagePreview');
  preview.innerHTML = currentImages.map((img, index) => `
    <div class="relative group">
      <img src="${img}" class="w-full h-24 object-cover rounded">
      
      <!-- Botón eliminar -->
      <button type="button" onclick="removeImage(${index})" 
              class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700">
        <i class="fas fa-times text-xs"></i>
      </button>
      
      <!-- Botones de reordenamiento -->
      <div class="absolute bottom-1 left-1 flex gap-1">
        ${index > 0 ? `
          <button type="button" onclick="moveImageLeft(${index})" 
                  class="bg-blue-600 text-white rounded w-6 h-6 flex items-center justify-center hover:bg-blue-700">
            <i class="fas fa-arrow-left text-xs"></i>
          </button>
        ` : ''}
        ${index < currentImages.length - 1 ? `
          <button type="button" onclick="moveImageRight(${index})" 
                  class="bg-blue-600 text-white rounded w-6 h-6 flex items-center justify-center hover:bg-blue-700">
            <i class="fas fa-arrow-right text-xs"></i>
          </button>
        ` : ''}
      </div>
      
      <!-- Indicador de posición -->
      <div class="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
        ${index + 1}
      </div>
    </div>
  `).join('');
}

function moveImageLeft(index) {
  if (index > 0) {
    reorderImages(index, index - 1);
  }
}

function moveImageRight(index) {
  if (index < currentImages.length - 1) {
    reorderImages(index, index + 1);
  }
}

function reorderImages(fromIndex, toIndex) {
  const [removed] = currentImages.splice(fromIndex, 1);
  currentImages.splice(toIndex, 0, removed);
  updateImagePreview();
}

function removeImage(index) {
  currentImages.splice(index, 1);
  updateImagePreview();
}

function previewImage() {
  // Mantener para compatibilidad, pero usar previewImages
  previewImages();
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


// Gallery control functions
function galleryNext(productId) {
  if (galleries[productId]) {
    galleries[productId].next();
  }
}

function galleryPrev(productId) {
  if (galleries[productId]) {
    galleries[productId].prev();
  }
}

function galleryGoTo(productId, index) {
  if (galleries[productId]) {
    galleries[productId].goTo(index);
  }
}

// Función para ampliar imagen con galería
function openImageZoom(productId, startIndex = 0) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const images = getProductImages(product);
  currentZoomImages = images;
  currentZoomIndex = startIndex;
  
  $('zoomedImage').src = images[startIndex];
  $('imageZoomModal').classList.remove('hidden');
  updateZoomControls();
}

function zoomImage(imageSrc) {
  // Mantener compatibilidad
  currentZoomImages = [imageSrc];
  currentZoomIndex = 0;
  $('zoomedImage').src = imageSrc;
  $('imageZoomModal').classList.remove('hidden');
  updateZoomControls();
}

function closeImageZoom() {
  $('imageZoomModal').classList.add('hidden');
}

// Variables para zoom
let currentZoomImages = [];
let currentZoomIndex = 0;

function updateZoomControls() {
  const hasMultiple = currentZoomImages.length > 1;
  
  // Show/hide navigation buttons
  const prevBtn = $('zoomPrevBtn');
  const nextBtn = $('zoomNextBtn');
  
  if (prevBtn && nextBtn) {
    prevBtn.style.display = hasMultiple ? 'flex' : 'none';
    nextBtn.style.display = hasMultiple ? 'flex' : 'none';
  }
  
  // Update counter
  const counter = $('zoomCounter');
  if (counter) {
    counter.textContent = hasMultiple ? `${currentZoomIndex + 1} / ${currentZoomImages.length}` : '';
  }
  
  // Update dots
  const dots = $('zoomDots');
  if (dots && hasMultiple) {
    dots.innerHTML = currentZoomImages.map((_, i) => `
      <button onclick="zoomGoTo(${i}); event.stopPropagation();" 
              class="w-3 h-3 rounded-full ${i === currentZoomIndex ? 'bg-white' : 'bg-white bg-opacity-40'} hover:bg-opacity-70 transition">
      </button>
    `).join('');
  } else if (dots) {
    dots.innerHTML = '';
  }
}

function zoomNextImage() {
  if (currentZoomImages.length > 1) {
    currentZoomIndex = (currentZoomIndex + 1) % currentZoomImages.length;
    $('zoomedImage').src = currentZoomImages[currentZoomIndex];
    updateZoomControls();
  }
}

function zoomPrevImage() {
  if (currentZoomImages.length > 1) {
    currentZoomIndex = (currentZoomIndex - 1 + currentZoomImages.length) % currentZoomImages.length;
    $('zoomedImage').src = currentZoomImages[currentZoomIndex];
    updateZoomControls();
  }
}

function zoomGoTo(index) {
  if (index >= 0 && index < currentZoomImages.length) {
    currentZoomIndex = index;
    $('zoomedImage').src = currentZoomImages[currentZoomIndex];
    updateZoomControls();
  }
}

// Keyboard navigation for zoom
document.addEventListener('keydown', (e) => {
  const modal = $('imageZoomModal');
  if (modal && !modal.classList.contains('hidden')) {
    if (e.key === 'ArrowLeft') {
      zoomPrevImage();
    } else if (e.key === 'ArrowRight') {
      zoomNextImage();
    } else if (e.key === 'Escape') {
      closeImageZoom();
    }
  }
});

// Detect touch capability
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Initialize touch handler for zoom modal
window.addEventListener('DOMContentLoaded', () => {
  const zoomModal = $('imageZoomModal');
  if (zoomModal && isTouchDevice()) {
    new TouchHandler(
      zoomModal,
      () => zoomNextImage(), // Swipe left = next
      () => zoomPrevImage()  // Swipe right = previous
    );
  }
});
