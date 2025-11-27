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
      
      // Si es un INSERT, agregar RETURNING id para obtener el lastID
      let modifiedSql = sql;
      if (sql.trim().toUpperCase().startsWith('INSERT') && !sql.toUpperCase().includes('RETURNING')) {
        modifiedSql = sql.trim() + ' RETURNING id';
      }
      
      pool.query(convertSQL(modifiedSql), params)
        .then(result => {
          // Simular el comportamiento de SQLite con this.lastID
          const context = {
            lastID: result.rows && result.rows[0] ? result.rows[0].id : undefined
          };
          callback && callback.call(context, null, result);
        })
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
