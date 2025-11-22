const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const db = require('./db-config');
const initDatabase = require('./init-db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'shopmanstore_secret_key_2024';
const isPostgres = !!process.env.DATABASE_URL;

// Configurar Mercado Pago
const MP_TOKEN = process.env.MP_TOKEN || 'APP_USR-5802293204482723-111823-41d8e3354a2e15c8dbc4802b59524b0d-3001373888';
let mpClient = null;
let mpPreference = null;

try {
  mpClient = new MercadoPagoConfig({ accessToken: MP_TOKEN });
  mpPreference = new Preference(mpClient);
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
  
  // Validar máximo 5 imágenes
  if (imageArray.length > 5) {
    return res.status(400).json({ error: 'Máximo 5 imágenes permitidas' });
  }
  
  // Validar tamaño de cada imagen (aproximadamente 2MB en base64)
  const MAX_SIZE = 2 * 1024 * 1024 * 1.37; // Base64 es ~37% más grande
  for (const img of imageArray) {
    if (img && img.length > MAX_SIZE) {
      return res.status(400).json({ error: 'Cada imagen debe ser menor a 2MB' });
    }
  }
  
  const sizesStr = Array.isArray(sizes) ? sizes.join(',') : sizes || '';
  const imagesJson = JSON.stringify(imageArray);
  
  db.run('INSERT INTO products (name, description, price, image, images, sizes, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, imageArray[0] || null, imagesJson, sizesStr, stock || 0],
    function(err) {
      if (err) return res.status(500).json({ error: 'Error al crear' });
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
  
  // Validar máximo 5 imágenes
  if (imageArray.length > 5) {
    return res.status(400).json({ error: 'Máximo 5 imágenes permitidas' });
  }
  
  // Validar tamaño de cada imagen
  const MAX_SIZE = 2 * 1024 * 1024 * 1.37;
  for (const img of imageArray) {
    if (img && img.length > MAX_SIZE) {
      return res.status(400).json({ error: 'Cada imagen debe ser menor a 2MB' });
    }
  }
  
  const sizesStr = Array.isArray(sizes) ? sizes.join(',') : sizes || '';
  const imagesJson = JSON.stringify(imageArray);
  
  db.run('UPDATE products SET name=?, description=?, price=?, image=?, images=?, sizes=?, stock=? WHERE id=?',
    [name, description, price, imageArray[0] || null, imagesJson, sizesStr, stock || 0, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar' });
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
app.post('/api/mp-link', auth, async (req, res) => {
  if (!mpPreference) return res.status(503).json({ error: 'MP no configurado' });
  
  try {
    const { items, total } = req.body;
    const body = {
      items: items.map(i => ({
        title: i.name,
        unit_price: Number(i.price),
        quantity: Number(i.qty),
        currency_id: 'ARS'
      }))
    };
    
    const response = await mpPreference.create({ body });
    res.json({ link: response.init_point || response.sandbox_init_point });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
