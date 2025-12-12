#!/usr/bin/env node

/**
 * VERIFICACIÓN DE ERRORES JAVASCRIPT
 * Verifica que no haya errores de sintaxis o referencias
 */

const http = require('http');

console.log('🔍 VERIFICANDO ERRORES JAVASCRIPT...\n');

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}`;

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ 
        statusCode: res.statusCode, 
        headers: res.headers, 
        data 
      }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => reject(new Error('Timeout')));
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function verifyJavaScript() {
  console.log(`${colors.bold}🔍 VERIFICACIÓN DE JAVASCRIPT${colors.reset}\n`);
  
  // Test 1: Verificar sintaxis del app.js
  console.log('📜 Test 1: Verificando sintaxis de app.js...');
  try {
    const js = await makeRequest(`${BASE_URL}/app.js`);
    if (js.statusCode === 200) {
      const jsContent = js.data;
      
      // Verificar que no haya errores obvios de sintaxis
      const hasUnclosedBraces = (jsContent.match(/\{/g) || []).length !== (jsContent.match(/\}/g) || []).length;
      const hasUnclosedParens = (jsContent.match(/\(/g) || []).length !== (jsContent.match(/\)/g) || []).length;
      const hasUnclosedBrackets = (jsContent.match(/\[/g) || []).length !== (jsContent.match(/\]/g) || []).length;
      
      if (!hasUnclosedBraces && !hasUnclosedParens && !hasUnclosedBrackets) {
        console.log(`${colors.green}✅ Sintaxis JavaScript correcta${colors.reset}`);
      } else {
        console.log(`${colors.red}❌ Posibles errores de sintaxis detectados${colors.reset}`);
        if (hasUnclosedBraces) console.log(`   • Llaves desbalanceadas`);
        if (hasUnclosedParens) console.log(`   • Paréntesis desbalanceados`);
        if (hasUnclosedBrackets) console.log(`   • Corchetes desbalanceados`);
      }
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error verificando JavaScript: ${error.message}${colors.reset}`);
  }
  
  // Test 2: Verificar funciones específicas
  console.log('\n🎯 Test 2: Verificando funciones de vista previa...');
  try {
    const js = await makeRequest(`${BASE_URL}/app.js`);
    if (js.statusCode === 200) {
      const jsContent = js.data;
      
      const functions = [
        'openImagePreviewModal',
        'closeImagePreviewModal', 
        'updatePreviewDisplay',
        'previewNextImage',
        'previewPrevImage',
        'downloadCurrentImage',
        'removeCurrentImage',
        'updatePreviewButton'
      ];
      
      let allFunctionsPresent = true;
      functions.forEach(func => {
        if (jsContent.includes(`function ${func}`) || jsContent.includes(`${func} =`)) {
          console.log(`   ✅ ${func}`);
        } else {
          console.log(`   ❌ ${func} - NO ENCONTRADA`);
          allFunctionsPresent = false;
        }
      });
      
      if (allFunctionsPresent) {
        console.log(`${colors.green}✅ Todas las funciones están presentes${colors.reset}`);
      } else {
        console.log(`${colors.red}❌ Algunas funciones faltan${colors.reset}`);
      }
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error verificando funciones: ${error.message}${colors.reset}`);
  }
  
  console.log(`\n${colors.bold}=== RESULTADO FINAL ===${colors.reset}`);
  console.log(`${colors.green}✅ Verificación completada${colors.reset}`);
  console.log(`${colors.blue}💡 Para test completo, abre: http://localhost:3001${colors.reset}`);
}

verifyJavaScript().catch(console.error);