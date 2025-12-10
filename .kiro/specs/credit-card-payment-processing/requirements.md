# Requirements Document

## Introduction

El sistema ShopManStore actualmente tiene un formulario de tarjeta de crédito que no procesa realmente los datos de la tarjeta, sino que redirige a Mercado Pago. Esta funcionalidad necesita ser mejorada para permitir el procesamiento directo de tarjetas de crédito a través de la API de Mercado Pago, proporcionando una experiencia de pago más fluida y profesional para los usuarios.

## Glossary

- **Sistema_Pago**: El módulo de procesamiento de pagos de ShopManStore
- **Formulario_Tarjeta**: El formulario de captura de datos de tarjeta de crédito en el frontend
- **API_MercadoPago**: La interfaz de programación de aplicaciones de Mercado Pago para procesar pagos
- **Token_Tarjeta**: Representación segura de los datos de tarjeta generada por Mercado Pago
- **Usuario_Cliente**: Usuario registrado que realiza una compra
- **Validacion_Frontend**: Proceso de validación de datos en el navegador del usuario
- **Procesamiento_Backend**: Proceso de envío y confirmación del pago en el servidor

## Requirements

### Requirement 1

**User Story:** Como usuario cliente, quiero poder pagar con mi tarjeta de crédito directamente en el formulario, para que pueda completar mi compra sin ser redirigido a sitios externos.

#### Acceptance Criteria

1. WHEN un usuario cliente completa el formulario de tarjeta con datos válidos THEN el Sistema_Pago SHALL procesar el pago directamente usando la API_MercadoPago
2. WHEN el procesamiento es exitoso THEN el Sistema_Pago SHALL mostrar una confirmación de pago aprobado y vaciar el carrito
3. WHEN el procesamiento falla THEN el Sistema_Pago SHALL mostrar el mensaje de error específico y mantener los datos del formulario
4. WHEN se procesa un pago exitoso THEN el Sistema_Pago SHALL guardar la orden en la base de datos con el método "Tarjeta de Crédito"
5. WHEN se completa una compra con tarjeta THEN el Sistema_Pago SHALL enviar la notificación por WhatsApp con los detalles de la compra

### Requirement 2

**User Story:** Como usuario cliente, quiero que mis datos de tarjeta sean validados en tiempo real, para que pueda corregir errores antes de enviar el formulario.

#### Acceptance Criteria

1. WHEN un usuario cliente ingresa un número de tarjeta THEN el Formulario_Tarjeta SHALL validar el formato y mostrar el tipo de tarjeta detectado
2. WHEN un usuario cliente ingresa una fecha de vencimiento THEN el Formulario_Tarjeta SHALL validar que la fecha sea futura y tenga formato MM/AA
3. WHEN un usuario cliente ingresa un CVV THEN el Formulario_Tarjeta SHALL validar que tenga 3 o 4 dígitos según el tipo de tarjeta
4. WHEN un usuario cliente ingresa un DNI THEN el Formulario_Tarjeta SHALL validar que contenga solo números y tenga longitud apropiada
5. WHEN todos los campos son válidos THEN el Formulario_Tarjeta SHALL habilitar el botón de procesar pago

### Requirement 3

**User Story:** Como usuario cliente, quiero ver el progreso del procesamiento de mi pago, para que sepa que mi transacción se está procesando correctamente.

#### Acceptance Criteria

1. WHEN un usuario cliente envía el formulario de tarjeta THEN el Sistema_Pago SHALL mostrar un indicador de carga y deshabilitar el formulario
2. WHEN el pago está siendo procesado THEN el Sistema_Pago SHALL mostrar un mensaje "Procesando pago..." con un spinner
3. WHEN el procesamiento toma más de 10 segundos THEN el Sistema_Pago SHALL mostrar un mensaje adicional "Esto puede tomar unos momentos..."
4. WHEN el pago se completa THEN el Sistema_Pago SHALL ocultar el indicador de carga y mostrar el resultado
5. WHEN ocurre un error de red THEN el Sistema_Pago SHALL mostrar un mensaje de error de conexión y permitir reintentar

### Requirement 4

**User Story:** Como administrador del sistema, quiero que los pagos con tarjeta sean registrados correctamente, para que pueda hacer seguimiento de las transacciones y generar reportes.

#### Acceptance Criteria

1. WHEN se procesa un pago con tarjeta exitoso THEN el Sistema_Pago SHALL guardar la orden con el ID de transacción de Mercado Pago
2. WHEN se guarda una orden de tarjeta THEN el Sistema_Pago SHALL registrar un log con los detalles de la transacción (sin datos sensibles)
3. WHEN se completa un pago THEN el Sistema_Pago SHALL incluir el estado del pago (approved, pending, rejected) en los registros
4. WHEN se procesa un pago THEN el Sistema_Pago SHALL guardar la información del método de pago específico (Visa, Mastercard, etc.)
5. WHEN ocurre un error en el pago THEN el Sistema_Pago SHALL registrar el error en los logs para debugging

### Requirement 5

**User Story:** Como usuario cliente, quiero que el sistema maneje diferentes tipos de tarjetas, para que pueda usar mi tarjeta preferida independientemente del emisor.

#### Acceptance Criteria

1. WHEN un usuario cliente ingresa un número de tarjeta THEN el Sistema_Pago SHALL detectar automáticamente el tipo (Visa, Mastercard, American Express)
2. WHEN se detecta el tipo de tarjeta THEN el Formulario_Tarjeta SHALL mostrar el logo correspondiente y ajustar la validación del CVV
3. WHEN se procesa un pago THEN el Sistema_Pago SHALL usar el payment_method_id correcto según el tipo de tarjeta detectado
4. WHEN una tarjeta no es soportada THEN el Sistema_Pago SHALL mostrar un mensaje informativo con los tipos aceptados
5. WHEN se valida una tarjeta American Express THEN el Sistema_Pago SHALL aceptar CVV de 4 dígitos en lugar de 3

### Requirement 6

**User Story:** Como usuario cliente, quiero que mis datos de tarjeta estén seguros, para que pueda confiar en realizar pagos en la plataforma.

#### Acceptance Criteria

1. WHEN se envían datos de tarjeta THEN el Sistema_Pago SHALL usar conexiones HTTPS para todas las comunicaciones
2. WHEN se procesan datos de tarjeta THEN el Sistema_Pago SHALL nunca almacenar números de tarjeta completos en la base de datos
3. WHEN se registra una transacción THEN el Sistema_Pago SHALL almacenar solo los últimos 4 dígitos de la tarjeta para referencia
4. WHEN se envían datos a Mercado Pago THEN el Sistema_Pago SHALL usar la tokenización de tarjetas cuando esté disponible
5. WHEN ocurre un error THEN el Sistema_Pago SHALL no incluir datos sensibles de tarjeta en los logs de error