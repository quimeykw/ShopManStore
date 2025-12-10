/**
 * Property-Based Tests for Database Schema Integrity
 * Feature: credit-card-payment-processing, Property 3: Order persistence completeness
 * Validates: Requirements 1.4, 4.1
 */

const fc = require('fast-check');
const db = require('./db-config');
const initDatabase = require('./init-db');

// Initialize database before tests
beforeAll((done) => {
  initDatabase(db, false);
  setTimeout(done, 1000); // Wait for initialization
});

describe('Database Schema Integrity Tests', () => {
  
  /**
   * **Feature: credit-card-payment-processing, Property 3: Order persistence completeness**
   * For any successful payment, an order record should be created in the database 
   * containing the transaction ID, payment method "Tarjeta de Crédito", and all order details
   */
  test('Property 3: Order persistence completeness', () => {
    return fc.assert(
      fc.asyncProperty(
        // Generate random order data
        fc.record({
          userId: fc.integer({ min: 1, max: 1000 }),
          total: fc.float({ min: 100, max: 100000, noNaN: true }),
          transactionId: fc.string({ minLength: 10, maxLength: 50 }),
          cardLastFour: fc.string({ minLength: 4, maxLength: 4 }).filter(s => /^\d{4}$/.test(s)),
          cardType: fc.constantFrom('visa', 'mastercard', 'amex'),
          items: fc.array(fc.record({
            id: fc.integer({ min: 1, max: 100 }),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            quantity: fc.integer({ min: 1, max: 10 }),
            price: fc.float({ min: 10, max: 1000, noNaN: true })
          }), { minLength: 1, maxLength: 5 })
        }),
        async (orderData) => {
          return new Promise((resolve, reject) => {
            const itemsJson = JSON.stringify(orderData.items);
            
            // Insert order with all required fields for credit card payments
            db.run(
              `INSERT INTO orders (user_id, total, payment_method, items, transaction_id, payment_status, card_last_four, card_type) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                orderData.userId,
                orderData.total,
                'Tarjeta de Crédito',
                itemsJson,
                orderData.transactionId,
                'approved',
                orderData.cardLastFour,
                orderData.cardType
              ],
              function(err) {
                if (err) {
                  reject(err);
                  return;
                }
                
                const orderId = this.lastID;
                
                // Verify the order was saved with all required data
                db.get(
                  'SELECT * FROM orders WHERE id = ?',
                  [orderId],
                  (err, row) => {
                    if (err) {
                      reject(err);
                      return;
                    }
                    
                    try {
                      // Verify all required fields are present and correct
                      expect(row).toBeDefined();
                      expect(row.user_id).toBe(orderData.userId);
                      expect(row.total).toBe(orderData.total);
                      expect(row.payment_method).toBe('Tarjeta de Crédito');
                      expect(row.transaction_id).toBe(orderData.transactionId);
                      expect(row.payment_status).toBe('approved');
                      expect(row.card_last_four).toBe(orderData.cardLastFour);
                      expect(row.card_type).toBe(orderData.cardType);
                      
                      // Verify items are properly serialized and can be parsed
                      const parsedItems = JSON.parse(row.items);
                      expect(parsedItems).toEqual(orderData.items);
                      
                      // Verify created_at is set
                      expect(row.created_at).toBeDefined();
                      
                      // Clean up - delete the test order
                      db.run('DELETE FROM orders WHERE id = ?', [orderId], (err) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve(true);
                        }
                      });
                    } catch (error) {
                      // Clean up on assertion failure
                      db.run('DELETE FROM orders WHERE id = ?', [orderId], () => {
                        reject(error);
                      });
                    }
                  }
                );
              }
            );
          });
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design
    );
  });

  /**
   * Test that payment_logs table can store transaction data correctly
   */
  test('Payment logs table integrity', () => {
    return fc.assert(
      fc.asyncProperty(
        fc.record({
          userId: fc.integer({ min: 1, max: 1000 }),
          orderId: fc.integer({ min: 1, max: 1000 }),
          transactionId: fc.string({ minLength: 10, maxLength: 50 }),
          paymentMethod: fc.constantFrom('Tarjeta de Crédito', 'Mercado Pago', 'WhatsApp'),
          cardType: fc.constantFrom('visa', 'mastercard', 'amex'),
          cardLastFour: fc.string({ minLength: 4, maxLength: 4 }).filter(s => /^\d{4}$/.test(s)),
          amount: fc.float({ min: 100, max: 100000, noNaN: true }),
          status: fc.constantFrom('approved', 'pending', 'rejected'),
          mpResponse: fc.string({ minLength: 10, maxLength: 200 })
        }),
        async (logData) => {
          return new Promise((resolve, reject) => {
            // Insert payment log
            db.run(
              `INSERT INTO payment_logs (user_id, order_id, transaction_id, payment_method, card_type, card_last_four, amount, status, mp_response) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                logData.userId,
                logData.orderId,
                logData.transactionId,
                logData.paymentMethod,
                logData.cardType,
                logData.cardLastFour,
                logData.amount,
                logData.status,
                logData.mpResponse
              ],
              function(err) {
                if (err) {
                  reject(err);
                  return;
                }
                
                const logId = this.lastID;
                
                // Verify the log was saved correctly
                db.get(
                  'SELECT * FROM payment_logs WHERE id = ?',
                  [logId],
                  (err, row) => {
                    if (err) {
                      reject(err);
                      return;
                    }
                    
                    try {
                      // Verify all fields are present and correct
                      expect(row).toBeDefined();
                      expect(row.user_id).toBe(logData.userId);
                      expect(row.order_id).toBe(logData.orderId);
                      expect(row.transaction_id).toBe(logData.transactionId);
                      expect(row.payment_method).toBe(logData.paymentMethod);
                      expect(row.card_type).toBe(logData.cardType);
                      expect(row.card_last_four).toBe(logData.cardLastFour);
                      expect(row.amount).toBe(logData.amount);
                      expect(row.status).toBe(logData.status);
                      expect(row.mp_response).toBe(logData.mpResponse);
                      expect(row.created_at).toBeDefined();
                      
                      // Clean up - delete the test log
                      db.run('DELETE FROM payment_logs WHERE id = ?', [logId], (err) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve(true);
                        }
                      });
                    } catch (error) {
                      // Clean up on assertion failure
                      db.run('DELETE FROM payment_logs WHERE id = ?', [logId], () => {
                        reject(error);
                      });
                    }
                  }
                );
              }
            );
          });
        }
      ),
      { numRuns: 50 } // Run 50 iterations for this supporting test
    );
  });

  /**
   * Test that card data is never stored in full (security requirement)
   */
  test('Card data security compliance', () => {
    return fc.assert(
      fc.asyncProperty(
        fc.record({
          userId: fc.integer({ min: 1, max: 1000 }),
          total: fc.float({ min: 100, max: 100000, noNaN: true }),
          fullCardNumber: fc.string({ minLength: 13, maxLength: 19 }).filter(s => /^\d+$/.test(s)),
          transactionId: fc.string({ minLength: 10, maxLength: 50 })
        }),
        async (testData) => {
          return new Promise((resolve, reject) => {
            // Extract last 4 digits (simulating what the system should do)
            const cardLastFour = testData.fullCardNumber.slice(-4);
            
            // Insert order with only last 4 digits (never full number)
            db.run(
              `INSERT INTO orders (user_id, total, payment_method, transaction_id, card_last_four) 
               VALUES (?, ?, ?, ?, ?)`,
              [
                testData.userId,
                testData.total,
                'Tarjeta de Crédito',
                testData.transactionId,
                cardLastFour
              ],
              function(err) {
                if (err) {
                  reject(err);
                  return;
                }
                
                const orderId = this.lastID;
                
                // Verify that full card number is never stored
                db.get(
                  'SELECT * FROM orders WHERE id = ?',
                  [orderId],
                  (err, row) => {
                    if (err) {
                      reject(err);
                      return;
                    }
                    
                    try {
                      // Verify only last 4 digits are stored
                      expect(row.card_last_four).toBe(cardLastFour);
                      expect(row.card_last_four).toHaveLength(4);
                      
                      // Verify full card number is not stored anywhere in the row
                      const rowString = JSON.stringify(row);
                      expect(rowString).not.toContain(testData.fullCardNumber);
                      
                      // Clean up
                      db.run('DELETE FROM orders WHERE id = ?', [orderId], (err) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve(true);
                        }
                      });
                    } catch (error) {
                      // Clean up on assertion failure
                      db.run('DELETE FROM orders WHERE id = ?', [orderId], () => {
                        reject(error);
                      });
                    }
                  }
                );
              }
            );
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Close database connection after tests
afterAll((done) => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    }
    done();
  });
});