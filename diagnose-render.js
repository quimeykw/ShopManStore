// Script de diagnóstico rápido para Render
require('dotenv').config();

console.log('🔍 DIAGNÓSTICO RÁPIDO DEL SISTEMA\n');
console.log('═'.repeat(60));

// 1. Información del entorno
console.log('\n📊 INFORMACIÓN DEL ENTORNO');
console.log('─'.repeat(60));
console.log(`Node Version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Uptime: ${Math.floor(process.uptime())} segundos`);
console.log(`Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);

// 2. Variables de entorno críticas
console.log('\n🔐 VARIABLES DE ENTORNO');
console.log('─'.repeat(60));

const envVars = {
  'PORT': process.env.PORT || 'No configurado',
  'NODE_ENV': process.env.NODE_ENV || 'No configurado',
  'DATABASE_URL': process.env.DATABASE_URL ? '✓ Configurado' : '✗ No configurado',
  'JWT_SECRET': process.env.JWT_SECRET ? '✓ Configurado' : '✗ No configurado',
  'MP_TOKEN': process.env.MP_TOKEN ? '✓ Configurado' : '✗ No configurado',
  'WHATSAPP_PHONE': process.env.WHATSAPP_PHONE || 'No configurado',
  'WHATSAPP_ENABLED': process.env.WHATSAPP_ENABLED || 'true (default)',
  'EMAIL_USER': process.env.EMAIL_USER ? '✓ Configurado' : '✗ No configurado',
  'EMAIL_APP_PASSWORD': process.env.EMAIL_APP_PASSWORD ? '✓ Configurado' : '✗ No configurado'
};

Object.entries(envVars).forEach(([key, value]) => {
  const icon = value.includes('✓') ? '✅' : value.includes('✗') ? '❌' : '⚠️';
  console.log(`${icon} ${key}: ${value}`);
});

// 3. Dependencias
console.log('\n📦 DEPENDENCIAS CRÍTICAS');
console.log('─'.repeat(60));

const deps = [
  'express',
  'bcryptjs',
  'jsonwebtoken',
  'cors',
  'sqlite3',
  'pg',
  'mercadopago',
  'compression',
  'dotenv'
];

deps.forEach(dep => {
  try {
    const pkg = require(`${dep}/package.json`);
    console.log(`✅ ${dep}: v${pkg.version}`);
  } catch (err) {
    console.log(`❌ ${dep}: No instalado`);
  }
});

// 4. Archivos críticos
console.log('\n📁 ARCHIVOS CRÍTICOS');
console.log('─'.repeat(60));

const fs = require('fs');
const files = [
  'server.js',
  'db-config.js',
  'init-db.js',
  'whatsapp-service.js',
  'email-service.js',
  'public/index.html',
  'public/app.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    const size = Math.round(stats.size / 1024);
    console.log(`✅ ${file} (${size} KB)`);
  } else {
    console.log(`❌ ${file}: No encontrado`);
  }
});

// 5. Test de base de datos
console.log('\n🗄️  BASE DE DATOS');
console.log('─'.repeat(60));

const db = require('./db-config');
const isPostgres = !!process.env.DATABASE_URL;

console.log(`Tipo: ${isPostgres ? 'PostgreSQL' : 'SQLite'}`);

db.get('SELECT 1 as test', (err, row) => {
  if (err) {
    console.log(`❌ Conexión: Error - ${err.message}`);
    finishDiagnosis();
  } else {
    console.log('✅ Conexión: OK');
    
    // Contar registros en tablas principales
    const queries = [
      { name: 'users', query: 'SELECT COUNT(*) as count FROM users' },
      { name: 'products', query: 'SELECT COUNT(*) as count FROM products' },
      { name: 'orders', query: 'SELECT COUNT(*) as count FROM orders' },
      { name: 'logs', query: 'SELECT COUNT(*) as count FROM logs' }
    ];
    
    let completed = 0;
    queries.forEach(({ name, query }) => {
      db.get(query, (err, result) => {
        if (err) {
          console.log(`❌ Tabla ${name}: Error - ${err.message}`);
        } else {
          console.log(`✅ Tabla ${name}: ${result.count} registros`);
        }
        
        completed++;
        if (completed === queries.length) {
          // Verificar columna items
          if (isPostgres) {
            db.all(`SELECT column_name FROM information_schema.columns WHERE table_name = 'orders'`, (err, columns) => {
              if (!err && columns) {
                const hasItems = columns.some(c => c.column_name === 'items');
                console.log(`${hasItems ? '✅' : '❌'} Columna items en orders: ${hasItems ? 'Existe' : 'No existe'}`);
              }
              finishDiagnosis();
            });
          } else {
            db.all(`PRAGMA table_info(orders)`, (err, columns) => {
              if (!err && columns) {
                const hasItems = columns.some(c => c.name === 'items');
                console.log(`${hasItems ? '✅' : '❌'} Columna items en orders: ${hasItems ? 'Existe' : 'No existe'}`);
              }
              finishDiagnosis();
            });
          }
        }
      });
    });
  }
});

function finishDiagnosis() {
  // 6. Servicios
  console.log('\n🔧 SERVICIOS');
  console.log('─'.repeat(60));
  
  try {
    const { WHATSAPP_ENABLED, WHATSAPP_PHONE } = require('./whatsapp-service');
    console.log(`✅ WhatsApp: ${WHATSAPP_ENABLED ? 'Habilitado' : 'Deshabilitado'} (${WHATSAPP_PHONE})`);
  } catch (err) {
    console.log(`❌ WhatsApp: Error - ${err.message}`);
  }
  
  try {
    const { emailEnabled } = require('./email-service');
    console.log(`✅ Email: ${emailEnabled ? 'Habilitado' : 'Deshabilitado'}`);
  } catch (err) {
    console.log(`❌ Email: Error - ${err.message}`);
  }
  
  try {
    const { MercadoPagoConfig } = require('mercadopago');
    const MP_TOKEN = process.env.MP_TOKEN;
    if (MP_TOKEN) {
      const isTestToken = MP_TOKEN.includes('TEST');
      console.log(`✅ Mercado Pago: Configurado (${isTestToken ? 'TEST' : 'PRODUCCIÓN'})`);
    } else {
      console.log('⚠️  Mercado Pago: Token no configurado');
    }
  } catch (err) {
    console.log(`❌ Mercado Pago: Error - ${err.message}`);
  }
  
  // 7. Resumen
  console.log('\n' + '═'.repeat(60));
  console.log('📋 RESUMEN');
  console.log('═'.repeat(60));
  
  const hasDatabase = !!process.env.DATABASE_URL;
  const hasJWT = !!process.env.JWT_SECRET;
  const filesExist = fs.existsSync('server.js') && fs.existsSync('db-config.js');
  
  if (hasDatabase && hasJWT && filesExist) {
    console.log('✅ Sistema operativo');
    console.log('\n💡 Si hay problemas:');
    console.log('   1. Revisa los logs arriba para errores específicos');
    console.log('   2. Verifica que todas las variables de entorno estén configuradas');
    console.log('   3. Ejecuta: node migrate-add-items-column.js si falta la columna items');
    console.log('   4. Reinicia el servicio en Render');
  } else {
    console.log('❌ Sistema tiene problemas de configuración');
    console.log('\n🔧 Acciones requeridas:');
    if (!hasDatabase) console.log('   - Configura DATABASE_URL en Render');
    if (!hasJWT) console.log('   - Configura JWT_SECRET en Render');
    if (!filesExist) console.log('   - Verifica que todos los archivos se hayan subido correctamente');
  }
  
  console.log('\n' + '═'.repeat(60));
  process.exit(0);
}
