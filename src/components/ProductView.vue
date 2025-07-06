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
            @click="openImageModal(product.image || defaultImage)"
          >
        </div>
        
      </div>
      
      <div class="product-details">
        <div class="product-badge" v-if="product.rating.rate >= 4.5">BESTSELLER</div>
        <div class="product-badge secondary" v-if="product.discount">SAVE {{ product.discount }}%</div>
        
        <h1 class="product-title">{{ product.title }}</h1>
        
        <div class="product-brand" v-if="product.brand">
          <span>Brand:</span>
          <span>{{ product.brand }}</span>
        </div>
        
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
          <router-link to="#reviews" class="review-link">Write a review</router-link>
        </div>
        
        <div class="product-price">
          <span class="current-price">₹{{ product.price }}</span>
          <span class="original-price" v-if="product.originalPrice">₹{{ product.originalPrice }}</span>
          <span class="discount" v-if="product.discount">{{ product.discount }}% OFF</span>
        </div>
        
        <div class="tax-info">Inclusive of all taxes</div>
        
        <div class="product-offers" v-if="offers.length">
          <h3>Available offers</h3>
          <ul>
            <li v-for="(offer, index) in offers" :key="index">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#26a541" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="#26a541" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="#26a541" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ offer }}
            </li>
          </ul>
        </div>
        
        <div class="delivery-info">
          <h3>Delivery Options</h3>
          <div class="delivery-option">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 5H16C16.5304 5 17.0391 5.21071 17.4142 5.58579C17.7893 5.96086 18 6.46957 18 7V15C18 15.5304 17.7893 16.0391 17.4142 16.4142C17.0391 16.7893 16.5304 17 16 17H5C4.46957 17 3.96086 16.7893 3.58579 16.4142C3.21071 16.0391 3 15.5304 3 15V5Z" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18 7L21 4V10L18 7Z" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6.5 14.5C7.32843 14.5 8 13.8284 8 13C8 12.1716 7.32843 11.5 6.5 11.5C5.67157 11.5 5 12.1716 5 13C5 13.8284 5.67157 14.5 6.5 14.5Z" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div>
              <p>Get it by <strong>{{ deliveryDate }}</strong></p>
              <p>Standard delivery</p>
            </div>
          </div>
          <div class="delivery-option">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 8V12L15 15" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div>
              <p>Get it in 2 hours</p>
              <p>Express delivery <span class="fee">₹49 fee</span></p>
            </div>
          </div>
        </div>
        
        <div class="product-description">
          <h3>Description</h3>
          <p>{{ product.description }}</p>
          
          <div class="features" v-if="product.features && product.features.length">
            <h4>Key Features:</h4>
            <ul>
              <li v-for="(feature, index) in product.features" :key="index">{{ feature }}</li>
            </ul>
          </div>
        </div>
        
        <div class="product-actions">
          
          
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
        
        <div class="product-meta">
          <div class="product-category">
            <span>Category:</span>
            <router-link :to="'/products?category=' + product.category">{{ product.category }}</router-link>
          </div>
          <div class="product-sku" v-if="product.sku">
            <span>SKU:</span>
            <span>{{ product.sku }}</span>
          </div>
          <div class="product-stock" :class="{ 'in-stock': product.inStock, 'out-of-stock': !product.inStock }">
            <span>Availability:</span>
            <span>{{ product.inStock ? 'In Stock' : 'Out of Stock' }}</span>
          </div>
        </div>
        
        <div class="product-share">
          <span>Share:</span>
          <a href="#" class="share-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="#3b5998" xmlns="http://www.w3.org/2000/svg"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="#3b5998" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          <a href="#" class="share-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="#1da1f2" xmlns="http://www.w3.org/2000/svg"><path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.9572 14.8821 3.28445C14.0247 3.61171 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3Z" stroke="#1da1f2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          <a href="#" class="share-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="#e4405f" xmlns="http://www.w3.org/2000/svg"><path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="#e4405f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 7H19C19.5304 7 20.0391 7.21071 20.4142 7.58579C20.7893 7.96086 21 8.46957 21 9V17C21 17.5304 20.7893 18.0391 20.4142 18.4142C20.0391 18.7893 19.5304 19 19 19H17" stroke="#e4405f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 7H5C4.46957 7 3.96086 7.21071 3.58579 7.58579C3.21071 7.96086 3 8.46957 3 9V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19H7" stroke="#e4405f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
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
    
    <!-- Image Modal -->
    <div v-if="showImageModal" class="image-modal" @click.self="closeImageModal">
      <div class="modal-content">
        <button @click="closeImageModal" class="close-modal">&times;</button>
        <img :src="modalImage" :alt="product.title">
      </div>
    </div>
    
    <!-- Product Tabs Section -->
    <div v-if="product" class="product-tabs">
      <div class="tabs-header">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          :class="{ 'active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="tabs-content">
        <div v-if="activeTab === 'details'" class="tab-pane">
          <h3>Product Details</h3>
          <table class="specs-table">
            <tr v-for="(spec, index) in product.specifications" :key="index">
              <td>{{ spec.key }}</td>
              <td>{{ spec.value }}</td>
            </tr>
          </table>
        </div>
        
        <div v-if="activeTab === 'reviews'" class="tab-pane" id="reviews">
          <h3>Customer Reviews</h3>
          <div class="reviews-summary">
            <div class="overall-rating">
              <div class="rating-value">{{ product.rating.rate.toFixed(1) }}</div>
              <div class="stars">
                <span 
                  v-for="star in 5" 
                  :key="star" 
                  :class="{ 'filled': star <= Math.round(product.rating.rate) }"
                >★</span>
              </div>
              <div class="rating-count">{{ product.rating.count }} ratings</div>
            </div>
            <div class="rating-bars">
              <div v-for="n in 5" :key="n" class="rating-bar">
                <span class="star-count">{{ 6 - n }}★</span>
                <div class="bar-container">
                  <div class="bar" :style="{ width: getRatingPercentage(6 - n) + '%' }"></div>
                </div>
                <span class="percentage">{{ getRatingPercentage(6 - n) }}%</span>
              </div>
            </div>
          </div>
          
          <div class="reviews-list">
            <div class="review" v-for="review in sampleReviews" :key="review.id">
              <div class="review-header">
                <div class="reviewer">{{ review.name }}</div>
                <div class="review-date">{{ review.date }}</div>
                <div class="review-rating">
                  <span 
                    v-for="star in 5" 
                    :key="star" 
                    :class="{ 'filled': star <= review.rating }"
                  >★</span>
                </div>
              </div>
              <div class="review-title">{{ review.title }}</div>
              <div class="review-content">{{ review.content }}</div>
            </div>
          </div>
          
          <button class="load-more-reviews">Load More Reviews</button>
        </div>
        
        <div v-if="activeTab === 'faq'" class="tab-pane">
          <h3>Frequently Asked Questions</h3>
          <div class="faq-list">
            <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
              <div class="faq-question" @click="toggleFaq(index)">
                {{ faq.question }}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="faq-answer" v-if="faq.open">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Related Products -->
    <div v-if="product && relatedProducts.length" class="related-products">
      <h2>You may also like</h2>
      <div class="products-grid">
        <div 
          v-for="related in relatedProducts" 
          :key="related.id" 
          class="product-card"
          @click="$router.push(`/products/${related.id}`)"
        >
          <div class="product-badge" v-if="related.rating.rate >= 4.5">BESTSELLER</div>
          <div class="product-image">
            <img :src="related.image" :alt="related.title">
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ related.title }}</h3>
            <div class="product-rating">
              <div class="stars">
                <span 
                  v-for="star in 5" 
                  :key="star" 
                  :class="{ 'filled': star <= Math.round(related.rating.rate) }"
                >★</span>
              </div>
              <span class="rating-count">({{ related.rating.count }})</span>
            </div>
            <div class="product-price">
              <span class="current-price">₹{{ related.price }}</span>
              <span class="original-price" v-if="related.originalPrice">₹{{ related.originalPrice }}</span>
              <span class="discount" v-if="related.discount">{{ related.discount }}% OFF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AIChatbot :currentProduct="product" />
