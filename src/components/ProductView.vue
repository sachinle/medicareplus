<template>
  <div class="product-view">
    <!-- Back button -->
    <button @click="$router.go(-1)" class="back-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Back to Products
    </button>
    
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
    </div>
    
    <div v-else-if="product" class="product-container">
      <div class="product-gallery">
        <div class="main-image">
          <img 
            :src="product.image || defaultImage" 
            :alt="product.title" 
            @error="handleImageError"
          >
        </div>
      </div>
      
      <div class="product-details">
        <div class="product-badge" v-if="product.rating.rate >= 4.5">BESTSELLER</div>
        <h1 class="product-title">{{ product.title }}</h1>
        
        <div class="product-rating">
          <div class="stars">
            <span 
              v-for="star in 5" 
              :key="star" 
              :class="{ 'filled': star <= Math.round(product.rating.rate) }"
            >★</span>
          </div>
          <span class="rating-count">{{ product.rating.count }} reviews</span>
          <span class="bought-count">{{ product.rating.bought }}</span>
        </div>
        
        <div class="product-price">
          <span class="current-price">₹{{ product.price }}</span>
        </div>
        
        <div class="product-description">
          <h3>Description</h3>
          <p>{{ product.description }}</p>
        </div>
        
        <div class="product-actions">
          <div class="quantity-selector">
            
          </div>
          
          <button @click="addToCart" class="add-to-cart-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Add to Cart
          </button>
          
          <button @click="buyNow" class="buy-now-btn">
            Buy Now
          </button>
        </div>
        
        <div class="product-category">
          <span>Category:</span>
          <span>{{ product.category }}</span>
        </div>
      </div>
    </div>
    
    <div v-else class="not-found">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 8V12" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 16H12.01" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h3>Product not found</h3>
      <p>The product you're looking for doesn't exist or may have been removed</p>
      <router-link to="/products" class="back-to-products">Back to Products</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ProductView',
  data() {
    return {
      product: null,
      loading: true,
      quantity: 1,
      defaultImage: 'https://via.placeholder.com/500x500?text=Product+Image'
    };
  },
  async created() {
    await this.fetchProduct();
  },
  methods: {
    ...mapActions(['addItemToCart']),
    async fetchProduct() {
      try {
        const productId = parseInt(this.$route.params.id);
        const response = await import('@/assets/products.json');
        const products = response.default || response;
        this.product = products.find(p => p.id === productId);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        this.loading = false;
      }
    },
    handleImageError(event) {
      event.target.src = this.defaultImage;
    },
    increaseQuantity() {
      this.quantity += 1;
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity -= 1;
      }
    },
    addToCart() {
      this.addItemToCart({
        ...this.product,
        quantity: this.quantity
      });
      // No toast notification - just silently add to cart
    },
    buyNow() {
      this.addToCart(); // Add to cart first
      this.$router.push('/cart'); // Then redirect to cart page
    }
  }
};
</script>


<style scoped>
.product-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 120px);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #6a1b9a;
  font-weight: 500;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  color: #7b1fa2;
  transform: translateX(-3px);
}

.back-btn svg {
  transition: transform 0.2s ease;
}

.back-btn:hover svg {
  transform: translateX(-3px);
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(106, 27, 154, 0.1);
  border-radius: 50%;
  border-top-color: #6a1b9a;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.product-gallery {
  position: sticky;
  top: 2rem;
}

.main-image {
  background-color: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.main-image img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

.product-details {
  padding: 1rem 0;
}

.product-badge {
  display: inline-block;
  background-color: #ff5722;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.product-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stars {
  display: flex;
}

.stars span {
  color: #e2e8f0;
  font-size: 1rem;
}

.stars .filled {
  color: #ffc107;
}

.rating-count,
.bought-count {
  font-size: 0.9rem;
  color: #718096;
}

.product-price {
  margin-bottom: 2rem;
}

.current-price {
  font-size: 1.75rem;
  font-weight: 700;
  color: #6a1b9a;
}

.product-description {
  margin-bottom: 2rem;
}

.product-description h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.product-description p {
  color: #4a5568;
  line-height: 1.6;
}

.product-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
}

.quantity-btn {
  width: 36px;
  height: 36px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  font-weight: 500;
}

.quantity-btn:hover {
  background-color: #edf2f7;
  border-color: #cbd5e0;
}

.add-to-cart-btn,
.buy-now-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.add-to-cart-btn {
  background-color: #6a1b9a;
  color: white;
  border: none;
}

.add-to-cart-btn:hover {
  background-color: #7b1fa2;
}

.buy-now-btn {
  background-color: #ff5722;
  color: white;
  border: none;
}

.buy-now-btn:hover {
  background-color: #f4511e;
}

.product-category {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.product-category span:first-child {
  font-weight: 500;
}

.not-found {
  text-align: center;
  padding: 4rem 0;
  color: #4a5568;
}

.not-found svg {
  margin-bottom: 1.5rem;
}

.not-found h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.not-found p {
  margin-bottom: 1.5rem;
}

.back-to-products {
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

.back-to-products:hover {
  background-color: #7b1fa2;
}

@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .product-gallery {
    position: static;
  }
  
  .product-actions {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .quantity-selector {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .add-to-cart-btn,
  .buy-now-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .product-title {
    font-size: 1.5rem;
  }
  
  .current-price {
    font-size: 1.5rem;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .add-to-cart-btn,
  .buy-now-btn {
    width: 100%;
  }
  
  .quantity-selector {
    margin-bottom: 1rem;
  }
}
</style>