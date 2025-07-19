<template>
  <div>
    <h2 class="mb-6">所有訂單</h2>
    <!-- 篩選 -->
    <v-card class="mb-5">
      <v-card-text>
        <v-row class="align-end">
          <v-col cols="12" sm="6" md="3">
            <div class="mb-1">訂單狀態</div>
            <v-select
              v-model="query.status"
              :items="statusItems"
              hide-details
              density="compact"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div class="mb-1">下單日期</div>
            <v-date-input
              v-model="query.date"
              prepend-icon=""
              prepend-inner-icon="$calendar"
              hide-details
              density="compact"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div class="mb-1">搜尋訂單</div>
            <v-text-field
              v-model="query.orderNo"
              hide-details
              density="compact"
              placeholder="訂單編號..."
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn color="#0D47A1" @click="handleSearch">套用篩選</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- 訂單呈現 -->
    <template v-if="orderListView.length">
      <v-card
        v-for="{
          orderId,
          totalPrice,
          status,
          createdDate,
          product,
        } in orderListView"
        :key="orderId"
        class="mb-5"
      >
        <v-card-text>
          <div class="d-flex justify-space-between">
            <div>
              <div class="order_no">#{{ orderId }}</div>
              <div class="order_date">
                下單日期：{{ renderCreatedDate(createdDate) }}
              </div>
            </div>
            <v-chip :color="statusMap[status]?.color" class="flex-shrink-0">{{
              statusMap[status]?.text
            }}</v-chip>
          </div>
          <v-divider class="my-4" />
          <div>
            <div class="order_consumer">顧客資訊：</div>
            <div class="order_consumer_info">{{ name }} ({{ email }})</div>
          </div>
          <v-divider class="my-4" />
          <div>
            <div class="order_consumer">商品摘要：</div>
            <template
              v-for="({ productName, quantity }, index) in product"
              :key="index"
            >
              <div class="order_consumer_info mb-1">
                {{ productName }} x{{ quantity }}
              </div>
            </template>
          </div>
          <div class="order_amount_container">
            <div>
              <span class="order_amount_title">總金額：</span>
              <span class="order_amount">NT$ {{ totalPrice }}</span>
            </div>
            <div class="d-flex ga-3">
              <v-btn
                v-if="status !== 'cancel'"
                @click="handleCancelOrder(orderId)"
                class="error_btn"
              >
                取消訂單
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
      <Pagination v-model="currentPage" :totalItems="orderList.length" />
    </template>
    <template v-else>
      <div>查無資料</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  shallowReactive,
  ref,
  onMounted,
  computed,
  inject,
  watch,
} from "vue";
import { useUserStore } from "@/stores/userStore";
import { useSysStore } from "@/stores/sysStore";
import type {
  Product,
  UserInfo,
  Select,
  OrderQuery,
  AllOrder,
  Status,
} from "@/types/interface";
import { useRouter } from "vue-router";
import {
  apiCancelOrder,
  apiGetOrder,
  apiGetSystemSetting,
} from "@/utils/apiClient";
import Pagination from "@/components/common/Pagination.vue";
defineOptions({
  inheritAttrs: false,
});

const router = useRouter();
const userStore = useUserStore();
const sysStore = useSysStore();
const userInfo = inject<UserInfo>("userInfo")!;
const { id: userId, name, email } = userInfo;
const query: OrderQuery = reactive({
  status: "",
  date: "",
  orderNo: "",
});
const statusItems: Select[] = shallowReactive([]);
const orderList: AllOrder[] = reactive([]);
const originalOrderList: AllOrder[] = reactive([]);
const statusMap = {
  paid: {
    text: "已付款",
    color: "green",
  },
  paying: {
    text: "待付款",
    color: "primary",
  },
  cancel: {
    text: "已取消",
    color: "red",
  },
  deliver: {
    text: "運送中",
    color: "info",
  },
  delivered: {
    text: "已送達",
    color: "amber",
  },
  finish: {
    text: "已完成",
    color: "grey",
  },
};
const orderID = shallowRef<string>("");
// 分頁
const currentPage = ref<number>(1);
const orderListView = computed((): AllOrder[] => {
  const start = currentPage.value === 1 ? 0 : currentPage.value * 10 - 10;
  const end = start + 10;
  return orderList.slice(start, end);
});

const searchDate = shallowRef<string>("");
watch(currentPage, () => {
  window.scrollTo(0, 0);
});
// 渲染下單日期
const renderCreatedDate = (date: string) => {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  return `${year}-${month}-${day}`;
};
// 轉換搜尋日期 Date物件轉成YYYYMMDD
const setSearchDate = () => {
  const date = new Date(query.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedMonth = month < 10 ? "0" + month : month.toString();
  const formattedDay = day < 10 ? "0" + day : day.toString();
  searchDate.value = `${year}${formattedMonth}${formattedDay}`;
};
// 狀態搜尋條件
const statusCondition = (value: string): boolean => {
  if (query.status === "all") {
    return true;
  } else {
    return query.status === value;
  }
};
// 日期搜尋條件
const dateCondition = (value: string): boolean => {
  if (!query.date) {
    return true;
  } else {
    return searchDate.value === value;
  }
};
// 訂單編號搜尋條件
const orderIdCondition = (value: string): boolean => {
  return (
    !query.orderNo ||
    value.toLowerCase().includes(query.orderNo.toLocaleLowerCase())
  );
};
const handleSearch = async () => {
  currentPage.value = 1;
  setSearchDate();
  const searchList = originalOrderList.filter((order) => {
    const status = statusCondition(order.status);
    const date = dateCondition(order.createdDate);
    const orderID = orderIdCondition(order.orderId);
    return status && date && orderID;
  });
  orderList.splice(0, orderList.length, ...searchList);
};
// 取消訂單API
const cancelOrder = async () => {
  const data = {
    orderId: orderID.value,
  };
  const res = await apiCancelOrder(data);
  sysStore.openDialog(res.data);
  sysStore.closeConfirmDialog();
  getOrder();
};
const handleCancelOrder = (orderId: string) => {
  orderID.value = orderId;
  sysStore.confirmAssign("是否取消訂單", cancelOrder);
};
// 取得訂單API
const getOrder = async () => {
  const res = await apiGetOrder(userId);
  orderList.splice(0, orderList.length, ...res.data);
  originalOrderList.splice(0, originalOrderList.length, ...res.data);
};
// 取得下拉選單API
const getSelectList = async () => {
  const res = await apiGetSystemSetting("status");
  const data = res.data.map((row) => {
    return {
      title: row.name,
      value: row.prop,
    };
  });
  statusItems.splice(0, statusItems.length, ...data);
  // 預設值
  query.status = statusItems[0].value;
};
onMounted(() => {
  Promise.all([getOrder(), getSelectList()]);
});
</script>

<style scoped lang="scss">
@import "@/styles/order.scss";
</style>
