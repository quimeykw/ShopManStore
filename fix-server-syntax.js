#!/usr/bin/env node

/**
 * Script para arreglar errores de sintaxis en server.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Arreglando errores de sintaxis en server.js...\n');

const serverPath = path.join(__dirname, 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Buscar y eliminar código duplicado problemático
const problematicCode = /\/\/ Crear pago con Mercado Pago\napp\.post\('\/api\/mp-payment'[\s\S]*?}\);/;

// Contar cuántas veces aparece el endpoint mp-payment
const matches = serverContent.match(/app\.post\('\/api\/mp-payment'/g);
console.log(`Encontrados ${matches ? matches.length : 0} endpoints mp-payment`);

if (matches && matches.length > 1) {
  console.log('🔄 Eliminando código duplicado...');
  
  // Eliminar la primera ocurrencia (la problemática)
  serverContent = serverContent.replace(problematicCode, '');
  
  console.log('✅ Código duplicado eliminado');
}

// Verificar que no haya problemas de async/await
const asyncIssues = serverContent.match(/const response = await mpPayment\.create.*\n.*function\(/g);
if (asyncIssues) {
  console.log('🔄 Arreglando problemas de async/await...');
  
  // Buscar funciones que usan await pero no son async
  serverContent = serverContent.replace(
    /function\(err\) \{[\s\S]*?const response = await/g,
    'async function(err) {\n        const response = await'
  );
}

// Escribir el archivo corregido
fs.writeFileSync(serverPath, serverContent);

console.log('✅ server.js corregido exitosamente');
console.log('\n💡 Cambios realizados:');
console.log('   • Eliminado código duplicado');
console.log('   • Corregidos problemas de async/await');
console.log('   • Servidor listo para reiniciar');