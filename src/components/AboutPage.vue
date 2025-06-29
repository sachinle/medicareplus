<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>About MediCare+</h1>
        <p class="subtitle">Innovating healthcare solutions since 2008</p>
        <div class="scroll-indicator">
          <span></span>
        </div>
      </div>
      <div class="hero-animation">
        <div class="floating-elements">
          <div class="molecule"></div>
          <div class="dna-helix"></div>
          <div class="cell"></div>
        </div>
      </div>
    </section>

    <!-- Our Story Section -->
    <section class="story-section">
      <div class="section-content">
        <h2 class="section-title">Our Story</h2>
        <div class="timeline">
          <div 
            class="timeline-item" 
            v-for="(milestone, index) in milestones" 
            :key="index"
            :style="{ '--delay': index * 0.1 + 's' }"
          >
            <div class="timeline-year">{{ milestone.year }}</div>
            <div class="timeline-content">
              <h3>{{ milestone.title }}</h3>
              <p>{{ milestone.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="section-header">
        <h2 class="section-title">Meet Our Leadership</h2>
        <p class="section-subtitle">Dedicated professionals driving healthcare innovation</p>
      </div>
      <div class="team-grid">
        <div 
          class="team-card" 
          v-for="(member, index) in team" 
          :key="index"
          :style="{ '--delay': index * 0.15 + 's' }"
        >
          <div class="team-image-wrapper">
            <div class="team-image" :style="{ backgroundImage: `url(${member.image})` }"></div>
            <div class="image-overlay"></div>
          </div>
          <h3>{{ member.name }}</h3>
          <p class="position">{{ member.position }}</p>
          <p class="bio">{{ member.bio }}</p>
          <div class="social-links">
            <a href="#" class="social-icon linkedin"></a>
            <a href="#" class="social-icon twitter"></a>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="section-header">
        <h2 class="section-title">Our Core Values</h2>
      </div>
      <div class="values-grid">
        <div 
          class="value-card" 
          v-for="(value, index) in values" 
          :key="index"
          :style="{ '--delay': index * 0.1 + 's' }"
        >
          <div class="value-icon-wrapper">
            <div class="value-icon" :class="`value-${index + 1}`"></div>
            <div class="icon-pulse"></div>
          </div>
          <h3>{{ value.title }}</h3>
          <p>{{ value.description }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Join Us in Revolutionizing Healthcare</h2>
        <p class="cta-subtitle">Be part of our mission to deliver exceptional healthcare solutions worldwide</p>
        <div class="cta-buttons">
          <router-link to="/careers" class="cta-button primary">Explore Careers</router-link>
          <router-link to="/contact" class="cta-button secondary">Contact Us</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      milestones: [
        {
          year: '2008',
          title: 'Foundation',
          description: 'MediCare+ was founded with a vision to make quality healthcare accessible to everyone.'
        },
        {
          year: '2012',
          title: 'First Breakthrough',
          description: 'Launched our flagship product that revolutionized cardiovascular treatment.'
        },
        {
          year: '2016',
          title: 'Global Expansion',
          description: 'Expanded operations to 3 continents with regional headquarters.'
        },
        {
          year: '2020',
          title: 'Pandemic Response',
          description: 'Developed critical treatments during global health crisis.'
        },
        {
          year: '2023',
          title: 'Current Era',
          description: 'Leading innovation in personalized medicine and AI diagnostics.'
        }
      ],
      team: [
        {
          name: 'Dr. Sarah Chen',
          position: 'CEO & Founder',
          bio: 'Board-certified physician with 20+ years in pharmaceutical research.',
          image: 'https://randomuser.me/api/portraits/women/65.jpg'
        },
        {
          name: 'James Rodriguez',
          position: 'Chief Medical Officer',
          bio: 'Former head of research at Johns Hopkins Medical Center.',
          image: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
          name: 'Priya Patel',
          position: 'Head of Innovation',
          bio: 'Biotech engineer with 15 patents in medical devices.',
          image: 'https://randomuser.me/api/portraits/women/44.jpg'
        }
      ],
      values: [
        {
          title: 'Patient First',
          description: 'Every decision starts with patient wellbeing at the center.'
        },
        {
          title: 'Scientific Excellence',
          description: 'Rigorous research and evidence-based solutions.'
        },
        {
          title: 'Ethical Integrity',
          description: 'Uncompromising standards in all we do.'
        },
        {
          title: 'Collaborative Innovation',
          description: 'Breaking silos to solve complex challenges.'
        }
      ]
    }
  },
  mounted() {
    // Enhanced floating animation with 3D effect
    const floatingElements = document.querySelectorAll('.molecule, .dna-helix, .cell');
    floatingElements.forEach((el, index) => {
      const duration = 3000 + (index * 500);
      const amplitude = 15 + (index * 5);
      const rotateAmplitude = 2 + (index * 0.5);
      
      const animate = () => {
        const now = Date.now();
        const y = Math.sin(now / duration) * amplitude;
        const rotation = Math.cos(now / (duration * 1.5)) * rotateAmplitude;
        el.style.transform = `translateY(${y}px) rotate(${rotation}deg)`;
        requestAnimationFrame(animate);
      };
      animate();
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.timeline-item, .team-card, .value-card').forEach(el => {
      observer.observe(el);
    });
  }
}
</script>

