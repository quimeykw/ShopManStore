// Ejecutar todos los tests y verificaciones
console.log('🧪 EJECUTANDO SUITE COMPLETA DE TESTS\n');
console.log('═'.repeat(60));

const { execSync } = require('child_process');
const fs = require('fs');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(name, command, description) {
  totalTests++;
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📋 Test ${totalTests}: ${name}`);
  console.log(`📝 ${description}`);
  console.log(`${'─'.repeat(60)}\n`);
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'inherit'
    });
    
    console.log(`\n✅ ${name}: PASÓ\n`);
    passedTests++;
    return true;
  } catch (error) {
    console.log(`\n❌ ${name}: FALLÓ\n`);
    failedTests++;
    return false;
  }
}

// Test 1: Compatibilidad Render
const test1 = runTest(
  'Compatibilidad Render',
  'node test-render-compatibility.js',
  'Verifica compatibilidad completa con PostgreSQL y funcionalidades de Render'
);

// Test 2: Verificación Pre-Deploy
const test2 = runTest(
  'Verificación Pre-Deploy',
  'node verify-render-ready.js',
  'Verifica que el sistema esté listo para deploy a Render'
);

// Test 3: Diagnóstico del Sistema
const test3 = runTest(
  'Diagnóstico del Sistema',
  'node diagnose-render.js',
  'Diagnóstico completo del estado del sistema'
);

// Resumen Final
console.log('\n' + '═'.repeat(60));
console.log('📊 RESUMEN FINAL DE TESTS');
console.log('═'.repeat(60));
console.log(`\nTotal de suites ejecutadas: ${totalTests}`);
console.log(`✅ Pasaron: ${passedTests}`);
console.log(`❌ Fallaron: ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 ¡TODOS LOS TESTS PASARON!');
  console.log('\n✨ El sistema está 100% listo para deploy a Render');
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Revisa DEPLOY-RENDER-FINAL.md para instrucciones de deploy');
  console.log('   2. Configura variables de entorno en Render');
  console.log('   3. git add . && git commit -m "feat: Deploy a producción"');
  console.log('   4. git push origin main');
  console.log('\n💡 Documentación disponible:');
  console.log('   - DEPLOY-RENDER-FINAL.md - Guía completa de deploy');
  console.log('   - SCRIPTS-DISPONIBLES.md - Lista de todos los scripts');
  console.log('   - SISTEMA-TESTEADO-RENDER.md - Resumen de tests');
  
  process.exit(0);
} else {
  console.log('\n⚠️  Algunos tests fallaron');
  console.log('\n🔧 Acciones requeridas:');
  console.log('   1. Revisa los errores arriba');
  console.log('   2. Corrige los problemas identificados');
  console.log('   3. Ejecuta este script nuevamente');
  console.log('\n💡 Para más información:');
  console.log('   - Revisa los logs de cada test arriba');
  console.log('   - Consulta SCRIPTS-DISPONIBLES.md para ayuda');
  
  process.exit(1);
}
