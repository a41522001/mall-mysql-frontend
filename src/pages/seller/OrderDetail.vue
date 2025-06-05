<template>
  <div id="orderDetail">
    <div class="mb-5">
      <div class="mb-5 d-flex align-sm-center flex-column flex-sm-row ga-2">
        <a @click="goToOrderManagePage" class="order_link">返回訂單管理</a>
        <div >
            <span>訂單日期：</span>
            <span>{{ orderInfo.createdDate }} {{ orderInfo.createdTime }}</span>
        </div>
      </div>
      <div class="d-flex flex-column flex-sm-row align-sm-center justify-sm-space-between ga-2">
        <h2>訂單詳情: <span class="text-indigo-accent-3">{{ orderInfo.orderId }}</span></h2>
        <span class="status" :class="[statusMap?.[orderInfo.status as Status]?.className]">
          {{ statusMap?.[orderInfo.status as Status]?.text }}
        </span>
      </div>
    </div>

    <!-- 商品資訊 -->
    <div class="mb-5">
      <p class="text-h6 mb-3">購買商品</p>
      <template v-for="({ productName, price, quantity, image }) in orderInfo.products">
        <v-row>
          <v-col cols="3" sm="2">
            <v-img :src="image" rounded />
          </v-col>
          <v-col cols="5" sm="3" class="me-auto d-flex flex-column">
            <div class="mb-1">{{ productName }}</div>
            <div>單價: NT$ {{ price }}</div>
          </v-col>
          <v-col cols="auto">
            <div class="mb-1">數量：{{ quantity }}</div>
            <div>NT$ {{ price * quantity }}</div>
          </v-col>
        </v-row>
      </template>
      
      <v-divider class="my-5" />
      <div class="text-end">
        <div class="mb-2">
          商品總額： NT$ {{ orderInfo.total }}
        </div>
        <div class="mb-2">
          運費： NT$ 0
        </div>
        <div>
          <span class="text-h5 font-weight-bold">訂單總金額：</span>
          <span class="text-h5 font-weight-bold text-indigo-accent-4">NT$ {{ orderInfo.total }}</span>
        </div>
      </div>
    </div>
    <!-- 顧客資訊 -->
    <div class="mb-5">
      <p class="text-h6">顧客與配送資訊</p>
      <v-row>
        <v-col cols="12" sm="6">
          <p class="mb-2">顧客資料</p>
          <div>姓名：</div>
          <div class="mb-1">{{ orderInfo.userName }}</div>
          <div>電子郵件：</div>
          <div class="mb-1">{{ orderInfo.email }}</div>
        </v-col>
        <v-col cols="12" sm="6">
          <p class="mb-2">收貨地址</p>
          <div>收貨人：</div>
          <div class="mb-1">{{ orderInfo.receiverName }}</div>
          <div>連絡電話：</div>
          <div class="mb-1">{{ orderInfo.phone }}</div>
          <div>地址：</div>
          <div>{{ orderInfo.address }}</div>
        </v-col>
      </v-row>
    </div>
    <!-- 訂單操作 -->
    <div>
      <p class="text-h6 mb-2">訂單操作</p>
      <div class="d-flex ga-3">
        <v-btn v-if="displayDeliverCondition(orderInfo.status)" @click="openDeliverDialog" density="comfortable">寄送商品</v-btn>
        <v-btn v-if="displayCancelCondition(orderInfo.status)" @click="openCancelDialog" density="comfortable">取消訂單</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import Apple from '@/../public/image/Apple.png'
  import { apiSellCancelOrder, apiSellDeliver, apiSellOrderDetail } from '@/utils/apiClient';
  import type { SellOrderDetail, Status } from '@/types/interface';
  import { useSysStore } from '@/stores/sysStore';
  const sysStore = useSysStore();
  const route = useRoute();
  const router = useRouter();
  const orderId = route.params.orderId;
  const orderInfo: SellOrderDetail = reactive({
    total: 0,
    receiverName: '',
    email: '',
    address: '',
    phone: '',
    status: 'cancel',
    orderId: '',
    userName: '',
    createdDate: '',
    createdTime: '',
    products: []
  })
  const statusMap = {
    paid: {
      text: '已付款',
      className: 'status_paid'
    },
    paying: {
      text: '待付款',
      className: 'status_paying'
    },
    deliver: {
      text: '運送中',
      className: 'status_deliver'
    },
    cancel: {
      text: '已取消',
      className: 'status_cancel'
    },
    delivered: {
      text: '已送達',
      className: 'status_delivered'
    },
    finish: {
      text: '已完成',
      className: 'status_finish'
    }
  }
  const currentOrderNo = shallowRef<string>('');
  const displayDeliverCondition = (status: Status) => {
    return status === 'paid' || status === 'paying';
  }
  const displayCancelCondition = (status: Status) => {
    return status !== 'cancel' && status !== 'finish';
  }
  // 寄出商品
  const openDeliverDialog = () => {
    currentOrderNo.value = orderInfo.orderId;
    sysStore.confirmAssign('確定已經出貨了嗎?', handleDeliver);
  }
  const handleDeliver = async () => {
    const data = {
      orderId: currentOrderNo.value
    }
    try {
      const res = await apiSellDeliver(data);
      if(res.code === 100) {
        sysStore.openDialog('出貨成功!');
        getOrderDetail();
      }
    } catch (error) {
      sysStore.openDialog('出貨失敗，請稍後再試');
    } finally {
      sysStore.confirmDialog = false;
    }
  }
  // 取消訂單
  const openCancelDialog = () => {
    currentOrderNo.value = orderInfo.orderId;
    sysStore.confirmAssign('確定要取消訂單嗎?', handleCancelOrder);
  }
  const handleCancelOrder = async () => {
    const data = {
      orderId: currentOrderNo.value
    }
    try {
      const res = await apiSellCancelOrder(data);
      if(res.code === 100) {
        sysStore.openDialog('取消訂單成功!');
        getOrderDetail();
      }
    } catch (error) {
      sysStore.openDialog('取消訂單失敗，請稍後再試');
    } finally {
      sysStore.confirmDialog = false;
    }
  }
  const goToOrderManagePage = () => {
    router.push('/seller/OrderManage');
  }
  const getOrderDetail = async () => {
    const res = await apiSellOrderDetail(orderId);
    Object.assign(orderInfo, res.data);
  }
  // 取消
  onMounted(() => {
    getOrderDetail();
  })
</script>

<style scoped lang="scss">
  #orderDetail {
    max-width: 768px;
    width: 100%;
    margin: auto;
  }
  .order_link {
    margin-right: auto;
    color: #443daf;
    cursor: pointer;
    &:hover {
      opacity: .8;
    }
    &::before {
      content: '<';
      margin-right: .5rem;
    }
  }
  .status {
    display: inline-block;
    padding: .25rem .75rem;
    border-radius: 50px;
    font-weight: 600;
    align-self: start;
  }
  .status_paid {
    background-color: #8addb8;
    color: rgb(52, 134, 52);
  }
  .status_paying {
    color: #e67b2a; 
    background-color: #FEF3C7;
  }
  .status_cancel {
    color: red;
    background-color: #ff8787d0;
  }
  .status_deliver {
    background-color: #E3F2FD;
    color: #1565C0;
  }
  .status_delivered {
    background-color: #83a9faa6;
    color: rgb(32, 32, 212);
  }
  .status_finish {
    background-color: #2e2e2e;
    color: #fff;
  }
</style>