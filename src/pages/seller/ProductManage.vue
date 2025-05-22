<template>
  <div class="d-flex justify-space-between align-center mb-5">
    <h2>商品管理</h2>
    <v-btn @click="" prepend-icon="mdi-plus">新增商品</v-btn>
  </div>
  <div>
    <v-tabs v-model="tab">
      <v-tab v-for="{ title, value } in tabList" :key="value">
        {{ title }}
      </v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item v-for="{ title, value, component } in tabList">
        <div class="py-3">
          <component :is="component" :productList="productList" />
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
  import { reactive, shallowRef, onMounted, inject } from 'vue';
  import ProductList from './ProductMange/ProductList.vue';
  import AddProduct from './ProductMange/AddProduct.vue';
  import type { Product, UserInfo } from '@/types/interface';
  import { apiGetSellProduct } from '@/utils/apiClient';
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
  const productList: Product[] = reactive([]);
  const handleGetProduct = async () => {
    const res = await apiGetSellProduct(userId);
    productList.splice(0, productList.length, ...res.data);
  }
  onMounted(() => {
    handleGetProduct();
  })
</script>

<style scoped lang="scss"></style>