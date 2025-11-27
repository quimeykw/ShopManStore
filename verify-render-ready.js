// Verificación completa para deploy a Render
require('dotenv').config();
const fs = require('fs');
const db = require('./db-config');

console.log('🚀 VERIFICACIÓN COMPLETA PARA RENDER\n');
console.log('═'.repeat(60));

let errors = 0;
let warnings = 0;
let checks = 0;

function check(name, condition, errorMsg, isWarning = false) {
  checks++;
  if (condition) {
    console.log(`✅ ${name}`);
    return true;
  } else {
    if (isWarning) {
      console.log(`⚠️  ${name}: ${errorMsg}`);
      warnings++;
    } else {
      console.log(`❌ ${name}: ${errorMsg}`);
      errors++;
    }
    return false;
  }
}

// FASE 1: Archivos críticos
console.log('\n📁 FASE 1: Archivos críticos');
console.log('─'.repeat(60));

const criticalFiles = [
  'server.js',
  'db-config.js',
  'init-db.js',
  'whatsapp-service.js',
  'email-service.js',
  'public/index.html',
  'public/app.js',
  'package.json'
];

criticalFiles.forEach(file => {
  check(`Archivo ${file}`, fs.existsSync(file), 'No encontrado');
});

// FASE 2: Variables de entorno
console.log('\n🔐 FASE 2: Variables de entorno');
console.log('─'.repeat(60));

check('JWT_SECRET', process.env.JWT_SECRET, 'Variable requerida no configurada');
check('DATABASE_URL', process.env.DATABASE_URL, 'Variable requerida no configurada');
check('MP_TOKEN', process.env.MP_TOKEN, 'Token de Mercado Pago no configurado', true);
check('WHATSAPP_PHONE', process.env.WHATSAPP_PHONE, 'Teléfono WhatsApp no configurado', true);

// FASE 3: Dependencias
console.log('\n📦 FASE 3: Dependencias npm');
console.log('─'.repeat(60));