<style scoped>
/* Base Styles */
.about-page {
  font-family: 'Inter', sans-serif;
  color: #2d3748;
  overflow-x: hidden;
}

/* Section Titles */
.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  background: linear-gradient(90deg, #512da8 0%, #5e35b1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #512da8 0%, #5e35b1 100%);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #4a5568;
  max-width: 700px;
  margin: 0 auto 3rem;
}

/* Hero Section */
.hero {
  display: flex;
  min-height: 100vh;
  align-items: center;
  padding: 0 5%;
  background: linear-gradient(135deg, #f0f4ff 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(94, 53, 177, 0.1) 0%, rgba(94, 53, 177, 0) 70%);
}

.hero-content {
  flex: 1;
  max-width: 600px;
  z-index: 2;
  position: relative;
  animation: fadeInUp 0.8s ease-out;
}

.hero h1 {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  background: linear-gradient(90deg, #512da8 0%, #5e35b1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.scroll-indicator span {
  display: block;
  width: 24px;
  height: 24px;
  border-bottom: 2px solid #5e35b1;
  border-right: 2px solid #5e35b1;
  transform: rotate(45deg);
  margin: -10px;
  animation: scrollAnimation 2s infinite;
}

.scroll-indicator span:nth-child(2) {
  animation-delay: -0.2s;
}

.scroll-indicator span:nth-child(3) {
  animation-delay: -0.4s;
}

/* Science floating elements */
.molecule, .dna-helix, .cell {
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.9;
  filter: drop-shadow(0 5px 15px rgba(81, 45, 168, 0.2));
  transition: transform 0.5s ease-out;
}

.molecule {
  width: 150px;
  height: 150px;
  top: 30%;
  right: 20%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="12" fill="%23512da8"/><circle cx="20" cy="30" r="10" fill="%235e35b1"/><circle cx="80" cy="40" r="10" fill="%235e35b1"/><line x1="50" y1="50" x2="20" y2="30" stroke="%23512da8" stroke-width="3"/><line x1="50" y1="50" x2="80" y2="40" stroke="%23512da8" stroke-width="3"/></svg>');
}

.dna-helix {
  width: 180px;
  height: 180px;
  top: 50%;
  right: 30%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M30,10 C40,20 20,30 30,40 C40,50 20,60 30,70 C40,80 20,90 30,90" stroke="%23512da8" stroke-width="3" fill="none"/><path d="M70,10 C60,20 80,30 70,40 C60,50 80,60 70,70 C60,80 80,90 70,90" stroke="%23512da8" stroke-width="3" fill="none"/><line x1="30" y1="10" x2="70" y2="10" stroke="%235e35b1" stroke-width="2"/><line x1="30" y1="40" x2="70" y2="40" stroke="%235e35b1" stroke-width="2"/><line x1="30" y1="70" x2="70" y2="70" stroke="%235e35b1" stroke-width="2"/></svg>');
}

.cell {
  width: 130px;
  height: 130px;
  top: 70%;
  right: 15%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="%23512da8" stroke-width="3"/><circle cx="35" cy="40" r="7" fill="%235e35b1"/><circle cx="60" cy="35" r="9" fill="%235e35b1"/><circle cx="45" cy="65" r="8" fill="%235e35b1"/></svg>');
}

/* Timeline styles */
.timeline {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  width: 4px;
  background: linear-gradient(to bottom, #512da8, #5e35b1);
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -2px;
  border-radius: 2px;
}

.timeline-item {
  padding: 30px 50px;
  position: relative;
  width: 50%;
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition-delay: var(--delay);
}

.timeline-item.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.timeline-item:nth-child(odd) {
  left: 0;
  text-align: right;
}

.timeline-item:nth-child(even) {
  left: 50%;
}

.timeline-item::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #fff;
  border: 4px solid #5e35b1;
  border-radius: 50%;
  top: 40px;
  z-index: 1;
}

.timeline-item:nth-child(odd)::after {
  right: -12px;
}

.timeline-item:nth-child(even)::after {
  left: -12px;
}

.timeline-year {
  background-color: #512da8;
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  display: inline-block;
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(81, 45, 168, 0.3);
}

.timeline-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
}

.timeline-content::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.timeline-item:nth-child(odd) .timeline-content::before {
  border-width: 10px 0 10px 10px;
  border-color: transparent transparent transparent #ffffff;
  right: -10px;
  top: 30px;
}

.timeline-item:nth-child(even) .timeline-content::before {
  border-width: 10px 10px 10px 0;
  border-color: transparent #ffffff transparent transparent;
  left: -10px;
  top: 30px;
}

/* Team Section */
.team-section {
  padding: 100px 5%;
  background-color: #f9faff;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.team-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  opacity: 0;
  transform: translateY(30px);
  transition-delay: var(--delay);
}

.team-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.team-card:hover {
  transform: translateY(-10px) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
}

.team-image-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 2rem;
}

