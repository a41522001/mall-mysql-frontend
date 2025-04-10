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
const routes = [
  {
    path: '/',
    name: 'home',
    component: defineAsyncComponent(() => import('@/pages/home/Home.vue'))
  },
  {
    path: '/login',
    name: 'login',
    component: defineAsyncComponent(() => import('@/pages/login/Login.vue'))
  },
  {
    path: '/sell',
    name: 'sell',
    children: [
      {
        path: '',
        component: defineAsyncComponent(() => import('@/pages/sell/dashboard/Dashboard.vue'))
      },
      {
        path: 'product',
        name: 'sellProduct',
        component: defineAsyncComponent(() => import('@/pages/sell/Product.vue'))
      }
    ]
  },
  {
    path: '/buyer',
    name: 'buyer',
    component: defineAsyncComponent(() => import('@/layouts/BuyerLayout.vue')),
    children: [
      {
        path: '',
        component: defineAsyncComponent(() => import('@/pages/buyer/Product.vue'))
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach(async (to, from) => {
  const userStore = useUserStore();
  if(!to.path.startsWith('/login')) {
    if(sessionStorage.getItem('token')) {
      await userStore.getUserInfo();
      return true;
    }else {
      return '/login'
    }
  }
});

export default router
