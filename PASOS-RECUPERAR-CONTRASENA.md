# 📋 Pasos para Recuperar Contraseña

## ⚠️ Problema Identificado

Los tokens se están generando pero **NO se están enviando emails** desde la aplicación real. El test funciona, pero la aplicación no está enviando.

## ✅ Solución Paso a Paso

### Paso 1: Verificar que el Servidor Esté Corriendo

Abre una terminal y ejecuta:
```bash
npm start
```

Deberías ver:
```
Server: http://localhost:3001
Environment: development
✓ Servicio de email configurado
```

**IMPORTANTE:** Deja esta terminal abierta con el servidor corriendo.

### Paso 2: Probar la Recuperación desde el Navegador

1. Abre tu navegador
2. Ve a: http://localhost:3001
3. En la pantalla de login, haz clic en **"¿Olvidaste tu contraseña?"**
4. Ingresa tu usuario: `quimeykw` o tu email: `quimeykw@gmail.com`
5. Haz clic en **"Enviar"**

### Paso 3: Verificar en la Consola del Servidor

En la terminal donde está corriendo el servidor, deberías ver:

```
📧 Intentando enviar email a: quimeykw@gmail.com
✓ Email enviado exitosamente a quimeykw@gmail.com
  Message ID: <...>
  Response: 250 2.0.0 OK
```

Si ves esto, el email se envió correctamente.

### Paso 4: Revisar tu Email

1. Abre Gmail: https://mail.google.com
2. **PRIMERO revisa la carpeta SPAM** ⚠️
3. Busca un email con asunto: "Recuperación de Contraseña - ShopManStore"
4. Si lo encuentras en SPAM, márcalo como "No es spam"

### Paso 5: Usar el Link de Recuperación

El email contiene un link como:
```
http://localhost:3001/reset-password.html?token=...
```

1. Haz clic en el link
2. Ingresa tu nueva contraseña
3. Confirma la contraseña
4. Haz clic en "Restablecer Contraseña"

## 🔧 Si el Servidor No Está Corriendo

Si no tienes el servidor corriendo, los emails NO se enviarán aunque el test funcione.

**Para iniciar el servidor:**
```bash
npm start
```

## 🧪 Test Alternativo (Con Servidor Corriendo)

Si el servidor está corriendo, puedes probar con este script:

```bash
node test-recuperacion-real.js
```

Este script hace una solicitud real al servidor.

## 📊 Verificar Logs Después de Intentar

Después de intentar recuperar la contraseña desde el navegador, ejecuta:

```bash
node diagnostico-email.js
```

Deberías ver en la sección "4. Últimos logs relacionados con email":
```
- [fecha] Email Recuperación Enviado
  Email enviado a quimeykw@gmail.com - Token: ...
```

Si NO ves logs de email, significa que el servidor no está procesando la solicitud correctamente.

## ⚡ Solución Rápida: Cambiar Contraseña Directamente

Si necesitas cambiar tu contraseña AHORA sin esperar el email:

```bash
node change-password.js
```

Sigue las instrucciones para cambiar la contraseña del usuario `quimeykw`.

## 🔍 Diagnóstico Completo

Si sigues teniendo problemas, ejecuta:

```bash
# 1. Verificar configuración
node diagnostico-email.js

# 2. Probar envío de email
npm run test:email

# 3. Ver logs del servidor
# (en la terminal donde corre npm start)
```

## 📝 Checklist

- [ ] Servidor corriendo (`npm start`)
- [ ] Intentar recuperación desde navegador
- [ ] Ver logs en consola del servidor
- [ ] Revisar SPAM en Gmail
- [ ] Ejecutar `node diagnostico-email.js`
- [ ] Verificar que aparezcan logs de email

## 💡 Notas Importantes

1. **El servidor DEBE estar corriendo** para que se envíen emails
2. **Los emails van a SPAM** la primera vez (es normal)
3. **El test funciona** pero es independiente de la aplicación
4. **Los tokens expiran en 1 hora**

## 🆘 Si Nada Funciona

Usa el método directo:

```bash
node change-password.js
```

O crea un nuevo usuario admin:

```bash
node -e "
const bcrypt = require('bcryptjs');
const db = require('./db-config');
const hash = bcrypt.hashSync('nuevapass123', 10);
db.run('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
  ['admin2', 'admin2@shopman.com', hash, 'admin'], 
  (err) => {
    if (err) console.error(err);
    else console.log('✓ Nuevo admin creado: admin2 / nuevapass123');
    process.exit();
  }
);
"
```

---

**Resumen:** El problema más probable es que el servidor no esté corriendo cuando intentas recuperar la contraseña. Asegúrate de tener `npm start` ejecutándose.
