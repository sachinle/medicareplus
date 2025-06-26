<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">Your Shopping Cart</h1>
      
      <div v-if="cartItems.length === 0" class="empty-cart">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 6H21" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything to your cart yet</p>
        <router-link to="/products" class="continue-shopping-btn">Continue Shopping</router-link>
      </div>
      
      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.title" @error="handleImageError">
            </div>
            
            <div class="item-details">
              <h3 class="item-title">{{ item.title }}</h3>
              <p class="item-category">{{ item.category }}</p>
              
              <div class="item-rating">
                <div class="stars">
                  <span 
                    v-for="star in 5" 
                    :key="star" 
                    :class="{ 'filled': star <= Math.round(item.rating.rate) }"
                  >★</span>
                </div>
                <span class="rating-count">{{ item.rating.count }} reviews</span>
              </div>
            </div>
            
            <div class="item-quantity">
              <button @click="decreaseQuantity(item)" class="quantity-btn">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQuantity(item)" class="quantity-btn">+</button>
            </div>
            
            <div class="item-price">
              ₹{{ (item.price * item.quantity).toFixed(2) }}
            </div>
            
            <button @click="removeItem(item)" class="remove-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="cart-summary">
          <h3>Order Summary</h3>
          
          <div class="summary-row">
            <span>Subtotal ({{ cartItemCount }} items)</span>
            <span>₹{{ cartSubtotal.toFixed(2) }}</span>
          </div>
          
          <div class="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          
          <div class="summary-row total">
            <span>Total</span>
            <span>₹{{ cartSubtotal.toFixed(2) }}</span>
          </div>
          
          
          <router-link to="/payment" class="continue-shopping-link">
            <button class="checkout-btn">Proceed to Checkout</button>
          </router-link>
          <router-link to="/products" class="continue-shopping-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Continue Shopping
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'CartPage',
  data() {
    return {
      defaultImage: 'https://via.placeholder.com/150?text=Product'
    };
  },
  computed: {
    ...mapState(['cartItems']),
    cartItemCount() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    cartSubtotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  },
  methods: {
    ...mapActions(['addItemToCart', 'removeItemFromCart', 'updateItemQuantity']),
    handleImageError(event) {
      event.target.src = this.defaultImage;
    },
    increaseQuantity(item) {
      this.updateItemQuantity({ 
        item, 
        newQuantity: item.quantity + 1 
      });
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        this.updateItemQuantity({ 
          item, 
          newQuantity: item.quantity - 1 
        });
      } else {
        this.removeItem(item);
      }
    },
    removeItem(item) {
      this.removeItemFromCart(item);
    },
    proceedToCheckout() {
      if (this.cartItems.length > 0) {
        this.$router.push('/checkout');
      }
    }
  }
};
</script>

<style scoped>
.cart-page {
    margin-top:70px;
  padding:5px;
  min-height: calc(100vh - 120px);
  background-color: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
}

.empty-cart {
  text-align: center;
  padding: 4rem 0;
  color: #4a5568;
}

.empty-cart svg {
  margin-bottom: 1.5rem;
}

.empty-cart h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.empty-cart p {
  margin-bottom: 1.5rem;
}

.continue-shopping-btn {
  padding: 0.75rem 1.5rem;
  background-color: #6a1b9a;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.continue-shopping-btn:hover {
  background-color: #7b1fa2;
  transform: translateY(-1px);
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1.5rem;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.item-image {
  width: 100px;
  height: 100px;
  background-color: #f8fafc;
  border-radius: 6px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.item-category {
  font-size: 0.85rem;
  color: #718096;
  text-transform: capitalize;
}

.item-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
}

.stars span {
  color: #e2e8f0;
  font-size: 0.9rem;
}

.stars .filled {
  color: #ffc107;
}

.rating-count {
  font-size: 0.8rem;
  color: #a0aec0;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-btn:hover {
  background-color: #edf2f7;
  border-color: #cbd5e0;
}

.item-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #6a1b9a;
  min-width: 80px;
  text-align: right;
}

.remove-btn {
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  transform: scale(1.1);
}

.cart-summary {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: fit-content;
  position: sticky;
  top: 1rem;
}

.cart-summary h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.summary-row.total {
  font-weight: 600;
  font-size: 1.1rem;
  margin: 1.5rem 0;
  color: #2d3748;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background-color: #6a1b9a;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;
}

.checkout-btn:hover {
  background-color: #7b1fa2;
}

.continue-shopping-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6a1b9a;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.continue-shopping-link:hover {
  color: #7b1fa2;
}

.continue-shopping-link svg {
  transition: transform 0.2s ease;
}

.continue-shopping-link:hover svg {
  transform: translateX(-3px);
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto auto auto;
    gap: 1rem;
  }
  
  .item-quantity,
  .item-price,
  .remove-btn {
    grid-column: 2;
    justify-self: start;
  }
  
  .remove-btn {
    justify-self: end;
    grid-row: 3;
    grid-column: 2;
  }
  
  .item-price {
    text-align: left;
  }

  /* In CartPage.vue style section */
.cart-page {
    margin-top:50px;
}
}
</style>