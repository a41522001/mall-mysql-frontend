/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { components } from 'vuetify/dist/vuetify.js';
import Login from '@/pages/default/Login.vue';
import BuyerLayout from '@/layouts/BuyerLayout.vue';
import SellerLayout from '@/layouts/sellerLayout.vue';
import Signup from '@/pages/default/Signup.vue';
const routes = [
  {
    path: '/',
    name: 'home',
    component: Login
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/buyer',
    name: 'buyer',
    component: BuyerLayout,
    children: [
      {
        path: '',
        name: 'product',
        component: defineAsyncComponent(() => import('@/pages/buyer/Product.vue'))
      },
      {
        path: 'cart',
        name: 'cart',
        component: defineAsyncComponent(() => import('@/pages/buyer/Cart.vue'))
      },
      {
        path: 'checkout/:orderId',
        name: 'checkout',
        component: defineAsyncComponent(() => import('@/pages/buyer/Checkout.vue')),
        props: true
      },
      {
        path: 'order',
        name: 'order',
        component: defineAsyncComponent(() => import('@/pages/buyer/Order.vue'))
      },
    ]
  },
  {
    path: '/seller',
    name: 'seller',
    component: SellerLayout,
    children: [
      {
        path: '',
        name: 'productManage',
        component: defineAsyncComponent(() => import('@/pages/seller/ProductManage.vue'))
      },
      {
        path: 'analysis',
        name: 'analysis',
        component: defineAsyncComponent(() => import('@/pages/seller/Analysis.vue'))
      },
      {
        path: 'orderManage',
        name: 'orderManage',
        component: defineAsyncComponent(() => import('@/pages/seller/OrderManage.vue'))
      },
      {
        path: 'orderDetail/:orderId',
        name: 'orderDetail',
        component: defineAsyncComponent(() => import('@/pages/seller/OrderDetail.vue'))
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach(async (to, from) => {
  if(!to.path.startsWith('/login') && !to.path.startsWith('/signup')) {
    if(sessionStorage.getItem('token')) {
      window.scrollTo(0, 0);
      return true;
    }else {
      return '/login'
    }
  }
});

export default router
