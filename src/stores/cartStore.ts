import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue';
import { api } from "@/utils/api";
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { Response } from '@/utils/res';
import type { Cart } from '@/types/interface';
import { apiGetCartList } from '@/utils/apiClient';
export const useCartStore = defineStore('cartStore', () => {
  const userStore = useUserStore();
  const cartList: Cart[] = reactive([]);
  const cartListLength = computed((): number => cartList.length);
  // 查看購物車API
  const getCartList = async (): Promise<void> => {
    const userID = userStore.userInfo.id
    const res = await Response.SendResponse(`cart/getCart?userID=${userID}`, 'get');
    cartList.splice(0, cartList.length, ...res);
  }
  // 設置cartList
  const setCartList = async (userId: string) => {
    try {
      const res = await apiGetCartList(userId);
      cartList.splice(0, cartList.length, ...res);
    } catch (error) {
      throw error;
    }
  }
  return {
    cartList,
    cartListLength,
    getCartList,
    setCartList
  }
})