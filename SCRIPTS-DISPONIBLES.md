# 📜 Scripts Disponibles para Render

## 🧪 Scripts de Testing y Verificación

### 1. `test-render-compatibility.js`
**Propósito:** Tests completos de compatibilidad con Render

**Uso:**
```bash
node test-render-compatibility.js
```

**Qué verifica:**
- ✅ Conexión a base de datos (PostgreSQL/SQLite)
- ✅ Estructura de tabla orders con columna items
- ✅ Inserción de órdenes con items JSON
- ✅ Parseo correcto de items
- ✅ Variables de entorno críticas
- ✅ Servicio WhatsApp
- ✅ Compatibilidad de lastID entre SQLite y PostgreSQL

**Resultado esperado:** 7/7 tests pasados

---

### 2. `verify-render-ready.js`
**Propósito:** Verificación completa pre-deploy

**Uso:**
```bash
node verify-render-ready.js
```

**Qué verifica:**
- 📁 Archivos críticos del proyecto
- 🔐 Variables de entorno requeridas y opcionales
- 📦 Dependencias npm instaladas
- 🗄️ Conexión y estructura de base de datos
- 🔧 Servicios (WhatsApp, Email, Mercado Pago)
- ☁️ Configuración de Render (render.yaml, scripts)

**Resultado esperado:** 0 errores, sistema listo para deploy

---

### 3. `diagnose-render.js`
**Propósito:** Diagnóstico rápido del sistema (útil en producción)

**Uso:**
```bash
node diagnose-render.js
```

**Qué muestra:**
- 📊 Información del entorno (Node version, memoria, uptime)
- 🔐 Estado de variables de entorno
- 📦 Versiones de dependencias instaladas
- 📁 Tamaño de archivos críticos
- 🗄️ Conexión a BD y conteo de registros
- 🔧 Estado de servicios (WhatsApp, Email, MP)

**Cuándo usar:** Para troubleshooting en Render o verificar estado del sistema

---

### 4. `pre-deploy-check.js`
**Propósito:** Checklist básico pre-deploy

**Uso:**
```bash
node pre-deploy-check.js
```

**Qué verifica:**
- Archivos críticos existen
- Variables documentadas en .env.example
- .gitignore configurado correctamente
- package.json tiene scripts necesarios
- Dependencias críticas instaladas
- Sintaxis de archivos JavaScript

---

## 🗄️ Scripts de Base de Datos

### 5. `migrate-add-items-column.js`
**Propósito:** Agregar columna `items` a tabla orders

**Uso:**
```bash
node migrate-add-items-column.js
```

**Qué hace:**
- Detecta si usa PostgreSQL o SQLite
- Verifica si la columna ya existe
- Agrega columna `items TEXT` si no existe
- Muestra estructura actualizada de la tabla

**Cuándo usar:** 
- Primera vez que despliegas a Render
- Si ves error "column items does not exist"

---

### 6. `init-db.js`
**Propósito:** Inicializar base de datos con estructura completa

**Uso:**
```bash
node init-db.js
```

**Qué hace:**
- Crea todas las tablas (users, products, orders, logs, password_resets)
- Crea usuario admin por defecto
- Agrega productos de ejemplo
- Compatible con SQLite y PostgreSQL

**Nota:** Este script se ejecuta automáticamente al iniciar el servidor

---

## 🔧 Scripts de Utilidad

### 7. `change-password.js`
**Propósito:** Cambiar contraseña de un usuario

**Uso:**
```bash
node change-password.js <username> <nueva-contraseña>
```

**Ejemplo:**
```bash
node change-password.js admin mi-nueva-contraseña-segura
```

---

### 8. `check-user.js`
**Propósito:** Verificar información de un usuario

**Uso:**
```bash
node check-user.js <username>
```

---

### 9. `list-users.js`
**Propósito:** Listar todos los usuarios del sistema

**Uso:**
```bash
node list-users.js
```

---

### 10. `find-user.js`
**Propósito:** Buscar usuario por username o email

