<template>
  <v-dialog v-model="sysStore.confirmDialog" max-width="300" width="100%">
    <v-card>
      <v-card-text class="text-h6">
        {{ sysStore.confirmText }}
      </v-card-text>
      <v-card-actions>
        <v-btn class="confirm-btn" @click="sysStore.confirmFunction"
          >確定</v-btn
        >
        <v-btn class="cancel-btn" @click="sysStore.closeConfirmDialog"
          >取消</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useSysStore } from "@/stores/sysStore";
const sysStore = useSysStore();
</script>
