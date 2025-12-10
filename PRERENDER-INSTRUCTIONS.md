
# Instrucciones para integrar prerender

## 1. Instalar en server.js

Añade estas líneas al inicio de server.js (después de los requires):

```javascript
const { prerenderMiddleware } = require('./prerender-middleware');

// Añadir antes de las rutas estáticas
app.use(prerenderMiddleware);
```

## 2. Beneficios

✅ **SEO Mejorado**: Los bots ven contenido prerenderizado
✅ **Faster FCP**: Contenido crítico se carga inmediatamente
✅ **Social Media**: Previews correctos en redes sociales
✅ **Ligero**: Solo se activa para bots, usuarios normales ven la SPA

## 3. Verificar funcionamiento

Puedes probar con:
```bash
curl -H "User-Agent: Googlebot" https://shopmanstorej.onrender.com/
```

## 4. Alternativas más avanzadas

Para proyectos más grandes, considera:
- Prerender.io
- Puppeteer para prerender dinámico
- Next.js con SSG/SSR
- Nuxt.js para Vue
