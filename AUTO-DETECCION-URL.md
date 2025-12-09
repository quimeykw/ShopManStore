# 🔄 Auto-Detección de URL en Render

## ✨ Nueva Funcionalidad

El sistema ahora **detecta automáticamente** la URL correcta para los links de recuperación de contraseña, tanto en desarrollo como en producción.

## 🎯 Cómo Funciona

### Prioridad de Detección:

```javascript
BASE_URL = process.env.BASE_URL ||                    // 1. Variable manual (opcional)
           process.env.RENDER_EXTERNAL_URL ||         // 2. URL de Render (automática)
           (NODE_ENV === 'production' ?               // 3. Fallback producción
             'https://shopmanstore.onrender.com' : 
             'http://localhost:3001')                 // 4. Fallback desarrollo
```

### 1. Variable Manual (Opcional)
```bash
BASE_URL=https://mi-dominio-personalizado.com
```
- **Cuándo usar:** Si tienes un dominio personalizado
- **Ejemplo:** `https://shopmanstore.com`

### 2. RENDER_EXTERNAL_URL (Automático) ✨
```bash
# Render proporciona esto automáticamente
RENDER_EXTERNAL_URL=https://shopmanstore.onrender.com
```
- **Cuándo:** Siempre en Render
- **Ventaja:** No necesitas configurar nada
- **Actualización:** Se actualiza automáticamente si cambias el nombre del servicio

### 3. Fallback Producción
```bash
https://shopmanstore.onrender.com
```
- **Cuándo:** Si NODE_ENV=production pero no hay RENDER_EXTERNAL_URL
- **Uso:** Backup de seguridad

### 4. Fallback Desarrollo
```bash
http://localhost:3001
```
- **Cuándo:** En tu máquina local
- **Uso:** Desarrollo y testing

## 📊 Ejemplos de Uso

### Escenario 1: Desarrollo Local
```bash
# .env
EMAIL_USER=quimeykw@gmail.com
EMAIL_APP_PASSWORD=yianricsnvxfhxbl
# BASE_URL no configurado
```

**Resultado:**
```
✓ Servicio de email configurado
  BASE_URL: http://localhost:3001
  Entorno: development
```

**Link generado:**
```
http://localhost:3001/reset-password.html?token=abc123...
```

### Escenario 2: Render (Automático) ✨
```bash
# Variables en Render Dashboard
EMAIL_USER=quimeykw@gmail.com
EMAIL_APP_PASSWORD=yianricsnvxfhxbl
# BASE_URL NO configurado (se detecta automáticamente)

# Render proporciona automáticamente:
RENDER_EXTERNAL_URL=https://shopmanstore.onrender.com
NODE_ENV=production
```

**Resultado:**
```
✓ Servicio de email configurado
  BASE_URL: https://shopmanstore.onrender.com
  Entorno: production
```

**Link generado:**
```
https://shopmanstore.onrender.com/reset-password.html?token=abc123...
```

### Escenario 3: Dominio Personalizado
```bash
# Variables en Render Dashboard
EMAIL_USER=quimeykw@gmail.com
EMAIL_APP_PASSWORD=yianricsnvxfhxbl
BASE_URL=https://shopmanstore.com  # Tu dominio personalizado
```

**Resultado:**
```
✓ Servicio de email configurado
  BASE_URL: https://shopmanstore.com
  Entorno: production
```

**Link generado:**
```
https://shopmanstore.com/reset-password.html?token=abc123...
```

## ✅ Ventajas

### 1. Configuración Simplificada
- ❌ Antes: Configurar BASE_URL manualmente en Render
- ✅ Ahora: Se detecta automáticamente

### 2. Sin Errores de Configuración
- ❌ Antes: Links rotos si BASE_URL estaba mal configurado
- ✅ Ahora: Siempre usa la URL correcta

### 3. Funciona en Todos los Entornos
- ✅ Desarrollo local: `http://localhost:3001`
- ✅ Render: `https://shopmanstore.onrender.com`
- ✅ Dominio personalizado: Tu dominio

### 4. Actualización Automática
- Si cambias el nombre del servicio en Render
- Si agregas un dominio personalizado
- No necesitas actualizar variables manualmente

## 🔧 Configuración en Render

### Opción 1: Automática (Recomendada) ✨

**Solo configura estas 2 variables:**
```
EMAIL_USER=quimeykw@gmail.com
EMAIL_APP_PASSWORD=yianricsnvxfhxbl
```

**BASE_URL se detecta automáticamente desde `RENDER_EXTERNAL_URL`**

### Opción 2: Manual (Solo si tienes dominio personalizado)

**Configura estas 3 variables:**
```
EMAIL_USER=quimeykw@gmail.com
EMAIL_APP_PASSWORD=yianricsnvxfhxbl
BASE_URL=https://tu-dominio-personalizado.com
```

## 📝 Verificación

### En los Logs de Render

Después de desplegar, busca en los logs:

```
✓ Servicio de email configurado
  BASE_URL: https://shopmanstore.onrender.com
  Entorno: production
```

Esto confirma que la URL se detectó correctamente.

### Probar Recuperación

1. Ve a tu aplicación en Render
2. Haz clic en "¿Olvidaste tu contraseña?"
3. Ingresa tu usuario
4. Revisa el email recibido
5. El link debería ser: `https://shopmanstore.onrender.com/reset-password.html?token=...`

## 🔍 Troubleshooting

### Problema: Link apunta a localhost

**Causa:** NODE_ENV no está configurado como "production"

**Solución:**
```bash
# En Render Dashboard → Environment
NODE_ENV=production
```

### Problema: Link apunta a URL incorrecta

**Causa:** BASE_URL configurado manualmente con valor incorrecto

**Solución:**
1. Ve a Render Dashboard → Environment
2. Elimina la variable BASE_URL
3. Deja que se detecte automáticamente

### Problema: RENDER_EXTERNAL_URL no existe

**Causa:** Render no proporcionó la variable (raro)

**Solución:**
```bash
# Configura manualmente en Render Dashboard
BASE_URL=https://shopmanstore.onrender.com
```

## 📊 Comparación

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Variables requeridas | 3 (EMAIL_USER, EMAIL_APP_PASSWORD, BASE_URL) | 2 (EMAIL_USER, EMAIL_APP_PASSWORD) |
| Configuración manual | Sí | No (automática) |
| Riesgo de error | Alto | Bajo |
| Soporte dominio personalizado | Sí | Sí |
| Actualización automática | No | Sí |

## 🎉 Resumen

### Para Desarrollo Local:
- ✅ No necesitas configurar BASE_URL
- ✅ Usa automáticamente `http://localhost:3001`

### Para Render (Producción):
- ✅ No necesitas configurar BASE_URL
- ✅ Usa automáticamente `RENDER_EXTERNAL_URL`
- ✅ Solo configura EMAIL_USER y EMAIL_APP_PASSWORD

### Para Dominio Personalizado:
- ✅ Configura BASE_URL con tu dominio
- ✅ Ejemplo: `https://shopmanstore.com`

---

**¡Configuración más simple y sin errores!** 🚀
