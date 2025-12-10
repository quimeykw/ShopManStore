const bcrypt = require('bcryptjs');

function initDatabase(db, isPostgres = false) {
  db.serialize(() => {
    if (isPostgres) {
      // PostgreSQL
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'cliente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT,
        description TEXT,
        price REAL,
        image TEXT,
        images TEXT,
        sizes TEXT,
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
      
      // Migrar columnas si la tabla ya existe (para bases de datos antiguas)
      db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes TEXT`, (err) => {
        if (!err) console.log('✓ Columna sizes verificada/agregada');
      });
      
      db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0`, (err) => {
        if (!err) console.log('✓ Columna stock verificada/agregada');
      });
      
      db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT`, (err) => {
        if (!err) console.log('✓ Columna images verificada/agregada');
      });

      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        total REAL,
        payment_method TEXT,
        items TEXT,
        transaction_id TEXT,
        payment_status TEXT DEFAULT 'pending',
        card_last_four TEXT,
        card_type TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // Migrar columnas de orders si la tabla ya existe
      db.run(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS items TEXT`, (err) => {
        if (!err) console.log('✓ Columna items verificada/agregada en orders');
      });
      
      db.run(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id TEXT`, (err) => {
        if (!err) console.log('✓ Columna transaction_id verificada/agregada en orders');
      });
      
      db.run(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending'`, (err) => {
        if (!err) console.log('✓ Columna payment_status verificada/agregada en orders');
      });
      
      db.run(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS card_last_four TEXT`, (err) => {
        if (!err) console.log('✓ Columna card_last_four verificada/agregada en orders');
      });
      
      db.run(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS card_type TEXT`, (err) => {
        if (!err) console.log('✓ Columna card_type verificada/agregada en orders');
      });

      db.run(`CREATE TABLE IF NOT EXISTS payment_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        order_id INTEGER,
        transaction_id TEXT,
        payment_method TEXT,
        card_type TEXT,
        card_last_four TEXT,
        amount REAL,
        status TEXT,
        mp_response TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        action TEXT,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS password_resets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`);

      db.run(`CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id)`);
      
      // Índices para payment_logs (PostgreSQL)
      db.run(`CREATE INDEX IF NOT EXISTS idx_payment_logs_user_id ON payment_logs(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_payment_logs_order_id ON payment_logs(order_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_payment_logs_transaction_id ON payment_logs(transaction_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_orders_transaction_id ON orders(transaction_id)`);

      // Crear usuario admin (PostgreSQL)
      const adminPass = bcrypt.hashSync('admin123', 10);
      db.run(`INSERT INTO users (username, email, password, role) 
              VALUES (?, ?, ?, ?)
              ON CONFLICT (username) DO NOTHING`, 
              ['admin', 'admin@store.com', adminPass, 'admin'], (err) => {
        if (!err) console.log('✓ Usuario admin inicializado');
      });
    } else {
      // SQLite
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'cliente',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price REAL,
        image TEXT,
        images TEXT,
        sizes TEXT,
        stock INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        total REAL,
        payment_method TEXT,
        items TEXT,
        transaction_id TEXT,
        payment_status TEXT DEFAULT 'pending',
        card_last_four TEXT,
        card_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Migrar columnas de orders si la tabla ya existe (SQLite)
      db.run(`PRAGMA table_info(orders)`, (err, rows) => {
        if (!err) {
          db.all(`PRAGMA table_info(orders)`, (err, columns) => {
            if (!err && columns) {
              const columnNames = columns.map(col => col.name);
              
              if (!columnNames.includes('items')) {
                db.run(`ALTER TABLE orders ADD COLUMN items TEXT`, (err) => {
                  if (!err) console.log('✓ Columna items agregada a orders');
                });
              }
              
              if (!columnNames.includes('transaction_id')) {
                db.run(`ALTER TABLE orders ADD COLUMN transaction_id TEXT`, (err) => {
                  if (!err) console.log('✓ Columna transaction_id agregada a orders');
                });
              }
              
              if (!columnNames.includes('payment_status')) {
                db.run(`ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'pending'`, (err) => {
                  if (!err) console.log('✓ Columna payment_status agregada a orders');
                });
              }
              
              if (!columnNames.includes('card_last_four')) {
                db.run(`ALTER TABLE orders ADD COLUMN card_last_four TEXT`, (err) => {
                  if (!err) console.log('✓ Columna card_last_four agregada a orders');
                });
              }
              
              if (!columnNames.includes('card_type')) {
                db.run(`ALTER TABLE orders ADD COLUMN card_type TEXT`, (err) => {
                  if (!err) console.log('✓ Columna card_type agregada a orders');
                });
              }
            }
          });
        }
      });

      db.run(`CREATE TABLE IF NOT EXISTS payment_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        order_id INTEGER,
        transaction_id TEXT,
        payment_method TEXT,
        card_type TEXT,
        card_last_four TEXT,
        amount REAL,
        status TEXT,
        mp_response TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`);

      db.run(`CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id)`);
      
      // Índices para payment_logs (SQLite)
      db.run(`CREATE INDEX IF NOT EXISTS idx_payment_logs_user_id ON payment_logs(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_payment_logs_order_id ON payment_logs(order_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_payment_logs_transaction_id ON payment_logs(transaction_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_orders_transaction_id ON orders(transaction_id)`);

      // Crear usuario admin (SQLite)
      const adminPass = bcrypt.hashSync('admin123', 10);
      db.run(`INSERT OR IGNORE INTO users (username, email, password, role) 
              VALUES (?, ?, ?, ?)`, 
              ['admin', 'admin@store.com', adminPass, 'admin'], (err) => {
        if (!err) console.log('✓ Usuario admin inicializado');
      });
      
      // Migrar productos existentes de image a images
      setTimeout(() => {
        db.all(`SELECT id, image, images FROM products WHERE images IS NULL AND image IS NOT NULL`, (err, rows) => {
          if (!err && rows && rows.length > 0) {
            console.log(`🔄 Migrando ${rows.length} productos a formato de múltiples imágenes...`);
            rows.forEach(row => {
              const imagesArray = JSON.stringify([row.image]);
              db.run('UPDATE products SET images = ? WHERE id = ?', [imagesArray, row.id]);
            });
            console.log('✓ Migración de imágenes completada');
          }
        });
      }, 500);
    }
  });
}

module.exports = initDatabase;
