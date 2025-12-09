# ☁️ Guía: Conectar ShopManStore con Cloudflare

Esta guía te ayudará a conectar tu aplicación ShopManStore desplegada en Render con Cloudflare para mejorar rendimiento, seguridad y SEO.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ **Dominio registrado** (ej: GoDaddy, Namecheap, Google Domains)
- ✅ **ShopManStore desplegado en Render** (o cualquier hosting)
- ✅ **Cuenta de Cloudflare** (gratuita)
- ✅ **Acceso al panel de tu registrador de dominio**

---

## 🎯 ¿Qué lograrás con Cloudflare?

### 🚀 Rendimiento
- **CDN Global**: Tu sitio se carga desde el servidor más cercano al usuario
- **Caché inteligente**: Imágenes, CSS y JS se sirven desde Cloudflare
- **Compresión automática**: Archivos más pequeños = carga más rápida

### 🛡️ Seguridad
- **Protección DDoS**: Bloquea ataques automáticamente
- **Firewall WAF**: Protege contra inyecciones SQL y XSS
- **SSL/TLS gratuito**: HTTPS automático para tu dominio
- **Oculta tu IP real**: Protege tu servidor de ataques directos

### 💰 Ahorro
- **Reduce ancho de banda**: Menos tráfico a tu servidor = menor costo
- **Menor carga del servidor**: Puedes usar un plan más económico

---

## 📍 Fase 1: Obtener la IP de tu Servidor (Render)

### Paso 1.1: Obtener la URL de Render

1. Ve a tu dashboard de Render: https://dashboard.render.com/
2. Selecciona tu servicio **ShopManStore**
3. Copia la URL que aparece (ej: `shopmanstore.onrender.com`)

### Paso 1.2: Obtener la IP

**Opción A: Usar comando (Windows)**
```cmd
nslookup shopmanstore.onrender.com
```

**Opción B: Usar herramienta online**
- Ve a: https://www.whatismyip.com/hostname-to-ip/
- Pega tu URL de Render
- Copia la dirección IPv4 que aparece

**Ejemplo de resultado:**
```
Dirección IPv4: 216.24.57.1
```

⚠️ **IMPORTANTE**: Guarda esta IP, la necesitarás en la Fase 3.

---

## 🌐 Fase 2: Configurar Cloudflare

### Paso 2.1: Crear Cuenta y Agregar Sitio

1. Ve a https://www.cloudflare.com/
2. Crea una cuenta gratuita (si no tienes una)
3. Haz clic en **"Add a Site"** (Agregar sitio)
4. Ingresa tu dominio (ej: `tudominio.com`)
5. Selecciona el plan **Free** (gratuito)
6. Haz clic en **"Continue"**

### Paso 2.2: Escaneo de DNS

Cloudflare escaneará automáticamente tus registros DNS existentes.

- ✅ Si encuentra registros, los mostrará
- ⚠️ No te preocupes si no son perfectos, los configuraremos después

Haz clic en **"Continue"**

### Paso 2.3: Obtener Nameservers de Cloudflare

Cloudflare te mostrará **2 nameservers únicos**, algo como:

```
alan.ns.cloudflare.com
amy.ns.cloudflare.com
```

⚠️ **IMPORTANTE**: Copia estos nameservers, los necesitarás en el siguiente paso.

---

## 🔧 Fase 3: Actualizar Nameservers en tu Registrador

Ahora debes decirle a tu registrador de dominio que Cloudflare manejará el DNS.

### Paso 3.1: Acceder a tu Registrador

**GoDaddy:**
1. Ve a https://dcc.godaddy.com/
2. Busca tu dominio
3. Haz clic en **DNS** o **Manage DNS**
4. Busca la sección **Nameservers**

**Namecheap:**
1. Ve a https://ap.www.namecheap.com/
2. Haz clic en **Domain List**
3. Selecciona tu dominio
4. Busca **Nameservers** en la pestaña **Domain**

**Google Domains:**
1. Ve a https://domains.google.com/
2. Selecciona tu dominio
3. Ve a **DNS** → **Name servers**

### Paso 3.2: Cambiar los Nameservers

1. Selecciona **"Custom nameservers"** o **"Use custom nameservers"**
2. **Elimina** los nameservers actuales
3. **Agrega** los 2 nameservers de Cloudflare que copiaste:
   ```
   alan.ns.cloudflare.com
   amy.ns.cloudflare.com
   ```
4. **Guarda los cambios**

