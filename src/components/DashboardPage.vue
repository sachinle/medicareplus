<template>
  <div class="dashboard">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Welcome to MediCare+, {{ userName }}</h1>
        <p class="subtitle">Your trusted healthcare solutions provider</p>
        <div class="cta-buttons">
          <router-link to="/products" class="cta-button primary">Explore Products</router-link>
          <router-link to="/about" class="cta-button secondary">Learn About Us</router-link>
        </div>
      </div>
      <div class="hero-animation">
        <div class="floating-elements">
          <div class="pill"></div>
          <div class="capsule"></div>
          <div class="tablet"></div>
        </div>
      </div>
    </section>

    <!-- Featured Products Carousel -->
    <section class="featured-products">
      <h2>Our Premium Healthcare Products</h2>
      <div class="carousel">
        <div class="carousel-track">
          <div class="carousel-item" v-for="(product, index) in products" :key="index">
            <div class="product-card">
              <div class="product-image" :style="{ backgroundImage: `url(${product.image})` }"></div>
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <router-link to="/products" class="product-button">View Details</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="carousel-controls">
        <button @click="prevSlide" class="carousel-arrow left">←</button>
        <button @click="nextSlide" class="carousel-arrow right">→</button>
      </div>
    </section>

    <!-- About Us Section -->
    <section class="about-section">
      <div class="about-content">
        <h2>About MediCare+</h2>
        <p>We are a leading provider of innovative healthcare solutions, committed to improving lives through cutting-edge medical products and services.</p>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ yearsInBusiness }}</div>
            <div class="stat-label">Years in Business</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ totalProducts }}</div>
            <div class="stat-label">Products</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ happyClients }}</div>
            <div class="stat-label">Happy Clients</div>
          </div>
        </div>
      </div>
      <div class="about-image">
        <div class="floating-dna"></div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <h2>Ready to Transform Your Healthcare Experience?</h2>
      <router-link to="/products" class="cta-button large">Start Shopping Now</router-link>
    </section>

    <!-- Footer -->
    <footer class="main-footer">
      <div class="footer-content">
        <div class="footer-logo">
          <h3>MediCare+</h3>
          <p>Innovating Healthcare Solutions</p>
        </div>
        <div class="footer-links">
          <div class="link-column">
            <h4>Products</h4>
            <router-link to="/products/pharmaceuticals">Pharmaceuticals</router-link>
            <router-link to="/products/equipment">Medical Equipment</router-link>
            <router-link to="/products/supplies">Supplies</router-link>
          </div>
          <div class="link-column">
            <h4>Company</h4>
            <router-link to="/about">About Us</router-link>
            <router-link to="/careers">Careers</router-link>
            <router-link to="/contact">Contact</router-link>
          </div>
          <div class="link-column">
            <h4>Resources</h4>
            <router-link to="/blog">Blog</router-link>
            <router-link to="/support">Support</router-link>
            <router-link to="/faq">FAQ</router-link>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} MediCare+. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>


<script>
export default {
  data() {
    return {
      userName: '',
      yearsInBusiness: 0,
      totalProducts: 0,
      happyClients: 0,
      products: [], // Now empty - will be loaded from JSON
      currentSlide: 0,
      isLoading: false,
      error: null
    }
  },
  async created() {
    const user = JSON.parse(localStorage.getItem('firebaseUser'));
    if (user) {
      this.userName = user.displayName || user.email;
    }
    
    await this.loadProducts();
    this.animateCounters();
  },
  methods: {
    async loadProducts() {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Import products from assets
        const response = await import('@/assets/products.json');
        this.products = response.default || response;
        
        // Update totalProducts counter to match loaded count
        this.totalProducts = this.products.length;
      } catch (err) {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        // Fallback to default products
        this.products = [
          {
            name: 'Default Product',
            description: 'Product description',
            image: 'https://via.placeholder.com/300x200?text=Product'
          }
        ];
      } finally {
        this.isLoading = false;
        // Ensure carousel updates after products load
        this.$nextTick(() => {
          this.updateCarousel();
        });
      }
    },
    animateCounters() {
      // Simple counter animation without GSAP
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        this.yearsInBusiness = Math.floor(progress * 15);
        // Use actual product count instead of hardcoded 87
        this.happyClients = Math.floor(progress * 1243);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    },
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.products.length;
      this.updateCarousel();
    },
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.products.length) % this.products.length;
      this.updateCarousel();
    },
    updateCarousel() {
      const track = document.querySelector('.carousel-track');
      if (track) {
        const itemWidth = document.querySelector('.carousel-item')?.offsetWidth || 300;
        const offset = -this.currentSlide * itemWidth;
        track.style.transform = `translateX(${offset}px)`;
      }
    }
  },
  mounted() {
    this.updateCarousel();
    
    // Simple floating animation without GSAP
    const floatingElements = document.querySelectorAll('.pill, .capsule, .tablet');
    floatingElements.forEach((el, index) => {
      const duration = 3000 + (index * 500); // 3s, 3.5s, 4s
      const amplitude = 15 + (index * 5); // 15px, 20px, 25px
      
      const animate = () => {
        const now = Date.now();
        const y = Math.sin(now / duration) * amplitude;
        el.style.transform = `translateY(${y}px)`;
        requestAnimationFrame(animate);
      };
      
      animate();
    });
    
    // Simple DNA rotation animation
    const dna = document.querySelector('.floating-dna');
    if (dna) {
      const animateRotation = () => {
        const now = Date.now();
        const rotation = (now / 20000) * 360; // 20s for full rotation
        dna.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        requestAnimationFrame(animateRotation);
      };
      animateRotation();
    }
  }
}
</script>


