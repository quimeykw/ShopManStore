# 🔧 Solucionar Modo TEST en Render

## Problema
Render muestra que los pagos están en modo TEST en lugar de PRODUCCIÓN.

## Causa
El token de Mercado Pago configurado en Render es de TEST en lugar de PRODUCCIÓN.

## Solución

### Paso 1: Verificar Token en Render

1. Ve a https://dashboard.render.com
2. Selecciona tu servicio "shopmanstore"
3. Click en la pestaña **"Environment"**
4. Busca la variable `MP_TOKEN`

### Paso 2: Verificar si es Token de TEST o PRODUCCIÓN

**Token de TEST** (INCORRECTO):
- Contiene la palabra "TEST" en el nombre
- Ejemplo: `TEST-123456...`

**Token de PRODUCCIÓN** (CORRECTO):
- Empieza con `APP_USR-`
- NO contiene "TEST"
- Ejemplo: `APP_USR-6705758039481271-111823-09ca53b5914d9759bf8dd9c972abf4cc-222452450`

### Paso 3: Actualizar Token en Render

Si el token es de TEST, cámbialo:

1. En la página de Environment de Render
2. Click en el **lápiz** (editar) junto a `MP_TOKEN`
3. Reemplaza el valor con el token de PRODUCCIÓN:

```
APP_USR-6705758039481271-111823-09ca53b5914d9759bf8dd9c972abf4cc-222452450
```

4. Click en **"Save Changes"**
5. Render reiniciará automáticamente el servicio

### Paso 4: Verificar Otras Variables

Asegúrate de que estas variables también estén configuradas:

```bash
# Mercado Pago - PRODUCCIÓN
MP_TOKEN=APP_USR-6705758039481271-111823-09ca53b5914d9759bf8dd9c972abf4cc-222452450
MP_CLIENT_SECRET=huxcuGkqQWwE6pRBjQx6jiN3zuZEQ16b

# WhatsApp
WHATSAPP_PHONE=5491122549995
WHATSAPP_ENABLED=true

# Email
EMAIL_USER=shopmanstorej@gmail.com
EMAIL_APP_PASSWORD=urvryhdurzflowwaq

# JWT
JWT_SECRET=shopmanstore_secret_key_2024

# Base URL (tu URL de Render)
BASE_URL=https://tu-app.onrender.com
```

### Paso 5: Esperar el Reinicio

- Render reiniciará el servicio automáticamente (1-2 minutos)
- Verás en los logs: "Mercado Pago configurado correctamente"

### Paso 6: Verificar en el Navegador

1. **Limpia la caché del navegador:**
   - Chrome/Edge: `Ctrl + Shift + Delete` → Selecciona "Imágenes y archivos en caché" → Borrar
   - O simplemente: `Ctrl + F5` para recargar sin caché

2. **Abre tu sitio de Render**
3. **Agrega productos al carrito**
4. **Click en "Mercado Pago"**
5. **Verifica el mensaje:**
   - ✅ Debe decir: "PAGO REAL - Se cobrará dinero real"
   - ❌ NO debe decir: "Modo TEST"

## Verificación Rápida

Para verificar rápidamente si estás en modo producción:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Haz una compra de prueba
4. Busca la petición a `/api/mp-link`
5. En la respuesta, verifica:
   - ✅ `link` debe apuntar a `www.mercadopago.com.ar/checkout`
   - ❌ `sandbox_link` NO debe usarse

## Problema de Caché Resuelto

Ya agregué `?v=2.0` al archivo `app.js` para forzar la actualización del navegador.

Después de que Render termine el deploy:
1. Recarga la página con `Ctrl + F5`
2. Verás todos los cambios aplicados

## Resumen

✅ **Hecho:**
- Agregado cache busting (`app.js?v=2.0`)
- Push a GitHub completado
- Render desplegando automáticamente

⚠️ **Pendiente (Debes hacer tú):**
- Verificar token `MP_TOKEN` en Render
- Cambiarlo si es de TEST
- Esperar reinicio de Render
- Limpiar caché del navegador

## Tiempo Estimado

- Cambiar token en Render: 1 minuto
- Reinicio de Render: 1-2 minutos
- **Total: 3 minutos**

---

**Una vez hecho esto, tu tienda estará 100% en modo PRODUCCIÓN con pagos reales.** 🚀
