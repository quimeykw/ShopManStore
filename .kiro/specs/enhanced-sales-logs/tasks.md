# Implementation Plan - Enhanced Sales Logs

- [ ] 1. Update log formatting to use structured JSON
  - Modify `formatPurchaseLog()` function to return JSON string with structured data
  - Include orderId, items array with full details, totalProducts, paymentMethod, and total
  - Update all calls to `formatPurchaseLog()` to pass orderId parameter
  - Ensure backward compatibility with existing logs
  - _Requirements: 1.1, 1.3, 1.4, 1.5_

- [ ]* 1.1 Write property test for complete log data
  - **Property 1: Complete log data**
  - **Validates: Requirements 1.1, 1.3**

- [ ]* 1.2 Write property test for valid payment method
  - **Property 2: Valid payment method**
  - **Validates: Requirements 1.4**

- [ ]* 1.3 Write property test for valid total amount
  - **Property 3: Valid total amount**
  - **Validates: Requirements 1.5**

- [ ] 2. Implement sales logs endpoint with filtering
  - Create `GET /api/sales-logs` endpoint with auth and isAdmin middleware
  - Implement query building with optional filters: username, paymentMethod, startDate, endDate
  - Join logs table with users table to get username and email
  - Filter for action = 'Compra realizada'
  - Parse JSON details field before returning
  - Handle database errors gracefully
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4_

- [ ]* 2.1 Write property test for username filter
  - **Property 4: Username filter correctness**
  - **Validates: Requirements 2.1**

- [ ]* 2.2 Write property test for payment method filter
  - **Property 5: Payment method filter correctness**
  - **Validates: Requirements 2.2**

- [ ]* 2.3 Write property test for date range filter
  - **Property 6: Date range filter correctness**
  - **Validates: Requirements 2.3**

- [ ]* 2.4 Write property test for multiple filters
  - **Property 7: Multiple filters conjunction**
  - **Validates: Requirements 2.4**

- [ ] 3. Implement sales statistics endpoint
  - Create `GET /api/sales-stats` endpoint with auth and isAdmin middleware
  - Calculate today's sales (count and total)
  - Calculate this week's sales (last 7 days)
  - Calculate this month's sales
  - Calculate breakdown by payment method
  - Use json_extract for SQLite compatibility
  - Return all statistics in single response
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 3.1 Write property test for daily sales calculation
  - **Property 8: Daily sales calculation**
  - **Validates: Requirements 3.1**

- [ ]* 3.2 Write property test for weekly sales calculation
  - **Property 9: Weekly sales calculation**
  - **Validates: Requirements 3.2**

- [ ]* 3.3 Write property test for monthly sales calculation
  - **Property 10: Monthly sales calculation**
  - **Validates: Requirements 3.3**

- [ ]* 3.4 Write property test for transaction count
  - **Property 11: Transaction count accuracy**
  - **Validates: Requirements 3.4**

- [ ]* 3.5 Write property test for payment method breakdown
  - **Property 12: Payment method breakdown accuracy**
  - **Validates: Requirements 3.5**

- [ ] 4. Checkpoint - Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement CSV export endpoint
  - Create `GET /api/sales-logs/export` endpoint with auth and isAdmin middleware
  - Reuse same query logic as sales-logs endpoint for filtering
  - Implement `generateCSV()` helper function
  - Include UTF-8 BOM for Excel compatibility
  - Set proper headers: Content-Type and Content-Disposition
  - Generate filename with current date
  - Handle special characters in CSV values (quotes, commas)
  - Include all required columns: fecha, hora, usuario, email, productos, cantidades, método de pago, total
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 5.1 Write property test for CSV completeness
  - **Property 13: CSV export completeness**
  - **Validates: Requirements 4.1, 4.2**

- [ ]* 5.2 Write property test for filtered export consistency
  - **Property 14: Filtered export consistency**
  - **Validates: Requirements 4.4**

- [ ]* 5.3 Write unit test for CSV special characters
  - Test CSV generation with product names containing quotes and commas
  - Test UTF-8 BOM inclusion
  - Test filename format with date
  - _Requirements: 4.2, 4.3, 4.5_

- [ ] 6. Add retry logic to saveLog function
  - Wrap saveLog database operation in retry logic (max 3 attempts)
  - Add exponential backoff between retries
  - Log failures to system error log after all retries exhausted
  - Don't throw errors that would block order creation
  - _Requirements: 5.2, 5.3_

- [ ]* 6.1 Write property test for order-log consistency
  - **Property 15: Order-log consistency**
  - **Validates: Requirements 5.4**

- [ ] 7. Implement sales panel frontend view
  - Create `showSalesPanel()` function in app.js
  - Design panel layout with statistics cards section
  - Add filters section with inputs for username, payment method, start date, end date
  - Add buttons: "Aplicar Filtros", "Limpiar", "Exportar CSV"
  - Add empty sales list container
  - Call `loadSalesStats()` and `loadSalesLogs()` on panel load
  - _Requirements: 1.2, 2.1, 2.2, 2.3, 4.1_

- [ ] 8. Implement sales statistics loading
  - Create `loadSalesStats()` function
  - Fetch from `/api/sales-stats` endpoint
  - Display three cards: HOY (today), ESTA SEMANA (week), ESTE MES (month)
  - Show total amount and transaction count for each period
  - Use color-coded cards (blue, green, purple)
  - Handle fetch errors gracefully
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 9. Implement sales logs loading and display
  - Create `loadSalesLogs(filters)` function
  - Build query parameters from filters object
  - Fetch from `/api/sales-logs` endpoint
  - Display each log as a card with:
    - User icon and username
    - Email with copy button
    - Order number and timestamp
    - Total amount (large, green)
    - Payment method badge
    - Product list with sizes and quantities
  - Show "No se encontraron ventas" if empty
  - Handle fetch errors gracefully
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 6.1, 6.2, 6.3_

- [ ]* 9.1 Write property test for user information presence
  - **Property 16: User information presence**
  - **Validates: Requirements 6.1, 6.2**

- [ ] 10. Implement filter functionality
  - Create `applySalesFilters()` function
  - Read values from filter inputs
  - Build filters object (remove empty values)
  - Call `loadSalesLogs(filters)` with filters
  - Create `clearSalesFilters()` function
  - Reset all filter inputs to empty
  - Call `loadSalesLogs()` without filters
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 11. Implement CSV export functionality
  - Create `exportSales()` function
  - Read current filter values
  - Build query parameters
  - Trigger download via window.location.href to export endpoint
  - Include token in query parameters for authentication
  - _Requirements: 4.1, 4.4, 4.5_

- [ ] 12. Implement email copy functionality
  - Create `copyEmail(email)` function
  - Check if email is valid (not null or "Sin email")
  - Use navigator.clipboard.writeText() to copy
  - Show alert with confirmation or error message
  - _Requirements: 6.1, 6.4_

- [ ] 13. Add sales panel navigation button
  - Add "📊 Ventas" button to admin panel navigation
  - Style with green background (bg-green-500)
  - Wire onclick to call `showSalesPanel()`
  - Position alongside existing admin panel buttons
  - _Requirements: 1.2_

- [ ]* 13.1 Write property test for admin-only access
  - **Property 17: Admin-only access**
  - **Validates: Requirements 6.5**

- [ ] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 15. Integration testing
  - Test complete purchase flow: create order → verify log → verify appears in panel
  - Test filter and export flow: create orders → filter → export → verify CSV
  - Test statistics: create orders across dates → verify stats correct
  - Test access control: attempt access as non-admin → verify 403
  - _Requirements: All_
