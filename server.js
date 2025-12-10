require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const compression = require('compression');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const db = require('./db-config');
const initDatabase = require('./init-db');
const { sendPurchaseNotification } = require('./whatsapp-service');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'shopmanstore_secret_key_2024';
const isPostgres = !!process.env.DATABASE_URL;

// Configurar Mercado Pago
const MP_TOKEN = process.env.MP_TOKEN || 'APP_USR-312986056474853-112320-2e5d635775f72335200f0a75382f96a6-3008632533';
let mpClient = null;
let mpPayment = null;

try {
  mpClient = new MercadoPagoConfig({ accessToken: MP_TOKEN });
  mpPayment = new Payment(mpClient);
  console.log('Mercado Pago configurado correctamente');
} catch (error) {
  console.error('Error al configurar Mercado Pago:', error.message);
}

// Optimizaciones de rendimiento avanzadas
app.use(compression({
  level: 6, // Nivel de compresión óptimo
  threshold: 1024, // Solo comprimir archivos > 1KB
  filter: (req, res) => {
    // No comprimir si ya está comprimido
    if (req.headers['x-no-compression']) return false;
    // Usar filtro por defecto de compression
    return compression.filter(req, res);
  }
}));

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Servir archivos estáticos con caché agresivo
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y', // Cachear por 1 año
  etag: true,
  immutable: true, // Marcar como immutable para mejor caché
  setHeaders: (res, path) => {
    // Headers específicos por tipo de archivo
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutos para HTML
    } else if (path.endsWith('.js') || path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 año para JS/CSS
    } else if (path.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 año para imágenes
    }
  }
}));

// Ruta principal para servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicializar base de datos
initDatabase(db, isPostgres);

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Requiere admin' });
  next();
};

// Función para formatear detalles de compra para logs
const formatPurchaseLog = (items, total, paymentMethod) => {
  if (!items || items.length === 0) {
    return `Método: ${paymentMethod}, Total: $${total}`;
  }
  
  // Formatear lista de productos
  const productList = items.map(item => {
    const size = item.size ? ` (${item.size})` : '';
    const qty = item.quantity || item.qty || 1;
    return `${item.name}${size} x${qty}`;
  }).join(', ');
  
  // Calcular total de productos
  const totalProducts = items.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0);
  
  return `Productos: ${productList} | Total productos: ${totalProducts} | Método: ${paymentMethod} | Total: $${total}`;
};

// Función para guardar logs
const saveLog = (userId, action, details = '') => {
  db.run(
    'INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)',
    [userId, action, details],
    (err) => {
      if (err) console.error('Error saving log:', err.message);
    }
  );
};

// AUTH
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Guardar log de inicio de sesión
    saveLog(user.id, 'Login', `Usuario ${user.username} inició sesión`);
    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  });
});

app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  
  db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
    [username, email, hash], 
    function(err) {
      if (err) return res.status(400).json({ error: 'Usuario ya existe' });
      
      // Guardar log de registro
      saveLog(this.lastID, 'Registro', `Nuevo usuario registrado: ${username}`);
      
      res.json({ message: 'Registrado exitosamente' });
    }
  );
});

// PASSWORD RECOVERY SYSTEM
const crypto = require('crypto');
const { sendPasswordResetEmail, emailEnabled } = require('./email-service');

// Rate limiting storage (in-memory, consider Redis for production)
const resetRequestTimes = new Map();
const RATE_LIMIT_MINUTES = 5;

