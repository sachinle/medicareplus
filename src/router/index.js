import { createRouter, createWebHashHistory } from 'vue-router';
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
    component: () => import('../components/HomePage.vue'),
    meta: { title: 'MediCare+ - Home' } 
  },
  { 
    path: '/login', 
    component: AuthForm,
    meta: { title: 'MediCare+ - Login' } 
  },
  { 
    path: '/dashboard', 
    component: () => import('../components/DashboardPage.vue'),
    meta: { 
      requiresAuth: true,
      title: 'MediCare+ - Dashboard'
    } 
  },
  {
    path: '/about',
    component: AboutPage,
    meta: { 
      requiresAuth: true,
      title: 'MediCare+ - About Us'
    }
  },
  {
    path: '/products',
    component: ProductList,
    meta: { 
      requiresAuth: true,
      title: 'MediCare+ - Products'
    }
  },
  {
    path: '/products/:id',
    component: ProductView,
    meta: { 
      requiresAuth: true,
      title: 'MediCare+ - Product Details'
    },
    props: true
  },
  {
    path: '/cart',
    component: CartPage,
    meta: { 
      requiresAuth: true,
      title: 'MediCare+ - Shopping Cart'
    }
  },
  {
    path: '/payment',
    component: PaymentPage,
    meta: { 
      requiresAuth: true,
      title: 'MediCare+ - Payment'
    }
  },
  {
    path: '/order-confirmation',
    component: OrderConfirmation,
    meta: { 
      requiresAuth: true,
      title: 'MediCare+ - Order Confirmation'
    },
    
    props: (route) => ({ 
      amount: route.query.amount,
      items: route.query.items ? JSON.parse(route.query.items) : []
    })
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = JSON.parse(localStorage.getItem('firebaseUser'));
  
  // Set document title
  document.title = to.meta.title || 'MediCare+';

  if (requiresAuth && !user) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/') && user) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;