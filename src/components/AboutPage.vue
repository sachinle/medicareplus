<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>About MediCare+</h1>
        <p class="subtitle">Innovating healthcare solutions since 2008</p>
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
        <h2>Our Story</h2>
        <div class="timeline">
          <div class="timeline-item" v-for="(milestone, index) in milestones" :key="index">
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
        <h2>Meet Our Leadership</h2>
        <p>Dedicated professionals driving healthcare innovation</p>
      </div>
      <div class="team-grid">
        <div class="team-card" v-for="(member, index) in team" :key="index">
          <div class="team-image" :style="{ backgroundImage: `url(${member.image})` }"></div>
          <h3>{{ member.name }}</h3>
          <p class="position">{{ member.position }}</p>
          <p class="bio">{{ member.bio }}</p>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="section-header">
        <h2>Our Core Values</h2>
      </div>
      <div class="values-grid">
        <div class="value-card" v-for="(value, index) in values" :key="index">
          <div class="value-icon" :class="`value-${index + 1}`"></div>
          <h3>{{ value.title }}</h3>
          <p>{{ value.description }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <h2>Join Us in Revolutionizing Healthcare</h2>
      <div class="cta-buttons">
        <router-link to="/careers" class="cta-button primary">Explore Careers</router-link>
        <router-link to="/contact" class="cta-button secondary">Contact Us</router-link>
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
    // Floating animation for science elements
    const floatingElements = document.querySelectorAll('.molecule, .dna-helix, .cell');
    floatingElements.forEach((el, index) => {
      const duration = 3000 + (index * 500);
      const amplitude = 15 + (index * 5);
      
      const animate = () => {
        const now = Date.now();
        const y = Math.sin(now / duration) * amplitude;
        el.style.transform = `translateY(${y}px)`;
        requestAnimationFrame(animate);
      };
      animate();
    });
  }
}
</script>

<style scoped>
/* Reuse dashboard styles with some additions */
.about-page {
  font-family: 'Inter', sans-serif;
  color: #2d3748;
}

/* Hero Section - matches dashboard */
.hero {
  display: flex;
  min-height: 70vh;
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
  font-size: 3.5rem;
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

/* Science floating elements */
.molecule, .dna-helix, .cell {
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.8;
}

.molecule {
  width: 120px;
  height: 120px;
  top: 30%;
  right: 20%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="10" fill="%23512da8"/><circle cx="20" cy="30" r="8" fill="%235e35b1"/><circle cx="80" cy="40" r="8" fill="%235e35b1"/><line x1="50" y1="50" x2="20" y2="30" stroke="%23512da8" stroke-width="2"/><line x1="50" y1="50" x2="80" y2="40" stroke="%23512da8" stroke-width="2"/></svg>');
}

.dna-helix {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 30%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M30,10 C40,20 20,30 30,40 C40,50 20,60 30,70 C40,80 20,90 30,90" stroke="%23512da8" stroke-width="2" fill="none"/><path d="M70,10 C60,20 80,30 70,40 C60,50 80,60 70,70 C60,80 80,90 70,90" stroke="%23512da8" stroke-width="2" fill="none"/><line x1="30" y1="10" x2="70" y2="10" stroke="%235e35b1" stroke-width="1"/><line x1="30" y1="40" x2="70" y2="40" stroke="%235e35b1" stroke-width="1"/><line x1="30" y1="70" x2="70" y2="70" stroke="%235e35b1" stroke-width="1"/></svg>');
}

.cell {
  width: 100px;
  height: 100px;
  top: 70%;
  right: 15%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="%23512da8" stroke-width="2"/><circle cx="35" cy="40" r="5" fill="%235e35b1"/><circle cx="60" cy="35" r="7" fill="%235e35b1"/><circle cx="45" cy="65" r="6" fill="%235e35b1"/></svg>');
}

/* Timeline styles */
.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  width: 4px;
  background-color: #5e35b1;
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -2px;
}

.timeline-item {
  padding: 20px 40px;
  position: relative;
  width: 50%;
  box-sizing: border-box;
}

.timeline-item:nth-child(odd) {
  left: 0;
  text-align: right;
}

.timeline-item:nth-child(even) {
  left: 50%;
}

.timeline-year {
  background-color: #512da8;
  color: white;
  padding: 8px 16px;
  border-radius: 50px;
  display: inline-block;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Team Section */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
}

.team-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.team-card:hover {
  transform: translateY(-10px);
}

.team-image {
  height: 200px;
  width: 200px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  background-size: cover;
  background-position: center;
  border: 5px solid #f0f4ff;
}

.position {
  color: #5e35b1;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* Values Section */
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
}

.value-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.value-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.value-1 {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23512da8"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/></svg>');
}

.value-2 {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23512da8"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>');
}

.value-3 {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23512da8"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/></svg>');
}

.value-4 {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23512da8"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>');
}

/* CTA Section - matches dashboard */
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

.cta-buttons {
  display: flex;
  justify-content: center;
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

/* Responsive adjustments */
@media (max-width: 768px) {
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
  
  .hero h1 {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .cta-buttons {
    flex-direction: column;
  }
}
</style>