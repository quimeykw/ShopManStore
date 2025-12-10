# Implementation Plan

- [ ] 1. Set up enhanced database schema and payment infrastructure
  - Create payment_logs table for transaction tracking
  - Add new columns to orders table (transaction_id, payment_status, card_last_four, card_type)
  - Update database initialization script to include new schema
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 1.1 Write property test for database schema integrity
  - **Property 3: Order persistence completeness**
  - **Validates: Requirements 1.4, 4.1**

- [ ] 2. Implement frontend card validation and type detection system
  - Create CardTypeDetector class with pattern matching for Visa, Mastercard, Amex
  - Implement CardFormValidator class with real-time validation
  - Add card type logos and visual feedback to the form
  - Implement CVV validation rules specific to each card type
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.5_

- [ ] 2.1 Write property test for card type detection
  - **Property 5: Card validation accuracy**
  - **Validates: Requirements 2.1, 5.1**

- [ ] 2.2 Write property test for form validation completeness
  - **Property 6: Form validation completeness**
  - **Validates: Requirements 2.2, 2.3, 2.4, 2.5**

- [ ] 2.3 Write property test for card type UI consistency
  - **Property 11: Card type UI consistency**
  - **Validates: Requirements 5.2**

- [ ] 3. Create payment processing frontend components
  - Implement PaymentProcessor class with progress indicators
  - Add loading states and timeout handling (10+ second notifications)
  - Create error handling with retry mechanisms
  - Implement form state management (disable/enable, preserve data on errors)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3.1 Write property test for UI state management
  - **Property 7: UI state management consistency**
  - **Validates: Requirements 3.1, 3.2, 3.4**

- [ ] 3.2 Write property test for error handling completeness
  - **Property 8: Error handling completeness**
  - **Validates: Requirements 1.3, 3.5**

- [ ] 4. Implement backend payment processing controller
  - Create enhanced /api/mp-payment endpoint for direct card processing
  - Implement SecurityManager for data sanitization and secure logging
  - Add comprehensive validation for payment data
  - Integrate with Mercado Pago Payment API using card data
  - _Requirements: 1.1, 6.2, 6.3, 6.5_

- [ ] 4.1 Write property test for payment processing completeness
  - **Property 1: Payment processing completeness**
  - **Validates: Requirements 1.1, 1.2, 1.3**

- [ ] 4.2 Write property test for data security compliance
  - **Property 12: Data security compliance**
  - **Validates: Requirements 6.2, 6.3**

- [ ] 5. Implement payment method mapping and transaction handling
  - Create mapping from card types to Mercado Pago payment_method_id
  - Implement transaction logging with secure data handling
  - Add payment status tracking and order updates
  - Create comprehensive error mapping for Mercado Pago responses
  - _Requirements: 4.3, 4.4, 5.3, 5.4_

- [ ] 5.1 Write property test for payment method mapping
  - **Property 10: Payment method mapping accuracy**
  - **Validates: Requirements 5.3**

- [ ] 5.2 Write property test for transaction logging
  - **Property 9: Transaction logging completeness**
  - **Validates: Requirements 4.2, 4.5, 6.5**

- [ ] 6. Integrate success handling and notifications
  - Update cart clearing logic for successful payments
  - Implement success confirmation UI with transaction details
  - Integrate WhatsApp notification system for card payments
  - Add order confirmation with masked card information
  - _Requirements: 1.2, 1.4, 1.5_

- [ ] 6.1 Write property test for cart state consistency
  - **Property 2: Cart state consistency**
  - **Validates: Requirements 1.2**

- [ ] 6.2 Write property test for notification delivery
  - **Property 4: Notification delivery consistency**
  - **Validates: Requirements 1.5**

- [ ] 7. Update frontend payment flow integration
  - Modify processCardPayment() function to use new direct processing
  - Remove Mercado Pago redirect logic from card payment flow
  - Integrate new validation and processing components
  - Update payment modal UI with enhanced feedback
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Add comprehensive error handling and edge cases
  - Implement network timeout handling with user feedback
  - Add support for unsupported card types with informative messages
  - Create fallback mechanisms for API failures
  - Add rate limiting and security measures
  - _Requirements: 3.3, 3.5, 5.4_

- [ ] 9.1 Write unit tests for specific error scenarios
  - Test specific Mercado Pago error codes and responses
  - Test network timeout scenarios
  - Test unsupported card type handling
  - _Requirements: 3.5, 5.4_

- [ ] 10. Final integration and testing
  - Test complete payment flow end-to-end
  - Verify all logging and notification systems work correctly
  - Validate security measures and data handling
  - Test with different card types and scenarios
  - _Requirements: All requirements_

- [ ] 11. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.