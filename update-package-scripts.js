#!/usr/bin/env node

/**
 * Script para actualizar package.json con nuevos comandos útiles
 */

const fs = require('fs');
const path = require('path');

console.log('📦 Actualizando scripts de package.json...\n');

const packagePath = path.join(__dirname, 'package.json');
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Añadir nuevos scripts útiles
const newScripts = {
  "force-update": "node force-update-products.js",
  "force-cache": "node force-cache-refresh.js",
  "recover-products": "node recover-missing-products.js",
  "test-system": "node test-complete-system.js",
  "reset-db": "node reset-database.js",
  "migrate-db": "node migrate-database.js"
};

// Combinar scripts existentes con nuevos
packageData.scripts = {
  ...packageData.scripts,
  ...newScripts
};

// Escribir package.json actualizado
fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));

console.log('✅ Scripts añadidos a package.json:');
Object.keys(newScripts).forEach(script => {
  console.log(`   npm run ${script.padEnd(15)} # ${getScriptDescription(script)}`);
});

console.log('\n🎉 ¡Package.json actualizado exitosamente!');

function getScriptDescription(script) {
  const descriptions = {
    "force-update": "Forzar actualización completa de productos",
    "force-cache": "Limpiar caché del servidor rápidamente",
    "recover-products": "Recuperar productos faltantes",
    "test-system": "Ejecutar tests completos del sistema",
    "reset-db": "Reset completo de base de datos",
    "migrate-db": "Migrar estructura de base de datos"
  };
  return descriptions[script] || "Script personalizado";
}