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
            <v-img :src="product.image" width="100%" aspect-ratio="1/1" rounded="sm" />
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
    <v-card variant="flat">
      <v-card-title class="bg-primary">
        <h3 class="subtitle-1">收件者資訊</h3>
      </v-card-title>
      <v-card-text class="pt-5">
        <v-form ref="formReceiver">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="receiverInfo.name" :rules="rulesReceiver.name" label="姓名" hint="請填寫全名" density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="receiverInfo.phone" :rules="rulesReceiver.phone" label="連絡電話" hint="請填寫手機或市話(加區碼)" density="compact" variant="outlined" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card variant="flat">
      <v-card-title class="bg-primary">
        <h3 class="subtitle-1">寄送地址</h3>
      </v-card-title>
      <v-card-text class="pt-5">
        <v-form ref="formAddress">
          <v-row>
            <v-col cols="6">
              <v-select v-model="receiveAddress.city" :rules="rulesAddress.city" :items="cityList" label="縣市" density="compact" variant="outlined"/>
            </v-col>
            <v-col cols="6">
              <v-select v-model="receiveAddress.area" :rules="rulesAddress.area" :items="areaList" label="區域" density="compact" variant="outlined" no-data-text="請先選擇縣市"/>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="receiveAddress.detailAddress" :rules="rulesAddress.detailAddress" label="詳細地址" density="compact" variant="outlined" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    </div>
    <v-divider :thickness="2" />
    <div class="pa-3 text-end">
      <v-btn @click="handlePayment">付款</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import Apple from '@/../public/image/Apple.png'
  import { reactive, watch, computed, ref, onMounted, inject } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import { useCartStore } from '@/stores/cartStore';
  import { useSysStore } from '@/stores/sysStore';
  import { useDisplay } from 'vuetify'
  import { useRouter, type Router, useRoute } from 'vue-router';
  import type { OrderProduct, OrderDetail, UserInfo } from '@/types/interface';
  import addressJSON from '@/../public/address.json';
  import { apiCheckout, apiGetSingleOrderDetail } from '@/utils/apiClient';
  import { VForm } from 'vuetify/components';
  interface Props {
    orderId: string;
  }
  defineOptions({
    inheritAttrs: false
  })
  const props = defineProps<Props>();
  const addressData = addressJSON as Record<string, string[]>;
  const userInfo = inject<UserInfo>('userInfo')!;
  const { id: userId } = userInfo;
  const formReceiver = ref<InstanceType<typeof VForm> | null>(null);
  const formAddress = ref<InstanceType<typeof VForm> | null>(null);
  const productList = computed((): OrderProduct[] => orderDetail.products);
  const orderDetail: OrderDetail = reactive({
    email: '',
    name: '',
    orderID: '',
    products: [],
    total: 0,
    userID: ''
  });
  const receiverInfo = reactive({
    name: '',
    phone: ''
  })
  const receiveAddress = reactive({
    city: '',
    area: '',
    detailAddress: ''
  })
  const validatePhoneRegex = /^0\d{8,9}$/;
  const rulesReceiver = {
    name: [
      (v: string) => !!v || '請填寫全名'
    ],
    phone: [
      (v: string) => !!v || '請填寫電話號碼',
      (v: string) => validatePhoneRegex.test(v) || '錯誤的號碼'
    ]
  }
  const rulesAddress = {
    city: [
      (v: string) => !!v || '請選擇縣市'
    ],
    area: [
      (v: string) => !!v || '請選擇區域'
    ],
    detailAddress: [
      (v: string) => !!v || '請填入詳細地址'
    ]
  }
  const cityList = computed(() => Object.keys(addressJSON));
  const areaList = computed(() => addressData[receiveAddress.city] ?? []);
  const phoneDetail = computed(() => {
    const isCellphone = receiverInfo.phone.startsWith('09') && receiverInfo.phone.length === 10;
    if(isCellphone) {
      const header = receiverInfo.phone.slice(0, 4);
      const middle = receiverInfo.phone.slice(4, 7);
      const footer = receiverInfo.phone.slice(7, receiverInfo.phone.length);
      return `${header}-${middle}-${footer}`;
    }
    return receiverInfo.phone;
  })
  const addressDetail = computed(() => {
    const { city, area, detailAddress } = receiveAddress;
    return `${city}${area}${detailAddress}`;
  })
  watch(() => receiveAddress.city, () => {
    receiveAddress.area = '';
  })

  const getOrderDetail = async () => {
    const data = {
      userId,
      orderId: props.orderId
    }
    const res = await apiGetSingleOrderDetail(data);
    Object.assign(orderDetail, res.data);
  }
  const handleValidateReceiver = async (): Promise<boolean | null | undefined> => {
    const result = await formReceiver.value?.validate();
    return result?.valid;
  }
  const handleValidateAddress = async (): Promise<boolean | null | undefined> => {
    const result = await formAddress.value?.validate();
    return result?.valid;
  }
  const handlePayment = async () => {
    const validateResult = await Promise.all([handleValidateReceiver(), handleValidateAddress()]);
    console.log(validateResult);
    const isCorrect = validateResult.every(item => item);
    if(!isCorrect) {
      return;
    }
    const data = {
      address: addressDetail.value,
      phone: phoneDetail.value,
      receiverName: receiverInfo.name,
      ...orderDetail
    }
    try {
      const res = await apiCheckout(data);
      console.log(res.data);
      document.open()
      document.write(res.data)
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