// Request password reset
app.post('/api/forgot-password', async (req, res) => {
  const { usernameOrEmail } = req.body;
  
  // Validate input
  if (!usernameOrEmail || !usernameOrEmail.trim()) {
    return res.status(400).json({ error: 'Por favor ingresa tu usuario o email' });
  }
  
  // Find user
  db.get('SELECT * FROM users WHERE username = ? OR email = ?', 
    [usernameOrEmail, usernameOrEmail], 
    async (err, user) => {
      // Always return success message for security (don't reveal if user exists)
      const successMessage = 'Si el usuario existe, recibirás un email con instrucciones para restablecer tu contraseña';
      
      if (err || !user) {
        return res.json({ message: successMessage });
      }
      
      // Check rate limiting
      const lastRequest = resetRequestTimes.get(user.id);
      if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_MINUTES * 60 * 1000) {
        return res.status(429).json({ 
          error: `Por favor espera ${RATE_LIMIT_MINUTES} minutos antes de solicitar otro restablecimiento` 
        });
      }
      
      // Check if email service is configured
      if (!emailEnabled) {
        return res.status(503).json({ 
          error: 'El servicio de recuperación de contraseña no está disponible. Contacta al administrador.' 
        });
      }
      
      // Generate secure token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      
      // Invalidate previous unused tokens for this user
      db.run('UPDATE password_resets SET used = ? WHERE user_id = ? AND used = ?', 
        [isPostgres ? true : 1, user.id, isPostgres ? false : 0]);
      
      // Store token in database
      db.run(
        'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, token, expiresAt],
        async (err) => {
          if (err) {
            console.error('Error storing reset token:', err);
            return res.status(500).json({ error: 'Error al procesar la solicitud' });
          }
          
          // Send email
          console.log(`📧 Intentando enviar email de recuperación a: ${user.email}`);
          const emailSent = await sendPasswordResetEmail(user, token);
          
          if (!emailSent) {
            console.error(`❌ Fallo al enviar email a: ${user.email}`);
            saveLog(user.id, 'Error Email Recuperación', `Fallo al enviar email a ${user.email}`);
            return res.status(500).json({ error: 'Error al enviar el email' });
          }
          
          console.log(`✅ Email de recuperación enviado exitosamente a: ${user.email}`);
          saveLog(user.id, 'Email Recuperación Enviado', `Email enviado a ${user.email} - Token: ${token.substring(0, 10)}...`);
          
          // Update rate limiting
          resetRequestTimes.set(user.id, Date.now());
          
          res.json({ message: successMessage });
        }
      );
    }
  );
});

// Verify reset token
app.get('/api/verify-reset-token/:token', (req, res) => {
  const { token } = req.params;
  
  db.get(
    'SELECT * FROM password_resets WHERE token = ? AND used = ? AND expires_at > ?',
    [token, isPostgres ? false : 0, new Date()],
    (err, resetToken) => {
      if (err || !resetToken) {
        return res.json({ 
          valid: false, 
          message: 'Token inválido o expirado' 
        });
      }
      
      res.json({ valid: true });
    }
  );
});

// Reset password with token
app.post('/api/reset-password', (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
  
  // Validate passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden' });
  }
  
  // Validate password strength (minimum 6 characters)
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }
  
  // Verify token
  db.get(
    'SELECT * FROM password_resets WHERE token = ? AND used = ? AND expires_at > ?',
    [token, isPostgres ? false : 0, new Date()],
    (err, resetToken) => {
      if (err || !resetToken) {
        return res.status(400).json({ error: 'Token inválido o expirado' });
      }
      
      // Hash new password
      const hash = bcrypt.hashSync(newPassword, 10);
      
      // Update user password
      db.run('UPDATE users SET password = ? WHERE id = ?', [hash, resetToken.user_id], (err) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ error: 'Error al actualizar la contraseña' });
        }
        
        // Mark token as used
        db.run('UPDATE password_resets SET used = ? WHERE token = ?', 
          [isPostgres ? true : 1, token], 
          (err) => {
            if (err) console.error('Error marking token as used:', err);
          }
        );
        
        res.json({ message: 'Contraseña actualizada exitosamente' });
      });
    }
  );
});

// Cache en memoria para productos (5 minutos)
let productsCache = null;
let productsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// PRODUCTS con paginación y caché
app.get('/api/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  // Si no se especifica paginación, mostrar todos los productos (hasta 100)
  // Si se especifica, usar paginación con máximo 20 por página
  const limit = req.query.limit ? Math.min(parseInt(req.query.limit), 20) : 100;
  const offset = (page - 1) * limit;
  
  // Verificar caché
  const now = Date.now();
  if (productsCache && (now - productsCacheTime) < CACHE_DURATION) {
    // Aplicar paginación al caché
    const startIndex = offset;
    const endIndex = offset + limit;
    const paginatedProducts = productsCache.slice(startIndex, endIndex);
    
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutos
    return res.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: productsCache.length,
        totalPages: Math.ceil(productsCache.length / limit)
      }
    });
  }
  
  // Consulta optimizada - solo campos necesarios
  db.all('SELECT id, name, description, price, image, images, sizes, colors, stock FROM products ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener productos' });
    
    // Deserializar images de JSON a array y actualizar caché
    const products = (rows || []).map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      image: row.image,
      images: row.images ? JSON.parse(row.images) : (row.image ? [row.image] : []),
      sizes: row.sizes,
      colors: row.colors,
      stock: row.stock
    }));
    
    // Actualizar caché
    productsCache = products;
    productsCacheTime = now;
    
    // Aplicar paginación
    const startIndex = offset;
    const endIndex = offset + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutos
    res.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: products.length,
        totalPages: Math.ceil(products.length / limit)
      }
    });
  });
});

