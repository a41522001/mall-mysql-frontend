<template>
  <v-app-bar color="primary" app>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-toolbar-title>購物商城</v-toolbar-title>

    <template v-if="$vuetify.display.mdAndUp">
      <v-text-field variant="outlined" density="compact" hide-details
        class="mx-4" placeholder="搜尋商品..." />
      <v-btn icon="mdi-magnify" />
    </template>

    <v-badge :content="cartList.length" @click="dialog.cart = true" floating color="error" class="cursor-pointer me-5">
      <v-icon icon="mdi-cart" size="large" />
    </v-badge>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary app
    :location="$vuetify.display.mobile ? 'bottom' : 'left'">
    <v-list>
      <v-list-item title="首頁" prepend-icon="mdi-home" />
      <v-list-item title="商品列表" prepend-icon="mdi-cart-outline" />
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <v-container>
      <Carousels />
    </v-container>
  </v-main>

  <!-- <v-btn @click="dialog.addProduct = true">新增商品</v-btn> -->
  <!-- <AddProduct v-model="dialog.addProduct" /> -->
</template>
<script setup lang="ts">
  import { reactive } from 'vue';
  import AddProduct from './AddProduct.vue';
  import Carousels from '@/components/common/Carousels.vue';
  const dialog = reactive({
    addProduct: false,
    cart: false
  })
  const drawer = ref(false);
  const cartList = reactive([]);

</script>