import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue';
import { api } from "@/utils/api";
import { useRouter } from 'vue-router';
export const useCartStore = defineStore('cartStore', () => {
  const cartList = reactive([]);
  const cartListLength = computed(() => cartList.length);
  return {
    cartList,
    cartListLength
  }
})