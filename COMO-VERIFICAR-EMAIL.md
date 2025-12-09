# 📧 Cómo Verificar si el Email Llega

Esta guía te ayudará a verificar si el sistema de recuperación de contraseña está enviando emails correctamente.

---

## 🎯 Métodos de Verificación

### Método 1: Script de Prueba Automático ⭐ RECOMENDADO

El script `test-email-recovery.js` verifica automáticamente si el email funciona.

#### Paso 1: Ejecutar el Script

```bash
node test-email-recovery.js
```

#### Paso 2: Revisar el Output

El script te mostrará:

✅ **Si funciona**:
```
✅ EMAIL ENVIADO EXITOSAMENTE
🎉 ¡El servicio de email está funcionando correctamente!

📬 Revisa tu bandeja de entrada:
   Email: quimeykw@gmail.com
   Asunto: "Recuperación de Contraseña - ShopManStore"
```

❌ **Si NO funciona**:
```
❌ ERROR AL ENVIAR EMAIL

Posibles causas:
1. Credenciales incorrectas
2. App Password inválido
3. Verificación en 2 pasos no activada
4. Problema de conexión a internet
```

#### Paso 3: Revisar tu Email

1. Abre Gmail: https://mail.google.com/
2. Busca un email de "ShopManStore"
3. Asunto: "Recuperación de Contraseña - ShopManStore"
4. Si no lo ves, revisa **SPAM**

---

### Método 2: Probar desde la Aplicación

#### Paso 1: Iniciar el Servidor

```bash
npm start
```

**Deberías ver**:
```
✓ Servicio de email configurado
Server: http://localhost:3001
```

#### Paso 2: Usar la Funcionalidad

1. Abre: http://localhost:3001
2. En login, clic en **"¿Olvidaste tu contraseña?"**
3. Ingresa tu usuario o email
4. Clic en **"Recuperar Contraseña"**

#### Paso 3: Revisar la Consola del Servidor

Deberías ver mensajes como:

✅ **Si funciona**:
```
📧 Intentando enviar email de recuperación a: quimeykw@gmail.com
📧 Intentando enviar email a quimeykw@gmail.com...
✓ Email enviado exitosamente a quimeykw@gmail.com
  Message ID: <abc123@gmail.com>
  Response: 250 2.0.0 OK
  Usuario: tu_usuario
  Token generado: abcdef1234...
✅ Email de recuperación enviado exitosamente a: quimeykw@gmail.com
```

❌ **Si NO funciona**:
```
📧 Intentando enviar email de recuperación a: quimeykw@gmail.com
📧 Intentando enviar email a quimeykw@gmail.com...
✗ Error al enviar email a quimeykw@gmail.com
  Error: Invalid login: 535-5.7.8 Username and Password not accepted
  Código: EAUTH
❌ Fallo al enviar email a: quimeykw@gmail.com
```

#### Paso 4: Revisar tu Email

1. Abre Gmail
2. Busca "ShopManStore"
3. Revisa SPAM si no lo ves

---

### Método 3: Ver Logs en la Base de Datos

Los emails enviados se registran en los logs del sistema.

#### Opción A: Desde el Panel Admin

1. Inicia sesión como admin
2. Ve al Panel Admin
3. Pestaña **"Logs"**
4. Busca entradas con:
   - `Email Recuperación Enviado` ✅
   - `Error Email Recuperación` ❌

#### Opción B: Consulta SQL Directa

```sql
-- Ver últimos emails enviados
SELECT * FROM logs 
WHERE action LIKE '%Email%' 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🔍 Interpretando los Resultados

### ✅ Email Enviado Exitosamente

**Indicadores**:
- ✓ Message ID presente
- ✓ Response: "250 2.0.0 OK"
- ✓ Log guardado en base de datos
- ✓ Email llega en 1-2 minutos

**Qué hacer**:
1. Revisar bandeja de entrada
2. Revisar carpeta de SPAM
3. Esperar unos minutos (puede tardar)

---

### ❌ Error al Enviar Email

**Errores Comunes**:

#### Error: "Invalid login" (EAUTH)
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
Código: EAUTH
```

**Causa**: Credenciales incorrectas

**Solución**:
1. Verifica `EMAIL_USER` en `.env`
2. Verifica `EMAIL_APP_PASSWORD` en `.env`
3. Genera un nuevo App Password
4. Reinicia el servidor

---

#### Error: "Connection timeout" (ETIMEDOUT)
```
Error: Connection timeout
Código: ETIMEDOUT
```

**Causa**: Problema de conexión a internet o firewall