⏳ **Nota**: Este cambio puede tardar de 5 minutos a 48 horas en propagarse globalmente.

---

## ⚙️ Fase 4: Configurar Registros DNS en Cloudflare

Ahora configuraremos a dónde debe apuntar tu dominio.

### Paso 4.1: Ir a la Sección DNS

1. En el dashboard de Cloudflare, selecciona tu dominio
2. Ve a la pestaña **DNS** → **Records**

### Paso 4.2: Configurar Registro A (Dominio Principal)

Crea un nuevo registro:

| Campo | Valor |
|-------|-------|
| **Type** | `A` |
| **Name** | `@` |
| **IPv4 address** | La IP que obtuviste en Fase 1 |
| **Proxy status** | 🟠 **Proxied** (Naranja) |
| **TTL** | Auto |

**Ejemplo:**
```
Type: A
Name: @
IPv4: 216.24.57.1
Proxy: Proxied (🟠)
```

Haz clic en **"Save"**

### Paso 4.3: Configurar Registro CNAME (www)

Crea otro registro para el subdominio `www`:

| Campo | Valor |
|-------|-------|
| **Type** | `CNAME` |
| **Name** | `www` |
| **Target** | `@` |
| **Proxy status** | 🟠 **Proxied** (Naranja) |
| **TTL** | Auto |

**Ejemplo:**
```
Type: CNAME
Name: www
Target: @
Proxy: Proxied (🟠)
```

Haz clic en **"Save"**

### 🎨 ¿Qué significa "Proxied" (Naranja)?

- 🟠 **Proxied (Naranja)**: El tráfico pasa por Cloudflare (CDN, seguridad, caché)
- ⚪ **DNS Only (Gris)**: El tráfico va directo a tu servidor (sin protección)

**Recomendación**: Deja siempre en **Proxied** para aprovechar Cloudflare.

---

## 🔐 Fase 5: Configurar SSL/TLS

### Paso 5.1: Configurar Modo SSL

1. En Cloudflare, ve a **SSL/TLS** → **Overview**
2. Selecciona el modo: **"Full (strict)"**

**Opciones:**
- ❌ **Off**: Sin HTTPS (no recomendado)
- ⚠️ **Flexible**: HTTPS entre usuario y Cloudflare, HTTP entre Cloudflare y servidor
- ✅ **Full**: HTTPS en ambos lados (certificado autofirmado OK)
- ✅ **Full (strict)**: HTTPS en ambos lados (certificado válido requerido)

**Para Render, usa**: **Full (strict)** (Render ya tiene SSL)

### Paso 5.2: Activar "Always Use HTTPS"

1. Ve a **SSL/TLS** → **Edge Certificates**
2. Activa **"Always Use HTTPS"**
3. Activa **"Automatic HTTPS Rewrites"**

Esto redirige automáticamente `http://` a `https://`

---

## ⚡ Fase 6: Optimizaciones Recomendadas

### 6.1 Activar Auto Minify

1. Ve a **Speed** → **Optimization**
2. Activa **Auto Minify** para:
   - ✅ JavaScript
   - ✅ CSS
   - ✅ HTML

Esto reduce el tamaño de tus archivos automáticamente.

### 6.2 Activar Brotli

1. En **Speed** → **Optimization**
2. Activa **Brotli**

Compresión más eficiente que Gzip.

### 6.3 Configurar Caché

1. Ve a **Caching** → **Configuration**
2. **Browser Cache TTL**: `4 hours` (recomendado)
3. Haz clic en **"Purge Everything"** si haces cambios importantes

---

## ✅ Fase 7: Verificación

### Paso 7.1: Esperar Propagación

⏳ La propagación de DNS puede tardar:
- **Mínimo**: 5-10 minutos
- **Promedio**: 2-4 horas
- **Máximo**: 24-48 horas

### Paso 7.2: Verificar Estado en Cloudflare

1. Ve al dashboard de Cloudflare
2. Deberías ver: **"Status: Active"** ✅
3. Recibirás un email de confirmación

### Paso 7.3: Probar tu Dominio

Abre tu navegador y prueba:

```
https://tudominio.com
https://www.tudominio.com
```

Deberías ver:
- ✅ Tu aplicación ShopManStore funcionando
- ✅ Candado de seguridad (HTTPS) en la barra de direcciones
- ✅ Carga rápida

### Paso 7.4: Verificar SSL

Ve a: https://www.ssllabs.com/ssltest/

Ingresa tu dominio y verifica que obtienes una calificación **A** o **A+**

