<template>
  <v-card class="mx-auto" width="100%" max-width="600px">
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
    <v-btn @click="handlePayment">付款</v-btn>
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
  import axios from 'axios';
  const { name } = useDisplay()
  const userStore = useUserStore();
  const cartStore = useCartStore();
  const sysStore = useSysStore();
  const router: Router = useRouter();
  const route = useRoute();
  const productList = computed(() => orderDetail.products);
  const orderDetail = reactive({
    email: '',
    name: '',
    orderID: '',
    products: [],
    total: 0,
    userID: ''
  });
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
      const res = await Response.SendResponse('checkout/test', 'post', orderDetail);
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