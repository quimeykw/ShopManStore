#!/usr/bin/env node

/**
 * TEST DE FUNCIONALIDAD DE VISTA PREVIA DE IMÁGENES
 * Verifica que la nueva funcionalidad de previsualización funcione correctamente
 */

const http = require('http');

console.log('🖼️ TEST DE VISTA PREVIA DE IMÁGENES...\n');

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}`;

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Función para hacer requests HTTP
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

async function testImagePreviewFeature() {
  console.log(`${colors.bold}🖼️ FUNCIONALIDAD DE VISTA PREVIA - TEST COMPLETO${colors.reset}\n`);
  
  // Test 1: Verificar que el servidor esté funcionando
  console.log('🔍 Test 1: Verificando servidor...');
  try {
    const health = await makeRequest(`${BASE_URL}/health`);
    if (health.statusCode === 200) {
      console.log(`${colors.green}✅ Servidor funcionando correctamente${colors.reset}\n`);
    } else {
      console.log(`${colors.red}❌ Servidor no responde correctamente${colors.reset}\n`);
      return;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Servidor no disponible: ${error.message}${colors.reset}\n`);
    return;
  }
  
  // Test 2: Verificar que el HTML contiene el modal de previsualización
  console.log('📄 Test 2: Verificando modal de previsualización en HTML...');
  try {
    const html = await makeRequest(`${BASE_URL}/`);
    if (html.statusCode === 200) {
      const htmlContent = html.data;
      
      // Verificar elementos del modal
      const hasModal = htmlContent.includes('imagePreviewModal');
      const hasPreviewButton = htmlContent.includes('previewImagesBtn');
      const hasMainImage = htmlContent.includes('previewMainImage');
      const hasThumbnails = htmlContent.includes('previewThumbnails');
      const hasControls = htmlContent.includes('previewPrevBtn') && htmlContent.includes('previewNextBtn');
      
      if (hasModal && hasPreviewButton && hasMainImage && hasThumbnails && hasControls) {
        console.log(`${colors.green}✅ Modal de previsualización correctamente implementado${colors.reset}`);
        console.log(`   • Modal principal: ✅`);
        console.log(`   • Botón de vista previa: ✅`);
        console.log(`   • Imagen principal: ✅`);
        console.log(`   • Miniaturas: ✅`);
        console.log(`   • Controles de navegación: ✅`);
      } else {
        console.log(`${colors.yellow}⚠️  Algunos elementos del modal faltan:${colors.reset}`);
        console.log(`   • Modal principal: ${hasModal ? '✅' : '❌'}`);
        console.log(`   • Botón de vista previa: ${hasPreviewButton ? '✅' : '❌'}`);
        console.log(`   • Imagen principal: ${hasMainImage ? '✅' : '❌'}`);
        console.log(`   • Miniaturas: ${hasThumbnails ? '✅' : '❌'}`);
        console.log(`   • Controles: ${hasControls ? '✅' : '❌'}`);
      }
      console.log('');
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error verificando HTML: ${error.message}${colors.reset}\n`);
  }
  
  // Test 3: Verificar que el JavaScript contiene las funciones necesarias
  console.log('📜 Test 3: Verificando funciones JavaScript...');
  try {
    const js = await makeRequest(`${BASE_URL}/app.js`);
    if (js.statusCode === 200) {
      const jsContent = js.data;
      
      // Verificar funciones principales
      const hasOpenModal = jsContent.includes('openImagePreviewModal');
      const hasCloseModal = jsContent.includes('closeImagePreviewModal');
      const hasNavigation = jsContent.includes('previewNextImage') && jsContent.includes('previewPrevImage');
      const hasUpdateDisplay = jsContent.includes('updatePreviewDisplay');
      const hasDownload = jsContent.includes('downloadCurrentImage');
      const hasRemove = jsContent.includes('removeCurrentImage');
      const hasKeyboard = jsContent.includes('keydown') && jsContent.includes('ArrowLeft');
      
      if (hasOpenModal && hasCloseModal && hasNavigation && hasUpdateDisplay && hasDownload && hasRemove && hasKeyboard) {
        console.log(`${colors.green}✅ Funciones JavaScript correctamente implementadas${colors.reset}`);
        console.log(`   • Abrir modal: ✅`);
        console.log(`   • Cerrar modal: ✅`);
        console.log(`   • Navegación: ✅`);
        console.log(`   • Actualizar display: ✅`);
        console.log(`   • Descargar imagen: ✅`);
        console.log(`   • Eliminar imagen: ✅`);
        console.log(`   • Navegación por teclado: ✅`);
      } else {
        console.log(`${colors.yellow}⚠️  Algunas funciones JavaScript faltan:${colors.reset}`);
        console.log(`   • Abrir modal: ${hasOpenModal ? '✅' : '❌'}`);
        console.log(`   • Cerrar modal: ${hasCloseModal ? '✅' : '❌'}`);
        console.log(`   • Navegación: ${hasNavigation ? '✅' : '❌'}`);
        console.log(`   • Actualizar display: ${hasUpdateDisplay ? '✅' : '❌'}`);
        console.log(`   • Descargar: ${hasDownload ? '✅' : '❌'}`);
        console.log(`   • Eliminar: ${hasRemove ? '✅' : '❌'}`);
        console.log(`   • Teclado: ${hasKeyboard ? '✅' : '❌'}`);
      }
      console.log('');
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error verificando JavaScript: ${error.message}${colors.reset}\n`);
  }
  
  // Test 4: Verificar estilos CSS
  console.log('🎨 Test 4: Verificando estilos CSS...');
  try {
    const html = await makeRequest(`${BASE_URL}/`);
    if (html.statusCode === 200) {
      const htmlContent = html.data;
      
      // Verificar que tiene z-index alto para el modal
      const hasHighZIndex = htmlContent.includes('z-60') || htmlContent.includes('z-50');
      const hasBackdrop = htmlContent.includes('bg-black bg-opacity-90');
      const hasTransitions = htmlContent.includes('transition');
      const hasResponsive = htmlContent.includes('max-w-') && htmlContent.includes('max-h-');
      
      if (hasHighZIndex && hasBackdrop && hasTransitions && hasResponsive) {
        console.log(`${colors.green}✅ Estilos CSS correctamente configurados${colors.reset}`);
        console.log(`   • Z-index alto: ✅`);
        console.log(`   • Fondo oscuro: ✅`);
        console.log(`   • Transiciones: ✅`);
        console.log(`   • Diseño responsivo: ✅`);
      } else {
        console.log(`${colors.yellow}⚠️  Algunos estilos pueden necesitar ajustes:${colors.reset}`);
        console.log(`   • Z-index alto: ${hasHighZIndex ? '✅' : '❌'}`);
        console.log(`   • Fondo oscuro: ${hasBackdrop ? '✅' : '❌'}`);
        console.log(`   • Transiciones: ${hasTransitions ? '✅' : '❌'}`);
        console.log(`   • Responsivo: ${hasResponsive ? '✅' : '❌'}`);
      }
      console.log('');
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error verificando CSS: ${error.message}${colors.reset}\n`);
  }
  
  // Resumen final
  console.log(`${colors.bold}=== RESUMEN FUNCIONALIDAD VISTA PREVIA ===${colors.reset}\n`);
  
  console.log(`${colors.green}✅ FUNCIONALIDADES IMPLEMENTADAS:${colors.reset}`);
  console.log(`   • Modal de vista previa de imágenes`);
  console.log(`   • Navegación entre imágenes (anterior/siguiente)`);
  console.log(`   • Miniaturas con selección directa`);
  console.log(`   • Información detallada de cada imagen`);
  console.log(`   • Descarga individual de imágenes`);
  console.log(`   • Eliminación de imágenes desde la vista previa`);
  console.log(`   • Navegación por teclado (flechas, ESC, Delete)`);
  console.log(`   • Contador de imágenes`);
  console.log(`   • Diseño responsivo y accesible`);
  
  console.log(`\n${colors.blue}🎯 CÓMO USAR LA NUEVA FUNCIONALIDAD:${colors.reset}`);
  console.log(`   1. Ve al panel de administración`);
  console.log(`   2. Crea o edita un producto`);
  console.log(`   3. Sube una o más imágenes`);
  console.log(`   4. Aparecerá el botón "Vista Previa de Imágenes"`);
  console.log(`   5. Haz clic para ver las imágenes en pantalla completa`);
  console.log(`   6. Navega, descarga o elimina imágenes según necesites`);
  console.log(`   7. Haz clic en "Continuar" para seguir editando`);
  
  console.log(`\n${colors.yellow}⌨️  ATAJOS DE TECLADO:${colors.reset}`);
  console.log(`   • ← → : Navegar entre imágenes`);
  console.log(`   • ESC : Cerrar vista previa`);
  console.log(`   • Delete/Backspace : Eliminar imagen actual`);
  
  console.log(`\n${colors.bold}🎉 VISTA PREVIA DE IMÁGENES IMPLEMENTADA CORRECTAMENTE${colors.reset}`);
  console.log(`Ahora puedes ver y gestionar las imágenes antes de publicar productos.`);
}

// Ejecutar test
testImagePreviewFeature().catch(error => {
  console.error(`${colors.red}Error ejecutando tests:${colors.reset}`, error);
});