**Solución**:
1. Verifica tu conexión a internet
2. Verifica que no haya firewall bloqueando
3. Intenta de nuevo

---

#### Error: "Recipient address rejected"
```
Error: Recipient address rejected
```

**Causa**: Email del usuario inválido

**Solución**:
1. Verifica que el usuario tenga un email válido en la BD
2. Actualiza el email del usuario si es necesario

---

## 📊 Checklist de Verificación

### Configuración
- [ ] `EMAIL_USER` configurado en `.env`
- [ ] `EMAIL_APP_PASSWORD` configurado en `.env`
- [ ] `BASE_URL` configurado en `.env`
- [ ] Servidor reiniciado después de configurar
- [ ] Mensaje "✓ Servicio de email configurado" en consola

### Prueba con Script
- [ ] Script ejecutado: `node test-email-recovery.js`
- [ ] Mensaje "✅ EMAIL ENVIADO EXITOSAMENTE"
- [ ] Email recibido en bandeja de entrada
- [ ] Email tiene el formato correcto

### Prueba desde App
- [ ] Servidor corriendo
- [ ] Modal "Olvidar contraseña" funciona
- [ ] Mensaje de éxito aparece
- [ ] Logs en consola muestran éxito
- [ ] Email recibido

### Verificación de Email
- [ ] Email llegó a bandeja de entrada
- [ ] Asunto correcto: "Recuperación de Contraseña - ShopManStore"
- [ ] Botón "Restablecer Contraseña" funciona
- [ ] Link alternativo funciona
- [ ] Diseño se ve bien

---

## 🐛 Solución de Problemas

### No veo mensajes en la consola

**Problema**: La consola no muestra logs de email

**Solución**:
1. Asegúrate de estar viendo la consola del servidor
2. Verifica que el servidor esté corriendo
3. Intenta solicitar un reset de contraseña

---

### Email llega a SPAM

**Problema**: El email siempre va a SPAM

**Solución**:
1. Marca el email como "No es spam"
2. Agrega `quimeykw@gmail.com` a tus contactos
3. Esto es normal la primera vez
4. Después de marcar como "No spam", llegarán a la bandeja principal

---

### Email tarda mucho en llegar

**Problema**: El email tarda más de 5 minutos

**Solución**:
1. Espera hasta 10 minutos (puede tardar)
2. Revisa SPAM
3. Verifica los logs del servidor
4. Ejecuta el script de prueba de nuevo

---

### No recibo ningún email

**Problema**: Nunca llega el email

**Solución**:
1. Ejecuta el script de prueba: `node test-email-recovery.js`
2. Revisa los logs en la consola
3. Verifica que el email del usuario sea correcto
4. Verifica credenciales en `.env`
5. Genera un nuevo App Password

---

## 📝 Comandos Útiles

### Ejecutar Script de Prueba
```bash
node test-email-recovery.js
```

### Ver Logs del Servidor
```bash
npm start
# Luego solicita un reset de contraseña
# Observa la consola
```

### Ver Logs en Base de Datos (SQLite)
```bash
sqlite3 store.db "SELECT * FROM logs WHERE action LIKE '%Email%' ORDER BY created_at DESC LIMIT 10;"
```

### Limpiar Logs Antiguos
```bash
sqlite3 store.db "DELETE FROM logs WHERE created_at < datetime('now', '-7 days');"
```

---

## 💡 Tips

1. **Ejecuta el script de prueba primero**: Es la forma más rápida de verificar
2. **Revisa SPAM siempre**: Los primeros emails suelen ir ahí
3. **Observa la consola**: Los logs te dirán exactamente qué pasó
4. **Espera unos minutos**: Los emails pueden tardar
5. **Verifica credenciales**: La mayoría de problemas son por credenciales incorrectas

---

## 📚 Documentación Relacionada

- **CONFIGURAR-RECUPERACION-CONTRASENA.md** - Configuración inicial
- **RESUMEN-RECUPERACION-CONTRASENA.md** - Resumen técnico
- **INDICE-DOCUMENTACION.md** - Índice completo

---

## 🎯 Resumen Rápido

**Para verificar si el email funciona**:

```bash
# 1. Ejecutar script de prueba
node test-email-recovery.js

# 2. Revisar output
# ✅ = Funciona
# ❌ = No funciona

# 3. Revisar email
# Gmail > Buscar "ShopManStore"
# Revisar SPAM si no aparece

# 4. Si no funciona
# - Verificar .env
# - Generar nuevo App Password
# - Reiniciar servidor
```

---

**Creado**: Diciembre 2024  
**Última actualización**: Diciembre 2024
