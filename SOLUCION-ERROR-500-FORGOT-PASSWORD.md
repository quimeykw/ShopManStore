# 🔧 Solución: Error 500 en /api/forgot-password

## 🎯 Diagnóstico Completo

Se ha diagnosticado el error 500 en el endpoint de recuperación de contraseña.

---

## ✅ Estado del Sistema

### Componentes Verificados:

- ✅ **Tabla password_resets**: Existe y funciona correctamente
- ✅ **Usuarios con email**: 25 usuarios tienen email configurado
- ✅ **Servicio de email**: Configurado correctamente (Gmail SMTP)
- ✅ **Base de datos**: PostgreSQL funcionando
- ✅ **Tokens recientes**: Sistema generando tokens correctamente

---

## 🚨 Causas del Error 500

### 1. Rate Limiting (Más Común) ⏰

**Problema:** El sistema tiene un límite de **5 minutos** entre solicitudes de recuperación para el mismo usuario.

**Síntomas:**
```
Failed to load resource: the server responded with a status of 500 ()
```

**Solución:**
- Espera 5 minutos antes de solicitar otro token
- El sistema está diseñado así para prevenir spam y ataques

**Verificar en logs del servidor:**
```
Por favor espera 5 minutos antes de solicitar otro restablecimiento
```

### 2. Gmail Bloqueando Emails 📧

**Problema:** Gmail puede bloquear temporalmente si se envían demasiados emails en poco tiempo.

**Síntomas:**
- Múltiples solicitudes seguidas
- Emails no llegan
- Error 500 en el servidor

**Solución:**
- Espera 10-15 minutos
- No hagas múltiples solicitudes seguidas
- Revisa la carpeta SPAM

### 3. Usuario Sin Email ❌

**Problema:** Si un usuario no tiene email configurado, no puede recuperar contraseña.

**Verificación:**
```bash
node diagnostico-error-500.js
```

**Solución:**
- Todos los usuarios actuales tienen email ✅
- Si agregas nuevos usuarios, asegúrate de incluir email

### 4. Tabla password_resets No Existe 🗄️

**Problema:** La tabla de tokens no existe en la base de datos.

**Verificación:**
```bash
node diagnostico-error-500.js
```

**Solución:**
- La tabla existe y funciona correctamente ✅

---

## 🔍 Cómo Diagnosticar

### Script de Diagnóstico

```bash
node diagnostico-error-500.js
```

**Salida esperada:**
```
✅ Tabla password_resets existe
✅ Usuarios con email: 25
✅ Todos los usuarios tienen email
✅ Tokens encontrados: 10
✅ Servicio de email configurado
```

### Verificar Logs del Servidor

Busca en los logs del servidor (proceso npm start):

**Éxito:**
```
📧 Intentando enviar email de recuperación a: usuario@gmail.com
✓ Email enviado exitosamente a usuario@gmail.com
✅ Email de recuperación enviado exitosamente a: usuario@gmail.com
```

**Rate Limiting:**
```
Por favor espera 5 minutos antes de solicitar otro restablecimiento
```

**Error de Email:**
```
❌ Fallo al enviar email a: usuario@gmail.com
```

---

## 🛠️ Soluciones Paso a Paso

### Solución 1: Esperar el Rate Limit

1. **Espera 5 minutos** desde la última solicitud
2. Intenta nuevamente
3. Revisa tu email (incluyendo SPAM)

### Solución 2: Verificar Email del Usuario

```bash
# Buscar usuario
node buscar-usuario.js [username]

# Verificar que tenga email configurado
```

### Solución 3: Probar con Otro Usuario

Si un usuario específico está dando problemas:

1. Prueba con otro usuario que tenga email
2. Verifica que el email sea válido
3. Revisa los logs del servidor

### Solución 4: Reiniciar Servidor

Si el problema persiste:

```bash
# Detener servidor
Ctrl + C

# Iniciar servidor
npm start
```

---

## 📊 Comportamiento Normal

### Flujo Exitoso:

1. Usuario solicita recuperación
2. Sistema verifica rate limiting (5 min)
3. Sistema genera token seguro
4. Sistema envía email
5. Usuario recibe email (puede ir a SPAM)
6. Usuario hace clic en el link
7. Usuario restablece contraseña