</template>

<script>
import { mapActions } from 'vuex';
import AIChatbot from './AIChatbot.vue';

export default {
  components: {
    AIChatbot
  },
  name: 'ProductView',
  data() {
    return {
      product: null,
      loading: true,
      quantity: 1,
      defaultImage: 'https://via.placeholder.com/500x500?text=Product+Image',
      showImageModal: false,
      modalImage: '',
      activeTab: 'details',
      tabs: [
        { id: 'details', label: 'Details' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'faq', label: 'FAQ' }
      ],
      faqs: [
        { 
          question: 'What are the ingredients in this product?', 
          answer: 'This product contains natural herbal extracts including Ashwagandha, Shilajit, and Safed Musli. Please check the product label for full ingredients list.',
          open: false
        },
        { 
          question: 'How should I take this product?', 
          answer: 'Take 1-2 capsules daily with water, preferably after meals or as directed by your healthcare practitioner.',
          open: false
        },
        { 
          question: 'Are there any side effects?', 
          answer: 'This product is generally well tolerated. In rare cases, some individuals may experience mild digestive discomfort. Discontinue use if any adverse reactions occur.',
          open: false
        },
        { 
          question: 'How long until I see results?', 
          answer: 'Results may vary. Some users report feeling benefits within 2-3 weeks, but optimal results are typically seen after consistent use for 2-3 months.',
          open: false
        },
        { 
          question: 'Is this product suitable for vegetarians?', 
          answer: 'Yes, this product is 100% vegetarian and contains no animal-derived ingredients.',
          open: false
        }
      ],
      sampleReviews: [
        {
          id: 1,
          name: 'Rahul Sharma',
          date: '2 weeks ago',
          rating: 5,
          title: 'Excellent product!',
          content: 'I have been using this for a month now and can already feel the difference. My energy levels have improved significantly.'
        },
        {
          id: 2,
          name: 'Priya Patel',
          date: '1 month ago',
          rating: 4,
          title: 'Good results',
          content: 'It took about 3 weeks to notice the effects but it has helped with my stress levels. Would recommend.'
        },
        {
          id: 3,
          name: 'Vikram Singh',
          date: '2 months ago',
          rating: 3,
          title: 'Average product',
          content: 'It works okay but not as effective as I hoped. Might try a different brand next time.'
        }
      ],
      offers: [
        '10% Instant Discount with HDFC Bank Credit Cards',
        'Buy 2 Get 10% Off',
        'Free Delivery on orders above ₹499',
        'Special Price Get extra 5% off'
      ]
    };
  },
  computed: {
    deliveryDate() {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      return date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
    },
    relatedProducts() {
      if (!this.product) return [];
      const response = require('@/assets/products.json');
      const products = response.default || response;
      return products
        .filter(p => p.category === this.product.category && p.id !== this.product.id)
        .slice(0, 4);
    }
  },
  async created() {
    await this.fetchProduct();
    // Simulate additional product data that might come from an API
    if (this.product) {
      this.product = {
        ...this.product,
        brand: 'HealthPlus',
        originalPrice: Math.round(this.product.price * 1.2),
        discount: 15,
        inStock: true,
        sku: 'HP' + this.product.id.toString().padStart(4, '0'),
        additionalImages: [
          'https://via.placeholder.com/500x500?text=Product+Image+1',
          'https://via.placeholder.com/500x500?text=Product+Image+2',
          'https://via.placeholder.com/500x500?text=Product+Image+3'
        ],
        features: [
          '100% natural ingredients',
          'No artificial preservatives',
          'Clinically tested formula',
          'Made in India',
          'GMP certified facility'
        ],
        specifications: [
          { key: 'Brand', value: 'HealthPlus' },
          { key: 'Manufacturer', value: 'HealthPlus Pharmaceuticals' },
          { key: 'Country of Origin', value: 'India' },
          { key: 'Item Weight', value: '120 grams' },
          { key: 'Product Dimensions', value: '5 x 5 x 10 cm' },
          { key: 'Shelf Life', value: '24 months' },
          { key: 'Dosage Form', value: 'Capsules' },
          { key: 'Net Quantity', value: '60 capsules' }
        ]
      };
    }
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
    },
    openImageModal(img) {
      this.modalImage = img;
      this.showImageModal = true;
      document.body.style.overflow = 'hidden';
    },
    closeImageModal() {
      this.showImageModal = false;
      document.body.style.overflow = 'auto';
    },
    toggleFaq(index) {
      this.faqs[index].open = !this.faqs[index].open;
    },
    getRatingPercentage(rating) {
      // Simulate rating distribution
      const distribution = {
        5: 65,
        4: 20,
        3: 10,
        2: 3,
        1: 2
      };
      return distribution[rating] || 0;
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
  margin-bottom: 1rem;
  cursor: zoom-in;
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
  margin-right: 0.5rem;
}

.product-badge.secondary {
  background-color: #26a541;
}

.product-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.product-brand {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 1rem;
}

.product-brand span:first-child {
  font-weight: 500;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
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

.review-link {
  font-size: 0.9rem;
  color: #6a1b9a;
  text-decoration: none;
}

.review-link:hover {
  text-decoration: underline;
}

.product-price {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.current-price {
  font-size: 1.75rem;
  font-weight: 700;
  color: #6a1b9a;
}

.original-price {
  font-size: 1.25rem;
  color: #718096;
  text-decoration: line-through;
}

.discount {
  font-size: 1rem;
  font-weight: 600;
  color: #26a541;
}

.tax-info {
  font-size: 0.9rem;
  color: #26a541;
  margin-bottom: 1.5rem;
}

.product-offers {
  background-color: #f8f5ff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.product-offers h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.product-offers ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-offers li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.product-offers li:last-child {
  margin-bottom: 0;
}

.delivery-info {
  margin-bottom: 2rem;
}

.delivery-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.delivery-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.delivery-option:last-child {
  border-bottom: none;
}

.delivery-option p {
  margin: 0;
  font-size: 0.9rem;
  color: #4a5568;
}

.delivery-option p strong {
  color: #2d3748;
}

.fee {
  color: #ff5722;
  font-weight: 500;
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
  margin-bottom: 1rem;
}

.features {
  margin-top: 1rem;
}

.features h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.features ul {
  list-style-position: inside;
  padding-left: 1rem;
  color: #4a5568;
  line-height: 1.6;
}

.features li {
  margin-bottom: 0.25rem;
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

.quantity {
  width: 40px;
  text-align: center;
  font-weight: 500;
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

.product-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.product-category,
.product-sku,
.product-stock {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.product-category span:first-child,
.product-sku span:first-child,
.product-stock span:first-child {
  font-weight: 500;
}

.product-category a {
  color: #6a1b9a;
  text-decoration: none;
}

.product-category a:hover {
  text-decoration: underline;
}

.product-stock.in-stock span:last-child {
  color: #26a541;
}

.product-stock.out-of-stock span:last-child {
  color: #ff5722;
}

.product-share {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.product-share span {
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
}

.share-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f8fafc;
  transition: all 0.2s ease;
}

.share-icon:hover {
  background-color: #edf2f7;
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

/* Image Modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.modal-content img {
  max-width: 100%;
  max-height: 80vh;
  display: block;
  border-radius: 8px;
}

.close-modal {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
}

/* Product Tabs */
.product-tabs {
  margin-top: 4rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 2rem;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.tabs-header button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tabs-header button:hover {
  color: #6a1b9a;
}

.tabs-header button.active {
  color: #6a1b9a;
  border-bottom-color: #6a1b9a;
}

.tab-pane {
  padding: 1rem 0;
}

.tab-pane h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table tr {
  border-bottom: 1px solid #e2e8f0;
}

.specs-table tr:last-child {
  border-bottom: none;
}

.specs-table td {
  padding: 0.75rem 0;
  vertical-align: top;
}

.specs-table td:first-child {
  font-weight: 500;
  color: #4a5568;
  width: 40%;
}

.specs-table td:last-child {
  color: #718096;
}

/* Reviews */
.reviews-summary {
  display: flex;
  gap: 3rem;
  margin-bottom: 2rem;
}

.overall-rating {
  text-align: center;
  min-width: 120px;
}

.rating-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.rating-count {
  font-size: 0.9rem;
  color: #718096;
}

.rating-bars {
  flex: 1;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.star-count {
  font-size: 0.9rem;
  color: #4a5568;
  width: 30px;
}

.bar-container {
  flex: 1;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background-color: #ffc107;
}

.percentage {
  font-size: 0.9rem;
  color: #4a5568;
  width: 40px;
  text-align: right;
}

.reviews-list {
  margin-bottom: 2rem;
}

.review {
  padding: 1.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.review:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.reviewer {
  font-weight: 600;
  color: #2d3748;
}

.review-date {
  font-size: 0.9rem;
  color: #718096;
}

.review-rating {
  display: flex;
}

.review-rating span {
  color: #e2e8f0;
  font-size: 0.9rem;
}

.review-rating .filled {
  color: #ffc107;
}

.review-title {
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.review-content {
  color: #4a5568;
  line-height: 1.6;
}

.load-more-reviews {
  padding: 0.75rem 1.5rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-weight: 500;
  color: #6a1b9a;
  cursor: pointer;
  transition: all 0.2s ease;
  display: block;
  margin: 0 auto;
}

.load-more-reviews:hover {
  background-color: #edf2f7;
  border-color: #cbd5e0;
}

/* FAQ */
.faq-list {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.faq-item {
  border-bottom: 1px solid #e2e8f0;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  padding: 1rem;
  font-weight: 500;
  color: #2d3748;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.faq-question:hover {
  background-color: #f8fafc;
}

.faq-question svg {
  transition: transform 0.2s ease;
}

.faq-question.open svg {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 1rem 1rem 1rem;
  color: #4a5568;
  line-height: 1.6;
}

/* Related Products */
.related-products {
  margin-top: 4rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 2rem;
}

.related-products h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.product-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 1;
}

.product-image {
  height: 180px;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-info {
  padding: 1rem;
}

.product-name {
  font-size: 1rem;
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8rem;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.product-rating .stars span {
  font-size: 0.8rem;
}

.rating-count {
  font-size: 0.8rem;
  color: #718096;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.product-price .current-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #6a1b9a;
}

.product-price .original-price {
  font-size: 0.9rem;
  color: #718096;
  text-decoration: line-through;
}

.product-price .discount {
  font-size: 0.8rem;
  font-weight: 600;
  color: #26a541;
}

/* Responsive */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .reviews-summary {
    flex-direction: column;
    gap: 1.5rem;
  }
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
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
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
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs-header {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 0.5rem;
  }
  
  .tabs-header::-webkit-scrollbar {
    display: none;
  }
  
  .tabs-header button {
    padding: 0.5rem 1rem;
  }
}
</style>