app.post('/api/products', auth, isAdmin, (req, res) => {
  const { name, description, price, image, images, sizes, colors, stock } = req.body;
  
  // Validar imágenes
  let imageArray = images || (image ? [image] : []);
  if (!Array.isArray(imageArray)) {
    imageArray = [imageArray];
  }
  
  // Validar máximo 10 imágenes
  if (imageArray.length > 10) {
    return res.status(400).json({ error: 'Máximo 10 imágenes permitidas' });
  }
  
  // Validar tamaño de cada imagen (aproximadamente 1.5MB en base64)
  const MAX_SIZE = 1.5 * 1024 * 1024 * 1.37; // Base64 es ~37% más grande
  for (const img of imageArray) {
    if (img && img.length > MAX_SIZE) {
      return res.status(400).json({ error: 'Cada imagen debe ser menor a 1.5MB después de compresión' });
    }
  }
  
  const sizesStr = Array.isArray(sizes) ? sizes.join(',') : sizes || '';
  const colorsStr = Array.isArray(colors) ? colors.join(',') : colors || '';
  const imagesJson = JSON.stringify(imageArray);
  
  db.run('INSERT INTO products (name, description, price, image, images, sizes, colors, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, imageArray[0] || null, imagesJson, sizesStr, colorsStr, stock || 0],
    function(err) {
      if (err) {
        console.error('Error creating product:', err);
        return res.status(500).json({ error: 'Error al crear: ' + err.message });
      }
      
      // Invalidar caché de productos
      productsCache = null;
      
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/products/:id', auth, isAdmin, (req, res) => {
  const { name, description, price, image, images, sizes, colors, stock } = req.body;
  
  // Validar imágenes
  let imageArray = images || (image ? [image] : []);
  if (!Array.isArray(imageArray)) {
    imageArray = [imageArray];
  }
  
  // Validar máximo 10 imágenes
  if (imageArray.length > 10) {
    return res.status(400).json({ error: 'Máximo 10 imágenes permitidas' });
  }
  
  // Validar tamaño de cada imagen (aproximadamente 1.5MB en base64)
  const MAX_SIZE = 1.5 * 1024 * 1024 * 1.37; // Base64 es ~37% más grande
  for (const img of imageArray) {
    if (img && img.length > MAX_SIZE) {
      return res.status(400).json({ error: 'Cada imagen debe ser menor a 1.5MB después de compresión' });
    }
  }
  
  const sizesStr = Array.isArray(sizes) ? sizes.join(',') : sizes || '';
  const colorsStr = Array.isArray(colors) ? colors.join(',') : colors || '';
  const imagesJson = JSON.stringify(imageArray);
  
  db.run('UPDATE products SET name=?, description=?, price=?, image=?, images=?, sizes=?, colors=?, stock=? WHERE id=?',
    [name, description, price, imageArray[0] || null, imagesJson, sizesStr, colorsStr, stock || 0, req.params.id],
    (err) => {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ error: 'Error al actualizar: ' + err.message });
      }
      
      // Invalidar caché de productos
      productsCache = null;
      
      res.json({ message: 'Actualizado' });
    }
  );
});

app.delete('/api/products/:id', auth, isAdmin, (req, res) => {
  db.run('DELETE FROM products WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar' });
    
    // Invalidar caché de productos
    productsCache = null;
    
    res.json({ message: 'Eliminado' });
  });
});

// USERS
app.get('/api/users', auth, isAdmin, (req, res) => {
  db.all('SELECT id, username, email, role FROM users', (err, rows) => {
    res.json(rows || []);
  });
});

app.put('/api/users/:id/role', auth, isAdmin, (req, res) => {
  db.run('UPDATE users SET role=? WHERE id=?', [req.body.role, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error' });
    res.json({ message: 'Rol actualizado' });
  });
});

