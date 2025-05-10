<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <div id="signup">
      <div class="mb-5">
        <h2 class="mb-2 text-center">建立您的帳戶</h2>
        <p class="text-center">
          <span class="me-2">或</span>
          <span @click="openLogin" class="login_text">已經有帳戶了？由此登入</span>
        </p>
      </div>
      <v-card class="pa-6 w-100" elevation="10" rounded="xl">
        <v-form v-model="isFormValid" ref="form" @submit.prevent class="d-flex flex-column">
          <div>
            <div class="text-subtitle-1 text-medium-emphasis mb-1">使用者名稱</div>
            <v-text-field v-model="dataForm.name" :rules="rules.name" density="compact" 
              variant="outlined" placeholder="輸入您的使用者名稱" />
          </div>
          <div>
            <div class="text-subtitle-1 text-medium-emphasis mb-1">電子郵件地址</div>
            <v-text-field v-model="dataForm.email" :rules="rules.email" 
              density="compact" variant="outlined" placeholder="123@example.com" />
          </div>
          <div>
            <div class="text-subtitle-1 text-medium-emphasis mb-1">密碼</div>
            <v-text-field v-model="dataForm.pwd" :rules="rules.pwd" density="compact" 
              variant="outlined" placeholder="至少6個字元" :type="pwd1.type" 
              :append-inner-icon="pwd1.icon" @click:append-inner="showPwd1 = !showPwd1" />
          </div>
          <div>
            <div class="text-subtitle-1 text-medium-emphasis mb-1">確認密碼</div>
            <v-text-field v-model="dataForm.confirmPwd" :rules="rules.confirmPwd" density="compact" 
              variant="outlined" placeholder="再次輸入您的密碼" :type="pwd2.type" 
              :append-inner-icon="pwd2.icon" @click:append-inner="showPwd2 = !showPwd2" />
          </div>
          <v-btn @click="handleSignup" size="large" rounded color="#2563EB" class="mt-2">註冊</v-btn>
        </v-form>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { reactive, ref, computed } from 'vue';
  import router from '@/router';
  import { Response } from '@/utils/res';
  import { VForm } from 'vuetify/components';
  import type { ResponseType } from '@/types/response';
  import type { SignupDataForm } from '@/types/interface';
  import { useSysStore } from '@/stores/sysStore';
  import { validateEmail } from '@/utils/validate';
  const sysStore = useSysStore();
  const dataForm: SignupDataForm = reactive({
    name: '',
    email: '',
    pwd: '',
    confirmPwd: ''
  })
  const form = ref<InstanceType<typeof VForm> | null>(null);
  const isFormValid = ref<boolean | null>(null);
  const pwdOpen = { 
    icon: 'mdi-eye', 
    type: 'text' 
  }
  const pwdOff = { 
    icon: 'mdi-eye-off', 
    type: 'password' 
  }
  const showPwd1 = ref<boolean>(false);
  const pwd1 = computed(() => showPwd1.value ?  pwdOpen : pwdOff);
  const showPwd2 = ref<boolean>(false);
  const pwd2 = computed(() => showPwd2.value ?  pwdOpen : pwdOff);
  const rules = {
    name: [
      (v: string) => !!v || '請輸入使用者名'
    ],
    email: [
      (v: string) => validateEmail(v) || '請輸入正確的電子信箱'
    ],
    pwd: [
      (v: string) => !!v || '請輸入密碼',
      (v: string) => v.length >= 6 || '密碼長度至少需要6個字元'
    ],
    confirmPwd: [
      (v: string) => !!v || '請再次輸入密碼',
      (v: string) => v.length >= 6 || '確認密碼長度至少需要6個字元',
      (v: string) => v === dataForm.pwd || '兩次輸入的密碼不一致'
    ]
  }
  const openLogin = () => {
    router.push('/login')
  }
  const handleValidate = async (): Promise<boolean | null | undefined> => {
    const result = await form.value?.validate();
    return result?.valid;
  }
  const handleSignup = async (): Promise<void> => {
    if(!await handleValidate()) {
      return;
    }
    const data = {
      name: dataForm.name,
      email: dataForm.email,
      password: dataForm.pwd
    }
    sysStore.setLoading(true);
    const res = await Response.SendResponse<ResponseType<null>>('auth/signup', 'post', data);
    sysStore.setLoading(false);
    sysStore.openDialog(res.message);
    for(const k in dataForm) {
      const key = k as keyof SignupDataForm;
      dataForm[key] = '';
    }
  }
</script>

<style scoped lang="scss">
@import './Signup.scss';
</style>