<style scoped>
/* Base Styles */
.dashboard {
  font-family: 'Inter', sans-serif;
  color: #2d3748;
  overflow-x: hidden;
}

/* Hero Section */
.hero {
  display: flex;
  min-height: 90vh;
  align-items: center;
  padding: 0 5%;
  background: linear-gradient(135deg, #f0f4ff 0%, #e2e8f0 100%);
  position: relative;
}

.hero-content {
  flex: 1;
  max-width: 600px;
  z-index: 2;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #512da8 0%, #5e35b1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 2.5rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
}

.cta-button {
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background-color: #512da8;
  color: white;
  box-shadow: 0 4px 15px rgba(81, 45, 168, 0.3);
}

.cta-button.primary:hover {
  background-color: #5e35b1;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(81, 45, 168, 0.4);
}

.cta-button.secondary {
  background-color: transparent;
  color: #512da8;
  border: 2px solid #512da8;
}

.cta-button.secondary:hover {
  background-color: rgba(81, 45, 168, 0.1);
}

.hero-animation {
  flex: 1;
  position: relative;
  height: 100%;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.pill, .capsule, .tablet {
  position: absolute;
  border-radius: 50px;
  background: linear-gradient(135deg, rgba(81, 45, 168, 0.1) 0%, rgba(94, 53, 177, 0.2) 100%);
}

.pill {
  width: 100px;
  height: 40px;
  top: 30%;
  right: 20%;
}

.capsule {
  width: 120px;
  height: 50px;
  top: 50%;
  right: 30%;
  border-radius: 60px;
}

.tablet {
  width: 80px;
  height: 100px;
  top: 70%;
  right: 15%;
  border-radius: 15px;
}

/* Featured Products */
.featured-products {
  padding: 5rem 5%;
  text-align: center;
  background-color: white;
}

.featured-products h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2d3748;
}

.carousel {
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  max-width: 1200px;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
  gap: 2rem;
}

.carousel-item {
  min-width: calc(33.333% - 1.33rem);
  padding: 1rem;
}

.product-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-10px);
}

.product-image {
  height: 200px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 1.5rem;
  background-color: #ffffff;
  border-radius: 10px;
}

.product-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.product-card p {
  color: #718096;
  margin-bottom: 1.5rem;
}

.product-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #512da8;
  color: white;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.product-button:hover {
  background-color: #5e35b1;
}

.carousel-controls {
  margin-top: 2rem;
}

.carousel-arrow {
  background: none;
  border: none;
  font-size: 2rem;
  color: #512da8;
  cursor: pointer;
  margin: 0 1rem;
  transition: color 0.3s ease;
}

.carousel-arrow:hover {
  color: #5e35b1;
}

/* About Section */
.about-section {
  display: flex;
  padding: 5rem 5%;
  background: linear-gradient(135deg, #f0f4ff 0%, #e2e8f0 100%);
  align-items: center;
}

.about-content {
  flex: 1;
  max-width: 600px;
}

.about-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
}

.about-section p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 2.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #512da8;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #718096;
  font-weight: 500;
}

.about-image {
  flex: 1;
  position: relative;
  height: 400px;
}

.floating-dna {
  position: absolute;
  width: 300px;
  height: 300px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,10 C60,20 40,30 50,40 C60,50 40,60 50,70 C60,80 40,90 50,90" stroke="%23512da8" stroke-width="2" fill="none"/><path d="M50,10 C40,20 60,30 50,40 C40,50 60,60 50,70 C40,80 60,90 50,90" stroke="%23512da8" stroke-width="2" fill="none"/></svg>') no-repeat center;
  background-size: contain;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* CTA Section */
.cta-section {
  padding: 5rem 5%;
  text-align: center;
  background-color: white;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2d3748;
}

.cta-button.large {
  padding: 1.25rem 3rem;
  font-size: 1.25rem;
}

/* Footer */
.main-footer {
  background-color: #2d3748;
  color: white;
  padding: 4rem 5% 2rem;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-logo {
  flex: 1;
  min-width: 250px;
}

.footer-logo h3 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.footer-logo p {
  color: #a0aec0;
}

.footer-links {
  flex: 2;
  display: flex;
  gap: 3rem;
}

.link-column {
  flex: 1;
}

.link-column h4 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.link-column a {
  display: block;
  color: #a0aec0;
  margin-bottom: 0.75rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-column a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #4a5568;
  color: #a0aec0;
}

/* Responsive */
@media (max-width: 1024px) {
  .carousel-item {
    min-width: calc(50% - 1rem);
  }
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding-top: 5rem;
  }
  
  .hero-content {
    margin-bottom: 3rem;
  }
  
  .cta-buttons {
    justify-content: center;
  }
  
  .about-section {
    flex-direction: column;
  }
  
  .about-content {
    margin-bottom: 3rem;
  }
  
  .carousel-item {
    min-width: 100%;
  }
  
  .footer-links {
    flex-wrap: wrap;
  }
  
  .link-column {
    min-width: 150px;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.25rem;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>