// ORDERS
app.post('/api/orders', auth, async (req, res) => {
  const { items, total, paymentMethod } = req.body;
  
  // Validar que items sea un array
  if (items && !Array.isArray(items)) {
    return res.status(400).json({ error: 'Items debe ser un array' });
  }
  
  // Serializar items a JSON
  const itemsJson = items && items.length > 0 ? JSON.stringify(items) : null;
  
  db.run('INSERT INTO orders (user_id, total, payment_method, items) VALUES (?, ?, ?, ?)',
    [req.user.id, total, paymentMethod, itemsJson],
    async function(err) {
      if (err) return res.status(500).json({ error: 'Error al crear orden' });
      
      const orderId = this.lastID;
      
      // Guardar log de orden creada con detalles de productos
      const logDetails = formatPurchaseLog(items || [], total, paymentMethod);
      saveLog(req.user.id, 'Compra realizada', logDetails);
      
      // Enviar notificación WhatsApp (asíncrono, no bloquea la respuesta)
      let whatsappSent = false;
      try {
        const orderData = {
          orderId,
          items: items || [],
          total,
          paymentMethod,
          username: req.user.username,
          timestamp: new Date()
        };
        
        whatsappSent = await sendPurchaseNotification(orderData);
        
        if (whatsappSent) {
          saveLog(req.user.id, 'WhatsApp enviado', `Notificación de compra enviada para orden #${orderId}`);
        }
      } catch (error) {
        // No bloquear la orden si falla WhatsApp
        console.error('Error al enviar WhatsApp:', error.message);
        saveLog(req.user.id, 'Error WhatsApp', `Fallo al enviar notificación: ${error.message}`);
      }
      
      res.json({ 
        message: 'Orden creada',
        orderId: orderId,
        whatsappSent: whatsappSent
      });
    }
  );
});

// GET orders - obtener órdenes con items parseados
app.get('/api/orders', auth, (req, res) => {
  const query = req.user.role === 'admin' 
    ? 'SELECT o.*, u.username FROM orders o LEFT JOIN users u ON o.user_id=u.id ORDER BY o.created_at DESC'
    : 'SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC';
  
  const params = req.user.role === 'admin' ? [] : [req.user.id];
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener órdenes' });
    
    // Parsear items de JSON a array con manejo de errores
    const orders = (rows || []).map(order => {
      let parsedItems = [];
      
      if (order.items) {
        try {
          // Si items es un string, parsearlo
          if (typeof order.items === 'string') {
            parsedItems = JSON.parse(order.items);
          } else {
            // Si ya es un objeto/array, usarlo directamente
            parsedItems = order.items;
          }
        } catch (e) {
          console.error('Error parsing items for order', order.id, ':', e.message);
          parsedItems = [];
        }
      }
      
      return {
        ...order,
        items: parsedItems
      };
    });
    
    res.json(orders);
  });
});

// LOGS
app.get('/api/logs', auth, isAdmin, (req, res) => {
  db.all('SELECT l.*, u.username FROM logs l LEFT JOIN users u ON l.user_id=u.id ORDER BY l.created_at DESC LIMIT 50',
    (err, rows) => {
      res.json(rows || []);
    }
  );
});

// METRICS - Core Web Vitals
app.post('/api/metrics', (req, res) => {
  const { name, value, id, url, timestamp, userAgent } = req.body;
  
  // Validar datos básicos
  if (!name || value === undefined) {
    return res.status(400).json({ error: 'Name and value required' });
  }
  
  // Guardar métrica en logs para análisis
  const details = `${name}: ${value}ms | URL: ${url} | ID: ${id || 'N/A'}`;
  saveLog(null, 'Web Vital', details);
  
  // Respuesta rápida
  res.status(200).json({ received: true });
});

// GET metrics - Dashboard de métricas
app.get('/api/metrics', auth, isAdmin, (req, res) => {
  db.all(
    "SELECT * FROM logs WHERE action = 'Web Vital' ORDER BY created_at DESC LIMIT 100",
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error fetching metrics' });
      
      // Procesar métricas para dashboard
      const metrics = (rows || []).map(row => {
        const details = row.details || '';
        const match = details.match(/(\w+): ([\d.]+)ms/);
        return {
          id: row.id,
          name: match ? match[1] : 'Unknown',
          value: match ? parseFloat(match[2]) : 0,
          timestamp: row.created_at,
          details: details
        };
      });
      
      res.json(metrics);
    }
  );
});

// MÉTODOS DE PAGO ALTERNATIVOS (SIN DEPENDENCIA DE MP)

