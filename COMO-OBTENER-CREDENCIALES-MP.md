# 🔑 Cómo Obtener Credenciales de Mercado Pago

## 📋 Guía Paso a Paso

### Paso 1: Acceder a tu Cuenta de Mercado Pago

1. **Abre tu navegador** (Chrome, Firefox, Edge, etc.)
2. **Ve a:** https://www.mercadopago.com.ar
3. **Haz clic en "Ingresar"** (arriba a la derecha)
4. **Ingresa tus datos:**
   - Email o usuario
   - Contraseña
5. **Click en "Continuar"**

---

### Paso 2: Ir al Panel de Desarrolladores

**Opción A - Directo:**
- Ve directamente a: https://www.mercadopago.com.ar/developers/panel

**Opción B - Desde el menú:**
1. Una vez logueado, busca tu nombre arriba a la derecha
2. Click en el menú desplegable
3. Busca "Desarrolladores" o "Developers"
4. Click en "Panel de desarrolladores"

---

### Paso 3: Crear una Aplicación (Si no tienes una)

Si es tu primera vez:

1. **Click en "Crear aplicación"** o "Create application"
2. **Completa los datos:**
   - **Nombre:** ShopManStore (o el que prefieras)
   - **Descripción:** Tienda online de ropa
   - **Tipo:** E-commerce
3. **Click en "Crear"** o "Create"

---

### Paso 4: Acceder a las Credenciales

1. **En el panel de desarrolladores**, verás tu aplicación
2. **Click en tu aplicación** (ShopManStore)
3. **En el menú lateral**, busca **"Credenciales"** o **"Credentials"**
4. **Click en "Credenciales"**

---

### Paso 5: Obtener las Credenciales de PRUEBA (TEST)

Verás **DOS secciones**:

#### 🧪 Credenciales de Prueba (TEST) ← **USA ESTAS**
```
┌─────────────────────────────────────────┐
│ Credenciales de prueba                  │
├─────────────────────────────────────────┤
│ Public Key:                             │
│ TEST-xxxxxxxx-xxxxxx-xxxx...            │
│ [Copiar]                                │
│                                         │
│ Access Token:                           │
│ TEST-xxxxxxxx-xxxxxx-xxxx...            │
│ [Copiar] ← COPIA ESTE                   │
└─────────────────────────────────────────┘
```

#### 💰 Credenciales de Producción ← **NO uses estas aún**
```
┌─────────────────────────────────────────┐
│ Credenciales de producción              │
├─────────────────────────────────────────┤
│ Public Key:                             │
│ APP_USR-xxxxxxxx-xxxxxx-xxxx...         │
│ [Copiar]                                │
│                                         │
│ Access Token:                           │
│ APP_USR-xxxxxxxx-xxxxxx-xxxx...         │
│ [Copiar]                                │
└─────────────────────────────────────────┘
```

---

### Paso 6: Copiar el Access Token de TEST

1. **En la sección "Credenciales de prueba"**
2. **Busca "Access Token"**
3. **Verifica que comience con `TEST-`**
4. **Click en el botón "Copiar"** (📋)
5. **O selecciona todo el token y copia** (Ctrl+C)

**El token se ve así:**
```
TEST-1234567890123456-112320-abcdef1234567890abcdef1234567890-12345678
```

---

### Paso 7: Configurar en tu Aplicación

1. **Abre el archivo `.env`** en tu proyecto
2. **Busca la línea:**
   ```
   # MP_TOKEN=...
   ```
3. **Reemplázala con:**
   ```
   MP_TOKEN=TEST-tu-token-completo-aqui
   ```
4. **Guarda el archivo** (Ctrl+S)
5. **Reinicia el servidor:**
   ```bash
   # Detener: Ctrl+C
   # Iniciar: npm start
   ```

---

## 🎯 Ejemplo Completo

### Antes:
```env
PORT=3001
JWT_SECRET=shopmanstore_secret_key_2024
# Mercado Pago desactivado
# MP_TOKEN=APP_USR-5802293204482723-111823-...
```

### Después:
```env
PORT=3001
JWT_SECRET=shopmanstore_secret_key_2024
MP_TOKEN=TEST-1234567890123456-112320-abcdef1234567890abcdef1234567890-12345678
```

---

## ❓ Preguntas Frecuentes

