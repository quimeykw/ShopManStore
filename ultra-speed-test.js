#!/usr/bin/env node

const http = require('http');
const start = Date.now();

console.log('⚡ ULTRA SPEED TEST - Midiendo velocidad...');

const testUrl = process.env.RENDER_URL || 'http://localhost:3001';

function testSpeed(url, name) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = http.request(url, (res) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`${name}: ${duration}ms`);
      resolve(duration);
    });
    
    req.on('error', () => {
      console.log(`${name}: ERROR`);
      resolve(9999);
    });
    
    req.setTimeout(5000);
    req.end();
  });
}

async function runUltraSpeedTest() {
  console.log(`🎯 Testing: ${testUrl}`);
  
  const tests = [
    { url: `${testUrl}/health`, name: 'Health Check' },
    { url: `${testUrl}/api/products`, name: 'API Products' },
    { url: `${testUrl}/`, name: 'Homepage' }
  ];
  
  let totalTime = 0;
  for (const test of tests) {
    const time = await testSpeed(test.url, test.name);
    totalTime += time;
  }
  
  const avgTime = Math.round(totalTime / tests.length);
  console.log(`\n⚡ RESULTADO: ${avgTime}ms promedio`);
  
  if (avgTime < 200) {
    console.log('🚀 ULTRA RÁPIDO! Excelente rendimiento');
  } else if (avgTime < 500) {
    console.log('✅ RÁPIDO! Buen rendimiento');
  } else {
    console.log('⚠️  LENTO - Necesita optimización');
  }
}

runUltraSpeedTest();