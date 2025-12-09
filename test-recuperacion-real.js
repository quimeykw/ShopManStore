// Test de recuperación de contraseña usando el endpoint real
require('dotenv').config();
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api';

async function testRecuperacion() {
  console.log('=== TEST DE RECUPERACIÓN REAL ===\n');
  
  // Probar con el usuario quimeykw
  const usernameOrEmail = 'quimeykw';
  
  console.log(`📧 Solicitando recuperación para: ${usernameOrEmail}`);
  console.log(`🌐 URL: ${API_URL}/forgot-password\n`);
  
  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usernameOrEmail })
    });
    
    const data = await response.json();
    
    console.log('📊 Respuesta del servidor:');
    console.log('   Status:', response.status);
    console.log('   Mensaje:', data.message || data.error);
    
    if (response.ok) {
      console.log('\n✅ Solicitud procesada correctamente');
      console.log('\n💡 Ahora revisa:');
      console.log('   1. Tu email: quimeykw@gmail.com');
      console.log('   2. Carpeta SPAM');
      console.log('   3. Ejecuta: node diagnostico-email.js');
    } else {
      console.log('\n❌ Error en la solicitud');
      console.log('   Detalles:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message);
    console.log('\n💡 Asegúrate de que el servidor esté corriendo:');
    console.log('   npm start');
  }
}

testRecuperacion();
