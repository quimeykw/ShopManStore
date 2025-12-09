# Requirements Document

## Introduction

Este documento define los requisitos para mejorar el sistema de logs de ventas de ShopManStore. Actualmente, el sistema registra compras en una tabla de logs genérica con información limitada. El objetivo es crear un sistema de registro de ventas más detallado que permita al administrador ver claramente quién compró, qué compró, cómo pagó, y cuándo, facilitando el seguimiento y análisis de ventas.

## Glossary

- **Sistema**: ShopManStore, la plataforma de e-commerce
- **Usuario**: Persona que realiza compras en la plataforma
- **Administrador**: Usuario con rol 'admin' que gestiona la tienda
- **Log de Venta**: Registro detallado de una transacción de compra
- **Método de Pago**: Forma en que el usuario paga (tarjeta, Mercado Pago, WhatsApp)
- **Orden**: Transacción de compra que incluye productos, total y método de pago
- **Panel de Logs**: Interfaz en el panel de administración para visualizar logs

## Requirements

### Requirement 1

**User Story:** Como administrador, quiero ver información detallada de cada venta en el panel de logs, para poder hacer seguimiento de las transacciones y analizar el comportamiento de compra.

#### Acceptance Criteria

1. WHEN el Sistema registra una compra THEN el Sistema SHALL almacenar el ID del usuario, nombre de usuario, email, timestamp, método de pago, total, y lista de productos con cantidades
2. WHEN un Administrador accede al panel de logs THEN el Sistema SHALL mostrar los logs de ventas con toda la información relevante en formato legible
3. WHEN se muestra un log de venta THEN el Sistema SHALL incluir el nombre completo de cada producto, talle seleccionado (si aplica), cantidad, y precio unitario
4. WHEN se muestra un log de venta THEN el Sistema SHALL mostrar el método de pago utilizado (Tarjeta, Mercado Pago Link, Mercado Pago Tarjeta, o WhatsApp)
5. WHEN se muestra un log de venta THEN el Sistema SHALL mostrar el total de la compra en formato de moneda

### Requirement 2

**User Story:** Como administrador, quiero poder filtrar y buscar logs de ventas por diferentes criterios, para encontrar rápidamente transacciones específicas.

#### Acceptance Criteria

1. WHEN un Administrador busca en el panel de logs THEN el Sistema SHALL permitir filtrar por nombre de usuario
2. WHEN un Administrador busca en el panel de logs THEN el Sistema SHALL permitir filtrar por método de pago
3. WHEN un Administrador busca en el panel de logs THEN el Sistema SHALL permitir filtrar por rango de fechas
4. WHEN un Administrador aplica filtros THEN el Sistema SHALL mostrar solo los logs que coincidan con todos los criterios seleccionados
5. WHEN un Administrador limpia los filtros THEN el Sistema SHALL mostrar todos los logs de ventas nuevamente

### Requirement 3

**User Story:** Como administrador, quiero ver estadísticas resumidas de ventas, para entender el rendimiento del negocio de un vistazo.

#### Acceptance Criteria

1. WHEN un Administrador accede al panel de logs THEN el Sistema SHALL mostrar el total de ventas del día actual
2. WHEN un Administrador accede al panel de logs THEN el Sistema SHALL mostrar el total de ventas de la semana actual
3. WHEN un Administrador accede al panel de logs THEN el Sistema SHALL mostrar el total de ventas del mes actual
4. WHEN un Administrador accede al panel de logs THEN el Sistema SHALL mostrar el número total de transacciones por período
5. WHEN un Administrador accede al panel de logs THEN el Sistema SHALL mostrar un desglose de ventas por método de pago

### Requirement 4

**User Story:** Como administrador, quiero poder exportar los logs de ventas, para realizar análisis externos o mantener registros contables.

#### Acceptance Criteria

1. WHEN un Administrador solicita exportar logs THEN el Sistema SHALL generar un archivo CSV con todos los datos de ventas
2. WHEN se genera el archivo CSV THEN el Sistema SHALL incluir columnas para: fecha, hora, usuario, email, productos, cantidades, método de pago, y total
3. WHEN se genera el archivo CSV THEN el Sistema SHALL usar formato compatible con Excel y Google Sheets
4. WHEN un Administrador aplica filtros y exporta THEN el Sistema SHALL exportar solo los logs filtrados
5. WHEN se descarga el archivo THEN el Sistema SHALL nombrar el archivo con la fecha de exportación

### Requirement 5

**User Story:** Como administrador, quiero que los logs de ventas sean persistentes y confiables, para no perder información crítica del negocio.

#### Acceptance Criteria

1. WHEN se completa una compra exitosamente THEN el Sistema SHALL registrar el log de venta antes de responder al usuario
2. WHEN ocurre un error al guardar un log THEN el Sistema SHALL reintentar el guardado automáticamente
3. WHEN falla el guardado de log después de reintentos THEN el Sistema SHALL registrar el error en un log de sistema separado
4. WHEN se registra una venta THEN el Sistema SHALL mantener consistencia entre la tabla orders y los logs de ventas
5. WHEN se consultan logs antiguos THEN el Sistema SHALL mantener acceso a todos los registros históricos sin límite de tiempo

### Requirement 6

**User Story:** Como administrador, quiero ver información de contacto del comprador en cada log de venta, para poder hacer seguimiento de pedidos o resolver problemas.

#### Acceptance Criteria

1. WHEN se muestra un log de venta THEN el Sistema SHALL incluir el email del Usuario que realizó la compra
2. WHEN se muestra un log de venta THEN el Sistema SHALL incluir el nombre de usuario del comprador
3. WHEN un Usuario no tiene email registrado THEN el Sistema SHALL mostrar "Sin email" en el log
4. WHEN un Administrador hace clic en el email THEN el Sistema SHALL permitir copiar el email al portapapeles
5. WHEN se muestra información de contacto THEN el Sistema SHALL proteger datos sensibles de usuarios no autorizados
