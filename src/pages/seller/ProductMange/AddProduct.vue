<template>
  <v-card max-width="800" class="mx-auto w-100">
    <v-card-title>建立新商品</v-card-title>
    <v-divider />
    <v-card-text>
      <v-form v-model="isFormValid" ref="form" @submit.prevent>
        <v-row>
          <v-col cols="12">
            <label class="require_label">商品名稱</label>
            <v-text-field v-model="dataForm.productName" :rules="rules.productName" class="mt-1" placeholder="例如：高級無線耳機" density="compact" variant="outlined" />
          </v-col>
          <v-col cols="6">
            <label class="require_label">價格(NT$)</label>
            <v-text-field v-model="dataForm.productPrice" :rules="rules.productPrice" class="mt-1" placeholder="例如：1999" density="compact" variant="outlined" />
          </v-col>
          <v-col cols="6">
            <label class="require_label">庫存數量</label>
            <v-text-field v-model="dataForm.quantity" :rules="rules.quantity" class="mt-1" placeholder="例如：100" density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12">
            <label>商品圖片</label>
            <Upload v-model="url" ref="uploadRef"/>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn @click="clearDataFormAndUploadFile">清除</v-btn>
      <v-btn @click="handleAddProduct">儲存商品</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import Upload from './Upload.vue';
import { useSysStore } from '@/stores/sysStore';
import { apiAddProduct } from '@/utils/apiClient';
import type { AddProductDataForm, UserInfo } from '@/types/interface';

defineOptions({
  inheritAttrs: false
})


const sysStore = useSysStore();
const userInfo = inject<UserInfo>('userInfo')!;
const { id: userId } = userInfo;
const url = ref<string>('');
const uploadRef = ref();
const form = ref();
const isFormValid = ref<boolean | null>(null);
const dataForm: AddProductDataForm = reactive({
  productName: '',
  productPrice: null,
  quantity: null
})
const rules = {
  productName: [
    (v: string) => v.length >= 1 || '請輸入商品名稱' 
  ],
  productPrice: [
    (v: string) => !!v || parseInt(v) > 0 || '請輸入正確的價錢' 
  ],
  quantity: [
    (v: string) => !!v || parseInt(v) > 0 || '請輸入正確的數量' 
  ]
}
const validateForm = async (): Promise<boolean | null | undefined> => {
  const result = await form.value?.validate();
  return result.valid;  
}
const clearDataFormAndUploadFile = () => {
  for(const k in dataForm) {
    const key = k as keyof AddProductDataForm;
    dataForm[key] = null; 
  }
  uploadRef.value.handleCancelUpload();
}

const handleAddProduct = async () => {
  if(!await validateForm()) {
    return;
  }
  await uploadRef.value.handleUploadFile();
  if(!url.value) {
    sysStore.openDialog('上傳圖片失敗，請重試');
    return;
  }
  const data = {
    userId,
    productName: dataForm.productName as string,
    price: +(dataForm.productPrice as string),
    quantity: +(dataForm.quantity as string),
    url: url.value
  }
  const res = await apiAddProduct(data);
  sysStore.openDialog(res.data);
  clearDataFormAndUploadFile();
}

</script>

<style scoped lang="scss">
.require_label {
  position: relative;
  &::after {
    content: '*';
    position: absolute;
    top: 10;
    left: 100;
    transform: translateX(50%);
    color: #f00;
  }
}

</style>