<template>
  <div class="product-list">
    <!-- Hero Banner -->
    <section class="hero-banner">
      <div class="hero-content">
        <h1>Premium Healthcare Products</h1>
        <p>Discover our carefully curated selection of health and wellness products</p>
      </div>
    </section>

    <!-- Product Filters -->
    <div class="filters-container">
      <div class="filters">
        <div class="filter-group">
          <label for="category-filter">Category:</label>
          <select id="category-filter" v-model="selectedCategory" @change="filterProducts">
            <option value="all">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="sort-filter">Sort by:</label>
          <select id="sort-filter" v-model="sortBy" @change="sortProducts">
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
        
        <div class="search-group">
          <input 
            type="text" 
            placeholder="Search products..." 
            v-model="searchQuery" 
            @input="searchProducts"
          >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="container">
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
      </div>
      
      <div v-else-if="filteredProducts.length === 0" class="no-results">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 8V12" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 16H12.01" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>No products found</h3>
        <p>Try adjusting your search or filter criteria</p>
        <button @click="resetFilters" class="reset-btn">Reset Filters</button>
      </div>
      
      <div v-else class="product-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id" 
          class="product-card"
        >
          <div class="product-badge" v-if="product.rating.rate >= 4.5">BESTSELLER</div>
          <div class="product-image-container">
            <img 
              :src="product.image" 
              :alt="product.title" 
              class="product-image"
              @error="handleImageError"
            >
          </div>
          <div class="product-info">
            <h3 class="product-title">{{ product.title }}</h3>
            <p class="product-description">{{ truncateDescription(product.description) }}</p>
            
            <div class="product-rating">
              <div class="stars">
                <span 
                  v-for="star in 5" 
                  :key="star" 
                  :class="{ 'filled': star <= Math.round(product.rating.rate) }"
                >★</span>
              </div>
              <span class="rating-count">{{ product.rating.bought }}</span>
            </div>
            
            <div class="product-price">
              <span class="current-price">₹{{ product.price }}</span>
            </div>
            
            <div class="product-actions">
              <router-link 
                :to="`/products/${product.id}`" 
                class="view-btn"
              >
                View Details
              </router-link>
              <button 
                @click="addToCart(product)" 
                class="add-to-cart-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="filteredProducts.length > 0" class="pagination">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
    
     </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ProductList',
  data() {
    return {
      products: [],
      filteredProducts: [],
      loading: true,
      selectedCategory: 'all',
      sortBy: 'default',
      searchQuery: '',
      categories: [],
      currentPage: 1,
      itemsPerPage: 12,
      isCartOpen: false,
      defaultImage: 'https://via.placeholder.com/300x200?text=Product'
    };
  },
  computed: {
    ...mapState(['cartItems']),
    cartItemCount() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    cartSubtotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    }
  },
  async created() {
    await this.loadProducts();
    this.extractCategories();
    this.filterProducts();
    this.loading = false;
  },
  methods: {
    ...mapActions(['addItemToCart', 'removeItemFromCart', 'updateItemQuantity']),
    async loadProducts() {
      try {
        const response = await import('@/assets/products.json');
        this.products = response.default || response;
        this.filteredProducts = [...this.products];
      } catch (error) {
        console.error('Error loading products:', error);
        this.products = [];
        this.filteredProducts = [];
      }
    },
    extractCategories() {
      const uniqueCategories = new Set();
      this.products.forEach(product => {
        uniqueCategories.add(product.category);
      });
      this.categories = Array.from(uniqueCategories).sort();
    },
    filterProducts() {
      let filtered = [...this.products];
      
      // Filter by category
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(product => 
          product.category === this.selectedCategory
        );
      }
      
      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(product => 
          product.title.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
        );
      }
      
      this.filteredProducts = filtered;
      this.currentPage = 1; // Reset to first page when filters change
      this.sortProducts();
    },
    sortProducts() {
      switch (this.sortBy) {
        case 'price-low':
          this.filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          this.filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          this.filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
          break;
        case 'popularity':
          // Extract number from "X bought in last 30 days" string
          this.filteredProducts.sort((a, b) => {
            const aBought = parseInt(a.rating.bought.replace(/\D/g, ''));
            const bBought = parseInt(b.rating.bought.replace(/\D/g, ''));
            return bBought - aBought;
          });
          break;
        default:
          // Default sorting (original order)
          break;
      }
    },
    searchProducts() {
      this.filterProducts();
    },
    resetFilters() {
      this.selectedCategory = 'all';
      this.sortBy = 'default';
      this.searchQuery = '';
      this.filterProducts();
    },
    truncateDescription(desc) {
      return desc.length > 80 ? desc.substring(0, 80) + '...' : desc;
    },
    handleImageError(event) {
      event.target.src = this.defaultImage;
    },
    addToCart(product) {
      this.addItemToCart({ ...product, quantity: 1 });
      this.isCartOpen = true;
    },
    removeFromCart(item) {
      this.removeItemFromCart(item);
    },
    increaseQuantity(item) {
      this.updateItemQuantity({ item, newQuantity: item.quantity + 1 });
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        this.updateItemQuantity({ item, newQuantity: item.quantity - 1 });
      } else {
        this.removeFromCart(item);
      }
    },
    toggleCart() {
      this.isCartOpen = !this.isCartOpen;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }
};
</script>

