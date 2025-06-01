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
  // 取得cartList
  const getCartList = async () => {
    const res = await apiGetCartList();
    cartList.splice(0, cartList.length, ...res.data);
  }
  return {
    cartList,
    cartListLength,
    getCartList,
  }
})