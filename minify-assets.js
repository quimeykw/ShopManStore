#!/usr/bin/env node

/**
 * Script simple para minificar CSS y JS
 * Para uso en desarrollo - en producción usar herramientas como Webpack, Vite, etc.
 */

const fs = require('fs');
const path = require('path');

// Función simple para minificar CSS
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remover comentarios
    .replace(/\s+/g, ' ') // Múltiples espacios a uno
    .replace(/;\s*}/g, '}') // Remover ; antes de }
    .replace(/\s*{\s*/g, '{') // Espacios alrededor de {
    .replace(/}\s*/g, '}') // Espacios después de }
    .replace(/:\s*/g, ':') // Espacios después de :
    .replace(/;\s*/g, ';') // Espacios después de ;
    .trim();
}

// Función simple para minificar JS (básica)
function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remover comentarios de bloque
    .replace(/\/\/.*$/gm, '') // Remover comentarios de línea
    .replace(/\s+/g, ' ') // Múltiples espacios a uno
    .replace(/\s*([{}();,:])\s*/g, '$1') // Espacios alrededor de operadores
    .trim();
}

// Procesar archivos en public/
const publicDir = path.join(__dirname, 'public');

console.log('🔧 Minificando archivos CSS y JS...\n');

// Buscar archivos CSS y JS
const files = fs.readdirSync(publicDir);

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  const ext = path.extname(file);
  
  if (ext === '.css' && !file.includes('.min.')) {
    console.log(`📄 Procesando CSS: ${file}`);
    const content = fs.readFileSync(filePath, 'utf8');
    const minified = minifyCSS(content);
    const minPath = filePath.replace('.css', '.min.css');
    fs.writeFileSync(minPath, minified);
    
    const originalSize = Buffer.byteLength(content, 'utf8');
    const minifiedSize = Buffer.byteLength(minified, 'utf8');
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
    
    console.log(`   Original: ${originalSize} bytes`);
    console.log(`   Minificado: ${minifiedSize} bytes`);
    console.log(`   Ahorro: ${savings}%\n`);
  }
  
  if (ext === '.js' && !file.includes('.min.') && file !== 'minify-assets.js') {
    console.log(`📄 Procesando JS: ${file}`);
    const content = fs.readFileSync(filePath, 'utf8');
    const minified = minifyJS(content);
    const minPath = filePath.replace('.js', '.min.js');
    fs.writeFileSync(minPath, minified);
    
    const originalSize = Buffer.byteLength(content, 'utf8');
    const minifiedSize = Buffer.byteLength(minified, 'utf8');
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
    
    console.log(`   Original: ${originalSize} bytes`);
    console.log(`   Minificado: ${minifiedSize} bytes`);
    console.log(`   Ahorro: ${savings}%\n`);
  }
});

console.log('✅ Minificación completada!');
console.log('\n💡 Para producción, considera usar:');
console.log('   - Terser para JS');
console.log('   - CleanCSS para CSS');
console.log('   - Webpack/Vite para automatización');

// Actualizar package.json si no existe el script
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  if (!pkg.scripts) pkg.scripts = {};
  if (!pkg.scripts.minify) {
    pkg.scripts.minify = 'node minify-assets.js';
    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
    console.log('\n📦 Añadido script "minify" a package.json');
  }
}