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

// ImageCompressor - Compresses images in the browser
class ImageCompressor {
  constructor(options = {}) {
    this.maxWidth = options.maxWidth || 1200;
    this.maxHeight = options.maxHeight || 1200;
    this.quality = options.quality || 0.8;
    this.maxSizeKB = options.maxSizeKB || 1500;
  }

  /**
   * Compress a single image file
   * @param {File} file - Image file to compress
   * @returns {Promise<Object>} - Object with base64, sizeKB, width, height, compressed
   */
  async compress(file) {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo no es una imagen válida');
      }

      // Load image
      const img = await this._loadImage(file);
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Resize if needed
      const { width, height } = this._calculateDimensions(img.width, img.height);
      canvas.width = width;
      canvas.height = height;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Compress and optimize quality
      const base64 = await this._optimizeQuality(canvas, this.maxSizeKB);
      const sizeKB = Math.round((base64.length * 0.75) / 1024); // Approximate size
      
      return {
        base64,
        sizeKB,
        width,
        height,
        compressed: true,
        filename: file.name
      };
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  }

  /**
   * Compress multiple images with progress callback
   * @param {FileList|Array} files - Array of image files
   * @param {Function} onProgress - Callback function (current, total, message)
   * @returns {Promise<Array>} - Array of compressed image objects
   */
  async compressMultiple(files, onProgress) {
    const results = [];
    const errors = [];
    const total = files.length;

    for (let i = 0; i < total; i++) {
      const file = files[i];
      
      try {
        if (onProgress) {
          onProgress(i, total, `Procesando ${file.name}...`);
        }
        
        const compressed = await this.compress(file);
        results.push(compressed);
        
        if (onProgress) {
          onProgress(i + 1, total, `${file.name} procesado`);
        }
      } catch (error) {
        errors.push({ file: file.name, error: error.message });
        console.error(`Error processing ${file.name}:`, error);
      }
    }

    return { results, errors };
  }

  /**
   * Load image from file
   * @private
   */
  _loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Error al cargar la imagen'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Calculate new dimensions maintaining aspect ratio
   * @private
   */
  _calculateDimensions(width, height) {
    let newWidth = width;
    let newHeight = height;

    // Scale down if larger than max dimensions
    if (width > this.maxWidth || height > this.maxHeight) {
      const aspectRatio = width / height;
      
      if (width > height) {
        newWidth = this.maxWidth;
        newHeight = Math.round(this.maxWidth / aspectRatio);
      } else {
        newHeight = this.maxHeight;
        newWidth = Math.round(this.maxHeight * aspectRatio);
      }
    }

    return { width: newWidth, height: newHeight };
  }

  /**
   * Optimize quality to meet size target
   * @private
   */
  async _optimizeQuality(canvas, targetSizeKB) {
    let quality = this.quality;
    let base64 = canvas.toDataURL('image/jpeg', quality);
    let sizeKB = Math.round((base64.length * 0.75) / 1024);

    // If still too large, reduce quality iteratively
    while (sizeKB > targetSizeKB && quality > 0.5) {
      quality -= 0.1;
      base64 = canvas.toDataURL('image/jpeg', quality);
      sizeKB = Math.round((base64.length * 0.75) / 1024);
    }

    // Ensure quality stays within acceptable range
    if (quality < 0.7) {
      console.warn('Image quality reduced below 0.7 to meet size constraint');
    }

    return base64;
  }
}

