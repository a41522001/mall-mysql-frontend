<template>
    <v-app-bar color="primary" app>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-toolbar-title>購物商城</v-toolbar-title>

    <template v-if="$vuetify.display.mdAndUp">
      <v-text-field v-model="search" variant="outlined" density="compact" hide-details clearable
        class="mx-4" placeholder="搜尋商品..." />
      <v-btn @click="handleSearch" icon="mdi-magnify" />
    </template>

    <v-badge :content="cartStore.cartListLength" @click="dialog.cart = true" floating color="error" class="cursor-pointer me-5">
      <v-icon icon="mdi-cart" size="large" @click="openCartPage"/>
    </v-badge>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary app
    :location="$vuetify.display.mobile ? 'bottom' : 'left'">
    <v-list>
      <v-list-item @click="router.push('/buyer/')" title="商品列表" prepend-icon="mdi-cart-outline" />
      <v-list-item @click="router.push('/buyer/order')" title="我的訂單" prepend-icon="mdi-list-box-outline" />
      <v-list-item @click="dialog.logout = true" title="我是賣家" prepend-icon="mdi-logout" />
      <v-list-item @click="dialog.logout = true" title="登出" prepend-icon="mdi-logout" />
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <v-container>
      <template v-if="isUserInfoReady">
        <router-view :searchString="searchString" />
      </template>
    </v-container>
  </v-main>
  <Loading />
  <Logout v-model="dialog.logout"/>
  <ConfirmDialog v-model="sysStore.confirmDialog" />
</template>

<script lang="ts" setup>
  import { reactive, shallowReactive, defineAsyncComponent, ref, onMounted, computed, nextTick, provide } from 'vue';
  import { useCartStore } from '@/stores/cartStore';
  import { useSysStore } from '@/stores/sysStore';
  import { useUserStore } from '@/stores/userStore';
  import { useRouter } from 'vue-router';
  import Loading from '@/components/common/Loading.vue';
  import type { UserInfo } from '@/types/interface';
  import { apiGetUserInfo } from '@/utils/apiClient';
  import Logout from '@/components/dialog/LogoutDialog.vue';
  import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue';
  const router = useRouter();
  const cartStore = useCartStore();
  const sysStore = useSysStore();
  const userStore = useUserStore();
  const drawer = ref<boolean>(false);
  const isUserInfoReady = ref<boolean>(false);
  const search = ref('');
  const searchString = shallowRef('');
  const userInfo: UserInfo = reactive({
    id: '',
    name: '',
    email: ''
  });
  provide('userInfo', readonly(userInfo));
  const dialog = reactive({
    cart: false,
    logout: false,
  })
  const handleSearch = () => {
    window.scrollTo(0, 0);
    searchString.value = search.value || '';
  }
  const openCartPage = () => {
    const isCartListLength = cartStore.cartListLength;
    if(isCartListLength === 0) {
      sysStore.openDialog('購物車內無商品');
      return
    };
    router.push('/buyer/cart');
  }
  // 取得使用者資訊API
  const getUserInfo = async () => {
    try {
      const res = await apiGetUserInfo();
      Object.assign(userInfo, {...res.data});
      Object.assign(userStore.userInfo, {...res.data});
      isUserInfoReady.value = true;
    } catch (error) {
      sessionStorage.removeItem('token');
      router.push('/login');
      sysStore.openDialog('請重新登入');
    } 
  }
  // 設置購物車資訊API
  const getCartList = async () => {
    cartStore.getCartList(userInfo.id);
  }
  
  onMounted(async () => {
    await getUserInfo();
    await getCartList();
  })
</script>
