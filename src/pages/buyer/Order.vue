<template>

</template>

<script setup lang="ts">
  import { reactive, shallowReactive, defineAsyncComponent, ref, onMounted, computed, nextTick } from 'vue';
  import { Response } from '@/utils/res';
  import { useUserStore } from '@/stores/userStore';
  import { useSysStore } from '@/stores/sysStore'; 
  import type { Product } from '@/types/interface';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from "pinia";
  const router = useRouter();
  const userStore = useUserStore();
  const sysStore = useSysStore();

  const getOrder = async () => {
    const userID = userStore.userInfo.id
    const res = await Response.SendResponse(`order/getOrder?userID=${userID}`, 'get');
    console.log(res);
  }
  onMounted(() => {
    getOrder();
  })
</script>