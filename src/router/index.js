// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import AuthForm from '../components/AuthForm.vue';
import AboutPage from '../components/AboutPage.vue';
import ProductList from '../components/ProductList.vue';
import ProductView from '../components/ProductView.vue';
import CartPage from '../components/CartPage.vue';
import PaymentPage from '../components/PaymentPage.vue';
import OrderConfirmation from '../components/OrderConfirmation.vue';

const routes = [
  { 
    path: '/', 
    component: () => import('../components/HomePage.vue') 
  },
  { 
    path: '/login', 
    component: AuthForm 
  },
  { 
    path: '/dashboard', 
    component: () => import('../components/DashboardPage.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/about',
    component: AboutPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    component: ProductList,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id',
    component: ProductView,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/cart',
    component: CartPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/payment',
    component: PaymentPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/order-confirmation',
    component: OrderConfirmation,
    meta: { requiresAuth: true },
    props: (route) => ({ 
      amount: route.query.amount,
      items: route.query.items ? JSON.parse(route.query.items) : []
    })
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = JSON.parse(localStorage.getItem('firebaseUser'));
  
  if (requiresAuth && !user) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/') && user) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;