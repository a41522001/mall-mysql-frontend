/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { defineAsyncComponent } from 'vue';
import { useUserStore } from '@/stores/userStore';
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