const dependencies = [
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

dependencies.forEach(dep => {
  try {
    require(dep);
    check(`Dependencia ${dep}`, true, '');
  } catch (err) {
    check(`Dependencia ${dep}`, false, 'No instalada');
  }
});

// FASE 4: Conexión a base de datos
console.log('\n🗄️  FASE 4: Base de datos');
console.log('─'.repeat(60));

db.get('SELECT 1 as test', (err, row) => {
  if (err) {
    check('Conexión a BD', false, err.message);
    finishVerification();
  } else {
    check('Conexión a BD', true, '');
    
    const isPostgres = !!process.env.DATABASE_URL;
    console.log(`   Tipo: ${isPostgres ? 'PostgreSQL' : 'SQLite'}`);
    
    // Verificar tablas
    if (isPostgres) {
      db.all(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`, (err, tables) => {
        if (err) {
          check('Tablas de BD', false, err.message);
          finishVerification();
        } else {
          const tableNames = tables.map(t => t.table_name);
          const requiredTables = ['users', 'products', 'orders', 'logs', 'password_resets'];
          
          requiredTables.forEach(table => {
            check(`Tabla ${table}`, tableNames.includes(table), 'Tabla no existe');
          });
          
          // Verificar columna items
          db.all(`SELECT column_name FROM information_schema.columns WHERE table_name = 'orders'`, (err, columns) => {
            if (!err && columns) {
              const hasItems = columns.some(c => c.column_name === 'items');
              if (!check('Columna items en orders', hasItems, 'Ejecuta: node migrate-add-items-column.js')) {
                console.log('   💡 Solución: node migrate-add-items-column.js');
              }
            }
            finishVerification();
          });
        }
      });
    } else {
      db.all(`SELECT name FROM sqlite_master WHERE type='table'`, (err, tables) => {
        if (err) {
          check('Tablas de BD', false, err.message);
          finishVerification();
        } else {
          const tableNames = tables.map(t => t.name);
          const requiredTables = ['users', 'products', 'orders', 'logs', 'password_resets'];
          
          requiredTables.forEach(table => {
            check(`Tabla ${table}`, tableNames.includes(table), 'Tabla no existe');
          });
          
          // Verificar columna items
          db.all(`PRAGMA table_info(orders)`, (err, columns) => {
            if (!err && columns) {
              const hasItems = columns.some(c => c.name === 'items');
              if (!check('Columna items en orders', hasItems, 'Ejecuta: node migrate-add-items-column.js')) {
                console.log('   💡 Solución: node migrate-add-items-column.js');
              }
            }
            finishVerification();
          });
        }
      });
    }
  }
});

function finishVerification() {
  // FASE 5: Servicios
  console.log('\n🔧 FASE 5: Servicios');
  console.log('─'.repeat(60));
  
  try {
    const { WHATSAPP_ENABLED, WHATSAPP_PHONE } = require('./whatsapp-service');
    check('Servicio WhatsApp', true, '');
    console.log(`   Estado: ${WHATSAPP_ENABLED ? 'Habilitado' : 'Deshabilitado'}`);
    console.log(`   Teléfono: ${WHATSAPP_PHONE}`);
  } catch (err) {
    check('Servicio WhatsApp', false, err.message);
  }
  
  try {
    const { emailEnabled } = require('./email-service');
    check('Servicio Email', true, '');
    console.log(`   Estado: ${emailEnabled ? 'Habilitado' : 'Deshabilitado'}`);
  } catch (err) {
    check('Servicio Email', false, err.message);
  }
  
  // FASE 6: Configuración de Render
  console.log('\n☁️  FASE 6: Configuración Render');
  console.log('─'.repeat(60));
  
  check('render.yaml existe', fs.existsSync('render.yaml'), 'Archivo de configuración no encontrado', true);
  
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  check('Script start', pkg.scripts && pkg.scripts.start, 'Script start no definido');
  check('Node version', pkg.engines && pkg.engines.node, 'Versión de Node no especificada', true);
  
  // RESUMEN FINAL
  console.log('\n' + '═'.repeat(60));
  console.log('📊 RESUMEN FINAL');
  console.log('═'.repeat(60));
  console.log(`Total de verificaciones: ${checks}`);
  console.log(`✅ Exitosas: ${checks - errors - warnings}`);
  console.log(`⚠️  Advertencias: ${warnings}`);
  console.log(`❌ Errores: ${errors}`);
  
  if (errors === 0) {
    console.log('\n🎉 ¡SISTEMA LISTO PARA DEPLOY A RENDER!');
    
    if (warnings > 0) {
      console.log('\n⚠️  Hay algunas advertencias, pero no son críticas.');
    }
    
    console.log('\n📋 Pasos para desplegar:');
    console.log('   1. git add .');
    console.log('   2. git commit -m "feat: Sistema listo para producción"');
    console.log('   3. git push origin main');
    console.log('   4. Render detectará los cambios y desplegará automáticamente');
    console.log('\n💡 Recuerda configurar las variables de entorno en Render:');
    console.log('   - DATABASE_URL (PostgreSQL)');
    console.log('   - JWT_SECRET');
    console.log('   - MP_TOKEN (Mercado Pago)');
    console.log('   - WHATSAPP_PHONE (opcional)');
    console.log('   - NODE_ENV=production');
    
    process.exit(0);
  } else {
    console.log('\n❌ SISTEMA NO ESTÁ LISTO PARA DEPLOY');
    console.log('\n🔧 Acciones requeridas:');
    console.log('   - Corrige los errores marcados con ❌');
    console.log('   - Ejecuta migraciones si es necesario');
    console.log('   - Verifica que todas las dependencias estén instaladas');
    console.log('\n💡 Después de corregir, ejecuta este script nuevamente.');
    
    process.exit(1);
  }
}
