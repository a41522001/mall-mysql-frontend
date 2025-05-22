<template>
  <v-app-bar color="primary" app>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-toolbar-title>購物商城</v-toolbar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary app
    :location="$vuetify.display.mobile ? 'bottom' : 'left'">
    <v-list>
      <v-list-item @click="router.push('/seller/')" title="總覽" prepend-icon="mdi-logout" />
      <v-list-item @click="router.push('/seller/analysis')" title="銷售分析" prepend-icon="mdi-logout" />
      <v-list-item @click="router.push('/seller/productManage')" title="商品管理" prepend-icon="mdi-logout" />
      <v-list-item @click="router.push('/buyer/')" title="我是買家" prepend-icon="mdi-logout" />
      <v-list-item @click="dialog.logout = true" title="登出" prepend-icon="mdi-logout" />
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

  const userInfo: UserInfo = reactive({
    id: '',
    name: '',
    email: ''
  });
  provide('userInfo', readonly(userInfo));
  const dialog = reactive({
    logout: false,
  })

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
  
  onMounted(async () => {
    await getUserInfo();
  })
</script>
