<template>
  <v-card class="ma-5 mx-auto">
    <v-file-upload v-model="file" title="請拖曳或點擊您想上傳的圖片" divider-text="限JPG, PNG檔" browse-text="點擊" 
      density="default" clearable @update:modelValue="handleUpdateFile">
      <template v-slot:browse>
        <v-file-input v-show="false" ref="fileInputRef" v-model="file" @update:modelValue="handleUpdateFile" />
        <v-btn @click="handleClickInputFile" color="#f00">點擊</v-btn>
      </template>
    </v-file-upload>
    <p v-if="progress === 100" class="ma-2">上傳成功</p>
    <v-progress-linear v-if="progress > 0 && progress < 100"
      v-model="progress" color="blue" height="20" class="my-2">
      <template v-slot:default="{ value }">
        <strong>{{ Math.ceil(value) }}%</strong>
      </template>
    </v-progress-linear>
    <div class="ma-2">
      <!-- <v-btn v-if="file && progress === 0" @click="handleUploadFile">上傳</v-btn> -->
      <v-btn v-if="progress !== 0 && progress !== 100" @click="handleCancelUpload">取消</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import { reactive, shallowReactive, defineAsyncComponent, ref, onMounted, computed, nextTick } from 'vue';
  import { Response } from '@/utils/res';
  import { useUserStore } from '@/stores/userStore';
  import { useSysStore } from '@/stores/sysStore'; 
  import { useRouter } from 'vue-router';
  import { storeToRefs } from "pinia";
  import { apiUploadProductImg } from '@/utils/apiClient';
  
  const router = useRouter();
  const userStore = useUserStore();
  const sysStore = useSysStore();
  const url = defineModel<string>();
  const fileCondition = ['jpg', 'png'];
  const fileInputRef = ref();
  const file = ref<File | undefined>();
  const progress = ref(0); // 上傳進度百分比
  // 取消請求實例
  let controller = new AbortController();

  const handleClickInputFile = () => {
    fileInputRef.value.click();
  }
  
  const handleUpdateFile = (e: File | File[]): void => {
    progress.value = 0;
    if(e === undefined) {
      handleCancelUpload();
      return
    };
    if(Array.isArray(e)) {
      file.value = undefined;
      return;
    }
    const fileSubName = e.name.split('.').at(-1);
    const isCorrectFileFormat = fileCondition.includes(fileSubName!);
    if(isCorrectFileFormat) {
      file.value = e;
    }else {
      file.value = undefined;
      sysStore.openDialog('請給予正確的圖片');
    }
  }
  // 上傳檔案
  const handleUploadFile = async (): Promise<void> => {
    if(!file.value) {
      return;
    };
    controller = new AbortController();
    const formdata = new FormData();
    formdata.append('file', file.value!, file.value!.name);
    try {
      const res = await apiUploadProductImg(formdata, {
      onUploadProgress: (progressEvent: { total: any; progress: any; }) => {
        if (progressEvent.total) {
          progress.value = Math.ceil(progressEvent.progress! * 100);
        }
      },
      signal: controller.signal
    })
      url.value = res.data;
    } catch (error) {
      url.value = '';
    }
  }
  // 取消上傳
  const handleCancelUpload = () => {
    if (controller) {
      controller.abort();
    }
    file.value = undefined;
    url.value = '';
    nextTick(() => progress.value = 0);
  }

  defineExpose({
    handleUploadFile,
    handleCancelUpload
  })
</script>

<style scoped lang="scss"></style>