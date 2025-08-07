<template>
  <v-app>
    <router-view />
    <v-dialog v-model="sysStore.dialog" max-width="300" width="100%">
      <v-card>
        <v-card-text>
          {{ sysStore.dialogText }}
        </v-card-text>
        <v-card-actions>
          <v-btn @click="sysStore.dialog = false">確定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Snack />
  </v-app>
</template>

<script lang="ts" setup>
import { useSysStore } from "@/stores/sysStore";
const sysStore = useSysStore();
</script>
