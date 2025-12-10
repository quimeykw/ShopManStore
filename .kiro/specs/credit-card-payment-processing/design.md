# Design Document - Credit Card Payment Processing

## Overview

This design document outlines the enhancement of the ShopManStore credit card payment processing system. The current implementation redirects users to Mercado Pago instead of processing card data directly, which creates a suboptimal user experience. This enhancement will implement direct credit card processing through Mercado Pago's API while maintaining security best practices and providing real-time validation and feedback.

The solution will integrate seamlessly with the existing Express.js backend and vanilla JavaScript frontend, maintaining the current architecture while significantly improving the payment flow.

## Architecture

### High-Level Architecture

```
Frontend (Vanilla JS)          Backend (Express.js)           External Services
┌─────────────────────┐       ┌──────────────────────┐       ┌─────────────────┐
│  Card Form          │────── │  Payment Controller  │────── │  Mercado Pago   │
│  - Validation       │       │  - Data Processing   │       │  API            │
│  - UI Feedback      │       │  - Security Layer    │       │                 │
│  - Progress Tracking│       │  - Error Handling    │       │                 │
└─────────────────────┘       └──────────────────────┘       └─────────────────┘
         │                             │                             │
         │                             │                             │
         └─────────────────────────────┼─────────────────────────────┘
                                       │
                                ┌──────────────────────┐
                                │  Database (SQLite)   │
                                │  - Orders            │
                                │  - Logs              │
                                │  - User Data         │
                                └──────────────────────┘
```

### Component Interaction Flow

1. **User Input**: User fills credit card form with real-time validation
2. **Frontend Validation**: Comprehensive client-side validation before submission
3. **Secure Transmission**: HTTPS POST to backend with card data
4. **Backend Processing**: Server validates and processes payment via Mercado Pago API
5. **Response Handling**: Success/failure feedback with appropriate UI updates
6. **Data Persistence**: Order and transaction logging in database
7. **Notification**: WhatsApp notification for successful purchases

## Components and Interfaces

### Frontend Components

#### CardFormValidator
```javascript
class CardFormValidator {
  validateCardNumber(number): { isValid: boolean, type: string, errors: string[] }
  validateExpiry(expiry): { isValid: boolean, errors: string[] }
  validateCVV(cvv, cardType): { isValid: boolean, errors: string[] }
  validateDNI(dni): { isValid: boolean, errors: string[] }
  validateForm(): { isValid: boolean, errors: object }
}
```

#### CardTypeDetector
```javascript
class CardTypeDetector {
  detectCardType(number): string // 'visa', 'mastercard', 'amex', 'unknown'
  getCardConfig(type): { cvvLength: number, logo: string, paymentMethodId: string }
}
```

#### PaymentProcessor
```javascript
class PaymentProcessor {
  processPayment(cardData, orderData): Promise<PaymentResult>
  showProgress(): void
  hideProgress(): void
  handleSuccess(result): void
  handleError(error): void
}
```

### Backend Components

#### PaymentController
```javascript
class PaymentController {
  async processCardPayment(req, res): Promise<void>
  validatePaymentData(data): ValidationResult
  createMercadoPagoPayment(paymentData): Promise<MPResult>
  saveOrder(orderData): Promise<Order>
  logTransaction(transactionData): void
}
```

#### SecurityManager
```javascript
class SecurityManager {
  sanitizeCardData(cardData): SanitizedData
  maskCardNumber(number): string
  validateSecureConnection(req): boolean
  logSecurely(data): void
}
```

### API Interfaces

#### Payment Request Interface
```javascript
interface PaymentRequest {
  cardData: {
    number: string,
    name: string,
    expiry: string,
    cvv: string,
    dni: string
  },
  orderData: {
    items: CartItem[],
    total: number,
    userId: number
  }
}
```

#### Payment Response Interface
```javascript
interface PaymentResponse {
  success: boolean,
  transactionId?: string,
  orderId?: number,
  status: 'approved' | 'pending' | 'rejected',
  message: string,
  error?: string
}
```

## Data Models

### Enhanced Order Model
```sql
-- Existing orders table with additional fields
ALTER TABLE orders ADD COLUMN transaction_id TEXT;
ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN card_last_four TEXT;
ALTER TABLE orders ADD COLUMN card_type TEXT;
```

### Transaction Log Model
```sql
CREATE TABLE IF NOT EXISTS payment_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  order_id INTEGER,
  transaction_id TEXT,
  payment_method TEXT,
  card_type TEXT,
  card_last_four TEXT,
  amount REAL,
  status TEXT,
  mp_response TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

### Card Validation Rules
```javascript
const CARD_PATTERNS = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$/,
  amex: /^3[47][0-9]{13}$/
};

