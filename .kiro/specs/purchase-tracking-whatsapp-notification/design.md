# Design Document

## Overview

Este diseño extiende el sistema actual de órdenes y logs de ShopManStore para capturar información detallada de compras y enviar notificaciones automáticas por WhatsApp. La solución se integra con la arquitectura existente sin modificar el flujo de compra actual, agregando funcionalidad de tracking y notificación como capas adicionales.

El sistema utilizará la API de WhatsApp Business (wa.me) para enviar mensajes automáticos y modificará el esquema de la base de datos para almacenar detalles de productos en cada orden. Los logs se enriquecerán con información estructurada sobre productos y cantidades.

## Architecture

### High-Level Architecture

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │ Completa compra
       ▼
┌─────────────────────────────────┐
│   POST /api/orders              │
│   (Express Route Handler)       │
└──────┬──────────────────────────┘
       │
       ├──────────────────────────┐
       │                          │
       ▼                          ▼
┌─────────────────┐      ┌──────────────────┐
│  Guardar Orden  │      │  Crear Log       │
│  con Detalles   │      │  Detallado       │
└──────┬──────────┘      └──────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Enviar Notificación WhatsApp   │
│  (Asíncrono, no bloqueante)     │
└─────────────────────────────────┘
```

### Component Interaction

1. **Order Creation Flow**: El endpoint `/api/orders` recibe la orden con items del carrito
2. **Data Persistence**: Se guarda la orden con detalles de productos en formato JSON
3. **Logging**: Se crea un log con información legible de productos y cantidades
4. **Notification**: Se envía mensaje de WhatsApp de forma asíncrona (no bloquea la respuesta)

## Components and Interfaces

### 1. Database Schema Extension

#### Orders Table Migration

```sql
-- Agregar columna para detalles de productos
ALTER TABLE orders ADD COLUMN items TEXT;
-- items: JSON string con array de {product_id, name, quantity, price, size}
```

**Estructura del campo `items`:**
```json
[
  {
    "product_id": 1,
    "name": "Remera Negra",
    "quantity": 2,
    "price": 5000,
    "size": "M"
  },
  {
    "product_id": 3,
    "name": "Jean Azul",
    "quantity": 1,
    "price": 12000,
    "size": "L"
  }
]
```

### 2. WhatsApp Notification Service

**Module**: `whatsapp-service.js`

```javascript
/**
 * Envía notificación de compra por WhatsApp
 * @param {Object} orderData - Datos de la orden
 * @param {string} orderData.orderId - ID de la orden
 * @param {Array} orderData.items - Items comprados
 * @param {number} orderData.total - Total de la compra
 * @param {string} orderData.paymentMethod - Método de pago
 * @param {string} orderData.username - Nombre del usuario
 * @returns {Promise<boolean>} - true si se envió exitosamente
 */
async function sendPurchaseNotification(orderData)

/**
 * Formatea el mensaje de compra para WhatsApp
 * @param {Object} orderData - Datos de la orden
 * @returns {string} - Mensaje formateado
 */
function formatPurchaseMessage(orderData)
```

### 3. Enhanced Logging Service

**Extension**: Modificar función `saveLog` en `server.js`

```javascript
/**
 * Guarda log con formato estructurado para compras
 * @param {number} userId - ID del usuario
 * @param {string} action - Acción realizada
 * @param {Object} details - Detalles estructurados o string
 */
function saveLog(userId, action, details)

/**
 * Formatea detalles de compra para logs
 * @param {Array} items - Items comprados
 * @param {number} total - Total de la compra
 * @param {string} paymentMethod - Método de pago
 * @returns {string} - String formateado para log
 */
function formatPurchaseLog(items, total, paymentMethod)
```

### 4. Modified Order Endpoint

**Endpoint**: `POST /api/orders`

**Request Body**:
```json
{
  "items": [
    {
      "id": 1,
      "name": "Remera Negra",
      "qty": 2,
      "price": 5000,
      "size": "M"
    }
  ],
  "total": 10000,
  "paymentMethod": "Mercado Pago"
}
```

**Response**:
```json
{
  "message": "Orden creada",
  "orderId": 123,
  "whatsappSent": true
}
```

## Data Models

### Order Model (Extended)

```javascript
{
  id: INTEGER,
  user_id: INTEGER,
  total: REAL,
  payment_method: TEXT,
  items: TEXT, // JSON string
  created_at: TIMESTAMP
}
```

### Log Entry Model (Enhanced)

```javascript
{
  id: INTEGER,
  user_id: INTEGER,
  action: TEXT, // "Compra realizada"
  details: TEXT, // "Productos: Remera Negra x2, Jean Azul x1 | Total productos: 3 | Método: Mercado Pago | Total: $17000"
  created_at: TIMESTAMP
}
```

### WhatsApp Message Format

```
🛍️ *COMPRA CONFIRMADA*

