<template>
  <v-overlay v-model="sysStore.isLoading" persistent class="d-flex align-center justify-center"> 
      <v-progress-circular indeterminate color="primary" :size="70"  />
  </v-overlay>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useSysStore } from '@/stores/sysStore';
  const sysStore = useSysStore();

</script>