const CVV_RULES = {
  visa: 3,
  mastercard: 3,
  amex: 4
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing all properties identified in the prework, I've identified several areas for consolidation:

- Properties 2.1 and 5.1 both test card type detection - these can be combined
- Properties 1.4 and 4.1 both test order saving - these can be combined  
- Properties 4.2 and 4.5 both test logging - these can be combined into comprehensive logging property
- Properties 6.2 and 6.3 both test data storage security - these can be combined

The following properties represent the unique validation requirements after removing redundancy:

**Property 1: Payment processing completeness**
*For any* valid card data and order data, when processing a payment, the system should either return a successful result with transaction ID or a specific error message, and never leave the payment in an undefined state
**Validates: Requirements 1.1, 1.2, 1.3**

**Property 2: Cart state consistency**
*For any* successful payment processing, the shopping cart should be emptied and the user should see a confirmation message
**Validates: Requirements 1.2**

**Property 3: Order persistence completeness**
*For any* successful payment, an order record should be created in the database containing the transaction ID, payment method "Tarjeta de Crédito", and all order details
**Validates: Requirements 1.4, 4.1**

**Property 4: Notification delivery consistency**
*For any* completed purchase, a WhatsApp notification should be sent with the correct order details and payment method
**Validates: Requirements 1.5**

**Property 5: Card validation accuracy**
*For any* card number input, the system should correctly detect the card type (Visa, Mastercard, Amex) and apply the appropriate validation rules
**Validates: Requirements 2.1, 5.1**

**Property 6: Form validation completeness**
*For any* combination of form inputs, the validation should correctly identify all errors and only enable the submit button when all fields are valid
**Validates: Requirements 2.2, 2.3, 2.4, 2.5**

**Property 7: UI state management consistency**
*For any* payment processing attempt, the UI should show loading indicators during processing and hide them when complete, regardless of success or failure
**Validates: Requirements 3.1, 3.2, 3.4**

**Property 8: Error handling completeness**
*For any* payment processing error, the system should display a user-friendly error message and allow the user to retry without losing form data
**Validates: Requirements 1.3, 3.5**

**Property 9: Transaction logging completeness**
*For any* payment attempt (successful or failed), the system should create appropriate log entries without exposing sensitive card data
**Validates: Requirements 4.2, 4.5, 6.5**

**Property 10: Payment method mapping accuracy**
*For any* detected card type, the system should use the correct Mercado Pago payment_method_id when processing the payment
**Validates: Requirements 5.3**

**Property 11: Card type UI consistency**
*For any* detected card type, the system should display the appropriate logo and adjust CVV validation rules accordingly
**Validates: Requirements 5.2**

**Property 12: Data security compliance**
*For any* payment processing, the system should never store complete card numbers in the database and should only store the last 4 digits for reference
**Validates: Requirements 6.2, 6.3**

## Error Handling

### Frontend Error Handling

1. **Validation Errors**: Real-time field validation with specific error messages
2. **Network Errors**: Retry mechanism with exponential backoff
3. **Timeout Handling**: 30-second timeout with user notification
4. **Server Errors**: User-friendly error messages with technical details logged

### Backend Error Handling

1. **Mercado Pago API Errors**: Specific error mapping and user-friendly messages
2. **Database Errors**: Transaction rollback and error logging
3. **Validation Errors**: Detailed field-level error responses
4. **Security Errors**: Secure logging without exposing sensitive data

### Error Response Format
```javascript
{
  success: false,
  error: "user_friendly_message",
  code: "ERROR_CODE",
  details: {
    field: "specific_field_error"
  }
}
```

## Testing Strategy

### Dual Testing Approach

The system will use both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, and error conditions
- **Property tests** verify universal properties that should hold across all inputs
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

### Unit Testing Requirements

Unit tests will cover:
- Specific card number validation examples (known valid/invalid numbers)
- Integration points between frontend and backend
- Error handling for specific Mercado Pago error codes
- Database transaction scenarios

### Property-Based Testing Requirements

Property-based testing will use **fast-check** library for JavaScript. Each property-based test will:
- Run a minimum of 100 iterations to ensure thorough coverage
- Be tagged with comments referencing the design document property
- Use the format: `**Feature: credit-card-payment-processing, Property {number}: {property_text}**`

Each correctness property will be implemented by a single property-based test that generates random valid inputs and verifies the expected behavior holds across all test cases.

The property-based tests will generate:
- Random valid card numbers for different card types
- Random valid and invalid form data combinations
- Random order data with various item configurations
- Random error scenarios to test error handling paths

This approach ensures that the payment processing system works correctly not just for specific test cases, but for the entire space of possible inputs that users might provide.