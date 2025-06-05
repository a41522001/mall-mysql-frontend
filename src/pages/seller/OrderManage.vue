<template>
  <div id="orderManage" class="text-no-wrap">
    <h2 class="mb-5">訂單管理</h2>
    <DataTable :headers="headers" :items="items" item-key="orderNo"
      :append="append" no-data-text="暫無訂單">
      <template v-slot:status="{ value }">
        <span class="status" :class="[statusMap[value as Status].className]">
          {{ statusMap[value as Status].text }}
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { reactive, shallowReactive, defineAsyncComponent, ref, onMounted, computed, nextTick, provide } from 'vue';
  import type { Select, UserInfo, Period, SellCount, SellOrder, Status } from '@/types/interface';
  import { apiGetSellOrders, apiSellDeliver } from '@/utils/apiClient';
  import { useSysStore } from '@/stores/sysStore';
  import DataTable from '@/components/common/DataTable.vue';
  import type { TableItem, PrependAndAppend } from '@/types/dataTable';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const sysStore = useSysStore();
  const userInfo = inject<UserInfo>('userInfo')!;
  const { id: userId } = userInfo;
  const headers = shallowReactive([
    {
      key: 'orderNo',
      title: '訂單編號',
      sortable: false
    },
    {
      key: 'date',
      title: '日期',
      sortable: false
    },
    {
      key: 'custom',
      title: '顧客',
      sortable: false
    },
    {
      key: 'total',
      title: '總金額',
      sortable: false
    },
    {
      key: 'status',
      title: '狀態',
      sortable: false,
      width: 120
    }
  ])
  const items: SellOrder[] = reactive([]);
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
  const handleViewOrder = (item: TableItem, index: number) => {
    console.log('view' , item.orderNo);
    router.push({ path: `/seller/orderDetail/${item.orderNo}` });
  }

  const append: PrependAndAppend = {
    key: 'operate',
    title: '操作',
    sortable: false,
    width: 120,
    value: [
      { text: '查看訂單詳情', method: handleViewOrder, variant: 'outlined', color: '#4F47ED' }
    ]
  }

  const getSellOrders = async () => {
    const res = await apiGetSellOrders();
    items.splice(0, items.length, ...res.data);
  }
  onMounted(() => {
    getSellOrders();
  })


</script>

<style scoped lang="scss">
.operate {
  color: #fff;
  cursor: pointer;
  padding: 0 .25rem;
  transition: .2s;
}
.operate_view {
  background-color: #3abb20;
  &:hover {
    background-color: #2ba812;
  }
}
.operate_deliver {
  background-color: #2075bb;
  &:hover {
    background-color: #5170c7;
  }
}
.status {
  display: inline-block;
  padding: .25rem .75rem;
  border-radius: 50px;
  font-weight: 600;
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