// ProgressIndicator - Shows progress for image processing
class ProgressIndicator {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = null;
  }

  /**
   * Show progress bar
   * @param {number} total - Total number of items to process
   */
  show(total) {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error(`Container ${this.containerId} not found`);
      return;
    }

    this.container.innerHTML = `
      <div class="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-blue-900" id="${this.containerId}-message">
            Procesando imágenes...
          </span>
          <span class="text-sm text-blue-700" id="${this.containerId}-counter">
            0 / ${total}
          </span>
        </div>
        <div class="w-full bg-blue-200 rounded-full h-2">
          <div id="${this.containerId}-bar" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
        </div>
        <div id="${this.containerId}-errors" class="mt-2 text-xs text-red-600"></div>
      </div>
    `;
    this.container.classList.remove('hidden');
  }

  /**
   * Update progress
   * @param {number} current - Current progress
   * @param {number} total - Total items
   * @param {string} message - Optional message to display
   */
  update(current, total, message) {
    const percentage = Math.round((current / total) * 100);
    
    const bar = document.getElementById(`${this.containerId}-bar`);
    const counter = document.getElementById(`${this.containerId}-counter`);
    const messageEl = document.getElementById(`${this.containerId}-message`);
    
    if (bar) bar.style.width = `${percentage}%`;
    if (counter) counter.textContent = `${current} / ${total}`;
    if (messageEl && message) messageEl.textContent = message;
  }

  /**
   * Hide progress bar
   */
  hide() {
    if (this.container) {
      this.container.innerHTML = '';
      this.container.classList.add('hidden');
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    const errorsEl = document.getElementById(`${this.containerId}-errors`);
    if (errorsEl) {
      errorsEl.innerHTML += `<div>⚠️ ${message}</div>`;
    }
  }

  /**
   * Show summary of processing
   * @param {number} successful - Number of successful items
   * @param {number} failed - Number of failed items
   */
  showSummary(successful, failed) {
    const messageEl = document.getElementById(`${this.containerId}-message`);
    if (messageEl) {
      if (failed === 0) {
        messageEl.textContent = `✓ ${successful} imagen${successful !== 1 ? 'es' : ''} procesada${successful !== 1 ? 's' : ''} exitosamente`;
        messageEl.className = 'text-sm font-medium text-green-700';
      } else {
        messageEl.textContent = `${successful} exitosa${successful !== 1 ? 's' : ''}, ${failed} fallida${failed !== 1 ? 's' : ''}`;
        messageEl.className = 'text-sm font-medium text-orange-700';
      }
    }
  }
}