📦 *Orden #123*
👤 Cliente: juan_perez
📅 Fecha: 26/11/2025 14:30

*Productos:*
• Remera Negra (M) x2 - $10,000
• Jean Azul (L) x1 - $12,000

💰 *Total: $22,000*
💳 Método: Mercado Pago

¡Gracias por tu compra! 🎉
```

## Correc
tness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, several properties can be consolidated:
- Properties 1.1, 1.2, and 1.5 all test that logs contain complete product information - these can be combined
- Properties 3.1 and 3.5 both test that WhatsApp failures don't block orders - redundant
- Properties 4.4 and 4.5 both test backward compatibility - can be combined

### Core Properties

**Property 1: Complete product logging**
*For any* purchase order with one or more products, the created log entry should contain all product names, their quantities, and the total product count in a human-readable format.
**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

**Property 2: Automatic WhatsApp notification trigger**
*For any* completed purchase regardless of payment method, the system should attempt to send a WhatsApp notification.
**Validates: Requirements 2.1**

**Property 3: Complete WhatsApp message content**
*For any* WhatsApp notification sent, the message should include order number, timestamp, all products with quantities, total amount, and payment method.
**Validates: Requirements 2.2, 2.3, 2.4, 2.5**

**Property 4: Order completion resilience**
*For any* purchase order, if the WhatsApp notification fails to send, the order should still complete successfully and return a success response without WhatsApp error details.
**Validates: Requirements 3.1, 3.3, 3.5**

**Property 5: WhatsApp error logging**
*For any* failed WhatsApp notification attempt, the system should create a log entry with error details.
**Validates: Requirements 3.2**

**Property 6: WhatsApp success logging**
*For any* successful WhatsApp notification, the system should create a log entry confirming the notification was sent.
**Validates: Requirements 3.4**

**Property 7: Product details persistence**
*For any* order created, the system should store product details (ID, name, quantity, price) in valid JSON format in the items field.
**Validates: Requirements 4.1, 4.2**

**Property 8: Product details round-trip**
*For any* order with stored product details, retrieving and parsing the order should return the same product information that was stored.
**Validates: Requirements 4.3**

**Property 9: Backward compatibility**
*For any* order without product details (legacy orders), the system should handle retrieval and display operations without errors.
**Validates: Requirements 4.4, 4.5**

## Error Handling

### WhatsApp Service Errors

1. **Network Failures**: Catch and log network errors, continue order processing
2. **Invalid Phone Number**: Log error, continue order processing
3. **Rate Limiting**: Implement exponential backoff, log if message queued
4. **Service Unavailable**: Graceful degradation, log error

**Error Handling Strategy**:
```javascript
try {
  await sendWhatsAppNotification(orderData);
  saveLog(userId, 'WhatsApp enviado', `Orden #${orderId}`);
} catch (error) {
  // No bloquear la orden
  saveLog(userId, 'Error WhatsApp', error.message);
  console.error('WhatsApp notification failed:', error);
}
```

### Database Errors

1. **JSON Parse Errors**: Return empty array if items field is invalid
2. **Missing items Field**: Treat as empty order (backward compatibility)
3. **Schema Migration Errors**: Log and continue with existing schema

### Validation Errors

1. **Empty Items Array**: Reject order creation with 400 error
2. **Invalid Item Structure**: Validate required fields before saving
3. **Missing Required Fields**: Return descriptive error messages

## Testing Strategy

### Unit Testing

**Framework**: Jest (already configured in project)

**Test Files**:
- `whatsapp-service.test.js` - WhatsApp notification formatting and sending
- `order-logging.test.js` - Log formatting and creation
- `order-persistence.test.js` - Database operations for orders with items

**Key Unit Tests**:
1. Message formatting produces correct WhatsApp format
2. Log formatting includes all required information
3. JSON serialization/deserialization of order items
4. Error handling doesn't throw exceptions
5. Backward compatibility with orders without items field

### Property-Based Testing

**Framework**: fast-check (JavaScript PBT library)

**Installation**: `npm install --save-dev fast-check`

**Configuration**: Each property test should run minimum 100 iterations

**Test Tagging Format**: Each PBT test must include a comment:
```javascript
// Feature: purchase-tracking-whatsapp-notification, Property 1: Complete product logging
```

**Property Tests**:

1. **Property 1 Test**: Generate random orders with 1-10 products, verify log contains all product names and quantities
2. **Property 2 Test**: Generate orders with different payment methods, verify WhatsApp send is called
3. **Property 3 Test**: Generate random order data, verify formatted message contains all required fields
4. **Property 4 Test**: Simulate WhatsApp failures, verify order still completes with success response
5. **Property 5 Test**: Simulate WhatsApp failures, verify error log is created
6. **Property 6 Test**: Simulate WhatsApp success, verify success log is created
7. **Property 7 Test**: Generate random orders, verify items field contains valid JSON with required fields
8. **Property 8 Test**: Generate random order items, store and retrieve, verify data matches (round-trip)
9. **Property 9 Test**: Retrieve orders without items field, verify no errors occur

### Integration Testing

**Test Scenarios**:
1. Complete purchase flow from cart to WhatsApp notification
2. Admin viewing logs with purchase details
3. Database migration with existing orders
4. WhatsApp service unavailable scenario

### Manual Testing Checklist

1. Complete a purchase and verify WhatsApp message received
2. Check admin logs show product details
3. Test with multiple products in cart
4. Test with different payment methods
5. Verify old orders still display correctly

## Implementation Notes

### WhatsApp API Integration

**API Used**: WhatsApp Business API via wa.me links

**Current Implementation**: The app already uses `https://wa.me/5491122549995` for manual checkout