### ❓ ¿Por qué usar credenciales de TEST?

**Respuesta:**
- ✅ No requieren verificación de cuenta
- ✅ No procesan pagos reales
- ✅ Perfectas para desarrollo y pruebas
- ✅ Puedes usar tarjetas de prueba
- ✅ No hay riesgo de cargos reales

### ❓ ¿Cuándo usar credenciales de PRODUCCIÓN?

**Respuesta:**
- 💰 Cuando quieras cobrar dinero real
- 💰 Después de verificar tu cuenta
- 💰 Cuando hayas probado todo con TEST
- 💰 Cuando estés listo para ventas reales

### ❓ No veo la opción "Desarrolladores"

**Soluciones:**
1. **Verifica tu cuenta:**
   - Algunas cuentas nuevas necesitan verificación
   - Ve a "Mi cuenta" → "Datos personales"
   - Completa la verificación de identidad

2. **Usa el link directo:**
   - https://www.mercadopago.com.ar/developers/panel

3. **Prueba desde otro navegador:**
   - A veces hay problemas de caché

### ❓ No puedo crear una aplicación

**Soluciones:**
1. **Verifica tu cuenta de Mercado Pago:**
   - Debe estar activa
   - Email verificado
   - Datos completos

2. **Contacta soporte de Mercado Pago:**
   - https://www.mercadopago.com.ar/ayuda

---

## 💳 Tarjetas de Prueba

Una vez que tengas el token de TEST, usa estas tarjetas:

### ✅ Visa - Pago Aprobado
```
Número: 4509 9535 6623 3704
CVV: 123
Vencimiento: 11/25
Nombre: APRO
DNI: 12345678
```

### ❌ Mastercard - Pago Rechazado
```
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
Nombre: OTHE
DNI: 12345678
```

### 🔄 Más tarjetas de prueba:
https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing

---

## 🔍 Verificar que Funciona

### 1. Reinicia el servidor:
```bash
npm start
```

### 2. Verifica los logs:
Deberías ver:
```
Mercado Pago configurado correctamente
Server: http://localhost:3001
```

### 3. Prueba un pago:
1. Agrega productos al carrito
2. Click en "Pagar"
3. Selecciona "Mercado Pago"
4. Debería abrir el link de pago

### 4. Revisa los logs del servidor:
```
Creando pago MP para: admin Total: 1500
Respuesta de MP: { status: 200, payment_id: 12345, payment_status: 'pending' }
Orden guardada exitosamente
```

---

## 🆘 Si Sigues Teniendo Problemas

### Opción 1: Usa los métodos alternativos
Tu tienda funciona perfectamente con:
- ✅ Tarjeta (simulado)
- ✅ WhatsApp

### Opción 2: Contacta a Mercado Pago
- **Soporte:** https://www.mercadopago.com.ar/ayuda
- **Comunidad:** https://www.mercadopago.com.ar/developers/es/community
- **Email:** developers@mercadopago.com

### Opción 3: Verifica tu cuenta
1. Ve a "Mi cuenta" en Mercado Pago
2. Completa todos los datos personales
3. Verifica tu email
4. Verifica tu identidad (DNI)
5. Espera 24-48 horas

---

## 📞 Recursos Útiles

- **Panel de Desarrolladores:** https://www.mercadopago.com.ar/developers/panel
- **Documentación:** https://www.mercadopago.com.ar/developers/es/docs
- **Guías:** https://www.mercadopago.com.ar/developers/es/guides
- **API Reference:** https://www.mercadopago.com.ar/developers/es/reference
- **Soporte:** https://www.mercadopago.com.ar/ayuda

---

## ✅ Checklist Final

Antes de contactar soporte, verifica:

- [ ] Tengo cuenta de Mercado Pago activa
- [ ] Mi email está verificado
- [ ] Puedo acceder a https://www.mercadopago.com.ar/developers/panel
- [ ] Veo la sección "Credenciales de prueba"
- [ ] Copié el token que comienza con `TEST-`
- [ ] Actualicé el archivo `.env`
- [ ] Reinicié el servidor
- [ ] Probé hacer un pago de prueba

---

**¡Buena suerte!** 🍀

Si sigues los pasos, deberías poder obtener tus credenciales sin problemas. Si tienes alguna duda específica, avísame y te ayudo. 😊
