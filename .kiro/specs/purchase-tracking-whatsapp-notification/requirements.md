# Requirements Document

## Introduction

Este documento define los requisitos para mejorar el sistema de seguimiento de compras y notificaciones automáticas. El sistema actual registra logs básicos de órdenes, pero no captura información detallada sobre los productos comprados ni la cantidad. Además, aunque existe integración con WhatsApp para checkout, actualmente requiere que el cliente elija esta opción manualmente. Esta mejora automatizará las notificaciones de compra vía WhatsApp y enriquecerá los logs con información detallada de cada transacción.

## Glossary

- **Sistema**: ShopManStore, la plataforma de e-commerce
- **Log**: Registro de actividad del sistema almacenado en la tabla `logs`
- **Orden**: Registro de compra almacenado en la tabla `orders`
- **Producto**: Artículo disponible para compra en el catálogo
- **Usuario**: Persona autenticada que realiza compras
- **Administrador**: Usuario con rol `admin` que puede ver logs
- **WhatsApp API**: Servicio de mensajería para enviar notificaciones automáticas
- **Detalle de compra**: Información sobre productos, cantidades y precios en una orden

## Requirements

### Requirement 1

**User Story:** Como administrador, quiero ver en los logs qué productos y cuántas unidades compró cada cliente, para poder hacer seguimiento detallado de las ventas.

#### Acceptance Criteria

1. WHEN a user completes a purchase THEN the system SHALL create a log entry containing the complete list of purchased products
2. WHEN a log entry is created for a purchase THEN the system SHALL include the quantity of each product purchased
3. WHEN a log entry is created for a purchase THEN the system SHALL include the total number of products in the order
4. WHEN an administrator views the logs THEN the system SHALL display product names and quantities in a readable format
5. WHEN multiple products are purchased in one order THEN the system SHALL list all products with their respective quantities in the log details

### Requirement 2

**User Story:** Como cliente, quiero recibir automáticamente una confirmación por WhatsApp cuando completo mi compra, para tener un registro inmediato de mi pedido.

#### Acceptance Criteria

1. WHEN a user completes a purchase with any payment method THEN the system SHALL send a WhatsApp message automatically
2. WHEN the WhatsApp message is sent THEN the system SHALL include the order number and timestamp
3. WHEN the WhatsApp message is sent THEN the system SHALL include the complete list of purchased products with quantities
4. WHEN the WhatsApp message is sent THEN the system SHALL include the total amount paid
5. WHEN the WhatsApp message is sent THEN the system SHALL include the payment method used

### Requirement 3

**User Story:** Como administrador, quiero que el sistema maneje errores de envío de WhatsApp sin afectar el proceso de compra, para que los clientes puedan completar sus órdenes incluso si hay problemas con las notificaciones.

#### Acceptance Criteria

1. WHEN a WhatsApp notification fails to send THEN the system SHALL complete the purchase successfully
2. WHEN a WhatsApp notification fails THEN the system SHALL log the error with details
3. WHEN a WhatsApp notification fails THEN the system SHALL NOT display an error to the customer
4. WHEN a WhatsApp notification succeeds THEN the system SHALL log the successful notification
5. IF the WhatsApp service is unavailable THEN the system SHALL continue processing orders normally

### Requirement 4

**User Story:** Como desarrollador, quiero que el sistema almacene los detalles de productos en las órdenes, para poder generar reportes y análisis de ventas.

#### Acceptance Criteria

1. WHEN an order is created THEN the system SHALL store the product details in JSON format
2. WHEN product details are stored THEN the system SHALL include product ID, name, quantity, and price for each item
3. WHEN an order is retrieved THEN the system SHALL parse the stored product details correctly
4. WHEN the database schema is updated THEN the system SHALL maintain backward compatibility with existing orders
5. WHEN migrating existing orders THEN the system SHALL handle orders without product details gracefully
