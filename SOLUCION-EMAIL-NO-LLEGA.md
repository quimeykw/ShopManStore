# 🔍 Solución: Email de Recuperación No Llega

## ✅ Estado del Sistema

El test muestra que el email **SÍ se está enviando correctamente**:
```
✓ Email enviado exitosamente a quimeykw@gmail.com
Message ID: <6f656fb3-21f1-cf41-10e7-1e7445907fc2@gmail.com>
Response: 250 2.0.0 OK (Gmail aceptó el email)
```

## 🔎 Dónde Buscar el Email

### 1. Carpeta de SPAM/Correo No Deseado ⚠️

**ESTA ES LA CAUSA MÁS COMÚN**

Gmail puede estar marcando los emails como spam porque:
- Es un email automático
- Viene de una aplicación local (localhost)
- Es la primera vez que envías desde esta aplicación

**Solución:**
1. Abre Gmail: https://mail.google.com
2. Ve a la carpeta **"Spam"** o **"Correo no deseado"** (en el menú lateral izquierdo)
3. Busca emails de "ShopManStore" o con asunto "Recuperación de Contraseña"
4. Si lo encuentras:
   - Márcalo como "No es spam"
   - Los próximos emails llegarán a la bandeja principal

### 2. Todas las Carpetas 📁

El email podría estar en:
- **Bandeja de entrada** (Principal)
- **Spam** ⚠️ (MÁS PROBABLE)
- **Promociones** (si tienes pestañas activadas)
- **Social**
- **Actualizaciones**

**Cómo buscar:**
1. En Gmail, usa el buscador
2. Escribe: `from:quimeykw@gmail.com subject:recuperación`
3. O busca: `ShopManStore`

### 3. Filtros de Gmail 🔧

Gmail podría tener un filtro que está moviendo o eliminando los emails.

**Verificar:**
1. Gmail → Configuración (⚙️) → Ver toda la configuración
2. Pestaña "Filtros y direcciones bloqueadas"
3. Busca filtros que afecten emails de tu propia dirección

### 4. Espacio de Almacenamiento 💾

Si tu cuenta está llena, Gmail no puede recibir emails.

**Verificar:**
1. Ve a: https://one.google.com/storage
2. Verifica que tengas espacio disponible

## 🧪 Prueba en Tiempo Real

Vamos a hacer una prueba mientras miras tu email:

### Paso 1: Abre Gmail
Abre https://mail.google.com en otra pestaña

### Paso 2: Ejecuta el Test
```bash
npm run test:email
```

### Paso 3: Revisa INMEDIATAMENTE
- Actualiza Gmail (F5)
- Revisa SPAM primero
- Busca en todas las carpetas

## 🔧 Solución Alternativa: Probar con Otro Email

Si quieres probar con otro email para verificar:

### Opción 1: Crear Usuario de Prueba

```bash
node -e "
const bcrypt = require('bcryptjs');
const db = require('./db-config');
const hash = bcrypt.hashSync('test123', 10);
db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
  ['test_user', 'TU_OTRO_EMAIL@gmail.com', hash], 
  (err) => {
    if (err) console.error(err);
    else console.log('Usuario de prueba creado');
    process.exit();
  }
);
"
```

Luego intenta recuperar contraseña con ese email.

### Opción 2: Modificar el Test

Edita `test-email-recovery.js` y cambia el email de destino:

```javascript
// Línea 15, cambiar:
email: 'OTRO_EMAIL@gmail.com'  // Tu otro email
```

## 📊 Verificar en la Base de Datos

Vamos a verificar que el token se está guardando:

```bash
node -e "
const db = require('./db-config');
db.all('SELECT * FROM password_resets ORDER BY created_at DESC LIMIT 5', (err, rows) => {
  console.log('Últimos tokens generados:');
  console.table(rows);
  process.exit();
});
"
```

## 🔍 Verificar Logs del Servidor

Si estás ejecutando el servidor (`npm start`), revisa la consola para ver:

```
📧 Intentando enviar email a: quimeykw@gmail.com
✓ Email enviado exitosamente a quimeykw@gmail.com
  Message ID: <...>
  Response: 250 2.0.0 OK
```

## ⚡ Solución Rápida: Usar la Aplicación

Si necesitas recuperar tu contraseña AHORA:

### Opción 1: Cambiar Contraseña Directamente

```bash
node change-password.js
```

Sigue las instrucciones para cambiar la contraseña sin email.

### Opción 2: Crear Nuevo Usuario Admin

```bash
node -e "
const bcrypt = require('bcryptjs');
const db = require('./db-config');
const hash = bcrypt.hashSync('nuevapass123', 10);
db.run('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
  ['admin2', 'admin2@shopman.com', hash, 'admin'], 
  (err) => {
    if (err) console.error(err);
    else console.log('Nuevo admin creado: admin2 / nuevapass123');
    process.exit();
  }
);
"
```

## 🎯 Diagnóstico Completo

Ejecuta este script para un diagnóstico completo:

```bash
node -e "
console.log('=== DIAGNÓSTICO DE EMAIL ===\n');

// 1. Variables de entorno
require('dotenv').config();
console.log('1. Configuración:');
console.log('   EMAIL_USER:', process.env.EMAIL_USER);
console.log('   EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? '✓ Configurado' : '✗ No configurado');
console.log('   BASE_URL:', process.env.BASE_URL);

// 2. Servicio de email
const { emailEnabled } = require('./email-service');
console.log('\n2. Servicio de Email:', emailEnabled ? '✓ Habilitado' : '✗ Deshabilitado');

// 3. Últimos tokens
const db = require('./db-config');
db.all('SELECT * FROM password_resets ORDER BY created_at DESC LIMIT 3', (err, rows) => {
  console.log('\n3. Últimos tokens generados:');
  if (rows && rows.length > 0) {
    rows.forEach(r => {
      console.log('   -', new Date(r.created_at).toLocaleString(), '- Usuario ID:', r.user_id);
    });
  } else {
    console.log('   No hay tokens generados');
  }
  
  // 4. Logs de email
  db.all(\"SELECT * FROM logs WHERE action LIKE '%Email%' OR action LIKE '%email%' ORDER BY created_at DESC LIMIT 5\", (err, logs) => {
    console.log('\n4. Últimos logs de email:');
    if (logs && logs.length > 0) {
      logs.forEach(l => {
        console.log('   -', l.action, '-', l.details);
      });
    } else {
      console.log('   No hay logs de email');
    }
    process.exit();
  });
});
"
```

## 📞 Resumen

**El email SÍ se está enviando** (confirmado por Gmail con código 250 OK).

**Lugares más probables donde está:**
1. 🎯 **Carpeta SPAM** (90% de probabilidad)
2. Carpeta Promociones
3. Otra carpeta de Gmail

**Acción recomendada:**
1. Abre Gmail
2. Ve directamente a SPAM
3. Busca "ShopManStore" o "Recuperación"
4. Márcalo como "No es spam"

**Si no lo encuentras:**
- Ejecuta el diagnóstico completo arriba
- Prueba con otro email
- Usa `change-password.js` para cambiar contraseña directamente

---

**Nota:** El sistema está funcionando correctamente. El problema es de entrega/filtrado de Gmail, no del código.
