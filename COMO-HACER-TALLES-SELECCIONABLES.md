# Cómo hacer los talles seleccionables

## ✅ Lo que ya está hecho:
- La función `addToCart()` ya valida que se seleccione un talle

## ⚠️ Lo que falta hacer:

Abre el archivo `talles-seleccionables.js` que creé. Tiene 4 funciones que debes copiar y pegar en `public/app.js`:

### 1. renderProducts() 
Busca esta función en app.js (línea ~172) y reemplázala completa

### 2. addToCart()
Ya está actualizada ✅

### 3. updateCart()
Busca esta función en app.js (línea ~236) y reemplázala completa

### 4. changeQty()
Busca esta función en app.js (línea ~260) y reemplázala completa

## 🎯 Resultado:

Cuando termines, los clientes verán:
- Un **selector desplegable** con los talles disponibles
- Deben **elegir un talle** antes de agregar al carrito
- Si no eligen talle, aparece: "Por favor selecciona un talle"
- En el carrito se muestra: "Talle: 38" (por ejemplo)
- Pueden tener el mismo producto con diferentes talles en el carrito

## 🚀 Después de editar:

```bash
# Subir cambios
git add .
git commit -m "Talles seleccionables implementados"
git push
```

## 🧪 Probar:

1. Refresca localhost:3001 (Ctrl + Shift + R)
2. Agrega un producto con talles: `36, 38, 40`
3. En el catálogo verás un selector: "Elegir talle"
4. Intenta agregar sin seleccionar → Debe mostrar alerta
5. Selecciona un talle → Debe agregarse al carrito
6. En el carrito debe mostrar: "Talle: 38"