// MÉTODO 1: PAGO POR TRANSFERENCIA BANCARIA
app.post('/api/payment-transfer', auth, async (req, res) => {
  try {
    const { items, total } = req.body;
    
    // Validar datos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items requeridos' });
    }
    
    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Total inválido' });
    }
    
    // Generar número de orden único
    const orderNumber = `TRF-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Datos bancarios para mostrar al usuario
    const bankData = {
      banco: 'Banco Ejemplo',
      cbu: '0000003100010000000001',
      alias: 'SHOPMAN.STORE',
      titular: 'ShopManStore',
      cuit: '20-12345678-9'
    };
    
    // Guardar la orden como "pendiente de pago"
    const itemsJson = JSON.stringify(items);
    db.run('INSERT INTO orders (user_id, total, payment_method, items) VALUES (?, ?, ?, ?)',
      [req.user.id, total, `Transferencia - ${orderNumber}`, itemsJson],
      function(err) {
        if (err) {
          console.error('Error saving transfer order:', err);
          return res.status(500).json({ error: 'Error al crear orden' });
        }
        
        const orderId = this.lastID;
        
        // Guardar log
        const logDetails = formatPurchaseLog(items, total, `Transferencia - ${orderNumber}`);
        saveLog(req.user.id, 'Orden transferencia creada', logDetails);
        
        // Enviar notificación WhatsApp con datos bancarios
        (async () => {
          try {
            const orderData = {
              orderId: orderId,
              orderNumber: orderNumber,
              items: items,
              total,
              paymentMethod: 'Transferencia Bancaria',
              username: req.user.username,
              timestamp: new Date()
            };
            
            const whatsappSent = await sendPurchaseNotification(orderData);
            if (whatsappSent) {
              saveLog(req.user.id, 'WhatsApp enviado', `Datos bancarios enviados para orden ${orderNumber}`);
            }
          } catch (error) {
            console.error('Error al enviar WhatsApp:', error.message);
          }
        })();
        
        res.json({
          success: true,
          orderId: orderId,
          orderNumber: orderNumber,
          message: 'Orden creada. Realiza la transferencia con los datos proporcionados.',
          bankData: bankData,
          instructions: [
            '1. Realiza la transferencia bancaria con los datos proporcionados',
            '2. Envía el comprobante por WhatsApp al 5491122549995',
            '3. Incluye tu número de orden en el mensaje',
            '4. Tu pedido será procesado una vez confirmado el pago'
          ]
        });
      }
    );
    
  } catch (error) {
    console.error('Transfer payment error:', error);
    res.status(500).json({ error: 'Error al procesar pago por transferencia' });
  }
});

// MÉTODO 2: PAGO EN EFECTIVO / PUNTO DE RETIRO
app.post('/api/payment-cash', auth, async (req, res) => {
  try {
    const { items, total, pickupLocation } = req.body;
    
    // Validar datos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items requeridos' });
    }
    
    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Total inválido' });
    }
    
    // Generar código de retiro
    const pickupCode = `CASH-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Ubicaciones disponibles para retiro
    const locations = {
      'centro': 'Centro - Av. Corrientes 1234, CABA',
      'palermo': 'Palermo - Av. Santa Fe 5678, CABA',
      'belgrano': 'Belgrano - Av. Cabildo 9012, CABA'
    };
    
    const selectedLocation = locations[pickupLocation] || locations['centro'];
    
    // Guardar la orden
    const itemsJson = JSON.stringify(items);
    db.run('INSERT INTO orders (user_id, total, payment_method, items) VALUES (?, ?, ?, ?)',
      [req.user.id, total, `Efectivo - ${pickupCode}`, itemsJson],
      function(err) {
        if (err) {
          console.error('Error saving cash order:', err);
          return res.status(500).json({ error: 'Error al crear orden' });
        }
        
        const orderId = this.lastID;
        
        // Guardar log
        const logDetails = formatPurchaseLog(items, total, `Efectivo - ${pickupCode}`);
        saveLog(req.user.id, 'Orden efectivo creada', logDetails);
        
        // Enviar notificación WhatsApp
        (async () => {
          try {
            const orderData = {
              orderId: orderId,
              pickupCode: pickupCode,
              items: items,
              total,
              paymentMethod: 'Pago en Efectivo',
              username: req.user.username,
              timestamp: new Date()
            };
            
            const whatsappSent = await sendPurchaseNotification(orderData);
            if (whatsappSent) {
              saveLog(req.user.id, 'WhatsApp enviado', `Código de retiro enviado: ${pickupCode}`);
            }
          } catch (error) {
            console.error('Error al enviar WhatsApp:', error.message);
          }
        })();
        
        res.json({
          success: true,
          orderId: orderId,
          pickupCode: pickupCode,
          message: 'Orden creada. Retira y paga en nuestro local.',
          location: selectedLocation,
          instructions: [
            '1. Dirígete a la ubicación seleccionada',
            '2. Presenta tu código de retiro',
            '3. Paga en efectivo al retirar',
            '4. Horarios: Lun-Vie 9-18hs, Sáb 9-13hs'
          ]
        });
      }
    );
    
  } catch (error) {
    console.error('Cash payment error:', error);
    res.status(500).json({ error: 'Error al procesar pago en efectivo' });
  }
});

