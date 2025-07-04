<template>
  <div class="payment-page">
    <div class="container">
      <h1 class="page-title">Secure Payment</h1>
      
      <div class="payment-container">
        <div class="payment-methods">
          <div class="payment-steps">
            <div class="step completed">
              <div class="step-number">1</div>
              <div class="step-label">Cart</div>
            </div>
            <div class="step completed">
              <div class="step-number">2</div>
              <div class="step-label">Details</div>
            </div>
            <div class="step active">
              <div class="step-number">3</div>
              <div class="step-label">Payment</div>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-label">Complete</div>
            </div>
          </div>
          
          <div class="payment-options">
            <h3>Select Payment Method</h3>
            <div class="options-grid">
              <div class="option-card" 
                   v-for="method in paymentMethods" 
                   :key="method.id"
                   :class="{ active: selectedMethod === method.id }"
                   @click="selectedMethod = method.id">
                <img :src="method.icon" :alt="method.name" class="option-icon">
                <span>{{ method.name }}</span>
              </div>
            </div>
          </div>
          
          <!-- Card Payment Form -->
          <div v-if="selectedMethod === 'card'" class="card-form">
            <h3>Card Details</h3>
            <div class="form-group">
  <label>Card Number</label>
  <div class="input-with-icon">
    <input type="text" 
           placeholder="1234 5678 9012 3456"
           v-model="cardDetails.number"
           @input="formatCardNumber"
           :class="{ 'error': errors.card.number }">
    <span class="card-type">
      <i class="fab fa-cc-visa" v-if="cardType === 'visa'"></i>
      <i class="fab fa-cc-mastercard" v-else-if="cardType === 'mastercard'"></i>
      <i class="fab fa-cc-amex" v-else-if="cardType === 'amex'"></i>
      <i class="far fa-credit-card" v-else></i>
    </span>
  </div>
  <div class="error-message" v-if="errors.card.number">{{ errors.card.number }}</div>
</div>
            
            <div class="form-row">
              <div class="form-group">
  <label>Expiry Date</label>
  <input type="text" 
         placeholder="MM/YY"
         v-model="cardDetails.expiry"
         @input="formatExpiryDate"
         :class="{ 'error': errors.card.expiry }">
  <div class="error-message" v-if="errors.card.expiry">
    {{ errors.card.expiry }}
  </div>
</div>
              <div class="form-group">
  <label>CVV</label>
  <div class="input-with-icon">
    <input type="password" 
           placeholder="123"
           v-model="cardDetails.cvv"
           @input="validateCVV"
           maxlength="4"
           :class="{ 'error': errors.card.cvv }">
    <span class="info-icon" :title="cardType === 'amex' ? '4-digit code on front of card' : '3-digit code on back of card'">
      <i class="fas fa-question-circle"></i>
    </span>
  </div>
  <div class="error-message" v-if="errors.card.cvv">
    {{ errors.card.cvv }}
  </div>
