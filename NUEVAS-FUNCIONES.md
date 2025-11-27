# Nuevas Funcionalidades Agregadas

## ✅ Funciones implementadas:

1. **Ampliar imagen** - Click en cualquier imagen de producto para verla en grande
2. **Talles disponibles** - Ingresa talles numéricos separados por comas (Ej: 36, 38, 40, 42)
3. **Stock disponible** - Cantidad de productos disponibles

## 📋 Cambios realizados:

### Base de datos (✅ Completado)
- `init-db.js` - Agregados campos `sizes` y `stock`
- `server.js` - Actualizado para manejar nuevos campos

### Frontend (⚠️ Requiere aplicación manual)
- `public/index.html` - Modal de zoom y campos de talles/stock agregados
- `public/app.js` - Necesita actualizaciones (ver instrucciones abajo)

## 🔧 Cómo aplicar los cambios:

### Opción 1: Aplicar manualmente (RECOMENDADO)

1. **Abre** `public/app.js` en tu editor

2. **Al final del archivo**, agrega estas funciones:

```javascript
// Función para ampliar imagen
function zoomImage(imageSrc) {
  $('zoomedImage').src = imageSrc;
  $('imageZoomModal').classList.remove('hidden');
}

function closeImageZoom() {
  $('imageZoomModal').classList.add('hidden');
}
```

3. **Busca** la función `renderProducts()` (línea ~172) y **reemplázala** con:

```javascript
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
```

4. **Busca** la función `openProductModal()` y **reemplázala** con:

```javascript
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
```

5. **Busca** la función `saveProduct()` y **reemplázala** con:

```javascript
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
```

6. **Busca** la función `loadAdminProducts()` y **reemplázala** con:

```javascript
async function loadAdminProducts() {
  await loadProducts();
  $('productsList').innerHTML = products.map(p => {
    const sizes = p.sizes ? p.sizes.split(',').filter(s => s) : [];
    const stock = p.stock || 0;
    return `
    <div class="flex gap-3 p-3 bg-gray-50 rounded mb-2">
      <img src="${p.image}" onclick="zoomImage('${p.image}')" class="w-full h-16 object-cover rounded cursor-pointer">
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
```

7. **Guarda** el archivo `public/app.js`

### Opción 2: Usar el archivo de referencia

Abre `public/app-updates.js` y copia las funciones indicadas.

## 🧪 Probar localmente:

```bash
npm start
```

1. Inicia sesión como admin (`admin` / `admin123`)
2. Ve al panel admin
3. Agrega un producto con talles y stock
4. Verifica que se muestre correctamente
5. Click en la imagen para ampliarla

## 🚀 Desplegar:

```bash
git add .
git commit -m "Agregadas funciones de zoom, talles y stock"
git push
```

## 📝 Notas importantes:

- Los productos existentes tendrán `stock: 0` por defecto
- Deberás editarlos para agregar talles y stock
- Si el stock es 0, el botón "Agregar al carrito" estará deshabilitado
- Click en cualquier imagen para ampliarla (funciona en catálogo y panel admin)

## ❓ Problemas comunes:

### No veo los campos de talles/stock en el modal
- Verifica que `public/index.html` tenga los cambios aplicados
- Refresca la página con Ctrl+F5

### Las funciones no funcionan
- Verifica que hayas agregado las funciones al final de `app.js`
- Abre la consola del navegador (F12) para ver errores

### Los productos no muestran talles/stock
- Verifica que `server.js` tenga los cambios aplicados
- Reinicia el servidor: `npm start`