// MÉTODO 3: PAGO SOLO POR WHATSAPP (SIN MERCADO PAGO)
app.post('/api/payment-whatsapp', auth, async (req, res) => {
  try {
    const { items, total } = req.body;
    
    // Validar datos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items requeridos' });
    }
    
    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Total inválido' });
    }
    
    // Generar código de pedido
    const orderCode = `WA-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Guardar la orden
    const itemsJson = JSON.stringify(items);
    db.run('INSERT INTO orders (user_id, total, payment_method, items) VALUES (?, ?, ?, ?)',
      [req.user.id, total, `WhatsApp - ${orderCode}`, itemsJson],
      function(err) {
        if (err) {
          console.error('Error saving WhatsApp order:', err);
          return res.status(500).json({ error: 'Error al crear orden' });
        }
        
        const orderId = this.lastID;
        
        // Guardar log
        const logDetails = formatPurchaseLog(items, total, `WhatsApp - ${orderCode}`);
        saveLog(req.user.id, 'Orden WhatsApp creada', logDetails);
        
        // Crear mensaje para WhatsApp
        const whatsappMessage = `🛍️ *NUEVO PEDIDO - ${orderCode}*\n\n` +
          `👤 Cliente: ${req.user.username}\n` +
          `📦 Productos:\n${items.map(item => `• ${item.name} x${item.quantity || 1} - $${item.price}`).join('\n')}\n\n` +
          `💰 *Total: $${total}*\n\n` +
          `📱 El cliente se contactará para coordinar pago y entrega.`;
        
        // URL para WhatsApp Business
        const whatsappUrl = `https://wa.me/5491122549995?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Enviar notificación automática
        (async () => {
          try {
            const orderData = {
              orderId: orderId,
              orderCode: orderCode,
              items: items,
              total,
              paymentMethod: 'WhatsApp',
              username: req.user.username,
              timestamp: new Date()
            };
            
            const whatsappSent = await sendPurchaseNotification(orderData);
            if (whatsappSent) {
              saveLog(req.user.id, 'WhatsApp enviado', `Pedido enviado: ${orderCode}`);
            }
          } catch (error) {
            console.error('Error al enviar WhatsApp:', error.message);
          }
        })();
        
        res.json({
          success: true,
          orderId: orderId,
          orderCode: orderCode,
          message: 'Orden creada. Contacta por WhatsApp para coordinar.',
          whatsappUrl: whatsappUrl,
          whatsappNumber: '5491122549995',
          instructions: [
            '1. Haz clic en el enlace de WhatsApp',
            '2. Envía el mensaje pre-cargado',
            '3. Coordina forma de pago y entrega',
            '4. Recibirás confirmación una vez procesado'
          ]
        });
      }
    );
    
  } catch (error) {
    console.error('WhatsApp payment error:', error);
    res.status(500).json({ error: 'Error al procesar pedido por WhatsApp' });
  }
});

// ENDPOINT PARA OBTENER MÉTODOS DE PAGO DISPONIBLES
app.get('/api/payment-methods', (req, res) => {
  const methods = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Coordina pago y entrega por WhatsApp',
      icon: '📱',
      available: true,
      processing_time: 'Inmediato',
      fees: 'Sin comisión',
      recommended: true
    },
    {
      id: 'transfer',
      name: 'Transferencia Bancaria',
      description: 'Pago por transferencia o depósito bancario',
      icon: '🏦',
      available: true,
      processing_time: '24-48 horas',
      fees: 'Sin comisión'
    },
    {
      id: 'cash',
      name: 'Efectivo en Local',
      description: 'Paga en efectivo al retirar en nuestro local',
      icon: '💵',
      available: true,
      processing_time: 'Inmediato',
      fees: 'Sin comisión'
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      description: 'Pago online con tarjeta de crédito/débito',
      icon: '💳',
      available: !!mpPayment, // Solo disponible si MP está configurado
      processing_time: 'Inmediato',
      fees: 'Comisión MP aplicable'
    }
  ];
  
  res.json({
    methods: methods.filter(m => m.available), // Solo mostrar métodos disponibles
    default_method: 'whatsapp',
    message: 'Elige el método de pago que prefieras',
    total_methods: methods.filter(m => m.available).length
  });
});

