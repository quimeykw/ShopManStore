# Implementation Plan

- [x] 1. Agregar columna items a la tabla orders


  - Crear script de migración para agregar columna `items TEXT` a la tabla orders
  - Soportar tanto SQLite como PostgreSQL
  - Ejecutar migración y verificar que no afecta órdenes existentes
  - _Requirements: 4.1, 4.4_



- [x] 2. Crear servicio de notificaciones WhatsApp
  - Crear archivo `whatsapp-service.js` con funciones de formateo y envío
  - Implementar `formatPurchaseMessage()` que genera mensaje con formato especificado
  - Implementar `sendPurchaseNotification()` que maneja el envío (inicialmente solo logging)
  - Agregar variables de entorno WHATSAPP_PHONE y WHATSAPP_ENABLED
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x]* 2.1 Escribir test de propiedad para formato de mensaje WhatsApp


  - **Property 3: Complete WhatsApp message content**
  - **Validates: Requirements 2.2, 2.3, 2.4, 2.5**

- [x] 3. Mejorar función de logging para compras
  - Crear función `formatPurchaseLog()` que formatea items, cantidades y total
  - Modificar llamadas a `saveLog()` en el endpoint de órdenes para usar el nuevo formato
  - Asegurar que el formato sea legible para administradores
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_



- [ ]* 3.1 Escribir test de propiedad para logging completo de productos
  - **Property 1: Complete product logging**
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

- [x] 4. Modificar endpoint POST /api/orders
  - Actualizar endpoint para recibir array de items en el body
  - Serializar items a JSON y guardar en columna items
  - Mantener compatibilidad con campos existentes (total, payment_method)
  - _Requirements: 4.1, 4.2_

- [x]* 4.1 Escribir test de propiedad para persistencia de detalles de productos


  - **Property 7: Product details persistence**
  - **Validates: Requirements 4.1, 4.2**

- [ ]* 4.2 Escribir test de propiedad para round-trip de datos de orden
  - **Property 8: Product details round-trip**
  - **Validates: Requirements 4.3**

- [x] 5. Integrar notificación WhatsApp en flujo de compra
  - Agregar llamada a `sendPurchaseNotification()` después de guardar orden
  - Implementar manejo de errores con try-catch para no bloquear la orden
  - Agregar logging de éxito/error de notificación WhatsApp
  - Asegurar que la respuesta al cliente no incluye errores de WhatsApp
  - _Requirements: 2.1, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 5.1 Escribir test de propiedad para trigger automático de WhatsApp
  - **Property 2: Automatic WhatsApp notification trigger**
  - **Validates: Requirements 2.1**

- [ ]* 5.2 Escribir test de propiedad para resiliencia ante fallos de WhatsApp
  - **Property 4: Order completion resilience**
  - **Validates: Requirements 3.1, 3.3, 3.5**



- [ ]* 5.3 Escribir test de propiedad para logging de errores de WhatsApp
  - **Property 5: WhatsApp error logging**
  - **Validates: Requirements 3.2**

- [ ]* 5.4 Escribir test de propiedad para logging de éxito de WhatsApp
  - **Property 6: WhatsApp success logging**


  - **Validates: Requirements 3.4**

- [x] 6. Actualizar endpoint GET /api/orders para parsear items
  - Modificar respuesta para incluir items parseados desde JSON
  - Manejar órdenes legacy sin campo items (retornar array vacío)
  - _Requirements: 4.3, 4.4, 4.5_



- [x]* 6.1 Escribir test de propiedad para compatibilidad con órdenes legacy



  - **Property 9: Backward compatibility**
  - **Validates: Requirements 4.4, 4.5**

- [x] 7. Actualizar frontend para enviar items en POST /api/orders
  - Modificar función de checkout en `public/app.js` para incluir items del carrito
  - Asegurar que se envía información completa: id, name, qty, price, size
  - Mantener compatibilidad con flujo actual
  - _Requirements: 4.1_

- [x] 8. Actualizar vista de logs en admin panel
  - Modificar renderizado de logs para mostrar detalles de compra de forma clara
  - Asegurar que logs antiguos se muestran correctamente
  - _Requirements: 1.4_

- [ ] 9. Checkpoint - Verificar que todas las pruebas pasan
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Actualizar documentación y variables de entorno
  - Agregar WHATSAPP_PHONE y WHATSAPP_ENABLED a .env.example
  - Documentar el nuevo formato de datos en README si es necesario
  - Agregar comentarios en código sobre el formato JSON de items