<style scoped>
.product-list {
  font-family: 'Inter', sans-serif;
  color: #2d3748;
  background-color: #f8fafc;
  min-height: 100vh;
  padding-bottom: 4rem;
}

/* Hero Banner */
.hero-banner {
  color: rgb(0, 0, 0);
  padding: 5rem;
  margin-top:2.5rem;
  text-align: center;
}

.hero-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 700px;
  margin: auto;
}

/* Filters */
.filters-container {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.filters {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #4a5568;
}

.filter-group select {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: white;
  font-size: 0.95rem;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-group select:hover {
  border-color: #cbd5e0;
}

.filter-group select:focus {
  outline: none;
  border-color: #6a1b9a;
  box-shadow: 0 0 0 2px rgba(106, 27, 154, 0.2);
}

.search-group {
  position: relative;
  flex: 1;
  max-width: 300px;
  margin-left: auto;
}

.search-group input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #2d3748;
  transition: all 0.2s ease;
}

.search-group input:hover {
  border-color: #cbd5e0;
}

.search-group input:focus {
  outline: none;
  border-color: #6a1b9a;
  box-shadow: 0 0 0 2px rgba(106, 27, 154, 0.2);
}

.search-group svg {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Loading Spinner */
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

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 0;
  color: #4a5568;
}

.no-results svg {
  margin-bottom: 1.5rem;
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.no-results p {
  margin-bottom: 1.5rem;
}

.reset-btn {
  padding: 0.75rem 1.5rem;
  background-color: #6a1b9a;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background-color: #7b1fa2;
  transform: translateY(-1px);
}

/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.product-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: #ff5722;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1;
}

.product-image-container {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  padding: 1.5rem;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #2d3748;
}

.product-description {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
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

.product-price {
  margin-bottom: 1.5rem;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #6a1b9a;
}

.product-actions {
  display: flex;
  gap: 0.75rem;
}

.view-btn, .add-to-cart-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.view-btn {
  background-color: transparent;
  border: 1px solid #6a1b9a;
  color: #6a1b9a;
}

.view-btn:hover {
  background-color: rgba(106, 27, 154, 0.1);
}

.add-to-cart-btn {
  background-color: #6a1b9a;
  color: white;
  border: none;
}

.add-to-cart-btn:hover {
  background-color: #7b1fa2;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin: 3rem 0;
}

.pagination-btn {
  padding: 0.5rem 1.25rem;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f8fafc;
  border-color: #cbd5e0;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: #4a5568;
}

/* Cart Sidebar */
.cart-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background-color: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.cart-open {
  right: 0;
}

.cart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.close-cart {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s ease;
}

.close-cart:hover {
  color: #2d3748;
  transform: rotate(90deg);
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.empty-cart p {
  font-size: 1.1rem;
  color: #4a5568;
  margin: 1.5rem 0;
}

.continue-shopping {
  padding: 0.75rem 1.5rem;
  background-color: #6a1b9a;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.continue-shopping:hover {
  background-color: #7b1fa2;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 6px;
  background-color: #f8fafc;
}

.cart-item-details {
  flex: 1;
}

.cart-item-details h4 {
  font-size: 0.95rem;
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.cart-item-price {
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.cart-item-total {
  font-size: 0.95rem;
  font-weight: 600;
  color: #6a1b9a;
}

.cart-item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.quantity-btn {
  width: 24px;
  height: 24px;
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
}

.remove-btn {
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  padding: 0.25rem;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  transform: scale(1.1);
}

.cart-summary {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.summary-row.total {
  font-weight: 600;
  font-size: 1.1rem;
  margin: 1.5rem 0;
  color: #2d3748;
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
}

.checkout-btn:hover {
  background-color: #7b1fa2;
}

/* Cart Toggle Button */
.cart-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background-color: #6a1b9a;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(106, 27, 154, 0.3);
  transition: all 0.3s ease;
  z-index: 999;
}

.cart-toggle:hover {
  background-color: #7b1fa2;
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(106, 27, 154, 0.4);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff5722;
  color: white;
  min-width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0 4px;
}



/* Responsive */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .search-group {
    max-width: 100%;
    margin-left: 0;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  
  .cart-sidebar {
    width: 100%;
    right: -100%;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .pagination {
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.8rem;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .view-btn, 
  .add-to-cart-btn {
    width: 100%;
  }
  
  .filters {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .search-group {
    max-width: 100%;
  }
}
</style>