</div>
            </div>
            
            <div class="form-group">
              <label>Cardholder Name</label>
              <input type="text" 
                     placeholder="Name on card"
                     v-model="cardDetails.name">
            </div>
          </div>
          
          <!-- UPI Payment Form -->
          <div v-if="selectedMethod === 'upi'" class="upi-form">
            <h3>UPI Payment</h3>
            <div class="form-group">
              <label>UPI ID</label>
              <input type="text" 
                     placeholder="yourname@upi"
                     v-model="upiDetails.id">
            </div>
            <div class="upi-apps">
              <div class="upi-app" 
                   v-for="app in upiApps" 
                   :key="app.id"
                   @click="upiDetails.app = app.id"
                   :class="{ active: upiDetails.app === app.id }">
                <img :src="app.icon" :alt="app.name">
                <span>{{ app.name }}</span>
              </div>
            </div>
          </div>
          
          <div class="terms-checkbox">
            <input type="checkbox" id="terms" v-model="acceptTerms">
            <label for="terms">I agree to the <a href="#">Terms & Conditions</a></label>
          </div>
          
          <button class="pay-button" @click="processPayment" :disabled="!isFormValid || processing">
            <span v-if="!processing">Pay ₹{{ totalAmount }}</span>
            <span v-else>
              <i class="fas fa-spinner fa-spin"></i> Processing...
            </span>
          </button>
          
          <div class="security-info">
            <i class="fas fa-lock"></i>
            <span>Your payment is securely encrypted</span>
          </div>
        </div>
        
        <div class="order-summary">
          <h2>Order Summary</h2>
          
          <div class="order-items">
            <div class="order-item" v-for="item in cartItems" :key="item.id">
              <img :src="item.image" :alt="item.title" class="item-image">
              <div class="item-details">
                <h4>{{ item.title }}</h4>
                <p>₹{{ item.price }} × {{ item.quantity }}</p>
              </div>
              <div class="item-total">₹{{ (item.price * item.quantity).toFixed(2) }}</div>
            </div>
          </div>
          
          <div class="price-breakdown">
            <div class="price-row">
              <span>Subtotal</span>
              <span>₹{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="price-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div class="price-row">
              <span>GST (18%)</span>
              <span>₹{{ gstAmount.toFixed(2) }}</span>
            </div>
            <div class="price-row total">
              <span>Total</span>
              <span>₹{{ totalAmount }}</span>
            </div>
          </div>
          
          <div class="delivery-info">
            <h4><i class="fas fa-truck"></i> Delivery Information</h4>
            <p>
              <strong>Address:</strong> Rathinam Technical Campus, Coimbatore<br>
              <strong>Estimated Delivery:</strong> 2-3 business days
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      selectedMethod: 'card',
      paymentMethods: [
        { id: 'card', name: 'Credit/Debit Card', icon: 'https://cdn-icons-png.flaticon.com/512/196/196578.png' },
        { id: 'upi', name: 'UPI', icon: 'https://cdn-icons-png.flaticon.com/512/825/825454.png' },
        { id: 'netbanking', name: 'Net Banking', icon: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png' }
      ],
      upiApps: [
        { id: 'gpay', name: 'Google Pay', icon: 'https://cdn-icons-png.flaticon.com/512/2504/2504739.png' },
        { id: 'phonepe', name: 'PhonePe', icon: 'https://cdn-icons-png.flaticon.com/512/3649/3649706.png' },
        { id: 'paytm', name: 'Paytm', icon: 'https://cdn-icons-png.flaticon.com/512/825/825454.png' }
      ],
      cardDetails: {
        number: '',
        expiry: '',
        cvv: '',
        name: ''
      },
      upiDetails: {
        id: '',
        app: 'gpay'
      },
      acceptTerms: false,
      processing: false,
      shipping: 0,
      gstRate: 18,
      errors: {
        card: {
          number: '',
          expiry: '',
          cvv: '',
          name: ''
        },
        upi: {
          id: ''
        }
      }
    }
  },
  computed: {
    ...mapState(['cartItems']),
    subtotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    gstAmount() {
      return (this.subtotal * this.gstRate) / 100;
    },
    totalAmount() {
      return (this.subtotal + this.gstAmount + this.shipping).toFixed(2);
    },
    cardType() {
      const num = this.cardDetails.number.replace(/\s+/g, '');
      if (/^4/.test(num)) return 'visa';
      if (/^5[1-5]/.test(num)) return 'mastercard';
      if (/^3[47]/.test(num)) return 'amex';
      return '';
    },
    isFormValid() {
      if (!this.acceptTerms) return false;
      
      if (this.selectedMethod === 'card') {
        return this.cardDetails.number.length >= 13 && 
               this.cardDetails.expiry.length === 5 &&
               this.cardDetails.cvv.length >= 3 &&
               this.cardDetails.name.length >= 3;
      } else if (this.selectedMethod === 'upi') {
        return this.upiDetails.id.includes('@');
      }
      
      return false;
    }
  },
  methods: {
    validateCardNumber() {
      const num = this.cardDetails.number.replace(/\s+/g, '');
      if (num.length < 13 || num.length > 19) {
        this.errors.card.number = 'Card number must be 13-19 digits';
        return false;
      }
      
      // Simple validation - in production use a proper library
      if (!/^\d+$/.test(num)) {
        this.errors.card.number = 'Only digits allowed';
        return false;
      }
      
      this.errors.card.number = '';
      return true;
    },
    
    validateExpiryDate() {
  const expiry = this.cardDetails.expiry;
  
  // Basic format check
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    this.errors.card.expiry = 'Use MM/YY format';
    return false;
  }

  const [month, year] = expiry.split('/');
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  // Month validation
  if (month < 1 || month > 12) {
    this.errors.card.expiry = 'Invalid month (01-12)';
    return false;
  }
  
  // Year validation
  const expiryYear = parseInt(year, 10);
  const expiryMonth = parseInt(month, 10);
  
  if (expiryYear < currentYear || 
      (expiryYear === currentYear && expiryMonth < currentMonth)) {
    this.errors.card.expiry = 'Card expired or invalid date';
    return false;
  }

  this.errors.card.expiry = '';
  return true;
},
    
    validateCVV() {
  const cvv = this.cardDetails.cvv;
  // Remove any non-digit characters
  const cleanCVV = cvv.replace(/\D/g, '');
  
  // Limit CVV length to 3-4 digits
  if (cleanCVV.length > 4) {
    this.cardDetails.cvv = cleanCVV.slice(0, 4);
    return false;
  }

  // Check for valid length based on card type
  const expectedLength = this.cardType === 'amex' ? 4 : 3;
  
  if (cleanCVV.length !== expectedLength) {
    this.errors.card.cvv = this.cardType === 'amex' 
      ? 'American Express requires 4-digit CVV' 
      : 'CVV must be 3 digits';
    return false;
  }

  if (!/^\d+$/.test(cleanCVV)) {
    this.errors.card.cvv = 'Only digits allowed';
    return false;
  }

  this.errors.card.cvv = '';
  return true;
},
    
    validateCardName() {
      if (this.cardDetails.name.trim().length < 3) {
        this.errors.card.name = 'Name too short';
        return false;
      }
      this.errors.card.name = '';
      return true;
    },
    
    validateUpiId() {
      if (!this.upiDetails.id.includes('@')) {
        this.errors.upi.id = 'Invalid UPI ID';
        return false;
      }
      this.errors.upi.id = '';
      return true;
    },
    
    formatCardNumber(event) {
      let value = event.target.value.replace(/\s+/g, '');
      if (value.length > 16) value = value.substring(0, 16);
      value = value.replace(/(\d{4})/g, '$1 ').trim();
      this.cardDetails.number = value;
      this.validateCardNumber();
    },
    
    formatExpiryDate(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length > 4) value = value.substring(0, 4);
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      this.cardDetails.expiry = value;
      this.validateExpiryDate();
    },
    formatCVV(event) {
  // Remove non-digit characters
  let value = event.target.value.replace(/\D/g, '');
  
  // Limit to 4 characters max
  if (value.length > 4) {
    value = value.slice(0, 4);
  }
  
  this.cardDetails.cvv = value;
  this.validateCVV();
},
    
    processPayment() {
      // Final validation before processing
      if (this.selectedMethod === 'card') {
        if (!this.validateCardNumber() || 
            !this.validateExpiryDate() || 
            !this.validateCVV() || 
            !this.validateCardName()) {
          return;
        }
      } else if (this.selectedMethod === 'upi') {
        if (!this.validateUpiId()) return;
      }
      
      if (!this.acceptTerms) return;
      
      this.processing = true;
      const invoiceItems = this.cartItems.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      }));
      
      setTimeout(() => {
        this.$router.push({
          path: '/order-confirmation',
          query: {
            amount: this.totalAmount,
            items: JSON.stringify(invoiceItems),
            method: this.selectedMethod
          }
        });
      }, 2000);
    }
  }
}
</script>

