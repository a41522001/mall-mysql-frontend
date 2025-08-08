<template>
  <v-dialog v-model="model">
    <v-card class="mx-auto" max-width="320" width="100%">
      <v-card-title>忘記密碼</v-card-title>
      <v-card-text>
        <v-form v-model="isFormValid" ref="form" @submit.prevent>
          <div>
            <div class="text-subtitle-1 text-medium-emphasis mb-1">
              使用者名稱
            </div>
            <v-text-field
              v-model="dataForm.name"
              :rules="rules.name"
              density="compact"
              variant="outlined"
              placeholder="輸入您的使用者名稱"
            />
          </div>
          <div>
            <div class="text-subtitle-1 text-medium-emphasis mb-1">
              電子信箱
            </div>
            <v-text-field
              v-model="dataForm.email"
              :rules="rules.email"
              density="compact"
              variant="outlined"
              placeholder="輸入您的電子信箱"
            />
          </div>
          <div>
            <div class="text-subtitle-1 text-medium-emphasis mb-1">新密碼</div>
            <v-text-field
              v-model="dataForm.pwd"
              :rules="rules.pwd"
              density="compact"
              variant="outlined"
              placeholder="輸入您的新密碼"
            />
          </div>
          <div>
            <div class="text-subtitle-1 text-medium-emphasis mb-1">
              確認密碼
            </div>
            <v-text-field
              v-model="dataForm.confirmPwd"
              :rules="rules.confirmPwd"
              density="compact"
              variant="outlined"
              placeholder="確認您的新密碼"
            />
          </div>
        </v-form>
        <div class="d-flex flex-column">
          <v-btn
            @click="handleReset"
            size="large"
            rounded
            color="#2563EB"
            class="mt-2"
            >重設</v-btn
          >
          <span class="cancel_text" @click="handleCancel">取消</span>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { validateEmail } from "@/utils/validate";
import type { VForm } from "vuetify/components";
interface DataForm {
  name: string;
  email: string;
  pwd: string;
  confirmPwd: string;
}
const emits = defineEmits(["reset"]);
const model = defineModel<boolean>();
const dataForm = defineModel<DataForm>("dataForm", {
  required: true,
  default: {
    name: "",
    email: "",
    pwd: "",
    confirmPwd: "",
  },
});
const form = ref<InstanceType<typeof VForm> | null>(null);
const isFormValid = ref<boolean | null>(null);
const rules = {
  name: [(v: string) => !!v || "請輸入使用者名"],
  email: [(v: string) => validateEmail(v) || "請輸入正確的電子信箱"],
  pwd: [
    (v: string) => !!v || "請輸入密碼",
    (v: string) => v.length >= 6 || "密碼長度至少需要6個字元",
  ],
  confirmPwd: [
    (v: string) => !!v || "請再次輸入密碼",
    (v: string) => v.length >= 6 || "確認密碼長度至少需要6個字元",
    (v: string) => v === dataForm.value.pwd || "兩次輸入的密碼不一致",
  ],
};
const handleValidate = async (): Promise<boolean | null | undefined> => {
  const result = await form.value?.validate();
  return result?.valid;
};
const handleReset = async () => {
  if (!(await handleValidate())) {
    return;
  }

  emits("reset");
};
const handleCancel = () => {
  for (const key in dataForm.value) {
    dataForm.value[key as keyof DataForm] = "";
  }
  model.value = false;
};
</script>

<style scoped lang="scss">
.cancel_text {
  margin-top: 0.5rem;
  align-self: center;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
