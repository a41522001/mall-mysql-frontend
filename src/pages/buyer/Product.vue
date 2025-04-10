<template>
  <div class="mb-5">
    <Carousels />
  </div>
  <v-row>
    <v-col v-for="{ id, name, price, quantity, image } in products" :key="id" cols="6" sm="4" lg="3" >
      <v-card>
        <v-sheet width="100%" height="8rem">
          <img :src="image" class="w-100 h-100">
        </v-sheet>
        <v-card-text>
          <div>{{ name }}</div>
          <div>價錢: ${{ price }}</div>
          <div>庫存: {{ quantity }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="handleAddCart({id, name, price, quantity, image})" 
            color="#3B82F6" variant="elevated" :disabled="quantity === 0">加入購物車
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <!-- <v-btn @click="dialog.addProduct = true">新增商品</v-btn> -->
  <!-- <AddProduct v-model="dialog.addProduct" /> -->
</template>
<script setup lang="ts">
  import { reactive, shallowReactive, defineAsyncComponent, ref, onMounted, computed, nextTick } from 'vue';
  import { Response } from '@/utils/res';
  import { useUserStore } from '@/stores/userStore';
  import { useSysStore } from '@/stores/sysStore'; 
  import type { Product } from '@/types/interface';
  import { useRouter } from 'vue-router';
  import Carousels from '@/components/common/Carousels.vue';
  const router = useRouter();
  const userStore = useUserStore();
  const sysStore = useSysStore();
  const products: Product[] = shallowReactive([]);
  const currentProduct: Product = shallowReactive({
    id: '',
    name: '',
    price: 0,
    quantity: 0,
    image: ''
  });
  const currentProductTotalPrice = computed(() => currentProduct.price * quantity.value);
  const currentProductQuantityMax = computed(() => currentProduct.quantity);
  const quantity = ref(1);
  const dialog = reactive({
    cart: false,
    product: false,
    addProduct: false,
  })
  const cartList = reactive([]);

  const clearData = () => {
    currentProduct.id = '';
    currentProduct.name = '';
    currentProduct.price = 0;
    currentProduct.quantity = 0;
    quantity.value = 1;
  }
  const closeDialog = () => {
    dialog.product = false;
    clearData();
  }
  const handleAddCart = (product: Product) => {
    dialog.product = true;
    Object.assign(currentProduct, product);
  }
  // 新增購物車API
  const handleConfirmAddCart = async () => {
    const { id } = currentProduct;
    const data = {
      productId: id,
      quantity: quantity.value,
      userId: userStore.userInfo.id
    }
    const res = await Response.SendResponse('cart/addCart', 'post', data);
    if(!res) {
      dialog.product = false;
      handleGetProduct();
      clearData();
      handleOpenCart();
    }
  }
  // 查看購物車API
  const handleOpenCart = async () => {
    const userID = userStore.userInfo.id
    const res = await Response.SendResponse(`cart/getCart?userID=${userID}`, 'get');
    cartList.splice(0, cartList.length, ...res as []);
  }
  // 取得商品列表API
  const handleGetProduct = async () => {
    const res = await Response.SendResponse('product/getProduct', 'get');
    products.splice(0, products.length, ...res as []);
  }

  // 結帳API
  const handleCheck = async (data: any) => {
    try {
      const res = await Response.SendResponse('order/addOrder', 'post', data);
      sysStore.openDialog(res);
      dialog.cart = false;
      handleOpenCart();
    } catch (error) {
      if(typeof error === 'string') sysStore.openDialog(error);
    }
  }
  onMounted(async () => {
    if(sessionStorage.getItem('token')) {
      handleGetProduct();
      await handleOpenCart();
    }
  })
</script>