# Integración de Mercado Pago - API de Payments

## Cambios Realizados

Se ha actualizado la integración de Mercado Pago para usar la **API de Payments** (`/v1/payments`) en lugar de Preferences.

## Endpoints Disponibles

### 1. `/api/mp-payment` (Nuevo - Recomendado)
Crea un pago directo usando la API de Payments de Mercado Pago.

**Método:** POST  
**Autenticación:** Requerida (JWT)

**Body:**
```json
{
  "items": [
    {
      "name": "Producto 1",
      "price": 1500,
      "qty": 2
    }
  ],
  "total": 3000,
  "paymentData": {
    "token": "card_token_from_mp_js",
    "payment_method_id": "visa",
    "email": "cliente@email.com",
    "identification_type": "DNI",
    "identification_number": "12345678",
    "installments": 1,
    "issuer_id": "123"
  }
}
```

**Respuesta exitosa:**
```json
{
  "status": "approved",
  "status_detail": "accredited",
  "id": 123456789,
  "payment_id": 123456789
}
```

### 2. `/api/mp-link` (Actualizado)
Genera un link de pago usando la API de Payments.

**Método:** POST  
**Autenticación:** Requerida (JWT)

**Body:**
```json
{
  "items": [
    {
      "name": "Producto 1",
      "price": 1500,
      "qty": 2
    }
  ],
  "total": 3000
}
```

**Respuesta exitosa:**
```json
{
  "link": "https://www.mercadopago.com/...",
  "payment_id": 123456789,
  "status": "pending"
}
```

## Configuración

### Variable de Entorno

```bash
MP_TOKEN=APP_USR-tu-access-token-aqui
```

### Obtener Access Token

1. Ingresa a tu cuenta de Mercado Pago
2. Ve a **Tus integraciones** → **Credenciales**
3. Copia el **Access Token** de producción o prueba
4. Configúralo en la variable de entorno `MP_TOKEN`

## Implementación en el Frontend

Para usar el nuevo endpoint de payments, necesitarás:

### 1. Incluir Mercado Pago JS SDK

```html
<script src="https://sdk.mercadopago.com/js/v2"></script>
```

### 2. Inicializar MP

```javascript
const mp = new MercadoPago('YOUR_PUBLIC_KEY');
```

### 3. Crear Token de Tarjeta

```javascript
const cardForm = mp.cardForm({
  amount: "100.5",
  iframe: true,
  form: {
    id: "form-checkout",
    cardNumber: {
      id: "form-checkout__cardNumber",
      placeholder: "Número de tarjeta",
    },
    expirationDate: {
      id: "form-checkout__expirationDate",
      placeholder: "MM/YY",
    },
    securityCode: {
      id: "form-checkout__securityCode",
      placeholder: "CVV",
    },
    cardholderName: {
      id: "form-checkout__cardholderName",
      placeholder: "Titular de la tarjeta",
    },
    issuer: {
      id: "form-checkout__issuer",
      placeholder: "Banco emisor",
    },
    installments: {
      id: "form-checkout__installments",
      placeholder: "Cuotas",
    },
    identificationType: {
      id: "form-checkout__identificationType",
      placeholder: "Tipo de documento",
    },
    identificationNumber: {
      id: "form-checkout__identificationNumber",
      placeholder: "Número de documento",
    },
    cardholderEmail: {
      id: "form-checkout__cardholderEmail",
      placeholder: "E-mail",
    },
  },
  callbacks: {
    onFormMounted: error => {
      if (error) return console.warn("Form Mounted handling error: ", error);
      console.log("Form mounted");
    },
    onSubmit: event => {
      event.preventDefault();

      const {
        paymentMethodId: payment_method_id,
        issuerId: issuer_id,
        cardholderEmail: email,
        amount,
        token,
        installments,
        identificationNumber,
        identificationType,
      } = cardForm.getCardFormData();

      // Enviar al backend
      fetch("/api/mp-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          items: cart,
          total: amount,
          paymentData: {
            token,
            payment_method_id,
            email,
            identification_type: identificationType,
            identification_number: identificationNumber,
            installments: Number(installments),
            issuer_id: Number(issuer_id)
          }
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'approved') {
          alert('¡Pago aprobado!');
        } else {
          alert('Pago rechazado: ' + data.status_detail);
        }
      })
      .catch(error => {
        alert('Error al procesar el pago');
      });
    },
  },
});
```

## Estados de Pago

| Estado | Descripción |
|--------|-------------|
| `approved` | Pago aprobado |
| `pending` | Pago pendiente |
| `in_process` | Pago en proceso |
| `rejected` | Pago rechazado |
| `cancelled` | Pago cancelado |
| `refunded` | Pago reembolsado |

## Testing

### Tarjetas de Prueba

Para probar en modo sandbox, usa estas tarjetas:

**Visa (Aprobada):**
- Número: 4509 9535 6623 3704
- CVV: 123
- Fecha: 11/25

**Mastercard (Rechazada):**
- Número: 5031 7557 3453 0604
- CVV: 123
- Fecha: 11/25

## Notas Importantes

1. **Seguridad**: Nunca expongas tu Access Token en el frontend
2. **Public Key**: Necesitarás la Public Key de MP para el frontend
3. **Webhooks**: Considera implementar webhooks para notificaciones de pago
4. **Logs**: Los errores se registran en la consola del servidor

## Recursos

- [Documentación oficial de Mercado Pago](https://www.mercadopago.com.ar/developers)
- [API Reference - Payments](https://www.mercadopago.com.ar/developers/es/reference/payments/_payments/post)
- [SDK JS](https://www.mercadopago.com.ar/developers/es/docs/checkout-api/integration-configuration/card/integrate-via-cardform)
