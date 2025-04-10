<template>
    <v-app-bar color="primary" app>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-toolbar-title>購物商城</v-toolbar-title>

    <template v-if="$vuetify.display.mdAndUp">
      <v-text-field variant="outlined" density="compact" hide-details
        class="mx-4" placeholder="搜尋商品..." />
      <v-btn icon="mdi-magnify" />
    </template>

    <v-badge :content="cartStore.cartListLength" @click="dialog.cart = true" floating color="error" class="cursor-pointer me-5">
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
      <router-view />
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
  import { reactive, shallowReactive, defineAsyncComponent, ref, onMounted, computed, nextTick } from 'vue';
  import { useCartStore } from '@/stores/cartStore';
  const cartStore = useCartStore();
  const drawer = ref(false);
  const dialog = reactive({
    cart: false
  })
</script>