**Automated Sending**: 
- For true automation, we'll use the same wa.me URL format but trigger it server-side
- Alternative: Use WhatsApp Business API (requires business account and webhook setup)
- **Recommended for MVP**: Use a WhatsApp automation service like:
  - Twilio WhatsApp API
  - WhatsApp Business API (official)
  - Or simply log the message and provide admin interface to send

**Implementation Decision**: For this design, we'll create the notification service that formats messages and provides a hook for actual sending. The initial implementation can log messages, and later integrate with a proper WhatsApp API.

### Database Migration Strategy

1. Add `items` column to orders table (nullable for backward compatibility)
2. Existing orders will have NULL in items field
3. New orders will populate items field
4. Display logic handles both cases

**Migration SQL**:
```sql
-- SQLite
ALTER TABLE orders ADD COLUMN items TEXT;

-- PostgreSQL
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items TEXT;
```

### Performance Considerations

1. **Async WhatsApp Sending**: Don't block order response waiting for WhatsApp
2. **JSON Storage**: Items stored as TEXT/JSON is efficient for SQLite and PostgreSQL
3. **Log Formatting**: Pre-format log strings to avoid parsing overhead when viewing
4. **Indexing**: No additional indexes needed for this feature

### Security Considerations

1. **WhatsApp Phone Number**: Store in environment variable, not hardcoded
2. **Message Content**: Sanitize user input to prevent injection
3. **Rate Limiting**: Prevent abuse of notification system
4. **PII Protection**: Logs contain purchase info - ensure proper access control (already implemented with admin-only access)

## Deployment Considerations

### Environment Variables

```bash
WHATSAPP_PHONE=5491122549995  # Target phone for notifications
WHATSAPP_ENABLED=true          # Feature flag to enable/disable
```

### Database Migration

Run migration script before deploying new code:
```bash
node migrate-add-items-column.js
```

### Rollback Plan

If issues occur:
1. Feature can be disabled via WHATSAPP_ENABLED flag
2. Orders will still work without items field (backward compatible)
3. Logs will continue working with existing format

### Monitoring

1. Log WhatsApp send success/failure rates
2. Monitor order creation latency
3. Track log storage growth
4. Alert on WhatsApp service errors

## Future Enhancements

1. **Rich WhatsApp Messages**: Add images, buttons, or interactive elements
2. **Customer Phone Numbers**: Send to customer's phone instead of store phone
3. **Order Status Updates**: Send notifications for order status changes
4. **Analytics Dashboard**: Visualize purchase patterns from enhanced logs
5. **Export Functionality**: Export detailed purchase reports
6. **Retry Mechanism**: Queue failed WhatsApp messages for retry