**Uso:**
```bash
node find-user.js <username-o-email>
```

---

## 🧪 Scripts de Testing de Funcionalidades

### 11. `test-log-formatting.js`
**Propósito:** Probar formato de logs de compras

**Uso:**
```bash
node test-log-formatting.js
```

**Qué prueba:**
- Formato de logs con productos y cantidades
- Logs sin items (backward compatibility)
- Cálculo de totales

---

### 12. `test-mercadopago-integration.js`
**Propósito:** Probar integración con Mercado Pago

**Uso:**
```bash
node test-mercadopago-integration.js
```

**Qué prueba:**
- Configuración de Mercado Pago
- Creación de preferencias de pago
- Detección de modo TEST vs PRODUCCIÓN

---

### 13. `test-purchase-notification.js`
**Propósito:** Probar notificaciones de compra

**Uso:**
```bash
node test-purchase-notification.js
```

**Qué prueba:**
- Formato de mensajes WhatsApp
- Generación de URLs de WhatsApp
- Servicio de notificaciones

---

## 🚀 Workflow Recomendado para Deploy

### Antes de Deploy (Local)

```bash
# 1. Verificar que todo está listo
node verify-render-ready.js

# 2. Ejecutar tests de compatibilidad
node test-render-compatibility.js

# 3. Si todo pasa, hacer commit y push
git add .
git commit -m "feat: Deploy a producción"
git push origin main
```

### Después de Deploy (En Render)

```bash
# 1. Ejecutar migración (si es primera vez)
node migrate-add-items-column.js

# 2. Verificar estado del sistema
node diagnose-render.js

# 3. Cambiar contraseña admin (recomendado)
node change-password.js admin nueva-contraseña-segura
```

### Si Hay Problemas en Render

```bash
# 1. Diagnóstico completo
node diagnose-render.js

# 2. Verificar base de datos
node migrate-add-items-column.js

# 3. Revisar logs del servidor
# (En Render Dashboard → Logs)
```

---

## 📋 Checklist de Deploy

- [ ] `node verify-render-ready.js` → 0 errores
- [ ] `node test-render-compatibility.js` → 7/7 tests pasados
- [ ] Variables de entorno configuradas en Render
- [ ] Base de datos PostgreSQL creada en Render
- [ ] `git push origin main` ejecutado
- [ ] Deploy completado en Render
- [ ] `node migrate-add-items-column.js` ejecutado en Render (si es necesario)
- [ ] `node diagnose-render.js` → Sistema operativo
- [ ] Contraseña admin cambiada
- [ ] Prueba de compra realizada exitosamente

---

## 🆘 Comandos de Emergencia

### Sistema no inicia
```bash
node diagnose-render.js
# Revisa errores en la sección de Base de Datos y Servicios
```

### Error de base de datos
```bash
node migrate-add-items-column.js
# Luego reinicia el servicio en Render
```

### Verificar configuración
```bash
node verify-render-ready.js
# Corrige los errores marcados con ❌
```

### Reset de contraseña admin
```bash
node change-password.js admin admin123
# Usa la contraseña por defecto temporalmente
```

---

## 💡 Tips

1. **Siempre ejecuta `verify-render-ready.js` antes de hacer deploy**
2. **Guarda los resultados de `diagnose-render.js` si reportas un problema**
3. **Ejecuta `test-render-compatibility.js` después de cambios en la BD**
4. **Usa `diagnose-render.js` en Render Shell para troubleshooting**

---

## 📚 Documentación Adicional

- `DEPLOY-RENDER-FINAL.md` - Guía completa de deploy
- `CHANGELOG-NUEVAS-FUNCIONES.md` - Historial de cambios
- `NUEVAS-FUNCIONALIDADES-COMPRAS.md` - Documentación de funcionalidades
- `RESUMEN-EJECUTIVO.md` - Resumen del proyecto

---

**Última actualización:** 2024-11-26
**Estado:** ✅ Todos los scripts testeados y funcionando