// ImageUploadManager - Manages multiple image uploads with preview
class ImageUploadManager {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = null;
    this.maxImages = options.maxImages || 10;
    this.images = []; // Array of { base64, sizeKB, id, filename }
    this.compressor = new ImageCompressor(options.compressor || {});
    this.progressIndicator = options.progressIndicator || null;
  }

  /**
   * Add new images with compression and validation
   * @param {FileList|Array} files - Files to add
   * @returns {Promise<Object>} - Results with successful and failed counts
   */
  async addImages(files) {
    // Validate total count
    const totalCount = this.images.length + files.length;
    if (totalCount > this.maxImages) {
      const remaining = this.maxImages - this.images.length;
      throw new Error(`Máximo ${this.maxImages} imágenes permitidas. Puedes agregar ${remaining} más.`);
    }

    // Show progress if indicator provided
    if (this.progressIndicator) {
      this.progressIndicator.show(files.length);
    }

    // Compress images
    const { results, errors } = await this.compressor.compressMultiple(files, (current, total, message) => {
      if (this.progressIndicator) {
        this.progressIndicator.update(current, total, message);
      }
    });

    // Add successful images
    results.forEach(result => {
      this.images.push({
        base64: result.base64,
        sizeKB: result.sizeKB,
        id: this._generateId(),
        filename: result.filename,
        width: result.width,
        height: result.height
      });
    });

    // Show errors
    if (this.progressIndicator && errors.length > 0) {
      errors.forEach(err => {
        this.progressIndicator.showError(`${err.file}: ${err.error}`);
      });
    }

    // Show summary
    if (this.progressIndicator) {
      this.progressIndicator.showSummary(results.length, errors.length);
      setTimeout(() => {
        this.progressIndicator.hide();
      }, 2000);
    }

    this.render();

    return { successful: results.length, failed: errors.length };
  }

  /**
   * Remove image at index
   * @param {number} index - Index of image to remove
   */
  removeImage(index) {
    if (index >= 0 && index < this.images.length) {
      this.images.splice(index, 1);
      this.render();
    }
  }

  /**
   * Replace image at specific index
   * @param {number} index - Index to replace
   * @param {File} file - New image file
   */
  async replaceImage(index, file) {
    if (index < 0 || index >= this.images.length) {
      throw new Error('Índice inválido');
    }

    try {
      const result = await this.compressor.compress(file);
      
      this.images[index] = {
        base64: result.base64,
        sizeKB: result.sizeKB,
        id: this._generateId(),
        filename: result.filename,
        width: result.width,
        height: result.height
      };

      this.render();
    } catch (error) {
      console.error('Error replacing image:', error);
      throw error;
    }
  }

  /**
   * Reorder images
   * @param {number} fromIndex - Source index
   * @param {number} toIndex - Destination index
   */
  reorderImages(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= this.images.length ||
        toIndex < 0 || toIndex >= this.images.length) {
      return;
    }

    const [removed] = this.images.splice(fromIndex, 1);
    this.images.splice(toIndex, 0, removed);
    this.render();
  }

  /**
   * Get array of base64 strings
   * @returns {Array<string>} - Array of base64 image strings
   */
  getImages() {
    return this.images.map(img => img.base64);
  }

  /**
   * Get total size in KB
   * @returns {number} - Total size in KB
   */
  getTotalSize() {
    return this.images.reduce((sum, img) => sum + img.sizeKB, 0);
  }

  /**
   * Load existing images
   * @param {Array<string>} base64Images - Array of base64 strings
   */
  loadImages(base64Images) {
    this.images = base64Images.map(base64 => ({
      base64,
      sizeKB: Math.round((base64.length * 0.75) / 1024),
      id: this._generateId(),
      filename: 'existing.jpg',
      width: 0,
      height: 0
    }));
    this.render();
  }

  /**
   * Clear all images
   */
  clear() {
    this.images = [];
    this.render();
  }

  /**
   * Render preview grid
   */
  render() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error(`Container ${this.containerId} not found`);
      return;
    }

    const totalSize = this.getTotalSize();
    const totalSizeFormatted = this._formatSize(totalSize);
    const showWarning = totalSize > 10240; // 10MB

    this.container.innerHTML = this.images.map((img, index) => `
      <div class="relative group" data-index="${index}">
        <img src="${img.base64}" class="w-full h-24 object-cover rounded">
        
        <!-- Remove button -->
        <button type="button" onclick="imageManager.removeImage(${index})" 
                class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition">
          <i class="fas fa-times text-xs"></i>
        </button>
        
        <!-- Replace button -->
        <button type="button" onclick="imageManager.triggerReplace(${index})" 
                class="absolute top-1 left-1 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-700 transition">
          <i class="fas fa-sync text-xs"></i>
        </button>
        
        <!-- Position indicator -->
        <div class="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          ${index + 1}
        </div>
        
        <!-- Size indicator -->
        <div class="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          ${this._formatSize(img.sizeKB)}
        </div>
      </div>
    `).join('');

    // Add total size display
    if (this.images.length > 0) {
      const totalDiv = document.createElement('div');
      totalDiv.className = `col-span-3 text-sm p-2 rounded ${showWarning ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-700'}`;
      totalDiv.innerHTML = `
        ${showWarning ? '<i class="fas fa-exclamation-triangle mr-1"></i>' : ''}
        <strong>Total:</strong> ${totalSizeFormatted} 
        ${showWarning ? '(Recomendado: < 10 MB)' : ''}
        <span class="ml-2 text-xs">(${this.images.length}/${this.maxImages} imágenes)</span>
      `;
      this.container.appendChild(totalDiv);
    }
  }

  /**
   * Trigger file input for replacing image
   * @param {number} index - Index to replace
   */
  triggerReplace(index) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          await this.replaceImage(index, file);
        } catch (error) {
          alert(`Error al reemplazar imagen: ${error.message}`);
        }
      }
    };
    input.click();
  }

  /**
   * Format size as KB or MB
   * @private
   */
  _formatSize(sizeKB) {
    if (sizeKB < 1024) {
      return `${Math.round(sizeKB)} KB`;
    } else {
      return `${(sizeKB / 1024).toFixed(2)} MB`;
    }
  }

  /**
   * Generate unique ID
   * @private
   */
  _generateId() {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// DragDropHandler - Handles drag and drop for image reordering
class DragDropHandler {
  constructor(manager) {
    this.manager = manager;
    this.draggedIndex = null;
    this.draggedElement = null;
  }

  /**
   * Attach drag event listeners to element
   * @param {HTMLElement} element - Element to make draggable
   * @param {number} index - Index of the image
   */
  attachToElement(element, index) {
    element.setAttribute('draggable', 'true');
    element.style.cursor = 'move';

    element.addEventListener('dragstart', (e) => this.handleDragStart(e, index));
    element.addEventListener('dragend', (e) => this.handleDragEnd(e));
    element.addEventListener('dragover', (e) => this.handleDragOver(e, index));
    element.addEventListener('drop', (e) => this.handleDrop(e, index));
    element.addEventListener('dragenter', (e) => this.handleDragEnter(e));
    element.addEventListener('dragleave', (e) => this.handleDragLeave(e));
  }

  /**
   * Handle drag start
   * @param {DragEvent} e - Drag event
   * @param {number} index - Index being dragged
   */
  handleDragStart(e, index) {
    this.draggedIndex = index;
    this.draggedElement = e.target;
    e.target.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
  }

  /**
   * Handle drag end
   * @param {DragEvent} e - Drag event
   */
  handleDragEnd(e) {
    e.target.style.opacity = '1';
    
    // Remove all drop zone highlights
    const elements = document.querySelectorAll(`#${this.manager.containerId} > div`);
    elements.forEach(el => {
      el.classList.remove('drag-over');
    });
  }

  /**
   * Handle drag over
   * @param {DragEvent} e - Drag event
   * @param {number} index - Index being dragged over
   */
  handleDragOver(e, index) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  /**
   * Handle drag enter
   * @param {DragEvent} e - Drag event
   */
  handleDragEnter(e) {
    const target = e.target.closest('[data-index]');
    if (target) {
      target.classList.add('drag-over');
    }
  }

  /**
   * Handle drag leave
   * @param {DragEvent} e - Drag event
   */
  handleDragLeave(e) {
    const target = e.target.closest('[data-index]');
    if (target) {
      target.classList.remove('drag-over');
    }
  }

  /**
   * Handle drop
   * @param {DragEvent} e - Drag event
   * @param {number} index - Index where dropped
   */
  handleDrop(e, index) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (this.draggedIndex !== null && this.draggedIndex !== index) {
      this.manager.reorderImages(this.draggedIndex, index);
      
      // Re-attach drag handlers after reorder
      setTimeout(() => {
        this.attachAllHandlers();
      }, 100);
    }

    return false;
  }

  /**
   * Attach handlers to all draggable elements
   */
  attachAllHandlers() {
    const container = document.getElementById(this.manager.containerId);
    if (!container) return;

    const elements = container.querySelectorAll('[data-index]');
    elements.forEach((el, index) => {
      this.attachToElement(el, index);
    });
  }
}

