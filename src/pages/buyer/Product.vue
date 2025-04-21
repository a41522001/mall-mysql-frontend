<template>
  <div class="mb-5">
    <Carousels />
  </div>
  <v-row>
    <v-col v-for="{ id, name, price, quantity, image } in products" :key="id" cols="12" sm="6" md="4" lg="3" >
      <v-card>
        <v-sheet width="100%" height="10rem">
          <img :src="image" class="w-100 h-100">
        </v-sheet>
        <v-card-text>
          <div class="text-h4 mb-4">{{ name }}</div>
          <div>${{ price }}</div>
          <div>庫存: {{ quantity }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="handleAddCart({id, name, price, quantity, image})" 
            :color="renderBtnColor(quantity)" variant="elevated" :disabled="quantity === 0">
            {{ renderBtnText(quantity) }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <!-- 新增商品dialog -->
  <v-dialog v-model="dialog.addProduct" max-width="400" width="100%" class="mx-5">
    <v-card>
      <v-card-title class="d-flex">
        <div class="me-auto">加入購物車</div>
        <v-btn @click="closeDialog" density="comfortable" variant="text" icon="$close" />
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <img class="w-100" height="100px" src="" alt="">
          </v-col>
          <v-col cols="8">
            <div>商品名稱</div>
            <div>單價: ${{ currentProduct.price }}</div>
          </v-col>
          <v-col cols="12">
            <div>
              <v-number-input v-model="quantity" :max="currentProduct.quantity" :min="1" label="數量" control-variant="split"
                :hideInput="false" :inset="false" :hide-details="true" density="compact" />
            </div>
            <div>總計 : ${{ currentProductTotalPrice }}</div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="closeDialog">取消</v-btn>
        <v-btn @click="handleConfirmAddCart">確認加入購物車</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { reactive, shallowReactive, defineAsyncComponent, ref, onMounted, computed, nextTick } from 'vue';
  import { Response } from '@/utils/res';
  import { useUserStore } from '@/stores/userStore';
  import { useSysStore } from '@/stores/sysStore';
  import { useCartStore } from '@/stores/cartStore';
  import type { Product } from '@/types/interface';
  import { useRouter } from 'vue-router';
  import Carousels from '@/components/common/Carousels.vue';
  const router = useRouter();
  const userStore = useUserStore();
  const sysStore = useSysStore();
  const cartStore = useCartStore();
  const products: Product[] = shallowReactive([]);
  const currentProduct: Product = shallowReactive({
    id: '',
    name: '',
    price: 0,
    quantity: 0,
    image: ''
  });
  const currentProductTotalPrice = computed((): number => currentProduct.price * quantity.value);
  const quantity = ref<number>(1);
  const dialog = reactive({
    cart: false,
    product: false,
    addProduct: false,
  })

  const renderBtnText = (quantity: number): string => quantity ? '加入購物車' : '目前尚無庫存';
  const renderBtnColor = (quantity: number): string => quantity ? '#3B82F6' : '#ff0000';

  const clearData = (): void => {
    currentProduct.id = '';
    currentProduct.name = '';
    currentProduct.price = 0;
    currentProduct.quantity = 0;
    currentProduct.image = '';
    quantity.value = 1;
  }

  const closeDialog = (): void => {
    dialog.addProduct = false;
    clearData();
  }

  const handleAddCart = (product: Product): void => {
    dialog.addProduct = true;
    Object.assign(currentProduct, product);
  }

  // 新增購物車API
  const handleConfirmAddCart = async (): Promise<void> => {
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
      closeDialog();
      cartStore.getCartList();
      sysStore.openDialog('成功添加購物車');
    }
  }

  // 取得商品列表API
  const handleGetProduct = async (): Promise<void> => {
    const res = await Response.SendResponse('product/getProduct', 'get');
    products.splice(0, products.length, ...res as []);
  }

  // 結帳API
  const handleCheck = async (data: any) => {
    try {
      const res = await Response.SendResponse('order/addOrder', 'post', data);
      sysStore.openDialog(res);
      dialog.cart = false;
      cartStore.getCartList();
    } catch (error) {
      if(typeof error === 'string') sysStore.openDialog(error);
    }
  }

  onMounted(async () => {
    if(sessionStorage.getItem('token')) {
      handleGetProduct();
    }
  })
</script>