# 🚀 Guía Rápida: Configurar UptimeRobot

## ⏰ Problema
Tu servidor en Render se "duerme" después de 15 minutos de inactividad, causando que la primera carga tarde 30-60 segundos.

## ✅ Solución
UptimeRobot hará "ping" a tu servidor cada 5 minutos para mantenerlo despierto.

---

## 📝 Pasos (5 minutos)

### 1. Crear Cuenta en UptimeRobot
1. Ve a: https://uptimerobot.com/signUp
2. Completa el formulario:
   - Email
   - Contraseña
   - Acepta términos
3. Click en "Sign Up"
4. Verifica tu email (revisa spam si no llega)

---

### 2. Agregar Monitor

1. **Iniciar Sesión** en UptimeRobot
2. Click en **"+ Add New Monitor"** (botón verde)
3. **Configurar el Monitor:**

   ```
   Monitor Type: HTTP(s)
   Friendly Name: ShopManStore
   URL (or IP): https://tu-app.onrender.com/health
   Monitoring Interval: 5 minutes
   ```

   **Importante:** Reemplaza `tu-app.onrender.com` con tu URL real de Render

4. **Configuración Avanzada (Opcional):**
   - Alert Contacts: Tu email (para recibir notificaciones si cae)
   - HTTP Method: GET (por defecto)
   - Timeout: 30 seconds

5. Click en **"Create Monitor"**

---

### 3. Verificar que Funciona

1. En el dashboard de UptimeRobot verás tu monitor
2. Espera 1-2 minutos
3. Deberías ver:
   - ✅ Status: Up
   - 🟢 Punto verde
   - Response Time: ~200-500ms

---

## 🎯 Resultado

### Antes:
- ⏰ Primera carga: 30-60 segundos (servidor dormido)
- ⚡ Cargas posteriores: 1-2 segundos

### Después:
- ⚡ **Todas las cargas: 1-2 segundos**
- ✅ Servidor siempre despierto
- 🎉 Sin esperas

---

## 📊 Monitoreo

UptimeRobot te mostrará:
- ✅ Uptime % (debería ser ~99.9%)
- 📈 Response time promedio
- 📧 Alertas si el servidor cae
- 📊 Estadísticas de los últimos 30 días

---

## 💡 Tips

### 1. Múltiples Monitores
Puedes agregar hasta **50 monitores gratis**:
- Monitor 1: `/health` (cada 5 min)
- Monitor 2: `/` (cada 10 min)
- Monitor 3: `/api/products` (cada 15 min)

### 2. Alertas
Configura alertas para recibir email si:
- El servidor cae
- Response time > 5 segundos
- Uptime < 99%

### 3. Status Page
UptimeRobot puede crear una página pública de status:
- Muestra si tu tienda está online
- Historial de uptime
- Puedes compartir con clientes

---

## ⚠️ Importante

### Límites del Plan Gratuito:
- ✅ 50 monitores
- ✅ Checks cada 5 minutos (mínimo)
- ✅ Alertas por email
- ✅ Retención de logs: 2 meses

### Si necesitas más:
- Plan Pro: $7/mes
  - Checks cada 1 minuto
  - SMS alerts
  - Más features

---

## 🔧 Troubleshooting

### Monitor muestra "Down"
1. Verifica que tu URL de Render sea correcta
2. Asegúrate de que el endpoint `/health` existe
3. Prueba la URL en tu navegador: `https://tu-app.onrender.com/health`
4. Deberías ver: `{"status":"ok","timestamp":"...","uptime":123}`

### Response Time muy alto (>5 segundos)
- Normal en la primera request después de dormir
- Debería bajar a ~200-500ms después

### No recibo alertas
1. Verifica tu email en UptimeRobot settings
2. Revisa carpeta de spam
3. Agrega `alert@uptimerobot.com` a tus contactos

---

## 📱 App Móvil

UptimeRobot tiene apps para:
- 📱 iOS: https://apps.apple.com/app/uptimerobot/id1104878581
- 🤖 Android: https://play.google.com/store/apps/details?id=com.uptimerobot

Puedes monitorear tu tienda desde el celular.

---

## ✅ Checklist Final

- [ ] Cuenta creada en UptimeRobot
- [ ] Monitor agregado con URL correcta
- [ ] Monitor muestra status "Up"
- [ ] Response time < 1 segundo
- [ ] Email de alerta configurado
- [ ] Probado que la tienda carga rápido

---

## 🎉 ¡Listo!

Tu servidor ahora se mantendrá despierto 24/7 y tu tienda cargará rápido siempre.

**URL de UptimeRobot:** https://uptimerobot.com/dashboard

---

## 📚 Recursos

- Documentación: https://uptimerobot.com/api/
- Soporte: https://uptimerobot.com/contact/
- Status: https://status.uptimerobot.com/

---

**¿Necesitas ayuda?** Revisa el archivo `OPTIMIZAR-RENDER.md` para más opciones y soluciones.