<style scoped>
.payment-page {
  padding: 2rem 0;
  background-color: #f8fafc;
  min-height: calc(100vh - 120px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  margin-top:50px;
  padding: 0 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
}

.payment-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.payment-methods {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.payment-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
}

.payment-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.step-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.step.completed .step-number {
  background: #6a1b9a;
  color: white;
}

.step.completed .step-label {
  color: #6a1b9a;
}

.step.active .step-number {
  background: #a78bfa;
  color: white;
  box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.3);
}

.step.active .step-label {
  color: #6a1b9a;
  font-weight: 600;
}

.payment-options h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-card:hover {
  border-color: #a78bfa;
}

.option-card.active {
  border-color: #6a1b9a;
  background: #f5f3ff;
}

.option-icon {
  width: 30px;
  height: auto;
  margin-right: 12px;
}

.card-form h3,
.upi-form h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  border-color: #a78bfa;
  outline: none;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-with-icon {
  position: relative;
}

.card-type, .info-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}


.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-group input.error {
  border-color: #ef4444;
  background-color: #fff5f5;
}

.info-icon {
  color: #6b7280;
  cursor: help;
}

.form-group input.error {
  border-color: #ef4444;
}

.info-icon {
  cursor: help;
}

.upi-apps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.upi-app {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upi-app:hover {
  border-color: #a78bfa;
}

.upi-app.active {
  border-color: #6a1b9a;
  background: #f5f3ff;
}

.upi-app img {
  width: 40px;
  height: 40px;
  margin-bottom: 0.5rem;
}

.upi-app span {
  font-size: 0.8rem;
}

.terms-checkbox {
  display: flex;
  align-items: center;
  margin: 2rem 0;
}

.terms-checkbox input {
  margin-right: 0.5rem;
}

.terms-checkbox a {
  color: #6a1b9a;
  text-decoration: none;
}

.terms-checkbox a:hover {
  text-decoration: underline;
}

.pay-button {
  width: 100%;
  padding: 1rem;
  background: #6a1b9a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pay-button:hover:not(:disabled) {
  background: #7b1fa2;
  transform: translateY(-2px);
}

.pay-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.security-info {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.security-info i {
  color: #10b981;
  margin-right: 0.5rem;
}

.order-summary {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 1rem;
}

.order-summary h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.order-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
}

.order-item {
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex-grow: 1;
}

.item-details h4 {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.item-details p {
  color: #64748b;
  font-size: 0.85rem;
  margin: 0;
}

.item-total {
  font-weight: 600;
  color: #2d3748;
  min-width: 70px;
  text-align: right;
}

.price-breakdown {
  margin: 1.5rem 0;
  padding: 1.5rem 0;
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #4a5568;
}

.price-row.total {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  font-weight: 600;
  color: #2d3748;
}

.price-row.total span:last-child {
  font-weight: 700;
  color: #6a1b9a;
  font-size: 1.2rem;
}

.delivery-info {
  margin-top: 1.5rem;
}

.delivery-info h4 {
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.delivery-info h4 i {
  margin-right: 0.5rem;
}

.delivery-info p {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .payment-container {
    grid-template-columns: 1fr;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .upi-apps {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>