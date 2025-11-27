// Script de verificación pre-deploy
console.log('🔍 Verificando sistema antes de deploy...\n');

const fs = require('fs');
const path = require('path');

let errors = [];
let warnings = [];
let success = [];

// 1. Verificar archivos críticos
console.log('📁 Verificando archivos críticos...');
const criticalFiles = [
  'server.js',
  'public/app.js',
  'public/index.html',
  'package.json',
  'db-config.js',
  'init-db.js',
  'whatsapp-service.js',
  'migrate-add-items-column.js',
  '.env.example'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    success.push(`✅ ${file} existe`);
  } else {
    errors.push(`❌ ${file} NO ENCONTRADO`);
  }
});

// 2. Verificar .env.example tiene las variables necesarias
console.log('\n🔐 Verificando variables de entorno...');
if (fs.existsSync('.env.example')) {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  const requiredVars = [
    'PORT',
    'JWT_SECRET',
    'MP_TOKEN',
    'WHATSAPP_PHONE',
    'WHATSAPP_ENABLED',
    'EMAIL_USER',
    'EMAIL_APP_PASSWORD'
  ];
  
  requiredVars.forEach(varName => {
    if (envExample.includes(varName)) {
      success.push(`✅ Variable ${varName} documentada`);
    } else {
      warnings.push(`⚠️  Variable ${varName} no está en .env.example`);
    }
  });
}

// 3. Verificar que .env no se suba a GitHub
console.log('\n🔒 Verificando .gitignore...');
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  if (gitignore.includes('.env')) {
    success.push('✅ .env está en .gitignore');
  } else {
    errors.push('❌ .env NO está en .gitignore - PELIGRO DE SEGURIDAD');
  }
  
  if (gitignore.includes('node_modules')) {
    success.push('✅ node_modules está en .gitignore');
  } else {
    warnings.push('⚠️  node_modules no está en .gitignore');
  }
}

// 4. Verificar package.json tiene los scripts necesarios
console.log('\n📦 Verificando package.json...');
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (pkg.scripts && pkg.scripts.start) {
    success.push('✅ Script "start" definido');
  } else {
    errors.push('❌ Script "start" NO definido');
  }
  
  // Verificar dependencias críticas
  const criticalDeps = [
    'express',
    'bcryptjs',
    'jsonwebtoken',
    'cors',
    'sqlite3',
    'pg',
    'mercadopago'
  ];
  
  criticalDeps.forEach(dep => {
    if (pkg.dependencies && pkg.dependencies[dep]) {
      success.push(`✅ Dependencia ${dep} instalada`);
    } else {
      errors.push(`❌ Dependencia ${dep} NO instalada`);
    }
  });
}

// 5. Verificar sintaxis de archivos JavaScript críticos
console.log('\n🔍 Verificando sintaxis de archivos...');
const jsFiles = [
  'server.js',
  'whatsapp-service.js',
  'db-config.js',
  'init-db.js'
];

jsFiles.forEach(file => {
  try {
    require(`./${file}`);
    success.push(`✅ ${file} sin errores de sintaxis`);
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND' || !e.message.includes('dotenv')) {
      errors.push(`❌ ${file} tiene errores: ${e.message}`);
    } else {
      success.push(`✅ ${file} sintaxis correcta`);
    }
  }
});

// 6. Verificar que existan los archivos de migración
console.log('\n🗄️  Verificando migraciones...');
if (fs.existsSync('migrate-add-items-column.js')) {
  success.push('✅ Script de migración existe');
} else {
  errors.push('❌ Script de migración NO encontrado');
}

// Resumen
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(50));

if (success.length > 0) {
  console.log(`\n✅ Éxitos (${success.length}):`);
  success.forEach(msg => console.log(`   ${msg}`));
}

if (warnings.length > 0) {
  console.log(`\n⚠️  Advertencias (${warnings.length}):`);
  warnings.forEach(msg => console.log(`   ${msg}`));
}

if (errors.length > 0) {
  console.log(`\n❌ Errores (${errors.length}):`);
  errors.forEach(msg => console.log(`   ${msg}`));
  console.log('\n🚫 NO DESPLEGAR - Corrige los errores primero');
  process.exit(1);
} else {
  console.log('\n🎉 SISTEMA LISTO PARA DEPLOY');
  console.log('\nPróximos pasos:');
  console.log('  1. git add .');
  console.log('  2. git commit -m "feat: Nuevas funcionalidades de compras"');
  console.log('  3. git push origin main');
  console.log('  4. Render detectará los cambios automáticamente');
  console.log('\n✨ ¡Buena suerte!');
  process.exit(0);
}
