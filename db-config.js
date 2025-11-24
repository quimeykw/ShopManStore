// Configuración de base de datos
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const DATABASE_URL = process.env.DATABASE_URL;

let db;

if (DATABASE_URL) {
  // PostgreSQL (producción o desarrollo)
  console.log('Usando PostgreSQL');
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  // Convertir ? a $1, $2, etc para PostgreSQL
  const convertSQL = (sql) => {
    let index = 0;
    return sql.replace(/\?/g, () => `$${++index}`);
  };

  db = {
    run: (sql, params, callback) => {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      pool.query(convertSQL(sql), params)
        .then(result => callback && callback(null, result))
        .catch(err => callback && callback(err));
    },
    get: (sql, params, callback) => {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      pool.query(convertSQL(sql), params)
        .then(result => callback && callback(null, result.rows[0]))
        .catch(err => callback && callback(err));
    },
    all: (sql, params, callback) => {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      pool.query(convertSQL(sql), params)
        .then(result => callback && callback(null, result.rows))
        .catch(err => callback && callback(err));
    },
    serialize: (callback) => callback()
  };
} else {
  // SQLite para desarrollo local
  console.log('Usando SQLite');
  db = new sqlite3.Database('./store.db');
}

module.exports = db;
