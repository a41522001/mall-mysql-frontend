<template>
  <h2>所有訂單</h2>
  <!-- 篩選 -->
  <v-card class="mb-5">
    <v-card-text>
      <v-row class="align-end">
        <v-col cols="12" sm="6" md="3">
          <div class="mb-1">訂單狀態</div>
          <v-select v-model="query.status" :items="statusItems" hide-details density="compact" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <div class="mb-1">下單日期</div>
          <v-date-input v-model="query.date" prepend-icon="" prepend-inner-icon="$calendar"
            hide-details density="compact" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <div class="mb-1">搜尋訂單</div>
          <v-text-field v-model="query.orderNo" hide-details density="compact" placeholder="訂單編號..."/>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn>套用篩選</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <!-- 訂單呈現 -->
  <v-card>
    <v-card-text>
      <div class="d-flex justify-space-between">
        <div>
          <div class="order_no">#ORD2025001</div>
          <div class="order_date">下單日期：2025-05-10</div>
        </div>
        <v-chip>Chip</v-chip>
      </div>
      <v-divider class="my-4" />
      <div>
        <div class="order_consumer">顧客資訊：</div>
        <div class="order_consumer_info">陳小明 (buyer01@example.com)</div>
      </div>
      <v-divider class="my-4" />
      <div></div>
      <div></div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { reactive, shallowReactive, ref, onMounted, computed, inject } from 'vue';
  import { Response } from '@/utils/res';
  import { useUserStore } from '@/stores/userStore';
  import { useSysStore } from '@/stores/sysStore'; 
  import type { Product, UserInfo, Select, OrderQuery } from '@/types/interface';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from "pinia";
  import { apiGetOrder, apiGetSystemSetting } from '@/utils/apiClient';
  defineOptions({
    inheritAttrs: false
  })
  const router = useRouter();
  const userStore = useUserStore();
  const sysStore = useSysStore();
  const userInfo = inject<UserInfo>('userInfo')!;
  const { id: userId } = userInfo;
  const query: OrderQuery = reactive({
    status: '',
    date: '',
    orderNo: ''
  })
  const statusItems: Select[] = shallowReactive([]);

  const getSelectList = async () => {
    const res = await apiGetSystemSetting('status');
    const data = res.data.map(row => {
      return {
        title: row.name,
        value: row.prop
      }
    })
    statusItems.splice(0, statusItems.length, ...data);
    // 預設值
    query.status = statusItems[0].value;
  }
  const getOrder = async () => {
    // const res = await apiGetOrder(userId);
  }
  
  onMounted(() => {
    Promise.all([getOrder(), getSelectList()]);
  })
</script>

<style scoped lang="scss">
.order_no {
  font-size: 1.75rem;
  color: #2b48ec;
  font-weight: 600;
  margin-bottom: .5rem;
}
.order_date {
  font-size: 1rem;
  color: #888;
}
.order_consumer {
  font-weight: 500;
  margin-bottom: .5rem;
  font-size: 1rem;
}
.order_consumer_info {
  font-weight: 400;
  color: #353535;
  font-size: 1rem;
}
</style>