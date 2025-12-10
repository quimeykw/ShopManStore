/**
 * FRONTEND MEJORADO PARA PAGO POR TARJETA
 * Integración completa con MercadoPago.js
 */

// Configuración de MercadoPago
let mp = null;
let cardForm = null;

// Inicializar MercadoPago cuando se carga la página
function initializeMercadoPago() {
  // Usar clave pública de test de MercadoPago
  const publicKey = 'TEST-4f3f7c8b-9e2d-4f5a-8b3c-1a2b3c4d5e6f'; // Reemplazar con tu clave pública
  
  if (typeof MercadoPago !== 'undefined') {
    mp = new MercadoPago(publicKey);
    console.log('✅ MercadoPago inicializado');
  } else {
    console.error('❌ MercadoPago.js no está cargado');
  }
}

// Mostrar formulario de tarjeta mejorado
function showEnhancedCardForm() {
  const total = window.cartTotal || cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.9;
  $('cardTotal').textContent = '$' + formatPrice(total);
  $('paymentModal').classList.add('hidden');
  $('cardModal').classList.remove('hidden');
  
  // Limpiar formulario
  $('cardForm').reset();
  
  // Inicializar formulario de MercadoPago si no está inicializado
  if (mp && !cardForm) {
    initializeCardForm();
  }
}

// Inicializar formulario de tarjeta con MercadoPago.js
function initializeCardForm() {
  try {
    cardForm = mp.cardForm({
      amount: window.cartTotal || cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.9,
      iframe: true,
      form: {
        id: "cardForm",
        cardNumber: {
          id: "cardNumber",
          placeholder: "Número de tarjeta"
        },
        expirationDate: {
          id: "cardExpiry",
          placeholder: "MM/YY"
        },
        securityCode: {
          id: "cardCVV",
          placeholder: "CVV"
        },
        cardholderName: {
          id: "cardholderName",
          placeholder: "Nombre del titular"
        },
        issuer: {
          id: "issuer",
          placeholder: "Banco emisor"
        },
        installments: {
          id: "installments",
          placeholder: "Cuotas"
        },
        identificationType: {
          id: "identificationType"
        },
        identificationNumber: {
          id: "cardDNI",
          placeholder: "DNI"
        }
      },
      callbacks: {
        onFormMounted: error => {
          if (error) {
            console.error('Error montando formulario:', error);
          } else {
            console.log('✅ Formulario de tarjeta montado');
          }
        },
        onSubmit: event => {
          event.preventDefault();
          processEnhancedCardPayment();
        },
        onFetching: (resource) => {
          console.log('Obteniendo:', resource);
        }
      }
    });
    
    console.log('✅ CardForm inicializado');
  } catch (error) {
    console.error('❌ Error inicializando CardForm:', error);
    // Fallback al formulario básico
    setupBasicCardForm();
  }
}

// Configurar formulario básico como fallback
function setupBasicCardForm() {
  console.log('🔄 Usando formulario básico de tarjeta');
  
  // Formatear inputs
  $('cardNumber').oninput = formatCardNumber;
  $('cardExpiry').oninput = formatExpiry;
  $('cardCVV').oninput = formatCVV;
  $('cardDNI').oninput = formatDNI;
  
  // Detectar tipo de tarjeta
  $('cardNumber').oninput = function(e) {
    formatCardNumber(e);
    detectCardType(e.target.value);
  };
}

// Detectar tipo de tarjeta
function detectCardType(cardNumber) {
  const number = cardNumber.replace(/\s/g, '');
  let cardType = 'unknown';
  
  if (/^4/.test(number)) {
    cardType = 'visa';
  } else if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) {
    cardType = 'mastercard';
  } else if (/^3[47]/.test(number)) {
    cardType = 'amex';
  }
  
  // Actualizar UI con el tipo de tarjeta
  const cardIcon = $('cardTypeIcon');
  if (cardIcon) {
    cardIcon.className = `card-icon ${cardType}`;
  }
  
  return cardType;
}

