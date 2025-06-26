// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store'; // Add this import
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGoogle, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { auth } from './firebase';

library.add(faGoogle, faFacebookF, faGithub, faLinkedinIn)

const app = createApp(App)
app.use(router);
app.use(store); // Add this line to use the store
app.component('font-awesome-icon', FontAwesomeIcon)

let isAppMounted = false;

auth.onAuthStateChanged((user) => {
  if (user) {
    localStorage.setItem('firebaseUser', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }));
  } else {
    localStorage.removeItem('firebaseUser');
  }
  
  if (!isAppMounted) {
    app.mount('#app');
    isAppMounted = true;
  }
});