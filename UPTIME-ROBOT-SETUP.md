# Configuración de UptimeRobot para Eliminar Cold Starts

## ¿Qué es UptimeRobot?

UptimeRobot es un servicio gratuito que monitorea tu sitio web y puede mantenerlo "despierto" haciendo requests periódicos, eliminando el problema de cold starts en Render.

## Configuración Paso a Paso

### 1. Crear Cuenta en UptimeRobot

1. Ve a [https://uptimerobot.com](https://uptimerobot.com)
2. Haz clic en "Sign Up Free"
3. Crea tu cuenta gratuita

### 2. Añadir Monitor para tu Sitio

1. Una vez logueado, haz clic en "Add New Monitor"
2. Configura los siguientes valores:

```
Monitor Type: HTTP(s)
Friendly Name: ShopManStore Keep-Alive
URL (or IP): https://shopmanstorej.onrender.com/health
Monitoring Interval: 5 minutes
Monitor Timeout: 30 seconds
```

### 3. Configuración Avanzada (Opcional)

En "Advanced Settings":
```
HTTP Method: GET
HTTP Username: (dejar vacío)
HTTP Password: (dejar vacío)
Custom HTTP Headers: (dejar vacío)
```

### 4. Configurar Alertas

1. En "Alert Contacts", añade tu email
2. Configura para recibir alertas cuando el sitio esté down
3. Esto te ayudará a monitorear el uptime

## Beneficios

✅ **Elimina Cold Starts**: Tu servidor nunca se "duerme"
✅ **Gratis**: Plan gratuito permite hasta 50 monitores
✅ **Confiable**: Pings cada 5 minutos desde múltiples ubicaciones
✅ **Alertas**: Te notifica si hay problemas
✅ **Estadísticas**: Dashboard con uptime y tiempo de respuesta

## Alternativas

Si no quieres usar UptimeRobot, también puedes:

1. **Cron-job.org**: Servicio similar gratuito
2. **GitHub Actions**: Crear workflow que haga ping cada 5 minutos
3. **Google Cloud Scheduler**: Si usas Google Cloud

## Verificación

Una vez configurado, puedes verificar que funciona:

1. Ve al dashboard de UptimeRobot
2. Verifica que el monitor esté "Up" (verde)
3. Revisa los logs de tu aplicación en Render
4. Deberías ver requests a `/health` cada 5 minutos

## Configuración Adicional en Render

En tu dashboard de Render, también puedes:

1. Ir a tu servicio → Settings
2. En "Health Check Path" poner: `/health`
3. Esto ayuda a Render a saber que tu app está funcionando

## Resultado Esperado

- **Antes**: Primer acceso después de inactividad = 10-30 segundos
- **Después**: Todos los accesos = <3 segundos

¡Tu sitio ahora estará siempre disponible y rápido! 🚀