// MERCADO PAGO (OPCIONAL)
// Crear pago con Mercado Pago (formato actualizado con token)
app.post('/api/mp-payment', auth, async (req, res) => {
  if (!mpPayment) {
    return res.status(503).json({ 
      error: 'Mercado Pago no configurado',
      suggestion: 'Usa otros métodos de pago disponibles: WhatsApp, Transferencia o Efectivo',
      alternative_methods: [
        { method: 'WhatsApp', endpoint: '/api/payment-whatsapp' },
        { method: 'Transferencia', endpoint: '/api/payment-transfer' },
        { method: 'Efectivo', endpoint: '/api/payment-cash' }
      ]
    });
  }
  
  try {
    const { items, total, paymentData } = req.body;
    
    // Validar datos requeridos
    if (!paymentData.token && !paymentData.card_number) {
      return res.status(400).json({ 
        error: 'Se requiere token de tarjeta o datos de tarjeta para testing' 
      });
    }
    
    // Crear el pago con el nuevo formato
    const body = {
      transaction_amount: Number(total),
      description: items.map(i => `${i.name} x${i.quantity || i.qty || 1}`).join(', '),
      payment_method_id: paymentData.payment_method_id || 'visa',
      
      // Datos del pagador
      payer: {
        email: req.user.email || req.user.username + '@shopmanstore.com',
        identification: {
          type: paymentData.identification_type || 'DNI',
          number: paymentData.identification_number || '12345678'
        }
      },
      
      // Usar token si está disponible (producción), sino datos directos (testing)
      ...(paymentData.token ? {
        token: paymentData.token
      } : {
        // Formato legacy para testing (puede fallar en producción)
        card: {
          number: paymentData.card_number,
          security_code: paymentData.security_code,
          expiration_month: parseInt(paymentData.expiration_month),
          expiration_year: parseInt(paymentData.expiration_year),
          cardholder: {
            name: paymentData.cardholder_name,
            identification: {
              type: paymentData.identification_type || 'DNI',
              number: paymentData.identification_number || '12345678'
            }
          }
        }
      }),
      
      installments: parseInt(paymentData.installments) || 1,
      
      // Información adicional para mejor procesamiento
      additional_info: {
        items: items.map(item => ({
          id: item.id?.toString() || 'item',
          title: item.name,
          description: item.name,
          category_id: 'clothing',
          quantity: item.quantity || item.qty || 1,
          unit_price: Number(item.price)
        })),
        payer: {
          first_name: paymentData.cardholder_name?.split(' ')[0] || 'Cliente',
          last_name: paymentData.cardholder_name?.split(' ').slice(1).join(' ') || 'ShopManStore'
        }
      }
    };
    
    console.log('Procesando pago MP:', {
      amount: body.transaction_amount,
      method: body.payment_method_id,
      hasToken: !!paymentData.token,
      user: req.user.username
    });
    
    const response = await mpPayment.create({ body });
    
    console.log('Respuesta MP:', response.status, response.status_detail);
    
    // Guardar la orden en la base de datos
    const itemsJson = items && items.length > 0 ? JSON.stringify(items) : null;
    db.run('INSERT INTO orders (user_id, total, payment_method, items) VALUES (?, ?, ?, ?)',
      [req.user.id, total, 'Mercado Pago - Tarjeta', itemsJson],
      function(err) {
        if (err) {
          console.error('Error saving order:', err);
          return;
        }
        
        const orderId = this.lastID;
        
        // Guardar log con detalles
        const logDetails = formatPurchaseLog(items || [], total, 'Mercado Pago - Tarjeta');
        saveLog(req.user.id, 'Compra realizada', logDetails);
        
        // Enviar notificación WhatsApp (sin await para no bloquear)
        (async () => {
          try {
            const orderData = {
              orderId: orderId,
              items: items || [],
              total,
              paymentMethod: 'Mercado Pago - Tarjeta',
              username: req.user.username,
              timestamp: new Date()
            };
            
            const whatsappSent = await sendPurchaseNotification(orderData);
            if (whatsappSent) {
              saveLog(req.user.id, 'WhatsApp enviado', `Notificación enviada para orden #${orderId}`);
            }
          } catch (error) {
            console.error('Error al enviar WhatsApp:', error.message);
            saveLog(req.user.id, 'Error WhatsApp', `Fallo al enviar notificación: ${error.message}`);
          }
        })();
      }
    );
    
    res.json({ 
      status: response.status,
      status_detail: response.status_detail,
      id: response.id,
      payment_id: response.id
    });
  } catch (err) {
    console.error('MP Payment Error:', err);
    
    // Proporcionar información más detallada del error
    let errorMessage = 'Error al procesar el pago';
    if (err.message) {
      errorMessage = err.message;
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: err.cause || [],
      suggestion: 'Usa el método de pago por link (/api/mp-link) que es más seguro y confiable'
    });
  }
});