.team-image {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 2;
}

.image-overlay {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(135deg, #512da8 0%, #5e35b1 100%);
  border-radius: 50%;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.team-card:hover .image-overlay {
  opacity: 0.3;
}

.position {
  color: #5e35b1;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.bio {
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-size: 60%;
  background-repeat: no-repeat;
  background-position: center;
  transition: all 0.3s ease;
}

.social-icon:hover {
  transform: translateY(-3px);
}

.linkedin {
  background-color: #f0f4ff;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23512da8"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>');
}

.twitter {
  background-color: #f0f4ff;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23512da8"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>');
}

/* Values Section */
.values-section {
  padding: 100px 5%;
  background-color: white;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.value-card {
  text-align: center;
  padding: 2.5rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
  opacity: 0;
  transform: translateY(30px);
  transition-delay: var(--delay);
}

.value-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.value-card:hover {
  transform: translateY(-10px) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
}

.value-icon-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
}

.value-icon {
  width: 100%;
  height: 100%;
  margin: 0 auto 1.5rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  z-index: 2;
}

.icon-pulse {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(94, 53, 177, 0.1);
  border-radius: 50%;
  z-index: 1;
  animation: pulse 3s infinite;
  opacity: 0;
}

.value-card:hover .icon-pulse {
  opacity: 1;
}

.value-card h3 {
  margin-bottom: 1rem;
  font-size: 1.4rem;
  color: #2d3748;
}

.value-card p {
  color: #4a5568;
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  padding: 120px 5%;
  text-align: center;
  background: linear-gradient(135deg, #512da8 0%, #5e35b1 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
}

.cta-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.cta-section h2 {
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.cta-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.cta-button {
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.cta-button.primary {
  background-color: white;
  color: #512da8;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.cta-button.primary:hover {
  background-color: #f0f4ff;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.cta-button.secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.cta-button.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
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

@keyframes scrollAnimation {
  0% {
    opacity: 0;
    transform: rotate(45deg) translate(-10px, -10px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translate(10px, 10px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  70% {
    transform: scale(1.3);
    opacity: 0;
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .hero h1 {
    font-size: 3.5rem;
  }
  
  .team-grid, .values-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding-top: 100px;
    padding-bottom: 100px;
  }
  
  .hero-content {
    margin-bottom: 80px;
  }
  
  .molecule, .dna-helix, .cell {
    position: relative;
    top: auto;
    right: auto;
    margin: 20px auto;
  }
  
  .timeline::before {
    left: 31px;
  }
  
  .timeline-item {
    width: 100%;
    padding-left: 70px;
    padding-right: 25px;
    text-align: left;
  }
  
  .timeline-item:nth-child(even) {
    left: 0;
  }
  
  .timeline-item:nth-child(odd)::after,
  .timeline-item:nth-child(even)::after {
    left: 19px;
  }
  
  .timeline-item:nth-child(odd) .timeline-content::before,
  .timeline-item:nth-child(even) .timeline-content::before {
    border-width: 10px 10px 10px 0;
    border-color: transparent #ffffff transparent transparent;
    left: -10px;
    right: auto;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-button {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .team-card, .value-card {
    padding: 1.5rem;
  }
}
</style>