---

## 🔧 Solución de Problemas

### ❌ "DNS_PROBE_FINISHED_NXDOMAIN"

**Causa**: Los nameservers aún no se han propagado.

**Solución**:
- Espera más tiempo (hasta 48 horas)
- Verifica que los nameservers en tu registrador sean correctos
- Limpia caché DNS: `ipconfig /flushdns` (Windows)

### ❌ "ERR_TOO_MANY_REDIRECTS"

**Causa**: Configuración SSL incorrecta.

**Solución**:
1. Ve a **SSL/TLS** en Cloudflare
2. Cambia a **"Full (strict)"**
3. Espera 5 minutos

### ❌ "Error 521: Web server is down"

**Causa**: Cloudflare no puede conectarse a tu servidor.

**Solución**:
1. Verifica que la IP en el registro A es correcta
2. Verifica que tu app en Render está funcionando
3. Verifica que Render no está en modo "sleep"

### ❌ "Error 525: SSL handshake failed"

**Causa**: Problema con el certificado SSL.

**Solución**:
1. Cambia SSL/TLS a **"Full"** (en lugar de "Full strict")
2. Espera unos minutos

### ❌ El sitio carga pero sin estilos

**Causa**: Caché de Cloudflare.

**Solución**:
1. Ve a **Caching** → **Configuration**
2. Haz clic en **"Purge Everything"**
3. Espera 5 minutos y recarga (Ctrl + F5)

---

## 📊 Monitoreo y Análisis

### Ver Estadísticas

1. Ve al dashboard de Cloudflare
2. Selecciona tu dominio
3. Ve a **Analytics & Logs** → **Traffic**

Podrás ver:
- 📈 Tráfico total
- 🛡️ Amenazas bloqueadas
- 💾 Ancho de banda ahorrado
- 🌍 Distribución geográfica de visitantes

---

## 🎯 Checklist de Configuración

- [ ] IP de Render obtenida
- [ ] Cuenta de Cloudflare creada
- [ ] Dominio agregado a Cloudflare
- [ ] Nameservers de Cloudflare copiados
- [ ] Nameservers actualizados en registrador
- [ ] Registro A configurado (@ → IP)
- [ ] Registro CNAME configurado (www → @)
- [ ] Ambos registros en modo "Proxied" (🟠)
- [ ] SSL/TLS configurado en "Full (strict)"
- [ ] "Always Use HTTPS" activado
- [ ] Auto Minify activado
- [ ] Brotli activado
- [ ] Dominio verificado y funcionando
- [ ] HTTPS funcionando correctamente
- [ ] Certificado SSL válido (A+ en SSLLabs)

---

## 💡 Consejos Pro

1. **Purga caché después de cambios**: Si actualizas tu app, purga el caché de Cloudflare
2. **Usa Page Rules**: Crea reglas personalizadas para diferentes rutas
3. **Activa "Development Mode"**: Cuando estés haciendo cambios frecuentes
4. **Monitorea Analytics**: Revisa regularmente las estadísticas
5. **Configura notificaciones**: Recibe alertas de problemas por email

---

## 🔗 Configuración Específica para ShopManStore

### Variables de Entorno en Render

Asegúrate de actualizar `BASE_URL` en Render:

```env
BASE_URL=https://tudominio.com
```

Esto es importante para:
- ✅ Links de recuperación de contraseña
- ✅ Notificaciones de WhatsApp
- ✅ Links de Mercado Pago

### Actualizar en Render

1. Ve a tu servicio en Render
2. Ve a **Environment** → **Environment Variables**
3. Edita `BASE_URL` con tu dominio
4. Guarda y espera el redeploy automático

---

## 📚 Recursos Adicionales

- **Dashboard de Cloudflare**: https://dash.cloudflare.com/
- **Documentación oficial**: https://developers.cloudflare.com/
- **Estado de Cloudflare**: https://www.cloudflarestatus.com/
- **Comunidad**: https://community.cloudflare.com/

---

## 🎉 ¡Listo!

Tu aplicación ShopManStore ahora está:
- ⚡ Más rápida (CDN global)
- 🛡️ Más segura (Firewall + DDoS protection)
- 🔒 Con HTTPS automático
- 💰 Consumiendo menos recursos de tu servidor

**Tiempo estimado total**: 30-60 minutos (+ tiempo de propagación DNS)

---

¿Necesitas ayuda? Revisa la sección de solución de problemas o contacta al equipo de desarrollo.