// Endpoint alternativo para generar link de pago (OPCIONAL - solo si MP está configurado)
app.post('/api/mp-link', auth, async (req, res) => {
  // Verificar si MP está configurado
  if (!MP_TOKEN || MP_TOKEN.includes('APP_USR-312986056474853')) {
    return res.status(503).json({ 
      error: 'Mercado Pago no configurado para producción',
      message: 'Usa otros métodos de pago disponibles',
      alternative_methods: [
        { method: 'WhatsApp', endpoint: '/api/payment-whatsapp', recommended: true },
        { method: 'Transferencia', endpoint: '/api/payment-transfer' },
        { method: 'Efectivo', endpoint: '/api/payment-cash' }
      ]
    });
  }
  
  try {
    const { items, total } = req.body;
    
    // Validar datos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items requeridos' });
    }
    
    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Total inválido' });
    }
    
    console.log('Creando preferencia MP para:', req.user.username, 'Total:', total);
    
    // Crear preferencia de pago (funciona en TEST y PRODUCCIÓN)
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: items.map(item => ({
          title: item.name,
          quantity: item.quantity || item.qty || 1,
          unit_price: Number(item.price),
          currency_id: 'ARS'
        })),
        payer: {
          email: req.user.username + '@shopmanstore.com'
        },
        external_reference: `order_${Date.now()}`,
        statement_descriptor: 'ShopManStore'
      })
    });
    
    const data = await response.json();
    
    console.log('Respuesta de MP:', {
      status: response.status,
      preference_id: data.id,
      init_point: data.init_point
    });
    
    if (response.ok) {
      // Guardar la orden en la base de datos
      const itemsJson = items && items.length > 0 ? JSON.stringify(items) : null;
      db.run('INSERT INTO orders (user_id, total, payment_method, items) VALUES (?, ?, ?, ?)',
        [req.user.id, total, 'Mercado Pago - Pref: ' + data.id, itemsJson],
        function(err) {
          if (err) {
            console.error('Error saving order:', err);
            return;
          }
          
          const orderId = this.lastID;
          console.log('Orden guardada exitosamente, ID:', orderId);
          
          // Guardar log con detalles
          const logDetails = formatPurchaseLog(items || [], total, 'Mercado Pago - Link');
          saveLog(req.user.id, 'Compra realizada', logDetails);
          
          // Enviar notificación WhatsApp (sin await para no bloquear)
          (async () => {
            try {
              const orderData = {
                orderId: orderId,
                items: items || [],
                total,
                paymentMethod: 'Mercado Pago - Link',
                username: req.user.username,
                timestamp: new Date()
              };
              
              const whatsappSent = await sendPurchaseNotification(orderData);
              if (whatsappSent) {
                saveLog(req.user.id, 'WhatsApp enviado', `Notificación enviada para orden #${orderId}`);
              }
            } catch (error) {
              console.error('Error al enviar WhatsApp:', error.message);
              saveLog(req.user.id, 'Error WhatsApp', `Fallo al enviar notificación: ${error.message}`);
            }
          })();
        }
      );
      
      res.json({ 
        link: data.init_point, // Link para pagar
        sandbox_link: data.sandbox_init_point, // Link para TEST
        preference_id: data.id,
        status: 'pending'
      });
    } else {
      console.error('Error de MP:', data);
      res.status(response.status).json({ 
        error: data.message || data.error || 'Error al crear preferencia de pago',
        details: data.cause || []
      });
    }
  } catch (err) {
    console.error('MP Link Error:', err);
    res.status(500).json({ 
      error: 'Error de conexión con Mercado Pago: ' + err.message 
    });
  }
});

// Health check endpoint optimizado (para keep-alive services)
app.get('/health', (req, res) => {
  // Respuesta ultra rápida sin consultas DB
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Endpoint de ping interno para keep-alive
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Catch-all route para SPA (debe ir al final)
app.get('*', (req, res) => {
  // Solo servir index.html si no es una ruta de API
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ error: 'Ruta no encontrada' });
  }
});

// Sistema de keep-alive interno para evitar cold starts
const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000; // 5 minutos
let keepAliveTimer;

function startKeepAlive() {
  if (process.env.NODE_ENV === 'production') {
    keepAliveTimer = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:${PORT}/ping`);
        if (response.ok) {
          console.log('✅ Keep-alive ping successful');
        }
      } catch (error) {
        console.log('❌ Keep-alive ping failed:', error.message);
      }
    }, KEEP_ALIVE_INTERVAL);
    
    console.log('🔄 Keep-alive system started (5 min intervals)');
  }
}

function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    console.log('⏹️ Keep-alive system stopped');
  }
}

// Manejar cierre graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  stopKeepAlive();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  stopKeepAlive();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log('🚀 Server: http://localhost:' + PORT);
  console.log('🌍 Environment: ' + (process.env.NODE_ENV || 'development'));
  console.log('⚡ Optimizations: Compression, Caching, Keep-alive');
  
  // Iniciar keep-alive después de que el servidor esté listo
  setTimeout(startKeepAlive, 10000); // Esperar 10 segundos
});
