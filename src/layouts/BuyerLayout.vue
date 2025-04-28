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
      <template v-if="isUserInfoReady">
        <router-view />
      </template>
    </v-container>
  </v-main>
  <Loading />
</template>

<script lang="ts" setup>
  import { reactive, shallowReactive, defineAsyncComponent, ref, onMounted, computed, nextTick, provide } from 'vue';
  import { useCartStore } from '@/stores/cartStore';
  import { useSysStore } from '@/stores/sysStore';
  import { useRouter } from 'vue-router';
  import Loading from '@/components/common/Loading.vue';
  import type { UserInfo } from '@/types/interface';
  import { apiGetUserInfo } from '@/utils/apiClient';
  const router = useRouter();
  const cartStore = useCartStore();
  const sysStore = useSysStore();
  const drawer = ref<boolean>(false);
  const isUserInfoReady = ref<boolean>(false);
  const userInfo: UserInfo = reactive({
    id: '',
    name: '',
    email: ''
  });
  provide('userInfo', readonly(userInfo));
  const dialog = reactive({
    cart: false
  })
  const openCartPage = () => {
    const isCartListLength = cartStore.cartListLength;
    if(isCartListLength === 0) {
      sysStore.openDialog('購物車內無商品');
      return
    };
    router.push({ name: 'cart' });
  }
  // 取得使用者資訊API
  const getUserInfo = async () => {
    try {
      sysStore.setLoading(true);
      const res = await apiGetUserInfo();
      console.log(res);
      Object.assign(userInfo, {...res});
      isUserInfoReady.value = true;
    } catch (error) {
      sessionStorage.removeItem('token');
      router.push('/login');
      sysStore.openDialog('請重新登入');
    } finally {
      sysStore.setLoading(false);
    }
  }
  // 設置購物車資訊API
  const setCartList = async () => {
    try {
      sysStore.setLoading(true);
      cartStore.setCartList(userInfo.id);
    } catch (error) {
      sysStore.openDialog(error as string);
    } finally {
      sysStore.setLoading(false);
    }
  }
  
  onMounted(async () => {
    await getUserInfo();
    await setCartList();
  })
</script>
