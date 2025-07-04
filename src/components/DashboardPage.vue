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
          <div class="syringe"></div>
          <div class="molecule"></div>
        </div>
      </div>
    </section>

    <!-- Featured Products Carousel -->
    <section class="featured-products">
      <h2>Our Premium Healthcare Products</h2>
      <p class="section-description">Discover our cutting-edge medical solutions designed to improve patient outcomes</p>
      <div class="carousel">
        <div class="carousel-track">
          <div class="carousel-item" v-for="(product, index) in products" :key="index">
            <div class="product-card">
              <div class="product-badge" v-if="product.isNew">New</div>
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
        <div class="carousel-dots">
          <button v-for="i in products.length" :key="i" 
                  @click="goToSlide(i-1)"
                  :class="['dot', currentSlide === i-1 ? 'active' : '']"></button>
        </div>
        <button @click="nextSlide" class="carousel-arrow right">→</button>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services-section">
      <div class="section-header">
        <h2>Our Comprehensive Services</h2>
        <p class="section-description">Beyond products, we offer complete healthcare solutions</p>
      </div>
      <div class="services-grid">
        <div class="service-card" v-for="(service, index) in services" :key="index">
          <div class="service-icon" :class="service.iconClass"></div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
          <router-link :to="service.link" class="service-link">Learn more →</router-link>
        </div>
      </div>
    </section>

    <!-- About Us Section -->
    <section class="about-section">
      <div class="about-content">
        <h2>About MediCare+</h2>
        <p>We are a leading provider of innovative healthcare solutions, committed to improving lives through cutting-edge medical products and services. Our team of experts works tirelessly to bring you the latest advancements in medical technology.</p>
        <div class="stats-grid">
          <div class="stat-item" v-for="(stat, index) in stats" :key="index">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
        <router-link to="/about" class="about-button">Our Story</router-link>
      </div>
      <div class="about-image">
        <div class="floating-dna"></div>
        <div class="floating-cells"></div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="section-header">
        <h2>What Our Clients Say</h2>
        <p class="section-description">Trusted by healthcare professionals worldwide</p>
      </div>
      <div class="testimonials-carousel">
        <div class="testimonial" v-for="(testimonial, index) in testimonials" :key="index"
             :class="{ active: currentTestimonial === index }">
          <div class="testimonial-content">
            <div class="quote-icon">“</div>
            <p class="testimonial-text">{{ testimonial.text }}</p>
            <div class="testimonial-author">
              <div class="author-image" :style="{ backgroundImage: `url(${testimonial.image})` }"></div>
              <div class="author-info">
                <h4>{{ testimonial.name }}</h4>
                <p class="author-title">{{ testimonial.title }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="testimonial-controls">
          <button v-for="(t, i) in testimonials" :key="i" 
                  @click="currentTestimonial = i"
                  :class="['testimonial-dot', currentTestimonial === i ? 'active' : '']"></button>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to Transform Your Healthcare Experience?</h2>
        <p>Join thousands of healthcare professionals who trust MediCare+ for their medical solutions</p>
        <div class="cta-buttons">
          <router-link to="/products" class="cta-button large primary">Start Shopping Now</router-link>
          <router-link to="/contact" class="cta-button large secondary">Contact Our Team</router-link>
        </div>
      </div>
      <div class="cta-particles"></div>
    </section>

    <!-- Footer -->
    <footer class="main-footer">
      <div class="footer-content">
        <div class="footer-logo">
          <h3>MediCare+</h3>
          <p>Innovating Healthcare Solutions</p>
          <div class="social-links">
            <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
        <div class="footer-links">
          <div class="link-column">
            <h4>Products</h4>
            <router-link to="/products/pharmaceuticals">Pharmaceuticals</router-link>
            <router-link to="/products/equipment">Medical Equipment</router-link>
            <router-link to="/products/supplies">Supplies</router-link>
            <router-link to="/products/new">New Arrivals</router-link>
          </div>
          <div class="link-column">
            <h4>Company</h4>
            <router-link to="/about">About Us</router-link>
            <router-link to="/careers">Careers</router-link>
            <router-link to="/contact">Contact</router-link>
            <router-link to="/press">Press</router-link>
          </div>
          <div class="link-column">
            <h4>Resources</h4>
            <router-link to="/blog">Blog</router-link>
            <router-link to="/support">Support</router-link>
            <router-link to="/faq">FAQ</router-link>
            <router-link to="/research">Research</router-link>
          </div>
          <div class="link-column">
            <h4>Legal</h4>
            <router-link to="/privacy">Privacy Policy</router-link>
            <router-link to="/terms">Terms of Service</router-link>
            <router-link to="/cookies">Cookie Policy</router-link>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} MediCare+. All rights reserved to Sachin Leo.</p>
        <div class="footer-payment-methods">
          <i class="fab fa-cc-visa"></i>
          <i class="fab fa-cc-mastercard"></i>
          <i class="fab fa-cc-amex"></i>
          <i class="fab fa-cc-paypal"></i>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: '',
      stats: [
        { value: 0, label: 'Years in Business', target: 15 },
        { value: 0, label: 'Products', target: 0 },
        { value: 0, label: 'Happy Clients', target: 1243 },
        { value: 0, label: 'Countries Served', target: 42 }
      ],
      products: [],
      services: [
        {
          title: 'Product Training',
          description: 'Comprehensive training programs for your staff on our products',
          iconClass: 'icon-training',
          link: '/services/training'
        },
        {
          title: 'Installation',
          description: 'Professional installation of medical equipment by certified technicians',
          iconClass: 'icon-installation',
          link: '/services/installation'
        },
        {
          title: 'Maintenance',
          description: 'Regular maintenance and calibration services to ensure optimal performance',
          iconClass: 'icon-maintenance',
          link: '/services/maintenance'
        },
        {
          title: '24/7 Support',
          description: 'Round-the-clock technical support for all our products',
          iconClass: 'icon-support',
          link: '/services/support'
        }
      ],
      testimonials: [
        {
          text: "MediCare+ has transformed our clinic's capabilities. Their equipment is reliable and their support team is exceptional.",
          name: "Dr. Sarah Johnson",
          title: "Chief Medical Officer, City Medical Center",
          image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
          text: "The training we received from MediCare+ was comprehensive and tailored to our needs. Our staff was operational within days.",
          name: "Michael Chen",
          title: "Hospital Administrator, Regional General",
          image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
          text: "Their innovative pharmaceutical solutions have improved patient outcomes in our practice significantly.",
          name: "Dr. Amina Diallo",
          title: "Pediatric Specialist, Children's Health Network",
          image: "https://randomuser.me/api/portraits/women/63.jpg"
        }
      ],
      currentSlide: 0,
      currentTestimonial: 0,
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
    this.startTestimonialRotation();
  },
  methods: {
    async loadProducts() {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Import products from assets
        const response = await import('@/assets/products.json');
        this.products = response.default || response;
        
        // Update products counter to match loaded count
        this.stats[1].target = this.products.length;
      } catch (err) {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        // Fallback to default products
        this.products = [
          {
            name: 'Advanced MRI Machine',
            description: 'High-resolution imaging with reduced scan times',
            image: 'https://via.placeholder.com/300x200?text=MRI+Machine',
            rating: 5,
            reviews: 24,
            isNew: true
          },
          {
            name: 'Portable Ultrasound',
            description: 'Compact design with professional-grade imaging',
            image: 'https://via.placeholder.com/300x200?text=Ultrasound',
            rating: 4,
            reviews: 18
          },
          {
            name: 'Digital Stethoscope',
            description: 'Amplified sound with digital recording capabilities',
            image: 'https://via.placeholder.com/300x200?text=Stethoscope',
            rating: 5,
            reviews: 32,
            isNew: true
          },
          {
            name: 'Patient Monitoring System',
            description: 'Real-time tracking of vital signs with alerts',
            image: 'https://via.placeholder.com/300x200?text=Monitoring',
            rating: 4,
            reviews: 15
          },
          {
            name: 'Surgical Instrument Set',
            description: 'Premium quality instruments for precise procedures',
            image: 'https://via.placeholder.com/300x200?text=Instruments',
            rating: 5,
            reviews: 29
          }
        ];
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.updateCarousel();
        });
      }
    },
    animateCounters() {
      const duration = 2000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        this.stats.forEach(stat => {
          stat.value = Math.floor(progress * stat.target);
        });
        
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
    goToSlide(index) {
      this.currentSlide = index;
      this.updateCarousel();
    },
    updateCarousel() {
      const track = document.querySelector('.carousel-track');
      if (track) {
        const itemWidth = document.querySelector('.carousel-item')?.offsetWidth || 300;
        const offset = -this.currentSlide * itemWidth;
        track.style.transform = `translateX(${offset}px)`;
      }
    },
    startTestimonialRotation() {
      setInterval(() => {
        this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
      }, 5000);
    }
  },
  mounted() {
    this.updateCarousel();
    
    // Floating animations for hero elements
    const floatingElements = document.querySelectorAll('.pill, .capsule, .tablet, .syringe, .molecule');
    floatingElements.forEach((el, index) => {
      const duration = 3000 + (index * 500);
      const amplitude = 15 + (index * 5);
      const delay = index * 200;
      
      const animate = () => {
        const now = Date.now() + delay;
        const y = Math.sin(now / duration) * amplitude;
        const x = Math.cos(now / (duration * 1.3)) * (amplitude / 2);
        el.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(animate);
      };
      
      animate();
    });
    
    // DNA rotation animation
    const dna = document.querySelector('.floating-dna');
    if (dna) {
      const animateRotation = () => {
        const now = Date.now();
        const rotation = (now / 20000) * 360;
        dna.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        requestAnimationFrame(animateRotation);
      };
      animateRotation();
    }
    
    // Floating cells animation
    const cells = document.querySelector('.floating-cells');
    if (cells) {
      const animateCells = () => {
        const now = Date.now();
        const scale = 1 + Math.sin(now / 3000) * 0.1;
        cells.style.transform = `translate(-50%, -50%) scale(${scale})`;
        requestAnimationFrame(animateCells);
      };
      animateCells();
    }
    
    // Particle animation for CTA section
    const ctaParticles = document.querySelector('.cta-particles');
    if (ctaParticles) {
      // Create particles
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${5 + Math.random() * 10}px`;
        particle.style.height = particle.style.width;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        ctaParticles.appendChild(particle);
      }
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
  line-height: 1.6;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-description {
  color: #718096;
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 2rem;
}

/* Hero Section */
.hero {
  display: flex;
  min-height: 90vh;
  align-items: center;
  padding: 0 5%;
  background: linear-gradient(135deg, #f0f4ff 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
}

.hero-content {
  flex: 1;
  max-width: 600px;
  z-index: 2;
  animation: fadeInUp 1s ease-out;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #512da8 0%, #5e35b1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 2.5rem;
  animation: fadeInUp 1s ease-out 0.2s both;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  animation: fadeInUp 1s ease-out 0.4s both;
}

.cta-button {
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
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

.cta-button.large {
  padding: 1.25rem 3rem;
  font-size: 1.25rem;
}

.hero-animation {
  flex: 1;
  position: relative;
  height: 100%;
  min-height: 500px;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.pill, .capsule, .tablet, .syringe, .molecule {
  position: absolute;
  background: linear-gradient(135deg, rgba(81, 45, 168, 0.1) 0%, rgba(94, 53, 177, 0.2) 100%);
  transition: transform 0.5s ease-out;
}

.pill {
  width: 100px;
  height: 40px;
  top: 30%;
  right: 20%;
  border-radius: 50px;
  box-shadow: 0 5px 15px rgba(81, 45, 168, 0.1);
}

.capsule {
  width: 120px;
  height: 50px;
  top: 50%;
  right: 30%;
  border-radius: 60px;
  box-shadow: 0 5px 15px rgba(81, 45, 168, 0.1);
}

.tablet {
  width: 80px;
  height: 100px;
  top: 70%;
  right: 15%;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(81, 45, 168, 0.1);
}

.syringe {
  width: 60px;
  height: 120px;
  top: 20%;
  right: 10%;
  border-radius: 5px 5px 50px 50px;
  box-shadow: 0 5px 15px rgba(81, 45, 168, 0.1);
}

.syringe::before {
  content: '';
  position: absolute;
  width: 30px;
  height: 60px;
  background: inherit;
  top: -60px;
  left: 15px;
  border-radius: 5px 5px 0 0;
}

.molecule {
  width: 80px;
  height: 80px;
  top: 65%;
  right: 25%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 15px rgba(81, 45, 168, 0.1);
}

.molecule::before, .molecule::after {
  content: '';
  position: absolute;
  width: 120%;
  height: 120%;
  border: 2px dashed rgba(81, 45, 168, 0.3);
  border-radius: 50%;
}

.molecule::before {
  transform: rotate(30deg);
}

.molecule::after {
  transform: rotate(60deg);
}

/* Featured Products */
.featured-products {
  padding: 5rem 5%;
  text-align: center;
  background-color: white;
  position: relative;
  overflow: hidden;
}

.featured-products h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
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
  transition: transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
  gap: 2rem;
  padding: 1rem 0;
}

.carousel-item {
  min-width: calc(33.333% - 1.33rem);
  padding: 1rem;
  transition: transform 0.3s ease;
}

.product-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.product-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #4caf50;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1;
}

.product-image {
  height: 200px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 1.5rem;
  background-color: #ffffff;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
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

.product-rating {
  margin-bottom: 1.5rem;
}

.star {
  color: #e2e8f0;
  font-size: 1.1rem;
}

.star.filled {
  color: #ffc107;
}

.rating-count {
  color: #a0aec0;
  font-size: 0.9rem;
  margin-left: 0.5rem;
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
  box-shadow: 0 5px 15px rgba(81, 45, 168, 0.3);
}

.carousel-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}

.carousel-arrow {
  background: none;
  border: none;
  font-size: 2rem;
  color: #512da8;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-arrow:hover {
  color: white;
  background-color: #5e35b1;
}

.carousel-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e2e8f0;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background-color: #512da8;
  transform: scale(1.2);
}

/* Services Section */
.services-section {
  padding: 5rem 5%;
  background-color: #f8f9fa;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.service-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.service-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.3s ease;
}

.service-card:hover .service-icon {
  transform: scale(1.1);
}

.icon-training {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23512da8"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>');
}

.icon-installation {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23512da8"><path d="M13 2.03v2.02c4.39.54 7.5 4.53 6.96 8.92-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93-.45-4.75-4.22-8.5-8.95-8.97m-2 .03c-1.95.19-3.81.94-5.33 2.2L7.1 5.74c1.12-.9 2.47-1.48 3.9-1.68v-2M4.26 5.67C2.97 7.55 2.39 9.8 2.5 12c.12 2.54 1.11 4.83 2.63 6.5l1.43-1.43C5.5 15.81 4.71 14 4.5 12c-.18-1.78.3-3.37 1.16-4.77L4.26 5.67M20.5 12c.18 1.78-.3 3.37-1.16 4.77l1.41 1.41c1.29-1.88 1.87-4.13 1.76-6.18-.12-2.54-1.11-4.83-2.63-6.5l-1.43 1.43c1.06 1.22 1.85 3.03 2.05 5.07M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg>');
}

.icon-maintenance {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23512da8"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm1.65-2.65L11.5 12.2V7h1v4.8l1.85 1.85-.7.7z"/></svg>');
}

.icon-support {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23512da8"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V8z"/></svg>');
}

.service-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.service-card p {
  color: #718096;
  margin-bottom: 1.5rem;
}

.service-link {
  color: #512da8;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.service-link:hover {
  color: #5e35b1;
  text-decoration: underline;
}

/* About Section */
.about-section {
  display: flex;
  padding: 5rem 5%;
  background: linear-gradient(135deg, #f0f4ff 0%, #e2e8f0 100%);
  align-items: center;
  position: relative;
  overflow: hidden;
}

.about-content {
  flex: 1;
  max-width: 600px;
  z-index: 2;
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
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.stat-item {
  text-align: center;
  background: white;
  padding: 1.5rem 1rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
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

.about-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #512da8;
  color: white;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.about-button:hover {
  background-color: #5e35b1;
  box-shadow: 0 5px 15px rgba(81, 45, 168, 0.3);
}

.about-image {
  flex: 1;
  position: relative;
  height: 500px;
  min-width: 400px;
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
  z-index: 1;
}

.floating-cells {
  position: absolute;
  width: 400px;
  height: 400px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="5" fill="%23512da8" opacity="0.3"/><circle cx="50" cy="30" r="7" fill="%23512da8" opacity="0.4"/><circle cx="80" cy="20" r="6" fill="%23512da8" opacity="0.3"/><circle cx="30" cy="50" r="8" fill="%23512da8" opacity="0.5"/><circle cx="60" cy="60" r="5" fill="%23512da8" opacity="0.3"/><circle cx="20" cy="80" r="7" fill="%23512da8" opacity="0.4"/><circle cx="70" cy="70" r="6" fill="%23512da8" opacity="0.3"/><circle cx="80" cy="50" r="5" fill="%23512da8" opacity="0.3"/></svg>') no-repeat center;
  background-size: contain;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

/* Testimonials Section */
.testimonials-section {
  padding: 5rem 5%;
  background-color: white;
  text-align: center;
}

.testimonials-carousel {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  min-height: 300px;
}

.testimonial {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.testimonial.active {
  opacity: 1;
  position: relative;
}

.testimonial-content {
  background: white;
  border-radius: 15px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
}

.quote-icon {
  font-size: 5rem;
  color: #e2e8f0;
  position: absolute;
  top: 0;
  left: 2rem;
  line-height: 1;
}

.testimonial-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-right: 1rem;
  border: 3px solid #f0f4ff;
}

.author-info h4 {
  margin: 0;
  color: #2d3748;
}

.author-title {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

.testimonial-controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.testimonial-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e2e8f0;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.testimonial-dot.active {
  background-color: #512da8;
  transform: scale(1.2);
}

/* CTA Section */
.cta-section {
  padding: 5rem 5%;
  text-align: center;
  background: linear-gradient(135deg, #512da8 0%, #5e35b1 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.cta-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.cta-section p {
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  
}

.cta-button {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}
.cta-button.large.secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.cta-button.large.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.cta-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.particle {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: float 15s infinite linear;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Footer */
.main-footer {
  background-color: #2d3748;
  color: white;
  padding: 4rem 5% 2rem;
  position: relative;
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
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;
  text-decoration:none;
}

.social-icon:hover {
  background-color: #512da8;
  transform: translateY(-3px);
}

.footer-links {
  flex: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
}

.link-column {
  flex: 1;
  min-width: 150px;
}

.link-column h4 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.link-column h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: #512da8;
}

.link-column a {
  display: block;
  color: #a0aec0;
  margin-bottom: 0.75rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.link-column a:hover {
  color: white;
  padding-left: 5px;
}

.footer-bottom {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #4a5568;
  color: #a0aec0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.footer-payment-methods {
  display: flex;
  gap: 1rem;
  font-size: 1.5rem;
}

.footer-payment-methods i {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.footer-payment-methods i:hover {
  opacity: 1;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .about-image {
    min-width: 300px;
  }
}

@media (max-width: 1024px) {
  .carousel-item {
    min-width: calc(50% - 1rem);
  }
  
  .about-section {
    flex-direction: column;
    text-align: center;
  }
  
  .about-content {
    margin-bottom: 3rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
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
  
  .carousel-item {
    min-width: 100%;
  }
  
  .footer-links {
    flex-wrap: wrap;
  }
  
  .link-column {
    min-width: 120px;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-button.large {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 2.2rem;
  }
  
  .subtitle {
    font-size: 1.25rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .about-image {
    min-width: 100%;
    height: 300px;
  }
  
  .testimonial-content {
    padding: 1.5rem;
  }
  
  .quote-icon {
    font-size: 3rem;
    left: 1rem;
  }
}
</style>