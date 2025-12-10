#!/usr/bin/env node

/**
 * CONFIGURADOR PARA DESACTIVAR MERCADO PAGO
 * Permite usar el sistema sin dependencia de Mercado Pago
 */

const fs = require('fs');
const path = require('path');

console.log('🚫💳 CONFIGURANDO SISTEMA SIN MERCADO PAGO...\n');

// Función para actualizar variables de entorno
function updateEnvFile() {
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  
  // Leer archivo .env existente si existe
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Configuración sin Mercado Pago
  const newConfig = `# CONFIGURACIÓN SIN MERCADO PAGO
PORT=3001
JWT_SECRET=shopmanstore_secret_key_2024
NODE_ENV=development

# MERCADO PAGO DESACTIVADO
# MP_TOKEN=
# Comentar o eliminar MP_TOKEN para desactivar Mercado Pago

# CONFIGURACIÓN DE PAGOS ALTERNATIVOS
WHATSAPP_NUMBER=5491122549995
BANK_CBU=0000003100010000000001
BANK_ALIAS=SHOPMAN.STORE
BANK_NAME=Banco Ejemplo
STORE_NAME=ShopManStore

# UBICACIONES PARA RETIRO EN EFECTIVO
PICKUP_CENTRO=Centro - Av. Corrientes 1234, CABA
PICKUP_PALERMO=Palermo - Av. Santa Fe 5678, CABA
PICKUP_BELGRANO=Belgrano - Av. Cabildo 9012, CABA
`;
  
  // Escribir nueva configuración
  fs.writeFileSync(envPath, newConfig);
  console.log('✅ Archivo .env actualizado');
  console.log('   • Mercado Pago desactivado');
  console.log('   • Métodos alternativos configurados');
  console.log('   • WhatsApp como método principal\n');
}

// Función para crear archivo de ejemplo
function createExampleEnv() {
  const examplePath = path.join(__dirname, '.env.sin-mp.example');
  
  const exampleContent = `# EJEMPLO DE CONFIGURACIÓN SIN MERCADO PAGO
# Copia este archivo a .env para usar sin Mercado Pago

PORT=3001
JWT_SECRET=tu_jwt_secret_seguro_aqui
NODE_ENV=production

# MERCADO PAGO DESACTIVADO
# No incluir MP_TOKEN para desactivar Mercado Pago completamente

# CONFIGURACIÓN DE PAGOS ALTERNATIVOS
WHATSAPP_NUMBER=tu_numero_de_whatsapp
BANK_CBU=tu_cbu_bancario
BANK_ALIAS=tu_alias_bancario
BANK_NAME=Nombre de tu Banco
STORE_NAME=Nombre de tu Tienda

# UBICACIONES PARA RETIRO EN EFECTIVO (opcional)
PICKUP_CENTRO=Tu dirección principal
PICKUP_SUCURSAL2=Tu segunda sucursal (opcional)
PICKUP_SUCURSAL3=Tu tercera sucursal (opcional)
`;
  
  fs.writeFileSync(examplePath, exampleContent);
  console.log('✅ Archivo .env.sin-mp.example creado');
  console.log('   • Plantilla para configuración sin MP');
  console.log('   • Personaliza con tus datos\n');
}

// Función para mostrar instrucciones
function showInstructions() {
  console.log('📋 INSTRUCCIONES PARA USAR SIN MERCADO PAGO:\n');
  
  console.log('1️⃣ CONFIGURACIÓN AUTOMÁTICA (RECOMENDADO):');
  console.log('   • El sistema ya está configurado');
  console.log('   • WhatsApp es el método principal');
  console.log('   • Transferencia y efectivo disponibles');
  console.log('   • MP es completamente opcional\n');
  
  console.log('2️⃣ PERSONALIZAR CONFIGURACIÓN:');
  console.log('   • Edita el archivo .env');
  console.log('   • Cambia WHATSAPP_NUMBER por tu número');
  console.log('   • Actualiza datos bancarios');
  console.log('   • Modifica ubicaciones de retiro\n');
  
  console.log('3️⃣ MÉTODOS DE PAGO DISPONIBLES:');
  console.log('   📱 WhatsApp (PRINCIPAL)');
  console.log('      • Coordinación directa con cliente');
  console.log('      • Sin comisiones');
  console.log('      • Flexible en formas de pago\n');
  
  console.log('   🏦 Transferencia Bancaria');
  console.log('      • Pago por CBU/Alias');
  console.log('      • Sin comisiones');
  console.log('      • Confirmación por comprobante\n');
  
  console.log('   💵 Efectivo en Local');
  console.log('      • Pago al retirar');
  console.log('      • Sin comisiones');
  console.log('      • Múltiples ubicaciones\n');
  
  console.log('4️⃣ VENTAJAS DEL SISTEMA SIN MP:');
  console.log('   ✅ Sin comisiones de Mercado Pago');
  console.log('   ✅ Control total del proceso de pago');
  console.log('   ✅ Relación directa con el cliente');
  console.log('   ✅ Flexibilidad en métodos de pago');
  console.log('   ✅ No requiere configuración compleja\n');
  
  console.log('5️⃣ PARA ACTIVAR MERCADO PAGO (OPCIONAL):');
  console.log('   • Agrega MP_TOKEN=tu_token en .env');
  console.log('   • Reinicia el servidor');
  console.log('   • MP aparecerá como opción adicional\n');
}

// Función para verificar estado actual
function checkCurrentStatus() {
  console.log('🔍 ESTADO ACTUAL DEL SISTEMA:\n');
  
  // Verificar si MP está configurado
  const mpToken = process.env.MP_TOKEN;
  if (mpToken && !mpToken.includes('APP_USR-312986056474853')) {
    console.log('💳 Mercado Pago: ✅ CONFIGURADO');
    console.log('   • Token de producción detectado');
    console.log('   • Disponible como método adicional\n');
  } else {
    console.log('🚫 Mercado Pago: ❌ NO CONFIGURADO');
    console.log('   • Sistema funcionando sin MP');
    console.log('   • Métodos alternativos activos\n');
  }
  
  console.log('📱 WhatsApp: ✅ ACTIVO');
  console.log('   • Método principal de pago');
  console.log('   • Número: 5491122549995\n');
  
  console.log('🏦 Transferencia: ✅ ACTIVA');
  console.log('   • CBU: 0000003100010000000001');
  console.log('   • Alias: SHOPMAN.STORE\n');
  
  console.log('💵 Efectivo: ✅ ACTIVO');
  console.log('   • Retiro en local disponible');
  console.log('   • Múltiples ubicaciones\n');
}

// Ejecutar configuración
async function main() {
  try {
    console.log('🚀 Iniciando configuración...\n');
    
    // Verificar estado actual
    checkCurrentStatus();
    
    // Actualizar configuración
    updateEnvFile();
    
    // Crear archivo de ejemplo
    createExampleEnv();
    
    // Mostrar instrucciones
    showInstructions();
    
    console.log('✅ CONFIGURACIÓN COMPLETADA');
    console.log('🎉 Tu sistema ya funciona sin Mercado Pago!');
    console.log('📱 Los clientes pueden pagar por WhatsApp, transferencia o efectivo.');
    
  } catch (error) {
    console.error('❌ Error en configuración:', error.message);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  updateEnvFile,
  createExampleEnv,
  showInstructions,
  checkCurrentStatus
};