// Elementos DOM
const $ = id => document.getElementById(id);

// Helper function to format price with thousands separator
function formatPrice(price) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

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
  // Auth - Los formularios manejan el submit ahora
  // $('loginSubmit').onclick = handleLogin;
  // $('registerSubmit').onclick = handleRegister;
  $('showRegister').onclick = () => {
    $('loginModal').classList.add('hidden');
    $('registerModal').classList.remove('hidden');
  };
  $('showLogin').onclick = () => {
    $('registerModal').classList.add('hidden');
    $('loginModal').classList.remove('hidden');
  };
  $('showForgotPassword').onclick = () => {
    $('loginModal').classList.add('hidden');
    $('forgotPasswordModal').classList.remove('hidden');
  };
  $('cancelForgotPassword').onclick = () => {
    $('forgotPasswordModal').classList.add('hidden');
    $('loginModal').classList.remove('hidden');
  };
  $('forgotPasswordSubmit').onclick = handleForgotPassword;
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

async function handleForgotPassword() {
  const identifier = $('forgotUser').value.trim();
  
  // Limpiar mensajes anteriores
  $('forgotError').classList.add('hidden');
  $('forgotSuccess').classList.add('hidden');
  
  if (!identifier) {
    $('forgotError').textContent = 'Por favor ingresa tu usuario o email';
    $('forgotError').classList.remove('hidden');
    return;
  }
  
  try {
    const res = await fetch(API + '/forgot-password', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({usernameOrEmail: identifier})
    });
    
    const data = await res.json();
    
    if (res.ok) {
      // Mostrar mensaje de éxito
      $('forgotSuccess').innerHTML = `
        <strong>✓ Solicitud enviada</strong><br><br>
        ${data.message}<br><br>
        <small>Revisa tu bandeja de entrada y spam.</small>
      `;
      $('forgotSuccess').classList.remove('hidden');
      
      // Limpiar el campo
      $('forgotUser').value = '';
      
      // Cerrar modal después de 5 segundos
      setTimeout(() => {
        $('forgotPasswordModal').classList.add('hidden');
        $('loginModal').classList.remove('hidden');
      }, 5000);
    } else {
      $('forgotError').textContent = data.error || 'Error al procesar la solicitud';
      $('forgotError').classList.remove('hidden');
    }
  } catch (err) {
    $('forgotError').textContent = 'Error de conexión';
    $('forgotError').classList.remove('hidden');
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
        <span class="text-xl font-bold text-indigo-600">$${formatPrice(p.price)}</span>
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
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  // Aplicar 10% de descuento
  const discount = subtotal * 0.10;
  const totalWithDiscount = subtotal - discount;
  
  // Envío gratis si es mayor a $80,000
  const freeShipping = totalWithDiscount >= 80000;
  
  // Actualizar contador del carrito
  $('cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  
  // Actualizar desglose de precios
  $('cartSubtotalDisplay').textContent = '$' + formatPrice(subtotal);
  $('cartDiscountDisplay').textContent = '-$' + formatPrice(discount);
  $('cartShippingDisplay').textContent = freeShipping ? 'GRATIS 🎉' : 'Estándar';
  $('cartShippingDisplay').className = freeShipping ? 'text-green-600 font-bold' : '';
  $('cartTotal').textContent = '$' + formatPrice(totalWithDiscount);
  
  // Guardar valores globales para usar en checkout
  window.cartTotal = totalWithDiscount;
  window.cartSubtotal = subtotal;
  window.cartDiscount = discount;
  window.freeShipping = freeShipping;
  
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
  // Usar el total con descuento
  const total = window.cartTotal || cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.9;
  $('paymentTotal').textContent = '$' + formatPrice(total);
  $('cartSidebar').classList.add('translate-x-full');
  $('paymentModal').classList.remove('hidden');
}

function showCardForm() {
  // Usar el total con descuento
  const total = window.cartTotal || cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.9;
  $('cardTotal').textContent = '$' + formatPrice(total);
  $('paymentModal').classList.add('hidden');
  $('cardModal').classList.remove('hidden');
  
  // Clear form
  $('cardForm').reset();
}

async function processCardPayment() {
  // Cerrar el modal de tarjeta y usar Mercado Pago Checkout
  $('cardModal').classList.add('hidden');
  
  // Redirigir al flujo de Mercado Pago (más seguro y funciona con credenciales TEST)
  alert('Serás redirigido a Mercado Pago para completar el pago de forma segura');
  
  // Usar el mismo flujo que el botón "Mercado Pago"
  handleMercadoPago();
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

// Helper para formatear items del carrito para el backend
function formatCartItems() {
  return cart.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.qty,
    price: item.price,
    size: item.size || null
  }));
}