// Procesar pago con tarjeta mejorado
async function processEnhancedCardPayment() {
  try {
    // Verificar autenticación
    if (!token || !user) {
      alert('Debes iniciar sesión para realizar un pago');
      return;
    }
    
    // Mostrar loading
    const submitBtn = $('cardSubmitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Procesando...';
    submitBtn.disabled = true;
    
    let paymentData;
    
    if (cardForm) {
      // Usar MercadoPago.js para generar token
      console.log('🔄 Generando token con MercadoPago.js...');
      
      const formData = cardForm.getCardFormData();
      
      if (!formData.token) {
        throw new Error('No se pudo generar el token de la tarjeta');
      }
      
      paymentData = {
        token: formData.token,
        payment_method_id: formData.payment_method_id,
        installments: formData.installments,
        identification_type: formData.identification_type,
        identification_number: formData.identification_number
      };
      
    } else {
      // Fallback: usar datos básicos del formulario
      console.log('🔄 Usando datos básicos del formulario...');
      
      paymentData = {
        card_number: $('cardNumber').value.replace(/\s/g, ''),
        cardholder_name: $('cardholderName').value,
        security_code: $('cardCVV').value,
        expiration_month: $('cardExpiry').value.split('/')[0],
        expiration_year: '20' + $('cardExpiry').value.split('/')[1],
        identification_type: 'DNI',
        identification_number: $('cardDNI').value,
        payment_method_id: detectCardType($('cardNumber').value),
        installments: 1
      };
    }
    
    // Preparar datos de la orden
    const orderData = {
      items: formatCartItems(),
      total: window.cartTotal || cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.9,
      paymentData: paymentData
    };
    
    console.log('💳 Enviando pago por tarjeta...');
    
    // Enviar pago al backend
    const response = await fetch('/api/card-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Pago exitoso
      console.log('✅ Pago procesado exitosamente:', result);
      
      alert(`¡Pago exitoso! 🎉\n\n` +
            `ID de transacción: ${result.payment_id}\n` +
            `Estado: ${result.status_detail}\n` +
            `Monto: $${formatPrice(result.transaction_amount)}\n` +
            `Método: ${result.payment_method}\n` +
            `Cuotas: ${result.installments}`);
      
      // Limpiar carrito y cerrar modales
      cart = [];
      updateCart();
      $('cardModal').classList.add('hidden');
      
      // Redirigir a página de éxito o mostrar confirmación
      showPaymentSuccess(result);
      
    } else {
      // Error en el pago
      console.error('❌ Error en el pago:', result);
      
      let errorMessage = 'Error procesando el pago';
      if (result.error) {
        errorMessage = result.error;
      }
      
      alert(`Error en el pago ❌\n\n${errorMessage}\n\nPor favor verifica los datos e intenta nuevamente.`);
    }
    
  } catch (error) {
    console.error('❌ Error procesando pago:', error);
    alert(`Error inesperado: ${error.message}\n\nPor favor intenta nuevamente.`);
  } finally {
    // Restaurar botón
    const submitBtn = $('cardSubmitBtn');
    if (submitBtn) {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }
}

// Mostrar confirmación de pago exitoso
function showPaymentSuccess(paymentResult) {
  const successHtml = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <div class="text-center">
          <div class="text-green-500 text-6xl mb-4">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h3>
          <p class="text-gray-600 mb-4">Tu compra ha sido procesada correctamente</p>
          
          <div class="bg-gray-50 rounded-lg p-4 mb-4 text-left">
            <div class="text-sm text-gray-600">
              <p><strong>ID:</strong> ${paymentResult.payment_id}</p>
              <p><strong>Monto:</strong> $${formatPrice(paymentResult.transaction_amount)}</p>
              <p><strong>Estado:</strong> ${paymentResult.status_detail}</p>
              <p><strong>Método:</strong> ${paymentResult.payment_method}</p>
            </div>
          </div>
          
          <button onclick="closePaymentSuccess()" 
                  class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
            Continuar
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', successHtml);
}

// Cerrar modal de éxito
function closePaymentSuccess() {
  const successModal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
  if (successModal) {
    successModal.remove();
  }
}

// Funciones de formateo mejoradas
function formatCardNumber(e) {
  let value = e.target.value.replace(/\s/g, '');
  let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
  if (formatted.length > 19) formatted = formatted.slice(0, 19);
  e.target.value = formatted;
}

function formatExpiry(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4);
  }
  e.target.value = value;
}

function formatCVV(e) {
  let value = e.target.value.replace(/\D/g, '');
  e.target.value = value.slice(0, 4);
}

function formatDNI(e) {
  let value = e.target.value.replace(/\D/g, '');
  e.target.value = value.slice(0, 8);
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  // Cargar MercadoPago.js si no está cargado
  if (typeof MercadoPago === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = initializeMercadoPago;
    document.head.appendChild(script);
  } else {
    initializeMercadoPago();
  }
});

// Exportar funciones para uso global
window.showEnhancedCardForm = showEnhancedCardForm;
window.processEnhancedCardPayment = processEnhancedCardPayment;
window.closePaymentSuccess = closePaymentSuccess;