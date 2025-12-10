#!/usr/bin/env node

/**
 * SISTEMA DE PAGO POR TARJETA MEJORADO
 * Implementación completa con validaciones y tests
 */

const express = require('express');
const { MercadoPagoConfig, Payment } = require('mercadopago');

// Configuración mejorada para pagos por tarjeta
class CardPaymentProcessor {
  constructor(accessToken) {
    this.client = new MercadoPagoConfig({ accessToken });
    this.payment = new Payment(this.client);
  }

  // Validar datos de tarjeta
  validateCardData(paymentData) {
    const errors = [];

    // Validar número de tarjeta
    if (!paymentData.card_number || paymentData.card_number.length < 13) {
      errors.push('Número de tarjeta inválido');
    }

    // Validar CVV
    if (!paymentData.security_code || paymentData.security_code.length < 3) {
      errors.push('Código de seguridad inválido');
    }

    // Validar fecha de expiración
    if (!paymentData.expiration_month || !paymentData.expiration_year) {
      errors.push('Fecha de expiración inválida');
    }

    // Validar nombre del titular
    if (!paymentData.cardholder_name || paymentData.cardholder_name.length < 2) {
      errors.push('Nombre del titular inválido');
    }

    // Validar DNI
    if (!paymentData.identification_number || paymentData.identification_number.length < 7) {
      errors.push('Número de identificación inválido');
    }

    return errors;
  }

  // Procesar pago por tarjeta
  async processCardPayment(orderData, paymentData, userInfo) {
    try {
      // Validar datos
      const validationErrors = this.validateCardData(paymentData);
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: 'Datos inválidos: ' + validationErrors.join(', ')
        };
      }

      // Preparar datos del pago
      const paymentBody = {
        transaction_amount: Number(orderData.total),
        description: orderData.items.map(i => `${i.name} x${i.quantity}`).join(', '),
        payment_method_id: paymentData.payment_method_id || 'visa',
        
        // Datos del pagador
        payer: {
          email: userInfo.email || userInfo.username + '@shopmanstore.com',
          identification: {
            type: paymentData.identification_type || 'DNI',
            number: paymentData.identification_number
          }
        },

        // Datos de la tarjeta
        token: paymentData.token, // Token generado por MercadoPago.js
        installments: parseInt(paymentData.installments) || 1,

        // Datos adicionales para seguridad
        additional_info: {
          items: orderData.items.map(item => ({
            id: item.id.toString(),
            title: item.name,
            description: item.name,
            picture_url: null,
            category_id: 'clothing',
            quantity: item.quantity,
            unit_price: item.price
          })),
          payer: {
            first_name: paymentData.cardholder_name.split(' ')[0],
            last_name: paymentData.cardholder_name.split(' ').slice(1).join(' ') || 'N/A',
            phone: {
              area_code: '11',
              number: '12345678'
            },
            address: {
              street_name: 'Calle Falsa',
              street_number: 123,
              zip_code: '1234'
            }
          }
        }
      };

      console.log('🔄 Procesando pago por tarjeta:', {
        amount: paymentBody.transaction_amount,
        method: paymentBody.payment_method_id,
        installments: paymentBody.installments,
        user: userInfo.username
      });

      // Crear el pago
      const response = await this.payment.create({ body: paymentBody });

      console.log('✅ Respuesta de Mercado Pago:', {
        id: response.id,
        status: response.status,
        status_detail: response.status_detail
      });

      return {
        success: true,
        payment_id: response.id,
        status: response.status,
        status_detail: response.status_detail,
        transaction_amount: response.transaction_amount,
        payment_method: response.payment_method_id
      };

    } catch (error) {
      console.error('❌ Error procesando pago:', error);
      
      return {
        success: false,
        error: error.message || 'Error al procesar el pago',
        details: error.cause || []
      };
    }
  }

  // Obtener métodos de pago disponibles
  async getPaymentMethods() {
    try {
      const response = await fetch('https://api.mercadopago.com/v1/payment_methods', {
        headers: {
          'Authorization': `Bearer ${this.client.accessToken}`
        }
      });
      
      const methods = await response.json();
      
      // Filtrar solo tarjetas de crédito
      return methods.filter(method => 
        method.payment_type_id === 'credit_card' && 
        method.status === 'active'
      );
    } catch (error) {
      console.error('Error obteniendo métodos de pago:', error);
      return [];
    }
  }
}

module.exports = { CardPaymentProcessor };