<template>
  <v-dialog v-model="dialog" max-width="300" width="100%">
    <v-card>
      <v-card-text>
        確定要登出嗎
      </v-card-text>
      <v-card-actions>
        <v-btn @click="handleLogout">確定</v-btn>
        <v-btn @click="dialog = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  const userStore = useUserStore();
  const dialog = defineModel<boolean>();
  const handleLogout = () => {
    userStore.logout();
  }
</script>
