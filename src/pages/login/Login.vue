<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <div id="login">
      <v-card class="px-sm-6 px-xs-2 py-6 w-100" elevation="10" rounded="xl">
        <v-card-title class="mb-5 text-center">會員登入</v-card-title>
        <v-card-text>
          <div class="login-input-container">
            <div class="mb-1">電子信箱</div>
            <v-text-field v-model="loginInfo.email" class="login-input" :rounded="true" density="comfortable" 
              hide-details variant="outlined" placeholder="請輸入Email" />
          </div>
          <div class="login-input-container">
            <div class="mb-1">密碼</div>
            <v-text-field v-model="loginInfo.password" class="login-input" :rounded="true" density="comfortable" 
              hide-details variant="outlined" placeholder="請輸入密碼" />
          </div>
          <div class="login-checkbox">
            <v-checkbox class="login-text" color="#2563EB" label="記住我" hide-details density="comfortable"/>
            <div class="login-text">忘記密碼?</div>
          </div>
          <v-btn @click="handleLogin" class="w-100" rounded color="#2563EB">登入</v-btn>
          <div class="d-flex justify-center my-8">
            <span class="me-3">還沒有帳號?</span>
            <span class="login-text">立即註冊</span>
          </div>
          <div class="d-flex align-center mt-2">
            <v-divider class="flex-shrink-1" :thickness="2" />
            <p class="mx-2 text-no-wrap">或使用以下方式登入</p>
            <v-divider class="flex-shrink-1" :thickness="2" />
          </div>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between">
          <v-btn class="mx-5" variant="outlined" rounded text="Google">
            <template v-slot:prepend>
              <v-icon>mdi-google</v-icon>
            </template>
          </v-btn>
          <v-btn class="mx-5" variant="outlined" rounded text="Facebook">
            <template v-slot:prepend>
              <v-icon>mdi-facebook</v-icon>
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { reactive, shallowReactive, defineAsyncComponent, ref, onMounted, computed, nextTick } from 'vue';
  import { api } from "@/utils/api";
  import { Response } from '@/utils/res';
  import { useUserStore } from '@/stores/userStore';
  import { storeToRefs } from "pinia";
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const userStore = useUserStore();
  const loginInfo = reactive({
    email: '',
    password: ''
  })

  // 登入API
  const handleLogin = async () => {
    const { email, password } = loginInfo;
    const result = await userStore.login(email, password);
    if(result) {
      router.push({ path: '/' })
    }
  }
</script>

<style scoped lang="scss">
@import './Login.scss';
</style>