<template>
  <v-dialog v-model="dialog">
    <v-card class="mx-auto" max-width="1000" width="100%">
      <v-card-text>
        <v-row class="align-center">
          <v-col sm="12" md="6">
            <v-file-upload v-model="file" title="請拖曳您想上傳的圖片" 
              divider-text="限JPG, PNG檔" clearable density="default"
              @update:modelValue="handleSelectFile">
              <template v-slot:browse>
                <v-file-input v-show="false" ref="fileInputRef" @update:modelValue="handleSelectFile" />
                <v-btn @click="handleClickFileInput" color="#f00">點擊</v-btn>
              </template>
            </v-file-upload>
          </v-col>

          <v-col sm="12" md="6" class="d-flex flex-column">
            <div class="my-2">
              <div class="mb-2">商品名稱</div>
              <v-text-field v-model="productInfo.name" rounded="lg" density="comfortable" 
                hide-details variant="outlined" placeholder="請輸入商品名稱" />
            </div>
            <div class="my-2">
              <div class="mb-2">價格</div>
              <v-text-field v-model.number="productInfo.price" rounded="lg" density="comfortable" 
                hide-details variant="outlined" placeholder="請輸入價格" />
            </div>
            <div class="my-2">
              <div class="mb-2">數量</div>
              <v-text-field v-model.number="productInfo.quantity" rounded="lg" density="comfortable" 
                hide-details variant="outlined" placeholder="請輸入數量" />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="handleAddProduct">新增</v-btn>
        <v-btn @click="dialog = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { isDataEmpty } from '@/utils';
  type Product = 'name' | 'price' | 'quantity';
  const dialog = defineModel<boolean>();
  const productInfo = reactive({
    name: '',
    price: 0,
    quantity: 1
  })
  const validatorProductInfo = {
    name: (value: string) => value.trim() !== '' && value,
    price: (value: number) => typeof value === 'number' && value > 0,
    quantity: (value: number) => Number.isInteger(value) && value > 0,
  }
  const file = ref<File | undefined>();
  const fileInputRef = ref();
  
  const handleSelectFile = (e: File | File[]) => {
    console.log(e);
    if(Array.isArray(e)) return;
    file.value = e;
  }
  const handleClickFileInput = () => {
    if(fileInputRef) {
      fileInputRef.value.click();
    }
  }
  const handleUpload = async () => {
    const formdata = new FormData();
    formdata.append('file', file.value!, file.value!.name);

  }
  const handleAddProduct = async () => {
    // const isCheck = Object.keys(validatorProductInfo).every(key => validatorProductInfo[key: Product](productInfo[key]));
    // console.log(isCheck);
    
    // const res = await handleUpload();
  }
</script>

<style scoped lang="scss"></style>