require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const db = require('./db-config');
const initDatabase = require('./init-db');

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

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

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

// AUTH
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
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
      res.json({ message: 'Registrado exitosamente' });
    }
  );
});

// FORGOT PASSWORD
app.post('/api/forgot-password', (req, res) => {
  const { identifier } = req.body; // username or email
  
  // Buscar usuario por username o email
  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [identifier, identifier], (err, user) => {
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Por seguridad, en producción deberías enviar un email con un token
    // Para desarrollo, devolvemos la información directamente
    res.json({ 
      message: 'Usuario encontrado',
      username: user.username,
      email: user.email,
      hint: 'Contacta al administrador para restablecer tu contraseña'
    });
  });
});

// RESET PASSWORD (para que el admin pueda resetear contraseñas)
app.post('/api/reset-password', auth, isAdmin, (req, res) => {
  const { userId, newPassword } = req.body;
  const hash = bcrypt.hashSync(newPassword, 10);
  
  db.run('UPDATE users SET password = ? WHERE id = ?', [hash, userId], (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar contraseña' });
    res.json({ message: 'Contraseña actualizada exitosamente' });
  });
});

// PRODUCTS
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    // Deserializar images de JSON a array
    const products = (rows || []).map(row => ({
      ...row,
      images: row.images ? JSON.parse(row.images) : (row.image ? [row.image] : [])
    }));
    res.json(products);
  });
});

app.post('/api/products', auth, isAdmin, (req, res) => {
  const { name, description, price, image, images, sizes, stock } = req.body;
  
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
  const imagesJson = JSON.stringify(imageArray);
  
  db.run('INSERT INTO products (name, description, price, image, images, sizes, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, imageArray[0] || null, imagesJson, sizesStr, stock || 0],
    function(err) {
      if (err) {
        console.error('Error creating product:', err);
        return res.status(500).json({ error: 'Error al crear: ' + err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/products/:id', auth, isAdmin, (req, res) => {
  const { name, description, price, image, images, sizes, stock } = req.body;
  
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
  const imagesJson = JSON.stringify(imageArray);
  
  db.run('UPDATE products SET name=?, description=?, price=?, image=?, images=?, sizes=?, stock=? WHERE id=?',
    [name, description, price, imageArray[0] || null, imagesJson, sizesStr, stock || 0, req.params.id],
    (err) => {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ error: 'Error al actualizar: ' + err.message });
      }
      res.json({ message: 'Actualizado' });
    }
  );
});

app.delete('/api/products/:id', auth, isAdmin, (req, res) => {
  db.run('DELETE FROM products WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar' });
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
app.post('/api/orders', auth, (req, res) => {
  const { total, paymentMethod } = req.body;
  db.run('INSERT INTO orders (user_id, total, payment_method) VALUES (?, ?, ?)',
    [req.user.id, total, paymentMethod],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error' });
      res.json({ message: 'Orden creada' });
    }
  );
});

// LOGS
app.get('/api/logs', auth, isAdmin, (req, res) => {
  db.all('SELECT l.*, u.username FROM logs l LEFT JOIN users u ON l.user_id=u.id ORDER BY l.created_at DESC LIMIT 50',
    (err, rows) => {
      res.json(rows || []);
    }
  );
});

// MERCADO PAGO
// Crear pago con Mercado Pago
app.post('/api/mp-payment', auth, async (req, res) => {
  if (!mpPayment) return res.status(503).json({ error: 'MP no configurado' });
  
  try {
    const { items, total, paymentData } = req.body;
    
    // Crear el pago
    const body = {
      transaction_amount: Number(total),
      description: items.map(i => `${i.name} x${i.qty}`).join(', '),
      payment_method_id: paymentData.payment_method_id || 'visa',
      payer: {
        email: paymentData.email || req.user.username + '@shopmanstore.com',
        identification: {
          type: paymentData.identification_type || 'DNI',
          number: paymentData.identification_number || '12345678'
        }
      },
      token: paymentData.token, // Token de la tarjeta generado por MP.js
      installments: paymentData.installments || 1,
      issuer_id: paymentData.issuer_id
    };
    
    const response = await mpPayment.create({ body });
    
    // Guardar la orden en la base de datos
    db.run('INSERT INTO orders (user_id, total, payment_method) VALUES (?, ?, ?)',
      [req.user.id, total, 'Mercado Pago'],
      (err) => {
        if (err) console.error('Error saving order:', err);
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
    res.status(500).json({ error: err.message || 'Error al procesar el pago' });
  }
});

// Endpoint alternativo para generar link de pago (mantener compatibilidad)
app.post('/api/mp-link', auth, async (req, res) => {
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
          quantity: item.qty,
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
      db.run('INSERT INTO orders (user_id, total, payment_method) VALUES (?, ?, ?)',
        [req.user.id, total, 'Mercado Pago - Pref: ' + data.id],
        (err) => {
          if (err) console.error('Error saving order:', err);
          else console.log('Orden guardada exitosamente');
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

// Catch-all route para SPA (debe ir al final)
app.get('*', (req, res) => {
  // Solo servir index.html si no es una ruta de API
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ error: 'Ruta no encontrada' });
  }
});

app.listen(PORT, () => {
  console.log('Server: http://localhost:' + PORT);
  console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
});