async function handleMercadoPago() {
  // Verificar autenticación
  if (!token || !user) {
    alert('Debes iniciar sesión para realizar un pago');
    $('paymentModal').classList.add('hidden');
    $('loginModal').classList.remove('hidden');
    return;
  }
  
  // Usar el total con descuento
  const total = window.cartTotal || cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.9;
  
  // Mostrar loading
  const mpButton = $('payMP');
  const originalText = mpButton.innerHTML;
  mpButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Procesando...';
  mpButton.disabled = true;
  
  try {
    // Formatear items para el backend
    const formattedItems = formatCartItems();
    
    const res = await fetch(API + '/mp-link', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
      body: JSON.stringify({items: formattedItems, total})
    });
    
    const data = await res.json();
    
    if (res.ok) {
      // Usar link de PRODUCCIÓN (pagos reales)
      const paymentLink = data.link;
      
      if (paymentLink) {
        // Abrir link de pago en nueva ventana
        const paymentWindow = window.open(paymentLink, '_blank');
        
        if (paymentWindow) {
          alert('Se abrió una ventana con el link de pago de Mercado Pago.\n\n' + 
                '💳 PAGO REAL - Se cobrará dinero real\n' +
                '\n\nID: ' + data.preference_id);
          
          // Limpiar carrito después de generar el link
          cart = [];
          updateCart();
          $('paymentModal').classList.add('hidden');
        } else {
          alert('Por favor permite las ventanas emergentes para completar el pago.\n\nLink de pago: ' + paymentLink);
        }
      } else {
        alert('Preferencia de pago creada.\n\nID: ' + data.preference_id);
        cart = [];
        updateCart();
        $('paymentModal').classList.add('hidden');
      }
    } else {
      // Error en la respuesta
      let errorMsg = data.error || 'Error al procesar el pago con Mercado Pago';
      
      // Si es error 401 de Mercado Pago (credenciales inválidas)
      if (res.status === 401) {
        errorMsg = 'Las credenciales de Mercado Pago no son válidas.\n\n' +
                   'Esto puede deberse a:\n' +
                   '- Token de producción sin cuenta verificada\n' +
                   '- Token de TEST requerido para pruebas\n\n' +
                   'Por favor usa otro método de pago.';
      }
      
      alert('Error al crear el pago:\n\n' + errorMsg);
      console.error('Error de MP:', data);
    }
  } catch (err) {
    console.error('Error con Mercado Pago:', err);
    alert('Error de conexión con Mercado Pago.\n\nPor favor intenta nuevamente.');
  } finally {
    // Restaurar botón
    mpButton.innerHTML = originalText;
    mpButton.disabled = false;
  }
}

