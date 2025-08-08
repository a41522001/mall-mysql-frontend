<template>
  <v-dialog v-model="model" max-width="300" width="100%">
    <v-card>
      <v-card-title>測試帳號</v-card-title>
      <v-card-text class="d-flex flex-column ga-3">
        <div class="d-flex flex-column ga-1">
          <div>買家</div>
          <v-sheet class="pa-2 d-flex" color="#f3f4f6" rounded>
            <span>{{ buyerAccount.email }}</span>
            <span
              class="test-dialog-text"
              @click="handleCopy(buyerAccount.email)"
              >複製</span
            >
          </v-sheet>
          <v-sheet class="pa-2 d-flex" color="#f3f4f6" rounded>
            <span>{{ buyerAccount.password }}</span>
            <span
              class="test-dialog-text"
              @click="handleCopy(buyerAccount.password)"
              >複製</span
            >
          </v-sheet>
        </div>
        <div class="d-flex flex-column ga-1">
          <div>賣家</div>
          <v-sheet class="pa-2 d-flex" color="#f3f4f6" rounded>
            <span>{{ sellerAccount.email }}</span>
            <span
              class="test-dialog-text"
              @click="handleCopy(sellerAccount.email)"
              >複製</span
            >
          </v-sheet>
          <v-sheet class="pa-2 d-flex" color="#f3f4f6" rounded>
            <span>{{ sellerAccount.password }}</span>
            <span
              class="test-dialog-text"
              @click="handleCopy(sellerAccount.password)"
              >複製</span
            >
          </v-sheet>
        </div>
        <v-btn class="w-100" color="#2563EB" @click="model = false">關閉</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { copy } from "@/utils";
import { useSnackStore } from "@/stores/snackStore";
const snackStore = useSnackStore();
const model = defineModel<boolean>();
const buyerAccount = reactive({
  email: "333@333.com",
  password: "333333",
});
const sellerAccount = reactive({
  email: "111@111.com",
  password: "111111",
});
const handleCopy = async (text: string) => {
  snackStore.closeSnack();
  try {
    await copy(text);
    snackStore.assignText("已複製到剪貼簿");
  } catch (error) {
    snackStore.assignText("複製失敗，請手動複製");
  } finally {
    snackStore.openSnack();
  }
};
</script>
<style scoped lang="scss">
@import "@/styles/variables.scss";
.test-dialog-text {
  color: $primary_text;
  cursor: pointer;
  margin-left: auto;
  &:hover {
    color: #084ee6;
  }
}
</style>
