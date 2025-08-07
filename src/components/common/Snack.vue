<template>
  <div class="text-center ma-2">
    <v-snackbar v-model="snackStore.model" color="#fff">
      {{ snackStore.text }}

      <template v-slot:actions>
        <v-btn variant="text" @click="snackStore.closeSnack"> 關閉 </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script setup lang="ts">
import { useSnackStore } from "@/stores/snackStore";
const snackStore = useSnackStore();
</script>
