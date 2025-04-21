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
      <v-icon icon="mdi-cart" size="large" @click="openCartPage"/>
    </v-badge>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary app
    :location="$vuetify.display.mobile ? 'bottom' : 'left'">
    <v-list>
      <v-list-item @click="router.push({ name: 'product' })" title="商品列表" prepend-icon="mdi-cart-outline" />
      <v-list-item @click="" title="我的訂單" prepend-icon="mdi-list-box-outline" />
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
  import { useSysStore } from '@/stores/sysStore';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const cartStore = useCartStore();
  const sysStore = useSysStore();
  const drawer = ref<boolean>(false);
  const dialog = reactive({
    cart: false
  })
  const openCartPage = () => {
    const isCartListLength = cartStore.cartList.length;
    if(isCartListLength === 0) {
      sysStore.openDialog('購物車內無商品');
      return
    };
    router.push({ name: 'cart' });
  }
  onMounted(() => {
    cartStore.getCartList();
  })
</script>