function handleWhatsApp() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);const discount = subtotal * 0.10;const total = window.cartTotal || (subtotal - discount);const freeShipping = window.freeShipping || (total >= 80000);
  let msg = 'Hola! Quiero comprar:\n\n';
  cart.forEach(item => {
    msg += `${item.name} x${item.qty} - $${formatPrice(item.price * item.qty)}\n`;
  });
  msg += `\nTotal: $${formatPrice(total)}`;
  
  const url = 'https://wa.me/5491122549995?text=' + encodeURIComponent(msg);
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
        <p class="text-sm text-gray-600">$${formatPrice(p.price)}</p>
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
  // Initialize ImageUploadManager
  const progressIndicator = new ProgressIndicator('uploadProgress');
  imageManager = new ImageUploadManager('imagePreview', {
    maxImages: 10,
    progressIndicator: progressIndicator
  });
  
  // Initialize DragDropHandler
  dragDropHandler = new DragDropHandler(imageManager);
  
  if (productId) {
    const p = products.find(pr => pr.id === productId);
    $('productModalTitle').textContent = 'Editar Producto';
    $('productId').value = p.id;
    $('productName').value = p.name;
    $('productDesc').value = p.description;
    $('productPrice').value = p.price;
    $('productStock').value = p.stock || 0;
    $('productSizes').value = p.sizes || '';
    
    // Cargar imágenes existentes usando ImageUploadManager
    const existingImages = getProductImages(p);
    imageManager.loadImages(existingImages);
    currentImages = existingImages;
    
    // Attach drag handlers after render
    setTimeout(() => {
      dragDropHandler.attachAllHandlers();
    }, 100);
  } else {
    $('productModalTitle').textContent = 'Agregar Producto';
    $('productId').value = '';
    $('productName').value = '';
    $('productDesc').value = '';
    $('productPrice').value = '';
    $('productStock').value = '0';
    $('productSizes').value = '';
    imageManager.clear();
    currentImages = [];
  }
  $('productModal').classList.remove('hidden');
}

