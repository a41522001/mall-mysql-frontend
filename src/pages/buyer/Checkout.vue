<template>
  <v-card class="mx-auto" width="100%" max-width="600px">
    <v-card class="mb-6">
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>訂單確認</v-toolbar-title>
      </v-toolbar>
    </v-card>
    <template v-for="product in productList" :key="product.productID">
      <v-row class="align-center">
        <v-col cols="5">
          <v-sheet width="100%" height="100%" class="pa-3">
            <v-img :src="Apple" width="100%" aspect-ratio="1/1" rounded="sm" />
          </v-sheet>
        </v-col>
        <v-col cols="3">
          {{ product.productName }}
        </v-col>
        <v-col cols="4">
          <div class="text-end pe-3">
            <p>NT$ {{ product.perPrice }}</p>
            <p>X{{ product.quantity }}</p>
          </div>
        </v-col>
      </v-row>
      <v-divider />
    </template>
    <div>
    <v-card class="mb-6">
      <v-card-title class="bg-primary">
        <h3 class="subtitle-1">寄送地址</h3>
      </v-card-title>
      <v-card-text class="pt-5">
        <v-row>
          <v-col cols="6">
            <v-select v-model="formData.city" :items="cityList" label="縣市" hide-details density="compact" variant="outlined"/>
          </v-col>
          <v-col cols="6">
            <v-select v-model="formData.area" :items="areaList" label="區域" hide-details density="compact" variant="outlined" no-data-text="請先選擇縣市"/>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="formData.detailAddress" label="詳細地址" hide-details density="compact" variant="outlined" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    </div>
    <div class="pa-3 text-end">
      <v-btn @click="handlePayment">付款</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import Apple from '@/../public/image/Apple.png'
  import { reactive, watch, computed, ref, onMounted } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import { useCartStore } from '@/stores/cartStore';
  import { useSysStore } from '@/stores/sysStore';
  import { Response } from '@/utils/res';
  import { useDisplay } from 'vuetify'
  import { useRouter, type Router, useRoute } from 'vue-router';
  import type { OrderProduct, OrderDetail } from '@/types/interface';
  import addressJSON from '@/../public/address.json';
  const addressData = addressJSON as Record<string, string[]>;
  const { name } = useDisplay()
  const userStore = useUserStore();
  const cartStore = useCartStore();
  const sysStore = useSysStore();
  const router: Router = useRouter();
  const route = useRoute();
  
  const productList = computed((): OrderProduct[] => orderDetail.products);
  const orderDetail: OrderDetail = reactive({
    email: '',
    name: '',
    orderID: '',
    products: [],
    total: 0,
    userID: ''
  });
  const formData = reactive({
    city: '',
    area: '',
    detailAddress: ''
  })
  const cityList = computed(() => Object.keys(addressJSON));
  const areaList = computed(() => addressData[formData.city] ?? []);

  watch(() => formData.city, () => {
    formData.area ='';
  })
  const getOrderDetail = async () => {
    const orderId = route.params.orderId;
    console.log(orderId);
    const userId = userStore.userInfo.id;
    // const res = await Response.SendResponse(`order/getOrder/${userID}`, 'get')
    const data = {
      userId,
      orderId
    }
    const res = await Response.SendResponse('order/getSingleOrderDetail', 'post', data);
    Object.assign(orderDetail, res);
  }

  const handlePayment = async () => {
    console.log('payment');
    try {
      const res: string = await Response.SendResponse('checkout/checkout', 'post', orderDetail);
      console.log(res);
      document.open()
      document.write(res)
      document.close()
    } catch (error) {
      console.error(error);
    }
  }
  onMounted(() => {
    getOrderDetail();
  })
</script>
<style scoped lang="scss">
.subtitle-1 {
  font-size: 1.25rem;
  font-weight: 400;
}
</style>