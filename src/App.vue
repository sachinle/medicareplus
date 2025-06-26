<template>
  <div id="app">
    <nav :class="{ 'nav-hidden': $route.path === '/login' }">
      <div class="nav-container">
        <router-link to="/" class="logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>MediCare+</span>
        </router-link>
        <div class="nav-links">
          <router-link to="/">Home</router-link>
          <router-link to="/login" v-if="!isAuthenticated">Login</router-link>
          <router-link to="/dashboard" v-if="isAuthenticated">Dashboard</router-link>
          <!-- In App.vue -->
<router-link to="/products" v-if="isAuthenticated">Products</router-link>
          <!-- In App.vue -->
<router-link to="/cart" v-if="isAuthenticated" class="cart-link">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <span class="cart-count" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
</router-link>
          <button @click="signOut" v-if="isAuthenticated" class="sign-out-btn">
            Sign Out
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { mapState } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: false
    }
  },
  computed: {
    ...mapState(['cartItems']),
    cartItemCount() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }
  },
  created() {
    this.checkAuth();
    auth.onAuthStateChanged(() => {
      this.checkAuth();
    });
  },
  watch: {
    '$route'() {
      this.checkAuth();
    }
  },
  methods: {
    checkAuth() {
      this.isAuthenticated = !!localStorage.getItem('firebaseUser');
    },
    async signOut() {
      try {
        await signOut(auth);
        this.$router.push('/');
      } catch (error) {
        console.error('Sign out error:', error);
      }
    }
  }
}
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

#app {
  min-height: 100vh;
  background-color: #f8fafc;
}

nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #6a1b9a;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
  transition: all 0.3s ease;
}

.nav-hidden {
  transform: translateY(-100%);
  opacity: 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.2rem;
  gap: 0.5rem;
}

.logo svg {
  color: rgb(245, 255, 255);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links a {
  color: #e1e4eb;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: rgb(215, 214, 218);
}

.nav-links a.router-link-exact-active {
  color: #fdfdfd;
}

.nav-links a.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #c5b4ec 0%, #5e35b1 100%);
  border-radius: 2px;
}

.sign-out-btn {
  background: none;
  border: none;
  color: #edf0f5;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.sign-out-btn:hover {
  color: rgb(243, 209, 13);
}

.sign-out-btn svg {
  transition: transform 0.3s ease;
}

.sign-out-btn:hover svg {
  transform: translateX(3px);
}

/* In App.vue style section */
.cart-link {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.5rem;
}

.cart-link svg {
  color: #e1e4eb;
  transition: color 0.3s ease;
}

.cart-link:hover svg {
  color: rgb(215, 214, 218);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff5722;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 600;
}
</style>