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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        total REAL,
        payment_method TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        action TEXT,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        total REAL,
        payment_method TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Crear usuario admin (SQLite)
      const adminPass = bcrypt.hashSync('admin123', 10);
      db.run(`INSERT OR IGNORE INTO users (username, email, password, role) 
              VALUES (?, ?, ?, ?)`, 
              ['admin', 'admin@store.com', adminPass, 'admin'], (err) => {
        if (!err) console.log('✓ Usuario admin inicializado');
      });
    }
  });
}

module.exports = initDatabase;