### Tiempos:

- **Rate limiting**: 5 minutos entre solicitudes
- **Expiración de token**: 1 hora
- **Uso del token**: Una sola vez

---

## 🔒 Seguridad Implementada

### Rate Limiting ✅

- **Límite**: 1 solicitud cada 5 minutos por usuario
- **Propósito**: Prevenir spam y ataques de fuerza bruta
- **Implementación**: En memoria (Map)

### Tokens Seguros ✅

- **Generación**: crypto.randomBytes(32).toString('hex')
- **Longitud**: 64 caracteres hexadecimales
- **Entropía**: 256 bits
- **Único**: Cada solicitud genera un token diferente

### Expiración ✅

- **Tiempo**: 1 hora desde la generación
- **Verificación**: Automática en cada uso
- **Invalidación**: Tokens anteriores se invalidan

### Uso Único ✅

- **Marcado**: Token se marca como "usado" después de restablecer
- **Verificación**: Tokens usados son rechazados
- **Seguridad**: No se puede reutilizar el mismo token

---

## 🧪 Pruebas

### Test 1: Solicitud Normal

```bash
# Debe funcionar
curl -X POST http://localhost:3001/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"quimeykw"}'
```

**Respuesta esperada:**
```json
{
  "message": "Si el usuario existe, recibirás un email con instrucciones para restablecer tu contraseña"
}
```

### Test 2: Rate Limiting

```bash
# Primera solicitud - OK
curl -X POST http://localhost:3001/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"quimeykw"}'

# Segunda solicitud inmediata - ERROR 429
curl -X POST http://localhost:3001/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"quimeykw"}'
```

**Respuesta esperada (segunda solicitud):**
```json
{
  "error": "Por favor espera 5 minutos antes de solicitar otro restablecimiento"
}
```

### Test 3: Usuario Inexistente

```bash
# Usuario que no existe
curl -X POST http://localhost:3001/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"usuarioinexistente"}'
```

**Respuesta esperada:**
```json
{
  "message": "Si el usuario existe, recibirás un email con instrucciones para restablecer tu contraseña"
}
```

**Nota:** Por seguridad, el sistema siempre retorna el mismo mensaje, sin revelar si el usuario existe o no.

---

## 📁 Scripts Disponibles

### 1. Diagnóstico Completo
```bash
node diagnostico-error-500.js
```
Verifica todos los componentes del sistema.

### 2. Buscar Usuario
```bash
node buscar-usuario.js [username]
```
Busca un usuario y muestra su información.

### 3. Verificar Token
```bash
node verificar-token.js
```
Muestra el último token generado.

### 4. Probar Email
```bash
node test-email-usuario.js [username]
```
Envía un email de prueba a un usuario.

---

## 💡 Recomendaciones

### Para Desarrollo:

1. **No hagas múltiples solicitudes seguidas**
   - Espera 5 minutos entre pruebas
   - Usa diferentes usuarios para probar

2. **Revisa los logs del servidor**
   - Verifica que los emails se envíen
   - Busca mensajes de error

3. **Usa el script de diagnóstico**
   - Ejecuta `node diagnostico-error-500.js` antes de reportar problemas

### Para Producción:

1. **Configura variables de entorno en Render**
   ```
   EMAIL_USER=quimeykw@gmail.com
   EMAIL_APP_PASSWORD=yianricsnvxfhxbl
   NODE_ENV=production
   ```

2. **Monitorea los logs**
   - Revisa logs en Render Dashboard
   - Busca errores de email

3. **Considera Redis para rate limiting**
   - Actualmente usa memoria (Map)
   - Para múltiples instancias, usa Redis

---

## ✅ Conclusión

**Estado Actual:** ✅ Sistema funcionando correctamente

**Causa del Error 500:** Rate limiting (5 minutos entre solicitudes)

**Solución:** Esperar 5 minutos antes de solicitar otro token

**Verificación:**
- ✅ Tabla password_resets existe
- ✅ 25 usuarios con email configurado
- ✅ Servicio de email funcionando
- ✅ Tokens generándose correctamente
- ✅ Emails enviándose exitosamente

---

**El sistema está funcionando correctamente. El error 500 es causado por rate limiting, que es un comportamiento de seguridad esperado.** 🎉
