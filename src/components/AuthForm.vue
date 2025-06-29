<template>
  <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  <div class="container" :class="{ active: isRegisterActive }">
    <div class="form-container sign-up">
      <form @submit.prevent="handleSignUp">
        <h1>Create Account</h1>
        <div class="social-icons">
          <a href="#" class="icon"><font-awesome-icon :icon="['fab', 'google']" /></a>
          <a href="#" class="icon"><font-awesome-icon :icon="['fab', 'facebook-f']" /></a>
          <a href="#" class="icon"><font-awesome-icon :icon="['fab', 'github']" /></a>
          <a href="#" class="icon"><font-awesome-icon :icon="['fab', 'linkedin-in']" /></a>
        </div>
        <span>or use your email for registeration</span>
        <input type="text" placeholder="Name" v-model="signUpForm.name" required>
        <input type="email" placeholder="Email" v-model="signUpForm.email" required>
        <input type="password" placeholder="Password (min 6 chars)" v-model="signUpForm.password" required>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>
    </div>
    <div class="form-container sign-in">
      <form @submit.prevent="handleSignIn">
        <h1>Sign In</h1>
        <div class="social-icons">
          <a href="#" class="icon"><font-awesome-icon :icon="['fab', 'google']" /></a>
          <a href="#" class="icon"><font-awesome-icon :icon="['fab', 'facebook-f']" /></a>
          <a href="#" class="icon"><font-awesome-icon :icon="['fab', 'github']" /></a>
          <a href="#" class="icon"><font-awesome-icon :icon="['fab', 'linkedin-in']" /></a>
        </div>
        <span>or use your email password</span>
        <input type="email" placeholder="Email" v-model="signInForm.email" required>
        <input type="password" placeholder="Password" v-model="signInForm.password" required>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>
    </div>
    
    <!-- Mobile toggle buttons -->
     <div class="mobile-toggle">
      <button v-if="!isRegisterActive" @click="toggleForm(true)" class="mobile-toggle-btn">
        Don't have an account? <span>Sign Up</span>
      </button>
      <button v-else @click="toggleForm(false)" class="mobile-toggle-btn">
        Already have an account? <span>Sign In</span>
      </button>
    </div>

    <div class="toggle-container">
      <div class="toggle">
        <div class="toggle-panel toggle-left">
          <h1>Welcome Back!</h1>
          <p>Enter your personal details to use all of site features</p>
          <button class="hidden" @click="toggleForm(false)">Sign In</button>
        </div>
        <div class="toggle-panel toggle-right">
          <h1>Hello, Friend!</h1>
          <p>Register with your personal details to use all of site features</p>
          <button class="hidden" @click="toggleForm(true)">Sign Up</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { registerUser, loginUser } from '../firebase/auth';

