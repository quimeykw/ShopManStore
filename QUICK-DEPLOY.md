# ⚡ Quick Deploy Guide

## 🚀 Deploy en 3 Pasos

### Paso 1: Verificar
```bash
node pre-deploy-check.js
```

### Paso 2: Commit y Push
```bash
git add .
git commit -m "feat: Nuevas funcionalidades - logs, WhatsApp, descuentos y envío gratis"
git push origin main
```

### Paso 3: Monitorear
- Ve a https://dashboard.render.com
- Selecciona tu servicio
- Observa el deploy en la pestaña "Logs"

## ✅ Checklist Rápido

Antes de hacer push:
- [ ] Tests pasan: `node test-mercadopago-integration.js`
- [ ] Servidor funciona: http://localhost:3001
- [ ] Sin errores de sintaxis
- [ ] Variables de entorno en .env.example

Después del deploy:
- [ ] Página carga en Render
- [ ] Login funciona
- [ ] Carrito muestra descuento 10%
- [ ] Logs muestran detalles de compras

## 🔐 Variables de Entorno en Render

Agregar si no existen:
```
WHATSAPP_PHONE=5491122549995
WHATSAPP_ENABLED=true
```

## 📊 Qué Esperar

**Tiempo de deploy:** 2-5 minutos

**Logs esperados:**
```
✓ Columna items agregada/verificada
✓ Usuario admin inicializado
Server: http://0.0.0.0:3001
```

## 🎉 ¡Listo!

Tu tienda ahora tiene:
- ✅ 10% de descuento automático
- ✅ Envío gratis en compras +$80,000
- ✅ Notificaciones WhatsApp automáticas
- ✅ Logs detallados de compras
- ✅ Pagos reales con Mercado Pago

---

**¿Problemas?** Lee `DEPLOY-INSTRUCTIONS.md` para troubleshooting detallado.
