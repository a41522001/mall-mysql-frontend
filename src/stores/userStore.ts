import { defineStore } from 'pinia'
import { reactive, ref } from 'vue';
import { api } from "@/utils/api";
import type { UserInfo } from '@/types/interface';
import { useRouter } from 'vue-router';
export const useUserStore = defineStore('userStore', () => {
  const router = useRouter();
  const isLogin = ref(false);
  const userInfo: UserInfo = reactive({
    id: '',
    name: '',
    email: ''
  });
  const getUserInfo = async () => {
    if(sessionStorage.getItem('token')) {
      const res: any = await api('auth/userInfo', 'post', {});
      if(res.data.code === 100) {
        const resData = res.data.data;
        for(const key in resData) userInfo[key] = resData[key];
        isLogin.value = true;
      }
    }
  }

  getUserInfo();

  const login = async (email: string, password: string) => {
    const res = await api('auth/login', 'post', { email, password });
    if(res) {
      const token = res?.data.token;
      sessionStorage.setItem('token', token);
      isLogin.value = true;
      return token;
    }else {
      return null;
    }
  }
  const logout = () => {
    sessionStorage.removeItem('token');
    isLogin.value = false;
    router.push({ path: '/login' });
  }
  return {
    isLogin,
    login,
    userInfo,
    getUserInfo,
    logout
  }
})
