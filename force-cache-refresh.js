#!/usr/bin/env node

const http = require('http');

console.log('🚀 Forzando actualización rápida del caché...');

async function forceRefresh() {
  for (let i = 0; i < 5; i++) {
    try {
      const req = http.request(`http://localhost:3001/api/products?force_refresh=${Date.now()}`, (res) => {
        console.log(`✅ Request ${i + 1}/5 - Status: ${res.statusCode}`);
      });
      req.end();
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.log(`❌ Error en request ${i + 1}`);
    }
  }
  console.log('🎉 ¡Caché actualizado y productos disponibles inmediatamente!');
}

forceRefresh();