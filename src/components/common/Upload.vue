<template>
  <div id="upload">
    <v-card class="mx-auto pa-5" height="300">
      <v-sheet class="border-dotted border-md d-flex">
        <v-icon class="mx-auto" size="100px" color="#888">mdi-image-outline</v-icon>
      </v-sheet>
      <v-file-input ref="fileInput" @change="handleSelectFile" label="File input" />
      <v-btn @click="uploadFile">上傳</v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import { reactive, shallowReactive, defineAsyncComponent, ref, onMounted, computed, nextTick } from 'vue';
  import { Response } from '@/utils/res';
  import { useUserStore } from '@/stores/userStore';
  import { useSysStore } from '@/stores/sysStore'; 
  import { useRouter } from 'vue-router';
  import { storeToRefs } from "pinia";
  // import 'vue3-dropzone/dist/vue3Dropzone.css'
  const router = useRouter();
  const userStore = useUserStore();
  const sysStore = useSysStore();
  const fileInput = ref<HTMLInputElement>();

  const file = ref<File | undefined>();

  const selectFile = ref<File>({
    lastModified: 0,
    name: '',
    webkitRelativePath: '',
    size: 0,
    type: '',
    arrayBuffer: function (): Promise<ArrayBuffer> {
      throw new Error('Function not implemented.');
    },
    bytes: function (): Promise<Uint8Array> {
      throw new Error('Function not implemented.');
    },
    slice: function (start?: number, end?: number, contentType?: string): Blob {
      throw new Error('Function not implemented.');
    },
    stream: function (): ReadableStream<Uint8Array> {
      throw new Error('Function not implemented.');
    },
    text: function (): Promise<string> {
      throw new Error('Function not implemented.');
    }
  });

  const handleSelectFile = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    if(target.files) {
      selectFile.value = target.files[0]
    }
  }
  const uploadFile = async () => {
    const formdata = new FormData();
    formdata.append('file', selectFile.value);
    const url = await Response.SendResponse(
      'product/addProductImage', 
      'post', 
      formdata, 
      {'Content-Type': 'multipart/form-data' }
    );
    console.log(url);
  }
</script>

<style scoped lang="scss">
#upload {
  width: 100%;
  display: flex;
  justify-content: center;
  .v-card {
    width: 500px;
  }
}
</style>