export default {
  name: 'AuthForm',
  data() {
    return {
      isRegisterActive: false,
      isLoading: false,
      errorMessage: '',
      signInForm: {
        email: '',
        password: ''
      },
      signUpForm: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    toggleForm(isActive) {
      this.isRegisterActive = isActive;
      this.errorMessage = '';
    },
    async handleSignIn() {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { email, password } = this.signInForm;
      const result = await loginUser(email, password);
      
      if (result.success) {
        this.$router.push('/dashboard');
      } else {
        this.errorMessage = this.getFirebaseError(result.error);
      }
      
      this.isLoading = false;
    },
    async handleSignUp() {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { name, email, password } = this.signUpForm;
      const result = await registerUser(email, password, name);
      
      if (result.success) {
        this.$router.push('/dashboard');
      } else {
        this.errorMessage = this.getFirebaseError(result.error);
      }
      
      this.isLoading = false;
    },
    getFirebaseError(error) {
      if (error.includes('auth/invalid-email')) return 'Invalid email address';
      if (error.includes('auth/user-not-found')) return 'No account found with this email';
      if (error.includes('auth/wrong-password')) return 'Incorrect password';
      if (error.includes('auth/email-already-in-use')) return 'Email already in use';
      if (error.includes('auth/weak-password')) return 'Password should be at least 6 characters';
      return 'An error occurred. Please try again.';
    }
  }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
}

body {
    background-color: #c9d6ff;
    background: linear-gradient(to right, #e2e2e2, #c9d6ff);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
}

.container {
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 90%;
  min-height: 480px;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.container p{
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    margin: 20px 0;
}

.container span{
    font-size: 12px;
}

.container a{
    color: #333;
    font-size: 13px;
    text-decoration: none;
    margin: 15px 0 10px;
}

.container button{
    background-color: #512da8;
    color: #fff;
    font-size: 12px;
    padding: 10px 45px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 10px;
    cursor: pointer;
}

.container button.hidden{
    background-color: transparent;
    border-color: #fff;
}

.container form{
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    height: 100%;
}

.container input{
    background-color: #eee;
    border: none;
    margin: 8px 0;
    padding: 10px 15px;
    font-size: 13px;
    border-radius: 8px;
    width: 100%;
    outline: none;
}

.form-container{
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
}

.sign-in{
    left: 0;
    width: 50%;
    z-index: 2;
}

.container.active .sign-in{
    transform: translateX(100%);
}

.sign-up{
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
    transition: all 0.5s;
}

.error-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff4444;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  max-width: 90%;
  text-align: center;
  font-size: 14px;
  word-wrap: break-word;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.container.active .sign-up{
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: move 0.6s;
}

@keyframes move{
    0%, 49.99%{
        opacity: 0;
        z-index: 1;
    }
    50%, 100%{
        opacity: 1;
        z-index: 5;
    }
}

.social-icons{
    margin: 20px 0;
}

.social-icons a{
    border: 1px solid #ccc;
    border-radius: 20%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 3px;
    width: 40px;
    height: 40px;
    transition: all 0.5s;
}

.social-icons a:hover{
    scale: 1.3;
    border: 1px solid #000;
}

.toggle-container{
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: all 0.6s ease-in-out;
    border-radius: 150px 0 0 100px;
    z-index: 1000;
}

.container.active .toggle-container{
    transform: translateX(-100%);
    border-radius: 0 150px 100px 0;
}

.toggle{
    background-color: #512da8;
    height: 100%;
    background: linear-gradient(to right, #5c6bc0, #512da8);
    color: #fff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
}

.container.active .toggle{
    transform: translateX(50%);
}

.toggle-panel{
    position: absolute;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 30px;
    text-align: center;
    top: 0;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
}

.toggle-left{
    transform: translateX(-200%);
}

.container.active .toggle-left{
    transform: translateX(0);
}

.toggle-right{
    right: 0;
    transform: translateX(0);
}

.container.active .toggle-right{
    transform: translateX(200%);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .container {
    width: 95%;
    min-height: 80vh;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .form-container {
    width: 100% !important;
    padding: 0 20px;
  }

  .sign-in {
    left: 0;
    width: 100% !important;
    transform: translateX(0);
  }

  .container.active .sign-in {
    transform: translateX(-100%);
    opacity: 0;
  }

  .sign-up {
    left: 0;
    width: 100% !important;
    transform: translateX(100%);
    opacity: 0;
  }

  .container.active .sign-up {
    transform: translateX(0);
    opacity: 1;
  }

  .toggle-container {
    display: none;
  }

  .mobile-toggle {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 10;
     display: flex; /* Show on mobile */
  }

  .mobile-toggle-btn {
    background: transparent !important;
    border: none !important;
    color: #512da8 !important;
    font-size: 14px !important;
    text-transform: none !important;
    padding: 5px !important;
    margin: 0 !important;
  }

  .mobile-toggle-btn span {
    font-weight: bold;
    text-decoration: underline;
  }

  form {
    padding: 0 20px !important;
  }

  input {
    padding: 12px 15px !important;
    font-size: 14px !important;
  }

  button[type="submit"] {
    padding: 12px 30px !important;
    font-size: 14px !important;
  }
  
  
}
@media (min-width: 769px) {
  .mobile-toggle {
    display: none !important;
  }
}

</style>