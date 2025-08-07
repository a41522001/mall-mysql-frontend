import { defineStore } from "pinia";
import { ref } from "vue";
export const useSnackStore = defineStore("snackStore", () => {
  const model = ref<boolean>(false);
  const text = ref<string>("");
  const openSnack = () => {
    model.value = true;
  };
  const closeSnack = () => {
    model.value = false;
    text.value = "";
  };
  const assignText = (str: string) => {
    text.value = str;
  };
  return {
    model,
    text,
    openSnack,
    closeSnack,
    assignText,
  };
});