function editProduct(id) {
  openProductModal(id);
}

async function saveProduct() {
  console.log('saveProduct called');
  const id = $('productId').value;
  const name = $('productName').value;
  const description = $('productDesc').value;
  const price = parseFloat($('productPrice').value);
  const stock = parseInt($('productStock').value) || 0;
  
  console.log('Product data:', { id, name, description, price, stock });
  
  // Validar campos requeridos
  if (!name || !description || !price) {
    alert('Por favor completa todos los campos requeridos (nombre, descripción, precio)');
    return;
  }
  
  // Obtener talles ingresados (limpiar espacios)
  const sizesInput = $('productSizes').value.trim();
  const sizes = sizesInput ? sizesInput.split(',').map(s => s.trim()).filter(s => s) : [];
  
  // Get images from ImageUploadManager
  const images = imageManager ? imageManager.getImages() : currentImages;
  
  console.log('Images to save:', images.length, 'images');
  console.log('ImageManager exists:', !!imageManager);
  
  if (images.length === 0) {
    alert('Debes agregar al menos una imagen');
    return;
  }
  
  if (images.length > 10) {
    alert('Máximo 10 imágenes permitidas');
    return;
  }
  
  const url = id ? API + '/products/' + id : API + '/products';
  const method = id ? 'PUT' : 'POST';
  
  try {
    const response = await fetch(url, {
      method,
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
      body: JSON.stringify({
        name, 
        description, 
        price, 
        images: images,
        image: images[0], // Mantener compatibilidad
        sizes, 
        stock
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert(id ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
      $('productModal').classList.add('hidden');
      currentImages = [];
      if (imageManager) {
        imageManager.clear();
      }
      loadAdminProducts();
    } else {
      alert('Error al guardar: ' + (data.error || 'Error desconocido'));
      console.error('Error response:', data);
    }
  } catch (err) {
    console.error('Error saving product:', err);
    alert('Error al guardar: ' + err.message);
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

// Global ImageUploadManager instance
let imageManager = null;
let dragDropHandler = null;

async function handleMultipleImages(files) {
  const images = [];
  for (const file of files) {
    // Skip very large files (> 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      alert(`La imagen ${file.name} es demasiado grande (> 10MB). Por favor selecciona una imagen más pequeña.`);
      continue;
    }
    
    try {
      const result = await fileToBase64(file);
      
      // Validate compressed size
      if (result.sizeKB > 1500) {
        alert(`La imagen ${file.name} sigue siendo muy grande después de compresión (${result.sizeKB}KB). Intenta con una imagen más pequeña.`);
        continue;
      }
      
      images.push(result.base64);
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
      alert(`Error al procesar ${file.name}: ${error.message}`);
    }
  }
  return images;
}

async function previewImages() {
  const files = $('productImages').files;
  
  if (!imageManager) {
    console.error('ImageUploadManager not initialized');
    return;
  }
  
  try {
    await imageManager.addImages(files);
    
    // Update currentImages from manager
    currentImages = imageManager.getImages();
    
    // Attach drag handlers after adding images
    setTimeout(() => {
      if (dragDropHandler) {
        dragDropHandler.attachAllHandlers();
      }
    }, 100);
  } catch (error) {
    alert(error.message);
  }
  
  // Clear file input
  $('productImages').value = '';
}

// Legacy function - now handled by ImageUploadManager.render()
// Kept for backward compatibility
function updateImagePreview() {
  if (imageManager) {
    imageManager.render();
  }
}

// Legacy functions - kept for backward compatibility
// These are now handled by ImageUploadManager
function moveImageLeft(index) {
  if (imageManager) {
    imageManager.reorderImages(index, index - 1);
  }
}

function moveImageRight(index) {
  if (imageManager) {
    imageManager.reorderImages(index, index + 1);
  }
}

function reorderImages(fromIndex, toIndex) {
  if (imageManager) {
    imageManager.reorderImages(fromIndex, toIndex);
  }
}

function removeImage(index) {
  if (imageManager) {
    imageManager.removeImage(index);
  }
}

function previewImage() {
  // Mantener para compatibilidad, pero usar previewImages
  previewImages();
}

/**
 * Convert file to base64 with compression
 * @param {File} file - Image file to convert
 * @returns {Promise<Object>} - Object with base64, sizeKB, width, height, compressed
 */
async function fileToBase64(file) {
  try {
    const compressor = new ImageCompressor();
    const result = await compressor.compress(file);
    return result;
  } catch (error) {
    console.error('Error converting file to base64:', error);
    // Fallback to simple conversion without compression
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const sizeKB = Math.round((base64.length * 0.75) / 1024);
        resolve({
          base64,
          sizeKB,
          width: 0,
          height: 0,
          compressed: false,
          filename: file.name
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
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
    
    $('logsList').innerHTML = logs.map(log => {
      // Determinar el color según el tipo de acción
      let bgColor = 'bg-gray-50';
      let icon = '📋';
      let textColor = 'text-gray-700';
      
      // Pagos y compras (VERDE)
      if (log.action === 'Compra realizada' || log.action === 'Orden creada') {
        bgColor = 'bg-green-50 border-l-4 border-green-500';
        icon = '💰';
        textColor = 'text-green-900';
      } 
      // Pagos exitosos de Mercado Pago (VERDE)
      else if (log.action.includes('Pago') && (log.details.includes('exitoso') || log.details.includes('aprobado') || log.details.includes('approved'))) {
        bgColor = 'bg-green-50 border-l-4 border-green-600';
        icon = '✅';
        textColor = 'text-green-900';
      }
      // Pagos rechazados o fallidos (ROJO)
      else if (log.action.includes('Pago') && (log.details.includes('rechazado') || log.details.includes('fallido') || log.details.includes('rejected') || log.details.includes('failed'))) {
        bgColor = 'bg-red-50 border-l-4 border-red-500';
        icon = '❌';
        textColor = 'text-red-900';
      }
      // WhatsApp enviado (AZUL)
      else if (log.action === 'WhatsApp enviado') {
        bgColor = 'bg-blue-50 border-l-4 border-blue-500';
        icon = '📱';
        textColor = 'text-blue-900';
      } 
      // Errores de WhatsApp (ROJO)
      else if (log.action === 'Error WhatsApp') {
        bgColor = 'bg-red-50 border-l-4 border-red-500';
        icon = '⚠️';
        textColor = 'text-red-900';
      } 
      // Login (AZUL)
      else if (log.action === 'Login') {
        bgColor = 'bg-blue-50 border-l-4 border-blue-400';
        icon = '🔐';
        textColor = 'text-blue-900';
      } 
      // Registro (MORADO)
      else if (log.action === 'Registro') {
        bgColor = 'bg-purple-50 border-l-4 border-purple-500';
        icon = '👤';
        textColor = 'text-purple-900';
      }
      // Errores generales (ROJO)
      else if (log.action.includes('Error') || log.details.includes('error') || log.details.includes('Error')) {
        bgColor = 'bg-red-50 border-l-4 border-red-500';
        icon = '🚨';
        textColor = 'text-red-900';
      }
      
      return `
        <div class="p-3 ${bgColor} rounded mb-2 shadow-sm">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-2xl">${icon}</span>
                <span class="font-bold ${textColor}">${log.username || 'Sistema'}</span>
                <span class="text-xs bg-white px-2 py-1 rounded font-semibold ${textColor}">${log.action}</span>
              </div>
              <p class="text-sm mt-2 ${textColor}">${log.details}</p>
            </div>
            <span class="text-xs text-gray-600 whitespace-nowrap ml-2">${new Date(log.created_at).toLocaleString('es-AR')}</span>
          </div>
        </div>
      `;
    }).join('');
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
