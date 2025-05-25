<template>
  <h2 class="mb-5">商品管理</h2>
  <div class="d-flex flex-column">
    <v-tabs v-model="tab">
      <v-tab v-for="{ title, value } in tabList" :key="value">
        {{ title }}
      </v-tab>
    </v-tabs>
    <template v-if="productList.length">
      <v-tabs-window v-model="tab">
        <v-tabs-window-item v-for="{ title, value, component } in tabList">
          <div class="py-3">
            <component :is="component" :productList="productList" 
              @changeIsActive="handleChangeActive"/>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template v-else>
      <div class="align-self-center pt-10 text-h4">
        還沒有商品嗎? 趕快去新增吧!
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { reactive, shallowRef, onMounted, inject, watch } from 'vue';
  import ProductList from './ProductMange/ProductList.vue';
  import AddProduct from './ProductMange/AddProduct.vue';
  import type { SellProduct, UserInfo } from '@/types/interface';
  import { apiGetSellProduct, apiChangeProductIsActive } from '@/utils/apiClient';
  import { useSysStore } from '@/stores/sysStore';
  const sysStore = useSysStore();
  const userInfo = inject<UserInfo>('userInfo')!;
  const { id: userId } = userInfo;
  const tab = shallowRef<'manage'| 'addProduct'>('manage');
  const tabList = {
    manage: {
      title: '商品列表',
      value: 'manage',
      component: ProductList
    },
    upload: {
      title: '新增商品',
      value: 'addProduct',
      component: AddProduct
    }
  }
  const productList: SellProduct[] = reactive([]);
  const handleGetProduct = async () => {
    const res = await apiGetSellProduct(userId);
    productList.splice(0, productList.length, ...res.data);
  }
  const handleChangeActive = async (productId: string, isActive: 0 | 1) => {
    const data: { productId: string, isActive: 0 | 1 } = {
      productId,
      // 如果是1則回傳0 反之 是0則回傳1
      isActive: isActive ? 0 : 1
    }
    const res = await apiChangeProductIsActive(data);
    sysStore.openDialog(res.data);
    handleGetProduct();
  }
  watch(tab, () => {
    handleGetProduct();
  })
</script>

<style scoped lang="scss"></style>