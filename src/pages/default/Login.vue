<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <div id="login">
      <v-btn class="test-btn" rounded @click="handleOpenTest">測試帳號</v-btn>
      <v-card class="px-sm-6 px-xs-2 py-6 w-100" elevation="10" rounded="xl">
        <v-card-title class="mb-5 text-center">會員登入</v-card-title>
        <v-card-text>
          <div class="login-input-container">
            <div class="mb-1">電子信箱</div>
            <v-text-field
              v-model="loginInfo.email"
              class="login-input"
              :rounded="true"
              density="comfortable"
              hide-details
              variant="outlined"
              placeholder="請輸入Email"
            />
          </div>
          <div class="login-input-container">
            <div class="mb-1">密碼</div>
            <v-text-field
              v-model="loginInfo.password"
              class="login-input"
              :rounded="true"
              density="comfortable"
              hide-details
              variant="outlined"
              placeholder="請輸入密碼"
              :type="showPwd ? 'text' : 'password'"
              :append-inner-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPwd = !showPwd"
              @keyup.enter="handleLogin"
            />
          </div>
          <div class="login-text text-end my-2">
            <span class="cursor-pointer" @click="handleOpenForgetPassword"
              >忘記密碼?</span
            >
          </div>
          <v-btn @click="handleLogin" class="w-100" rounded color="#2563EB"
            >登入</v-btn
          >
          <div class="d-flex justify-center my-8">
            <span class="me-3">還沒有帳號?</span>
            <span @click="goSignup" class="login-text cursor-pointer"
              >立即註冊</span
            >
          </div>
          <div class="d-flex align-center mt-2">
            <v-divider class="flex-shrink-1" :thickness="2" />
            <p class="mx-2 text-no-wrap">或使用以下方式登入</p>
            <v-divider class="flex-shrink-1" :thickness="2" />
          </div>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between">
          <v-btn class="mx-2" variant="outlined" rounded text="Google">
            <template v-slot:prepend>
              <v-icon>mdi-google</v-icon>
            </template>
          </v-btn>
          <v-btn class="mx-2" variant="outlined" rounded text="Facebook">
            <template v-slot:prepend>
              <v-icon>mdi-facebook</v-icon>
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <TestDialog v-model="dialog.test" />
    <ForgetPwdDialog
      v-model="dialog.password"
      v-model:dataForm="forgetPwd"
      @reset="handleReset"
    />
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { apiLogin, apiResetPwd } from "@/utils/apiClient";
import TestDialog from "@/components/dialog/TestDialog.vue";
import ForgetPwdDialog from "@/components/dialog/ForgetPwdDialog.vue";
import { useSysStore } from "@/stores/sysStore";
const sysStore = useSysStore();
const router = useRouter();
const loginInfo = reactive({
  email: "",
  password: "",
});

const dialog = reactive({
  test: false,
  password: false,
});
const forgetPwd = reactive({
  name: "",
  email: "",
  pwd: "",
  confirmPwd: "",
});
const showPwd = ref(false);
// 登入API
const handleLogin = async () => {
  const res = await apiLogin(loginInfo);
  sessionStorage.setItem("token", res.token);
  router.push("/buyer");
};
const goSignup = () => {
  router.push("/signup");
};
const handleOpenTest = () => {
  dialog.test = true;
};
const handleOpenForgetPassword = () => {
  dialog.password = true;
};
const handleReset = async () => {
  const data = {
    name: forgetPwd.name,
    email: forgetPwd.email,
    password: forgetPwd.pwd,
  };
  try {
    const res = await apiResetPwd(data);
    sysStore.openDialog(res.data);
    if (res.code === 100) {
      dialog.password = false;
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped lang="scss">
@import "./Login.scss";
</style>
